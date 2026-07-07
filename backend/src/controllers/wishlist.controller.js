import User from "../models/User.js";
import Product from "../models/Product.js";

// ══════════════════════════════════════════════
// GET /api/wishlist
// User ki wishlist products ki poori detail ke sath
// ══════════════════════════════════════════════
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).populate("wishlist");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ wishlist: user.wishlist || [] });
  } catch (err) {
    console.error("GET WISHLIST ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ══════════════════════════════════════════════
// POST /api/wishlist/:productId
// Product ko wishlist mein add karo
// ══════════════════════════════════════════════
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadyExists = user.wishlist.some(
      (id) => String(id) === String(productId)
    );

    if (alreadyExists) {
      return res.status(200).json({ message: "Already in wishlist", wishlist: user.wishlist });
    }

    user.wishlist.push(productId);
    await user.save();

    return res.status(201).json({ message: "Added to wishlist", wishlist: user.wishlist });
  } catch (err) {
    console.error("ADD WISHLIST ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ══════════════════════════════════════════════
// DELETE /api/wishlist/:productId
// Product ko wishlist se remove karo
// ══════════════════════════════════════════════
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishlist = user.wishlist.filter(
      (id) => String(id) !== String(productId)
    );
    await user.save();

    return res.json({ message: "Removed from wishlist", wishlist: user.wishlist });
  } catch (err) {
    console.error("REMOVE WISHLIST ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ══════════════════════════════════════════════
// PUT /api/wishlist/:productId/toggle
// Ek hi endpoint se add/remove (frontend ke liye simple)
// ══════════════════════════════════════════════
export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const exists = user.wishlist.some((id) => String(id) === String(productId));

    if (exists) {
      user.wishlist = user.wishlist.filter((id) => String(id) !== String(productId));
      await user.save();
      return res.json({ message: "Removed from wishlist", inWishlist: false, wishlist: user.wishlist });
    } else {
      user.wishlist.push(productId);
      await user.save();
      return res.json({ message: "Added to wishlist", inWishlist: true, wishlist: user.wishlist });
    }
  } catch (err) {
    console.error("TOGGLE WISHLIST ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
