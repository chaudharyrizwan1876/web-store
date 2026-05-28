import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  placeOrder,
  getMyOrders,
  getMyOrderById,
  cancelMyOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, placeOrder);

router.get("/my", protect, getMyOrders);
router.get("/my/:id", protect, getMyOrderById);

// ✅ cancel (only UNPAID + PLACED)
router.patch("/my/:id/cancel", protect, cancelMyOrder);

export default router;
