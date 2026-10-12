import Order from '../models/Order.js';
import User from '../models/User.js';
import stripe from '../config/stripe.js';

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

/**
 * Place Order with Online Payment (Stripe Checkout Session)
 * Route: POST /api/order/place
 * Access: Private (Requires Auth Middleware)
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const placeOrder = async (req, res) => {
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

    // 2. Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // 3. Create new Order in database with Card paymentMethod (payment: false until verified)
    const newOrder = new Order({
      userId,
      items,
      amount,
      address,
      status: 'Food Processing',
      date: new Date(),
      paymentMethod: 'Card',
      payment: false
    });

    await newOrder.save();

    // 4. Clear user's cartData
    await User.findByIdAndUpdate(userId, { cartData: {} });

    // 5. Construct Stripe line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name
        },
        unit_amount: Math.round(Number(item.price) * 100)
      },
      quantity: Number(item.quantity) || 1
    }));

    // Add delivery charges ($2 fixed fee)
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Delivery Charges'
        },
        unit_amount: 2 * 100
      },
      quantity: 1
    });

    // 6. Create Stripe Checkout Session
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: `${clientUrl}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${clientUrl}/verify?success=false&orderId=${newOrder._id}`
    });

    return res.status(200).json({
      success: true,
      message: 'Checkout session created successfully',
      session_url: session.url,
      orderId: newOrder._id
    });
  } catch (error) {
    console.error('Error in placeOrder (Stripe) controller:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to create payment checkout session',
      error: error.message
    });
  }
};

/**
 * Verify Stripe Payment Status
 * Route: POST /api/order/verify
 * Access: Public / Protected
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = req.body;

    // Validate orderId presence
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required for verification'
      });
    }

    const isSuccess = success === true || success === 'true';

    if (isSuccess) {
      // Payment successful: mark payment as true
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { payment: true },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully. Order confirmed.',
        order: updatedOrder
      });
    } else {
      // Payment cancelled or failed: remove the unpaid pending order
      const deletedOrder = await Order.findByIdAndDelete(orderId);

      return res.status(200).json({
        success: false,
        message: 'Payment was cancelled or failed. Order removed.',
        orderId: deletedOrder ? deletedOrder._id : orderId
      });
    }
  } catch (error) {
    console.error('Error in verifyOrder controller:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Order verification failed',
      error: error.message
    });
  }
};
