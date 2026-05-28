import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();

// ✅ protected upload (adminOnly nahi)
router.post("/", protect, upload.single("image"), uploadImage);

export default router;
