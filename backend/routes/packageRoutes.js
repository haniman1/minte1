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

// Public: Get all packages
packageRoutes.get("/", getPackages);

// Admin: Create package
packageRoutes.post("/", protect, adminOnly, createPackage);

// Admin: Update package
packageRoutes.put("/:id", protect, adminOnly, updatePackage);

// Admin: Delete package
packageRoutes.delete("/:id", protect, adminOnly, deletePackage);

export default packageRoutes;
