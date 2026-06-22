import express from 'express';
import { 
  getPackages, 
  createPackage, 
  updatePackage, 
  deletePackage 
} from '../controllers/packageController.js';
import { protect } from '../middleware/auth.js';
import {adminOnly} from  '../middleware/adminOnly.js'

const router = express.Router();

// Public route
router.get('/', getPackages);

// Admin routes
router.post('/', protect, adminOnly, createPackage);
router.put('/:id', protect, adminOnly, updatePackage);
router.delete('/:id', protect, adminOnly, deletePackage);

export default router;