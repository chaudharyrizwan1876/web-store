import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.get("/", protect, getWishlist);
router.post("/:productId", protect, addToWishlist);
router.delete("/:productId", protect, removeFromWishlist);
router.put("/:productId/toggle", protect, toggleWishlist);

export default router;
