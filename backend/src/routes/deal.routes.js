// ====================== backend-vite/src/routes/deal.routes.js ======================
import express from "express";
import { getActiveDeal } from "../controllers/dealController.js";

const router = express.Router();

// Public
router.get("/active", getActiveDeal);

export default router;
