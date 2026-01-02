import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

const money = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

// ✅ cart item se productId safely nikaalna (different shapes handle)
const getCartProductId = (c) => {
  if (c?.productId) return String(c.productId);
  if (c?.product) return String(c.product);

  if (c?.productId?._id) return String(c.productId._id);
  if (c?.product?._id) return String(c.product._id);

  if (c?._id) return String(c._id);

  return null;
};

export const placeOrder = async (req, res) => {
  // ✅ rollback tracking (agar mid-way fail ho to stock wapas)
  const decremented = [];

  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const cart = user.cart || [];
    if (cart.length === 0) return res.status(400).json({ message: "Cart is empty" });

    // ✅ payment method from body (default COD)
    const { paymentMethod } = req.body || {};
    const method = paymentMethod === "STRIPE" ? "STRIPE" : "COD";

    const items = [];
    let subtotal = 0;

    for (const c of cart) {
      const pid = getCartProductId(c);
      if (!pid) {
        return res.status(400).json({
          message: "Invalid cart item: product id missing",
          cartItem: c,
        });
      }

      const qty = Number(c.qty || 1);
      if (!Number.isFinite(qty) || qty <= 0) {
        return res.status(400).json({
          message: "Invalid cart item: qty invalid",
          cartItem: c,
        });
      }

      /**
       * ✅ ATOMIC stock decrement (no oversell)
       * Condition: stock >= qty
       * If fail -> Out of stock
       */
      const p = await Product.findOneAndUpdate(
        { _id: pid, isActive: true, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      );

      if (!p) {
        return res.status(400).json({
          message: "Out of stock",
          productId: pid,
        });
      }

      decremented.push({ productId: p._id, qty });

      const price = Number(p.price);

      items.push({
        product: p._id,
        name: p.name,
        image: p.image || "",
        price,
        qty,
      });

      subtotal += price * qty;
    }

    subtotal = money(subtotal);

    const shipping = money(0);
    const tax = money(0);
    const discount = money(0);
    const total = money(subtotal + shipping + tax - discount);

    const RESERVE_MINUTES = 15;
    const reservedUntil = new Date(Date.now() + RESERVE_MINUTES * 60 * 1000);

    const order = await Order.create({
      user: userId,
      items,
      subtotal,
      shipping,
      tax,
      discount,
      total,

      paymentMethod: method,
      isPaid: false,
      paymentStatus: "UNPAID",

      reservedUntil,
      status: "PLACED",
    });

    user.cart = [];
    await user.save();

    return res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    // ✅ rollback stock
    try {
      if (decremented.length > 0) {
        await Product.bulkWrite(
          decremented.map((d) => ({
            updateOne: {
              filter: { _id: d.productId },
              update: { $inc: { stock: d.qty } },
            },
          }))
        );
      }
    } catch (rollbackErr) {
      console.error("stock rollback failed:", rollbackErr);
    }

    console.error("placeOrder error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error("getMyOrders error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyOrderById = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json(order);
  } catch (err) {
    console.error("getMyOrderById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ PATCH /api/orders/my/:id/cancel
 * Rules:
 * - only owner can cancel
 * - only if status=PLACED and paymentStatus=UNPAID
 * - restores stock
 */
export const cancelMyOrder = async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    // ✅ 1) cancel order atomically (return PRE-cancel doc to restore stock safely)
    const pre = await Order.findOneAndUpdate(
      { _id: id, user: userId, status: "PLACED", paymentStatus: "UNPAID" },
      {
        $set: {
          status: "CANCELLED",
          paymentStatus: "FAILED",
          isPaid: false,
          paidAt: null,
          reservedUntil: null,
        },
      },
      { new: false } // return old doc (with items)
    );

    if (!pre) {
      return res.status(400).json({
        message: "Order cannot be cancelled (already paid, shipped, delivered or cancelled).",
      });
    }

    // ✅ 2) restore stock
    const ops = (pre.items || []).map((it) => ({
      updateOne: {
        filter: { _id: it.product },
        update: { $inc: { stock: Number(it.qty || 0) } },
      },
    }));

    if (ops.length) {
      await Product.bulkWrite(ops);
    }

    const updated = await Order.findById(id);
    return res.json({ message: "Order cancelled ✅", order: updated });
  } catch (err) {
    console.error("cancelMyOrder error:", err);

    // best-effort: if something went wrong after cancel, try revert (rare)
    try {
      await Order.updateOne(
        { _id: id, user: userId, status: "CANCELLED", paymentStatus: "FAILED" },
        { $set: { status: "PLACED", paymentStatus: "UNPAID" } }
      );
    } catch (revertErr) {
      console.error("cancel revert failed:", revertErr);
    }

    return res.status(500).json({ message: "Failed to cancel order" });
  }
};
