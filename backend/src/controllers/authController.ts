import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const register = async (req: Request, res: Response) => {
  try {
    const { fullname, email, password, phoneNumber, role, facility } = req.body;
    if (!fullname || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (role === 'ewaste_center' && !facility) {
      return res.status(400).json({ message: "Facility is required for ewaste center" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullname, email, password: hashedPassword, phoneNumber, role, facility });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    res.status(200).json({ ...user.toObject(), token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Get users failed" });
  }
};

export const sendResetCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetPasswordToken = hashedOtp;
    user.resetPasswordExpiry = new Date(expiry);
    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER!,
      to: email,
      subject: "E-Waygo Password Reset Code",
      html: `
        <h2>Your Password Reset Code</h2>
        <p>Use this code to reset your password: <strong>${otp}</strong></p>
        <p>This code expires in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    }; 

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset code sent to your email" });
  } catch (err) {
    console.error("Send reset code error:", err);
    res.status(500).json({ error: "Failed to send reset code" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const user = await User.findOne({ 
      email, 
      resetPasswordToken: crypto.createHash("sha256").update(otp).digest("hex"),
      resetPasswordExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Password reset failed" });
  }
};
