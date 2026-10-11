import express from 'express';
import multer from 'multer';
import path from 'path';
import { addFood, listFood } from '../controllers/foodController.js';

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

// Route: Add Food Item
foodRouter.post('/add', upload.single('image'), addFood);

// Route: Get All Food Items
foodRouter.get('/list', listFood);

export default foodRouter;
