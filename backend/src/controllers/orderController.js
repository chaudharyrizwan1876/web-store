import nodemailer from "nodemailer";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

const money = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

// ✅ Lazy transporter — .env values properly load hone ke baad banta hai
const getTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// ✅ Order confirmation email — kabhi fail ho to order placement pe asar na pade
const sendOrderConfirmationEmail = async (user, order) => {
  try {
    const itemsRows = (order.items || [])
      .map(
        (it) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;">
            <div style="font-weight:600;color:#111827;font-size:13px;">${it.name}</div>
            <div style="color:#6B7280;font-size:12px;margin-top:2px;">Qty: ${it.qty}</div>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;text-align:right;font-weight:700;color:#111827;font-size:13px;">
            $${(it.price * it.qty).toFixed(2)}
          </td>
        </tr>`
      )
      .join("");

    await getTransporter().sendMail({
      from: `"Web Store" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Order Confirmed — #${String(order._id).slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #f9f9f9; border-radius: 12px;">
          <h2 style="color: #1a1a2e; margin-bottom: 4px;">Thank you for your order! 🎉</h2>
          <p style="color: #555; font-size: 14px; margin-top: 0;">
            Hi ${user.firstName || "there"}, your order has been placed successfully.
          </p>

          <div style="background:#fff;border-radius:10px;padding:16px;margin-top:16px;border:1px solid #E5E7EB;">
            <div style="display:flex;justify-content:space-between;font-size:13px;color:#6B7280;margin-bottom:12px;">
              <span>Order ID: <b style="color:#111827;">#${String(order._id).slice(-8).toUpperCase()}</b></span>
              <span>Payment: <b style="color:#111827;">${order.paymentMethod}</b></span>
            </div>

            <table style="width:100%;border-collapse:collapse;">
              ${itemsRows}
            </table>

            <div style="margin-top:14px;padding-top:12px;border-top:1px solid #E5E7EB;">
              <div style="display:flex;justify-content:space-between;font-size:13px;color:#6B7280;">
                <span>Subtotal</span><span>$${Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:13px;color:#6B7280;margin-top:4px;">
                <span>Shipping</span><span>$${Number(order.shipping).toFixed(2)}</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:800;color:#111827;margin-top:10px;">
                <span>Total</span><span>$${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <p style="color:#999;font-size:12px;margin-top:20px;">
            We'll notify you again once your order ships. If you have any questions, just reply to this email.
          </p>
        </div>
      `,
    });
  } catch (err) {
    // Email fail hone se order placement fail nahi hona chahiye
    console.error("ORDER CONFIRMATION EMAIL ERROR:", err.message);
  }
};

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

    // ✅ Order confirmation email (background — order response ka wait nahi karta)
    sendOrderConfirmationEmail(user, order);

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
