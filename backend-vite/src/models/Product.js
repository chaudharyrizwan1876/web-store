import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    price: { type: Number, required: true, default: 0 },
    oldPrice: { type: Number, default: 0 }, // ✅ better product data

    description: { type: String, default: "" },
    category: { type: String, default: "" },
    brand: { type: String, default: "" }, // ✅ better product data

    images: { type: [String], default: [] }, // ✅ can be URLs or uploaded URLs

    stock: { type: Number, default: 0 },

    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
