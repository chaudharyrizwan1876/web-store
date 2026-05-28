import express from "express";
import {
  getProducts,
  seedProducts,
  getProductById,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// ================= USER =================
router.get("/", getProducts);
router.get("/:id", getProductById);

// ================= ADMIN =================
router.post("/seed", protect, adminOnly, seedProducts); // secure seed
router.post("/", protect, adminOnly, createProductAdmin);
router.patch("/:id", protect, adminOnly, updateProductAdmin);
router.delete("/:id", protect, adminOnly, deleteProductAdmin);

export default router;
