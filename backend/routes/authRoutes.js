import express from "express";
import { login, seedAdmin } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

const authRoutes = express.Router();

// Public routes
authRoutes.post("/login", login);

// Seed admin (you can call this once)
authRoutes.get("/seed-admin", seedAdmin);

export default authRoutes;
