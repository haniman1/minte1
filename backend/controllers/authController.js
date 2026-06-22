import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Seed Admin (Run once)
export const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@photo.com' });
    if (adminExists) return;

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await User.create({
      name: "Admin",
      email: "admin@photo.com",
      password: hashedPassword,
      role: "admin"
    });

    console.log('✅ Admin user seeded successfully');
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};