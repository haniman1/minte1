import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database & Cloudinary
connectDB();
connectCloudinary();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Photography API is running 🚀",
  });
});

// Routes
app.use("/api/auth", (await import("./routes/authRoutes.js")).default);
app.use("/api/photos", (await import("./routes/photoRoutes.js")).default);
app.use("/api/packages", (await import("./routes/packageRoutes.js")).default);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
