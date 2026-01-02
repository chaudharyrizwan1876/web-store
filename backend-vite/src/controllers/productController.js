import Product from "../models/Product.js";

// small helper to safely build regex from user text
const escapeRegex = (str = "") => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ================= USER APIs =================

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = { isActive: true };

    // ✅ category filter (case-insensitive exact match)
    // example: /api/products?category=Computer%20and%20tech
    if (category && String(category).trim()) {
      const c = String(category).trim();
      filter.category = new RegExp(`^${escapeRegex(c)}$`, "i");
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ count: products.length, products });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.isActive === false) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ product });
  } catch (err) {
    return res.status(400).json({ message: "Invalid product id" });
  }
};

// POST /api/products/seed
export const seedProducts = async (req, res) => {
  try {
    const sample = [
      {
        name: "Wireless Headphones",
        price: 4999,
        images: ["https://picsum.photos/seed/headphones/600/600"],
        description: "Comfortable wireless headphones with deep bass.",
        category: "Electronics",
        stock: 25,
        rating: 4.4,
        numReviews: 120,
        isActive: true,
      },
      {
        name: "Smart Watch",
        price: 8999,
        images: ["https://picsum.photos/seed/watch/600/600"],
        description: "Fitness tracking, notifications, and long battery life.",
        category: "Electronics",
        stock: 18,
        rating: 4.2,
        numReviews: 80,
        isActive: true,
      },
      {
        name: "Running Shoes",
        price: 6499,
        images: ["https://picsum.photos/seed/shoes/600/600"],
        description: "Lightweight shoes designed for daily running.",
        category: "Fashion",
        stock: 40,
        rating: 4.5,
        numReviews: 65,
        isActive: true,
      },
      {
        name: "Backpack",
        price: 2999,
        images: ["https://picsum.photos/seed/bag/600/600"],
        description: "Durable backpack for travel and college.",
        category: "Accessories",
        stock: 50,
        rating: 4.1,
        numReviews: 30,
        isActive: true,
      },
    ];

    const inserted = await Product.insertMany(sample);
    res.status(201).json({ message: "Seeded products ✅", insertedCount: inserted.length });
  } catch (err) {
    res.status(500).json({ message: "Failed to seed products" });
  }
};

// ================= ADMIN APIs =================

// POST /api/products (Admin)
export const createProductAdmin = async (req, res) => {
  try {
    const {
      name,
      price,
      images = [],
      description = "",
      category = "",
      stock = 0,
      isActive = true,
    } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const product = await Product.create({
      name,
      price,
      images,
      description,
      category,
      stock,
      isActive,
    });

    return res.status(201).json({ message: "Product created", product });
  } catch (err) {
    console.error("CREATE PRODUCT ADMIN ERROR:", err);
    return res.status(500).json({ message: "Failed to create product" });
  }
};

// PATCH /api/products/:id (Admin)
export const updateProductAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Partial update (only provided fields)
    const updatable = [
      "name",
      "price",
      "images",
      "description",
      "category",
      "stock",
      "isActive",
    ];

    updatable.forEach((key) => {
      if (req.body[key] !== undefined) product[key] = req.body[key];
    });

    await product.save();

    return res.json({ message: "Product updated", product });
  } catch (err) {
    console.error("UPDATE PRODUCT ADMIN ERROR:", err);
    return res.status(500).json({ message: "Failed to update product" });
  }
};

// DELETE /api/products/:id (Admin) — soft delete
export const deleteProductAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isActive = false;
    await product.save();

    return res.json({ message: "Product deactivated", productId: id });
  } catch (err) {
    console.error("DELETE PRODUCT ADMIN ERROR:", err);
    return res.status(500).json({ message: "Failed to delete product" });
  }
};
