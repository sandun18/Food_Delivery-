import Order from '../models/Order.js';
import User from '../models/User.js';

/**
 * Place Order with Cash on Delivery (COD)
 * Route: POST /api/order/place-cod
 * Access: Private (Requires Auth Middleware)
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const placeOrderCod = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    const { items, amount, address } = req.body;

    // 1. Validation of required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart items are required to place an order'
      });
    }

    if (amount === undefined || amount === null || typeof amount !== 'number' || amount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid order amount is required'
      });
    }

    if (!address || typeof address !== 'object' || Object.keys(address).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address is required'
      });
    }

    // 2. Verify that the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // 3. Create new Order with COD
    const newOrder = new Order({
      userId,
      items,
      amount,
      address,
      status: 'Food Processing',
      date: new Date(),
      paymentMethod: 'COD',
      payment: false
    });

    await newOrder.save();

    // 4. Clear the user's cartData in MongoDB
    await User.findByIdAndUpdate(userId, { cartData: {} });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully (Cash on Delivery)',
      orderId: newOrder._id,
      order: newOrder
    });
  } catch (error) {
    console.error('Error in placeOrderCod controller:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message
    });
  }
};
