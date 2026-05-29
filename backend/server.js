// ====================== backend-vite/server.js (UPDATED: safer CORS + clean logs) ======================
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

// ✅ Upload route (Cloudinary)
import uploadRoutes from "./src/routes/uploadRoutes.js";

// ✅ Admin routes
import adminRoutes from "./src/routes/admin.routes.js";
import adminDealRoutes from "./src/routes/admin.deal.routes.js";
import adminOrderRoutes from "./src/routes/admin.order.routes.js";
import adminProductRoutes from "./src/routes/admin.product.routes.js";

// ✅ Inquiry routes
import inquiryRoutes from "./src/routes/inquiry.routes.js";

import { protect } from "./src/middleware/authMiddleware.js";

// ✅ models for cleanup job
import Order from "./src/models/Order.js";
import Product from "./src/models/Product.js";

dotenv.config();

const app = express();

// ✅ Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =======================
// ✅ CORS (ENV-based, safer for Vercel preview)
// =======================
// =======================
// ✅ STRONG + SAFE CORS CONFIG (Netlify + Vercel + Local)
// =======================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://transcendent-kleicha-e134e0.netlify.app", // your Netlify frontend
  process.env.FRONTEND_URL, // optional (if set)
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server / Postman
      if (!origin) return callback(null, true);

      // allow exact matches
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // allow Vercel preview domains
      if (origin.includes(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman / server-to-server requests (no origin)
      if (!origin) return callback(null, true);

      const ok =
        allowedOrigins.includes(origin) ||
        // ✅ allow Vercel preview domains if they share the same base as FRONTEND_URL
        (process.env.FRONTEND_URL && origin.startsWith(process.env.FRONTEND_URL));

      if (ok) return callback(null, true);

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

// middlewares
app.use(morgan("dev"));

// ✅ IMPORTANT: Stripe webhook must be BEFORE express.json()
app.use("/api/webhook", webhookRoutes);

// Now JSON parser for rest APIs
app.use(express.json());

// ✅ serve uploaded images (local dev support)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// root route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend server is running" });
});

/* =======================
   USER ROUTES
======================= */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// ✅ Cloudinary upload endpoint
app.use("/api/upload", uploadRoutes);

// ✅ Supplier inquiry endpoint
app.use("/api/supplier-inquiry", inquiryRoutes);

/* =======================
   ADMIN ROUTES
======================= */
app.use("/api/admin", adminRoutes); // /dashboard etc
app.use("/api/admin", adminDealRoutes); // /deals
app.use("/api/admin", adminOrderRoutes); // /orders
app.use("/api/admin", adminProductRoutes); // /products

// 🔒 protected test route
app.get("/api/private", protect, (req, res) => {
  res.json({
    message: "You are authorized ✅",
    user: req.user,
  });
});

// 404 handler (always last)
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

const PORT = process.env.PORT || 5000;

/**
 * ✅ CRITICAL JOB: Auto-cancel expired UNPAID orders + restore stock
 * Runs every 5 minutes.
 */
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
        // 1) restore stock
        const ops = (order.items || []).map((it) => ({
          updateOne: {
            filter: { _id: it.product },
            update: { $inc: { stock: Number(it.qty || 0) } },
          },
        }));

        if (ops.length) {
          await Product.bulkWrite(ops);
        }

        // 2) cancel order
        await Order.updateOne(
          { _id: order._id, paymentStatus: "UNPAID", status: "PLACED" },
          {
            $set: {
              status: "CANCELLED",
              paymentStatus: "FAILED", // optional but useful
            },
          }
        );

        console.log(
          `🧹 Cancelled expired order ${order._id} and restored stock (reservedUntil: ${order.reservedUntil})`
        );
      }
    } catch (err) {
      console.error("❌ Expired order cleanup job failed:", err);
    }
  };

  // run once at start + then interval
  run();
  setInterval(run, intervalMs);
};

// connect DB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startExpiredOrderCleanupJob();
  });
});
