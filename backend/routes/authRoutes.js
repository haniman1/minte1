import express from 'express';
import { login, seedAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {adminOnly} from  '../middleware/adminOnly.js'

const router = express.Router();

// Public routes
router.post('/login', login);

// Seed admin (you can call this once)
router.get('/seed-admin', seedAdmin);

export default router;