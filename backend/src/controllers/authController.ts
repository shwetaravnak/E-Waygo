import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
