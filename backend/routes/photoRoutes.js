import express from 'express';
import { getPhotos, uploadPhoto, deletePhoto } from '../controllers/photoController.js';
import { protect } from '../middleware/auth.js';
import {adminOnly} from  '../middleware/adminOnly.js'
import upload from '../utils/upload.js';

const router = express.Router();

// Public route
router.get('/', getPhotos);

// Admin routes
router.post('/', protect, adminOnly, upload.single('image'), uploadPhoto);
router.delete('/:id', protect, adminOnly, deletePhoto);

export default router;