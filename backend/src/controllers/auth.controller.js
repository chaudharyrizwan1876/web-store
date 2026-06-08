import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import OtpToken from "../models/OtpToken.js";
import { generateToken } from "../utils/generateToken.js";

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();

const buildUserResponse = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  isAdmin: user.isAdmin,
});

// ── Email transporter ──────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── OTP generator (6 digit) ────────────────────────────────────
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ══════════════════════════════════════════════════════════════
// POST /api/auth/register
// ══════════════════════════════════════════════════════════════
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!firstName || !lastName || !email || !password || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
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

// ══════════════════════════════════════════════════════════════
// POST /api/auth/login
// ══════════════════════════════════════════════════════════════
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
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

// ══════════════════════════════════════════════════════════════
// POST /api/auth/forgot-password
// Email check karo — agar milti hai toh OTP bhejo
// ══════════════════════════════════════════════════════════════
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    // DB mein email dhundho
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email address" });
    }

    // Purana OTP delete karo (agar tha)
    await OtpToken.deleteMany({ email: cleanEmail });

    // Naya 6 digit OTP banao
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minute

    // OTP hash karke save karo
    const hashedOtp = await bcrypt.hash(otp, 10);
    await OtpToken.create({ email: cleanEmail, otp: hashedOtp, expiresAt });

    // Email bhejo
    await transporter.sendMail({
      from: `"Web Store" <${process.env.EMAIL_USER}>`,
      to: cleanEmail,
      subject: "Your Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9f9f9; border-radius: 12px;">
          <h2 style="color: #1a1a2e; margin-bottom: 8px;">Password Reset Request</h2>
          <p style="color: #555; font-size: 15px;">Use the OTP below to reset your password. It is valid for <strong>10 minutes</strong>.</p>
          <div style="text-align: center; margin: 32px 0;">
            <span style="display: inline-block; background: #3E63FF; color: #fff; font-size: 36px; font-weight: 900; letter-spacing: 10px; padding: 18px 32px; border-radius: 12px;">${otp}</span>
          </div>
          <p style="color: #999; font-size: 13px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    return res.json({ message: "OTP sent to your email address" });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return res.status(500).json({ message: "Failed to send OTP. Try again." });
  }
};

// ══════════════════════════════════════════════════════════════
// POST /api/auth/verify-otp
// OTP verify karo
// ══════════════════════════════════════════════════════════════
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const record = await OtpToken.findOne({ email: cleanEmail });

    if (!record) {
      return res.status(400).json({ message: "OTP expired or not found. Please try again." });
    }

    // Expiry check
    if (new Date() > record.expiresAt) {
      await OtpToken.deleteMany({ email: cleanEmail });
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // OTP match karo
    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect OTP. Please try again." });
    }

    return res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ══════════════════════════════════════════════════════════════
// POST /api/auth/reset-password
// Naya password set karo
// ══════════════════════════════════════════════════════════════
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const record = await OtpToken.findOne({ email: cleanEmail });

    if (!record) {
      return res.status(400).json({ message: "OTP expired or not found. Please start again." });
    }

    if (new Date() > record.expiresAt) {
      await OtpToken.deleteMany({ email: cleanEmail });
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP. Please start again." });
    }

    // Password update karo
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email: cleanEmail }, { password: hashedPassword });

    // OTP delete karo — ek baar use ho gaya
    await OtpToken.deleteMany({ email: cleanEmail });

    return res.json({ message: "Password reset successfully. Please login." });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};