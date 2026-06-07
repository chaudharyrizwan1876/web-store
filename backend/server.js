// backend/server.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import dealRoutes from "./src/routes/deal.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import webhookRoutes from "./src/routes/webhook.routes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import adminDealRoutes from "./src/routes/admin.deal.routes.js";
import adminOrderRoutes from "./src/routes/admin.order.routes.js";
import adminProductRoutes from "./src/routes/admin.product.routes.js";
import inquiryRoutes from "./src/routes/inquiry.routes.js";

import { protect } from "./src/middleware/authMiddleware.js";

// Rate limiter middleware
import {
  globalLimiter,
  authLimiter,
} from "./src/middleware/rateLimiter.js";

import Order from "./src/models/Order.js";
import Product from "./src/models/Product.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================
// ✅ CORS CONFIG (single, clean — no duplicate)
// ======================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://transcendent-kleicha-e134e0.netlify.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / server-to-server (no origin header)
      if (!origin) return callback(null, true);

      // Exact match
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Vercel preview domains
      if (/\.vercel\.app$/.test(origin)) return callback(null, true);

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// ======================
// ✅ Global rate limiter (all routes)
// ======================
app.use(globalLimiter);

app.use(morgan("dev"));

// ✅ Stripe webhook BEFORE express.json()
app.use("/api/webhook", webhookRoutes);

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root + health
app.get("/", (req, res) => res.send("Backend is running ✅"));
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", message: "Backend server is running" })
);

// ======================
// USER ROUTES
// ======================
app.use("/api/auth", authLimiter, authRoutes);  // stricter limiter on auth
app.use("/api/products", productRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/supplier-inquiry", inquiryRoutes);

// ======================
// ADMIN ROUTES
// ======================
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminDealRoutes);
app.use("/api/admin", adminOrderRoutes);
app.use("/api/admin", adminProductRoutes);

// Protected test route
app.get("/api/private", protect, (req, res) => {
  res.json({ message: "You are authorized ✅", user: req.user });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ======================
// Expired order cleanup job (every 5 min)
// ======================
const startExpiredOrderCleanupJob = () => {
  const intervalMs = 5 * 60 * 1000;

  const run = async () => {
    try {
      const now = new Date();
      const expiredOrders = await Order.find({
        paymentStatus: "UNPAID",
        status: "PLACED",
        reservedUntil: { $exists: true, $ne: null, $lt: now },
      }).select("_id items reservedUntil");

      if (!expiredOrders.length) return;

      for (const order of expiredOrders) {
        const ops = (order.items || []).map((it) => ({
          updateOne: {
            filter: { _id: it.product },
            update: { $inc: { stock: Number(it.qty || 0) } },
          },
        }));

        if (ops.length) await Product.bulkWrite(ops);

        await Order.updateOne(
          { _id: order._id, paymentStatus: "UNPAID", status: "PLACED" },
          { $set: { status: "CANCELLED", paymentStatus: "FAILED" } }
        );

        console.log(`🧹 Cancelled expired order ${order._id}`);
      }
    } catch (err) {
      console.error("❌ Expired order cleanup job failed:", err);
    }
  };

  run();
  setInterval(run, intervalMs);
};

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startExpiredOrderCleanupJob();
  });
});