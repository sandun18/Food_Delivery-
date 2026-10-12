import express from 'express';
import { placeOrderCod } from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

const orderRouter = express.Router();

// Route to place Cash on Delivery (COD) order (Protected)
orderRouter.post('/place-cod', authMiddleware, placeOrderCod);
orderRouter.post('/place', authMiddleware, placeOrderCod);

export default orderRouter;
