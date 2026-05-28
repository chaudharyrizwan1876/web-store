// ====================== backend-vite/src/routes/admin.deal.routes.js ======================
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { getActiveDealAdmin, upsertActiveDeal } from "../controllers/adminDealController.js";

const router = express.Router();

// Admin
router.get("/deals/active", protect, adminOnly, getActiveDealAdmin);
router.patch("/deals/active", protect, adminOnly, upsertActiveDeal);

export default router;
