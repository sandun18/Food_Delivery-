import express from 'express';
import { placeOrderCod, placeOrder, verifyOrder, userOrders, cancelOrder } from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

const orderRouter = express.Router();

// Order Placement Routes (Protected)
orderRouter.post('/place-cod', authMiddleware, placeOrderCod);
orderRouter.post('/place', authMiddleware, placeOrder);

// Order Payment Verification Route
orderRouter.post('/verify', verifyOrder);

// User Orders Route (Protected)
orderRouter.post('/userorders', authMiddleware, userOrders);
orderRouter.get('/userorders', authMiddleware, userOrders);

// Cancel Order Route (Protected)
orderRouter.post('/cancel', authMiddleware, cancelOrder);

export default orderRouter;
