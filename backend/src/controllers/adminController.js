import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const LOW_STOCK_THRESHOLD = 5;

// ══════════════════════════════════════════════
// GET /api/admin/dashboard
// Comprehensive store analytics for admin dashboard
// ══════════════════════════════════════════════
export const getAdminDashboardStats = async (req, res) => {
  try {
    // ── Orders stats ──
    const [
      totalOrders,
      paidOrders,
      unpaidOrders,
      codOrders,
      stripeOrders,
      placedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
    ] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ isPaid: true }),
      Order.countDocuments({ isPaid: false }),
      Order.countDocuments({ paymentMethod: "COD" }),
      Order.countDocuments({ paymentMethod: "STRIPE" }),
      Order.countDocuments({ status: "PLACED" }),
      Order.countDocuments({ status: "SHIPPED" }),
      Order.countDocuments({ status: "DELIVERED" }),
      Order.countDocuments({ status: "CANCELLED" }),
    ]);

    // ── Revenue (only paid orders count towards revenue) ──
    const revenueAgg = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // ── Products stats ──
    const [totalProducts, activeProducts, inactiveProducts, lowStockProducts, outOfStockProducts] =
      await Promise.all([
        Product.countDocuments({}),
        Product.countDocuments({ isActive: true }),
        Product.countDocuments({ isActive: false }),
        Product.countDocuments({ stock: { $gt: 0, $lte: LOW_STOCK_THRESHOLD } }),
        Product.countDocuments({ stock: { $lte: 0 } }),
      ]);

    // ── Users stats ──
    const [totalUsers, totalAdmins] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ isAdmin: true }),
    ]);

    // ── Recent orders (last 5) ──
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "firstName lastName email")
      .select("total status paymentMethod isPaid createdAt user");

    // ── Low stock product list (for alert widget) ──
    const lowStockList = await Product.find({ stock: { $gt: 0, $lte: LOW_STOCK_THRESHOLD } })
      .sort({ stock: 1 })
      .limit(10)
      .select("name stock category");

    // ── Orders per day (last 7 days) — simple trend ──
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const ordersTrend = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: { $cond: ["$isPaid", "$total", 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.json({
      // orders
      totalOrders,
      paidOrders,
      unpaidOrders,
      codOrders,
      stripeOrders,
      placedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,

      // products
      totalProducts,
      activeProducts,
      inactiveProducts,
      lowStockProducts,
      outOfStockProducts,
      lowStockList,

      // users
      totalUsers,
      totalAdmins,

      // recent activity
      recentOrders,
      ordersTrend,
    });
  } catch (err) {
    console.error("ADMIN DASHBOARD STATS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
