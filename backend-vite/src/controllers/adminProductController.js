import Product from "../models/Product.js";

const toFullUrl = (req, relPath) => {
  const base = `${req.protocol}://${req.get("host")}`;
  return `${base}${relPath}`;
};

const pickUploadedImages = (req) => {
  const files = req.files || [];
  // store as full URLs so frontend can render easily
  return files.map((f) => toFullUrl(req, `/uploads/${f.filename}`));
};

// ✅ GET all products (Admin)
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("ADMIN GET PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Failed to load products" });
  }
};

// ✅ CREATE product (Admin)  (supports multipart/form-data)
export const createProductAdmin = async (req, res) => {
  try {
    const {
      name,
      price,
      oldPrice,
      description,
      category,
      brand,
      stock,
      images, // optional: comma-separated URLs (if sending JSON/multipart)
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const uploaded = pickUploadedImages(req);

    let urlImages = [];
    if (typeof images === "string" && images.trim()) {
      urlImages = images
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }

    const product = await Product.create({
      name: String(name).trim(),
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : 0,
      description: description ? String(description).trim() : "",
      category: category ? String(category).trim() : "",
      brand: brand ? String(brand).trim() : "",
      stock: stock !== undefined && stock !== "" ? Number(stock) : 0,
      images: [...uploaded, ...urlImages],
      isActive: true,
    });

    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    console.error("ADMIN CREATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to create product" });
  }
};

// ✅ UPDATE product (Admin) (supports multipart/form-data)
export const updateProductAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const uploaded = pickUploadedImages(req);

    // fields update
    const fields = ["name", "price", "oldPrice", "description", "category", "brand", "stock", "isActive"];
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        if (f === "price" || f === "oldPrice" || f === "stock") product[f] = Number(req.body[f]);
        else if (f === "isActive") product[f] = req.body[f] === "true" || req.body[f] === true;
        else product[f] = String(req.body[f]).trim();
      }
    }

    // images logic:
    // if client sends images="" empty string -> do nothing
    // if client sends images as comma string -> replace url list but keep uploaded? (we add uploaded to front)
    if (typeof req.body.images === "string" && req.body.images.trim()) {
      const urlImages = req.body.images
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

      // keep existing uploaded urls that are already in DB? (optional)
      // simplest: replace with (uploaded + urlImages)
      product.images = [...uploaded, ...urlImages];
    } else if (uploaded.length) {
      // if only uploads came, append
      product.images = [...uploaded, ...(product.images || [])];
    }

    await product.save();

    res.json({ message: "Product updated", product });
  } catch (err) {
    console.error("ADMIN UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// ✅ TOGGLE active / inactive (Admin)
export const toggleProductStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isActive = !product.isActive;
    await product.save();

    res.json({ message: "Product status updated", product });
  } catch (err) {
    console.error("ADMIN TOGGLE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to toggle product" });
  }
};
