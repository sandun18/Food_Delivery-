import express from 'express';
import { getDashboardMetrics } from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const adminRouter = express.Router();

// Dashboard Metrics Endpoint (Protected - Admin Only)
adminRouter.get('/metrics', adminAuth, getDashboardMetrics);
adminRouter.post('/metrics', adminAuth, getDashboardMetrics);

export default adminRouter;
