import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  markOrderPaidAdmin,
} from "../controllers/adminOrderController.js";

const router = express.Router();

// ✅ Admin: get all orders
router.get("/orders", protect, adminOnly, getAllOrdersAdmin);

// ✅ Admin: update order status
router.patch("/orders/:id/status", protect, adminOnly, updateOrderStatusAdmin);

// ✅ Admin: mark COD order paid (optional)
router.patch("/orders/:id/mark-paid", protect, adminOnly, markOrderPaidAdmin);

export default router;
