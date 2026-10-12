import User from '../models/User.js';

/**
 * Add an item to the user's cart
 * Route: POST /api/cart/add
 * Access: Private (Requires Auth Middleware)
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    const { itemId } = req.body;

    // Validate itemId presence
    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required'
      });
    }

    // Find the user by ID
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get current cart data or initialize empty object
    const cartData = userData.cartData ? { ...userData.cartData } : {};

    // Increment quantity or initialize with 1
    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    // Update user document with the new cart data
    await User.findByIdAndUpdate(userId, { cartData });

    return res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      cartData
    });
  } catch (error) {
    console.error('Error in addToCart controller:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};
