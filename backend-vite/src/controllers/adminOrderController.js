import Order from "../models/Order.js";

// ✅ GET all orders (Admin)
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName email isAdmin");

    return res.json(orders);
  } catch (err) {
    console.error("GET ALL ORDERS ADMIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ UPDATE order status (Admin)
// statuses: "PLACED" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED"
export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["PLACED", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // 🔒 RULE 1: Paid orders cannot be cancelled
    if (order.isPaid && status === "CANCELLED") {
      return res.status(400).json({
        message: "Paid order cannot be cancelled",
      });
    }

    // 🔒 RULE 2: Controlled flow (no random jumps)
    // Allowed progress:
    // PLACED -> SHIPPED -> DELIVERED
    // PAID -> SHIPPED -> DELIVERED
    // (CANCELLED can only happen when NOT PAID, and only from PLACED)
    const current = order.status || "PLACED";

    const allowedNext = {
      PLACED: ["SHIPPED", "CANCELLED"],
      PAID: ["SHIPPED"],
      SHIPPED: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: [],
    };

    // NOTE: If order.isPaid true but status still PLACED, treat as PAID flow
    const effectiveCurrent = order.isPaid && current === "PLACED" ? "PAID" : current;

    if (!allowedNext[effectiveCurrent]?.includes(status)) {
      return res.status(400).json({
        message: `Invalid status change: ${effectiveCurrent} → ${status}`,
      });
    }

    // ✅ Apply status
    order.status = status;

    // 🔒 RULE 3: If DELIVERED and payment is COD, auto mark paid
    if (status === "DELIVERED" && order.paymentMethod === "COD" && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentStatus = "PAID";
    }

    await order.save();

    return res.json({
      message: "Order status updated",
      order,
    });
  } catch (err) {
    console.error("UPDATE ORDER STATUS ADMIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ OPTIONAL: Mark COD order as paid manually (Admin)
export const markOrderPaidAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only COD
    if (order.paymentMethod !== "COD") {
      return res
        .status(400)
        .json({ message: "Only COD orders can be marked paid manually" });
    }

    // Already paid
    if (order.isPaid) {
      return res.status(400).json({ message: "Order already paid" });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentStatus = "PAID";

    // ✅ Keep status synced
    // (This helps admin understand it’s paid even if not shipped yet)
    order.status = "PAID";

    await order.save();

    return res.json({
      message: "Order marked as paid",
      order,
    });
  } catch (err) {
    console.error("MARK PAID ADMIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
