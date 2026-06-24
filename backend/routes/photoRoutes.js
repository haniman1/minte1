import express from "express";
import {
  getPhotos,
  uploadPhoto,
  deletePhoto,
} from "../controllers/photoController.js";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";
import upload from "../utils/upload.js";

const photoRoutes = express.Router();

// Public route
photoRoutes.get("/", getPhotos);

// Admin routes
photoRoutes.post("/", protect, adminOnly, upload.single("image"), uploadPhoto);
photoRoutes.delete("/:id", protect, adminOnly, deletePhoto);

export default photoRoutes;
