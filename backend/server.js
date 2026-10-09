import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// 1. Environment variables load කිරීම
dotenv.config();

// 2. Express App එක initialize කිරීම
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Core Middlewares
// Client එකෙන් එන requests සඳහා CORS configure කිරීම
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Request body එකේ එන JSON data parse කර ගැනීමට express.json() middleware එක
app.use(express.json());

// URL-encoded data parse කර ගැනීම සඳහා
app.use(express.urlencoded({ extended: true }));

// 4. Base / Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Food Delivery API is running successfully'
  });
});

// 5. Database එකට සම්බන්ධ වී Server එක Start කිරීම
const startServer = async () => {
  // Database connection error handling
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();

export default app;
