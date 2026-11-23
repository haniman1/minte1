import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", detail: error.message });
  }
};

export const seedAdmin = async (req, res) => {
  try {
    const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      return res
        ?.status(400)
        .json({ message: "Set ADMIN_EMAIL and ADMIN_PASSWORD in .env" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const existing = await User.findOne({ email });

    if (existing) {
      existing.password = hashedPassword;
      existing.role = "admin";
      await existing.save();
      return res?.json({ message: "Admin updated" });
    }

    await User.create({
      name: "Admin",
      email,
      password: hashedPassword,
      role: "admin",
    });
    res?.json({ message: "Admin created" });
  } catch (error) {
    console.error("Error seeding admin:", error);
    res?.status(500).json({ message: error.message });
  }
};
