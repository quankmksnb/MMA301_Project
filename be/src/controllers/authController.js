// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendEmailOtp } from "../utils/emailService.js";

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hashed,
      role: role || "user",
      status: "pending"
    });

    // invalidate OTP cũ (nếu có)
    await OTP.deleteMany({ email, used: false });

    const otp = generateOtp(6);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
    await OTP.create({ email, otp, expiresAt });

    await sendEmailOtp({ to: email, otp });

    res.status(201).json({
      message: "Registered. OTP sent to email.",
      user: { id: user._id, email: user.email, status: user.status }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/auth/verify-otp
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await OTP.findOne({ email, otp, used: false });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });

    if (record.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    // mark used
    record.used = true;
    await record.save();

    const user = await User.findOneAndUpdate(
      { email },
      { $set: { status: "active" } },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Email verified", status: user.status });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/auth/resend-otp
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.status === "active")
      return res.status(400).json({ message: "Account already verified" });

    // rate-limit: nếu còn OTP chưa hết hạn trong 30s gần nhất thì từ chối
    const recent = await OTP.findOne({
      email,
      used: false,
      expiresAt: { $gt: new Date() }
    }).sort({ expiresAt: -1 });

    if (recent) {
      const secondsLeft = Math.max(0, Math.ceil((recent.expiresAt - Date.now()) / 1000));
      if (secondsLeft > 90) {
        return res.status(429).json({ message: "Please wait before requesting a new OTP" });
      }
    }

    await OTP.deleteMany({ email, used: false });

    const otp = generateOtp(6);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
    await OTP.create({ email, otp, expiresAt });

    await sendEmailOtp({ to: email, otp });

    res.json({ message: "New OTP sent" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.status !== "active")
      return res.status(403).json({ message: "Account not verified or blocked" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // Không cần lưu token hay xóa gì cả
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
