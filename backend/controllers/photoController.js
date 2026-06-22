import Photo from '../models/Photo.js';
import { cloudinary } from '../config/cloudinary.js';

// Get all photos (Public)
export const getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Upload Photo (Admin Only)
export const uploadPhoto = async (req, res) => {
  try {
    const { title, category } = req.body;
    const file = req.file;

    if (!file || !title || !category) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'photography-portfolio',
    });

    const newPhoto = await Photo.create({
      title,
      category,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });

    res.status(201).json({
      success: true,
      message: "Photo uploaded successfully",
      photo: newPhoto
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Photo (Admin Only)
export const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(photo.cloudinaryId);

    await Photo.findByIdAndDelete(req.params.id);

    res.json({ message: "Photo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};