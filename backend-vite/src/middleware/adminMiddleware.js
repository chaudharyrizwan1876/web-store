export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }

  return res.status(403).json({ message: "Admin access only" });
};
import User from "../models/User.js";

// 🔒 Admin middleware
export const isAdmin = async (req, res, next) => {
  try {
    // protect middleware sets: req.user = { id: ... }
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user.id).select("isAdmin");
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
