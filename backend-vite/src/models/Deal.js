// ====================== backend-vite/src/models/Deal.js ======================
import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Deals and offers" },
    subtitle: { type: String, default: "" },
    category: { type: String, default: "" }, // must match Product.category
    endsAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Deal = mongoose.model("Deal", dealSchema);
export default Deal;
