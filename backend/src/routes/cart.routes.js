import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getCart,
  addToCart,
  updateCartQty,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.patch("/", protect, updateCartQty);

// ✅ remove all must be BEFORE /:productId
router.delete("/clear", protect, clearCart);

router.delete("/:productId", protect, removeFromCart);

export default router;
