import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createStripeCheckoutSession } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/stripe/create-session", protect, createStripeCheckoutSession);

export default router;
