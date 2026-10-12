import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import userRouter from './routes/userRoute.js';
import foodRouter from './routes/foodRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import adminRouter from './routes/adminRoute.js';
import helmet from 'helmet';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/securityMiddleware.js';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load environment variables
dotenv.config();

// 2. Initialize Express application
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Middlewares
// Security HTTP headers (configured to allow cross-origin images for frontend)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Enable CORS for frontend and admin panel requests
app.use(cors());

// Parse incoming JSON payloads in request body
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// 4. Serve static files
// Serve uploaded images to the browser via /images/<filename>
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// 5. API Endpoints
app.use('/api/user', userRouter);
app.use('/api/food', foodRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/admin', adminRouter);

// 6. Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Food Delivery API is running successfully'
  });
});

// 7. Comprehensive Health Check route (Server & Database status)
app.get('/api/health', (req, res) => {
  const dbStatusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  const dbState = mongoose.connection.readyState;
  const isDbConnected = dbState === 1;

  const healthData = {
    status: isDbConnected ? 'OK' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: {
      status: dbStatusMap[dbState] || 'Unknown',
      name: mongoose.connection.name || 'N/A',
      host: mongoose.connection.host || 'N/A'
    }
  };

  res.status(isDbConnected ? 200 : 503).json({
    success: isDbConnected,
    ...healthData
  });
});

// 8. 404 Route Not Found and Centralized Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// 9. Connect to database and start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Static files served at http://localhost:${PORT}/images`);
    console.log(`🩺 Health check available at http://localhost:${PORT}/api/health`);
  });
};

startServer();

export default app;
