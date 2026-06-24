import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";
import authRoutes from "./routes/authRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";
import packageRoutes from "./routes/photoRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database & Cloudinary
connectDB();
connectCloudinary();

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 Photography API is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/packages", packageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
