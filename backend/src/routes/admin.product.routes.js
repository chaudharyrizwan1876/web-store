import express from "express";
import {
  getAllProductsAdmin,
  createProductAdmin,
  updateProductAdmin,
  toggleProductStatusAdmin,
} from "../controllers/adminProductController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// 🔒 all admin product routes
router.use(protect, isAdmin);

// ✅ list
router.get("/products", getAllProductsAdmin);

// ✅ create (upload images via "imagesFiles")
router.post("/products", upload.array("imagesFiles", 6), createProductAdmin);

// ✅ update (upload images via "imagesFiles")
router.patch("/products/:id", upload.array("imagesFiles", 6), updateProductAdmin);

// ✅ toggle active
router.patch("/products/:id/toggle", toggleProductStatusAdmin);

export default router;
