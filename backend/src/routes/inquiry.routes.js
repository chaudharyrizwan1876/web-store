import express from "express";
import { sendSupplierInquiry } from "../controllers/inquiryController.js";

const router = express.Router();

// POST - Send supplier inquiry
router.post("/", sendSupplierInquiry);

export default router;
