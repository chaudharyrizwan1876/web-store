import express from "express";
import { getAdminDashboardStats } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// GET /api/admin/dashboard
router.get("/dashboard", protect, adminOnly, getAdminDashboardStats);

export default router;
