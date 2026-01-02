import User from "../models/User.js";
import Product from "../models/Product.js";

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const user = await User.findById(userId).populate("cart.product");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ cart: user.cart || [] });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// POST /api/cart
// body: { productId, qty }
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { productId, qty = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const safeQty = Math.max(1, Number(qty) || 1);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ check product exists + active + stock
    const product = await Product.findById(productId);
    if (!product || product.isActive === false) {
      return res.status(404).json({ message: "Product not available" });
    }

    const existingIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    const currentQtyInCart =
      existingIndex >= 0 ? Number(user.cart[existingIndex].qty || 0) : 0;
    const newQty = currentQtyInCart + safeQty;

    // ✅ stock validation
    const stock = Number(product.stock ?? 0);
    if (newQty > stock) {
      return res.status(400).json({
        message: `${product.name} is out of stock.\n\nPlease visit tomorrow. New stock will be updated soon.`,
        productId,
        availableStock: stock,
        requestedQty: newQty,
      });
    }

    if (existingIndex >= 0) {
      user.cart[existingIndex].qty = newQty;
    } else {
      user.cart.push({ product: productId, qty: safeQty });
    }

    await user.save();

    const updated = await User.findById(userId).populate("cart.product");
    res.status(200).json({ message: "Added to cart ✅", cart: updated.cart });
  } catch (err) {
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// PATCH /api/cart
// body: { productId, qty }
export const updateCartQty = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { productId, qty } = req.body;

    if (!productId)
      return res.status(400).json({ message: "productId is required" });

    const safeQty = Number(qty);
    if (!safeQty || safeQty < 1) {
      return res.status(400).json({ message: "qty must be >= 1" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const idx = user.cart.findIndex((i) => i.product.toString() === productId);
    if (idx === -1)
      return res.status(404).json({ message: "Item not in cart" });

    // ✅ check product exists + active + stock
    const product = await Product.findById(productId);
    if (!product || product.isActive === false) {
      return res.status(404).json({ message: "Product not available" });
    }

    const stock = Number(product.stock ?? 0);
    if (safeQty > stock) {
      return res.status(400).json({
        message: `${product.name} is out of stock.\n\nPlease visit tomorrow. New stock will be updated soon.`,
        productId,
        availableStock: stock,
        requestedQty: safeQty,
      });
    }

    user.cart[idx].qty = safeQty;
    await user.save();

    const updated = await User.findById(userId).populate("cart.product");
    res.json({ message: "Cart updated ✅", cart: updated.cart });
  } catch (err) {
    res.status(500).json({ message: "Failed to update cart" });
  }
};

// DELETE /api/cart/:productId
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter((i) => i.product.toString() !== productId);
    await user.save();

    const updated = await User.findById(userId).populate("cart.product");
    res.json({ message: "Removed from cart ✅", cart: updated.cart });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from cart" });
  }
};

// ✅ DELETE /api/cart/clear  (Remove all)
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = [];
    await user.save();

    return res.json({ message: "Cart cleared ✅", cart: [] });
  } catch (err) {
    return res.status(500).json({ message: "Failed to clear cart" });
  }
};
