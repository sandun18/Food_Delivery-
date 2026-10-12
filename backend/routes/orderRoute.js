import express from 'express';
import {
  placeOrderCod,
  placeOrder,
  verifyOrder,
  userOrders,
  cancelOrder,
  listOrders,
  updateStatus
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const orderRouter = express.Router();

// Order Placement Routes (Protected - User)
orderRouter.post('/place-cod', authMiddleware, placeOrderCod);
orderRouter.post('/place', authMiddleware, placeOrder);

// Order Payment Verification Route
orderRouter.post('/verify', verifyOrder);

// User Orders Route (Protected - User)
orderRouter.post('/userorders', authMiddleware, userOrders);
orderRouter.get('/userorders', authMiddleware, userOrders);

// Cancel Order Route (Protected - User)
orderRouter.post('/cancel', authMiddleware, cancelOrder);

// Admin Order Management Routes (Protected - Admin)
orderRouter.get('/list', adminAuth, listOrders);
orderRouter.post('/list', adminAuth, listOrders);
orderRouter.post('/status', adminAuth, updateStatus);

export default orderRouter;
