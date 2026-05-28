import Order from "../models/Order.js";

// GET /api/admin/dashboard
export const getAdminDashboardStats = async (req, res) => {
  try {
    // total orders
    const totalOrders = await Order.countDocuments();

    // paid orders
    const paidOrders = await Order.countDocuments({ isPaid: true });

    // unpaid orders
    const unpaidOrders = await Order.countDocuments({ isPaid: false });

    // payment methods
    const codOrders = await Order.countDocuments({ paymentMethod: "COD" });
    const stripeOrders = await Order.countDocuments({ paymentMethod: "STRIPE" });

    // total revenue (only PAID orders)
    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return res.json({
      totalOrders,
      paidOrders,
      unpaidOrders,
      codOrders,
      stripeOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);
    return res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};
