import express from 'express';
import { placeOrderCod, placeOrder } from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

const orderRouter = express.Router();

// Order Placement Routes (Protected)
orderRouter.post('/place-cod', authMiddleware, placeOrderCod);
orderRouter.post('/place', authMiddleware, placeOrder);

export default orderRouter;
