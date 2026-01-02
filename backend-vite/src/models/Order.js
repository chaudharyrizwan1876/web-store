import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },

    subtotal: { type: Number, required: true, default: 0 },
    shipping: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },

    // ✅ Payment fields (COD + Stripe ready)
    paymentMethod: {
      type: String,
      enum: ["COD", "STRIPE"],
      default: "COD",
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID", "FAILED"],
      default: "UNPAID",
    },
    stripeSessionId: { type: String },

    /**
     * ✅ Stock reservation expiry (CRITICAL for Stripe unpaid)
     * If UNPAID and reservedUntil < now => auto-cancel + restore stock
     */
    reservedUntil: { type: Date },

    status: {
      type: String,
      enum: ["PLACED", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },
  },
  { timestamps: true }
);

// ✅ optional index: helps queries to find expired unpaid orders faster
orderSchema.index({ paymentStatus: 1, reservedUntil: 1, status: 1 });

export default mongoose.model("Order", orderSchema);
