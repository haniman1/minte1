import express from "express";
import { login, seedAdmin } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

const authRoutes = express.Router();

// Public routes
authRoutes.post("/login", login);

export default authRoutes;
