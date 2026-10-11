import express from 'express';
import multer from 'multer';
import path from 'path';
import { addFood, listFood, removeFood, getFoodByCategory } from '../controllers/foodController.js';
import adminAuth from '../middleware/adminAuth.js';

const foodRouter = express.Router();

// Configure Image Storage Engine using Multer
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  }
});

// Configure Multer Upload Middleware with file filtering
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed!'));
  }
});

// Route: Add Food Item (Admin only)
foodRouter.post('/add', adminAuth, upload.single('image'), addFood);

// Route: Get All Food Items (Public)
foodRouter.get('/list', listFood);

// Route: Remove Food Item (Admin only)
foodRouter.post('/remove', adminAuth, removeFood);

// Route: Filter Food by Category (Public)
foodRouter.get('/category/:cat', getFoodByCategory);

export default foodRouter;
