import User from "../models/User.js";

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();

const isEnvAdmin = (user = {}) => {
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL);
  return !!adminEmail && normalizeEmail(user.email) === adminEmail && user.isAdmin === true;
};

export const adminOnly = (req, res, next) => {
  if (req.user?.isAdmin) return next();

  return res.status(403).json({ message: "Admin access only" });
};

export const isAdmin = async (req, res, next) => {
  try {
    if (isEnvAdmin(req.user)) return next();

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
