import bcrypt from "bcryptjs";
import User from "../models/User.js";

// ══════════════════════════════════════════════
// GET /api/user/profile
// Logged in user ki detail lo
// ══════════════════════════════════════════════
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -cart");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ══════════════════════════════════════════════
// PUT /api/user/profile
// Profile update karo
// ══════════════════════════════════════════════
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Basic fields update
    if (firstName && firstName.trim()) user.firstName = firstName.trim();
    if (lastName && lastName.trim()) user.lastName = lastName.trim();
    if (phone && phone.trim()) user.phone = phone.trim();
    if (address && address.trim()) user.address = address.trim();

    // Password change (optional)
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to set a new one" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
