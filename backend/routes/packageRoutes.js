import express from "express";
import {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from "../controllers/packageController.js";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

const packageRoutes = express.Router();

// Public route
packageRoutes.get("/", getPackages);

// Admin routes
packageRoutes.post("/", protect, adminOnly, createPackage);
packageRoutes.put("/:id", protect, adminOnly, updatePackage);
packageRoutes.delete("/:id", protect, adminOnly, deletePackage);

export default packageRoutes;
