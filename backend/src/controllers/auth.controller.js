import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();

const getEnvAdminCredentials = () => ({
  email: normalizeEmail(process.env.ADMIN_EMAIL),
  password: process.env.ADMIN_PASSWORD || "",
});

const isEnvAdminEmail = (email) => {
  const admin = getEnvAdminCredentials();
  return !!admin.email && normalizeEmail(email) === admin.email;
};

const buildUserResponse = (user) => ({
  id: user._id || user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  isAdmin: user.isAdmin,
});

const buildEnvAdminUser = () => {
  const admin = getEnvAdminCredentials();

  if (!admin.email || !admin.password) {
    throw new Error("Admin credentials are not configured");
  }

  return {
    id: "env-admin",
    firstName: "Admin",
    lastName: "",
    email: admin.email,
    isAdmin: true,
  };
};

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!firstName || !lastName || !email || !password || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isEnvAdminEmail(cleanEmail)) {
      return res.status(403).json({ message: "This email is reserved for admin login" });
    }

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email: cleanEmail,
      password: hashedPassword,
      phone,
      address,
      isAdmin: false,
    });

    return res.status(201).json({
      message: "Registered successfully",
      user: buildUserResponse(user),
      token: generateToken(user),
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (isEnvAdminEmail(cleanEmail)) {
      const admin = getEnvAdminCredentials();

      if (!admin.password || password !== admin.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = buildEnvAdminUser();

      return res.json({
        message: "Logged in successfully",
        user: buildUserResponse(user),
        token: generateToken(user),
      });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      message: "Logged in successfully",
      user: buildUserResponse(user),
      token: generateToken(user),
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
