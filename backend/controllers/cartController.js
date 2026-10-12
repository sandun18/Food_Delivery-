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

/**
 * Remove an item or decrement its quantity from the user's cart
 * Route: POST /api/cart/remove
 * Access: Private (Requires Auth Middleware)
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const removeFromCart = async (req, res) => {
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

    // Check if the item exists in the cart
    if (cartData[itemId]) {
      if (cartData[itemId] > 1) {
        cartData[itemId] -= 1;
      } else {
        // If quantity is 1 or less, delete the key completely
        delete cartData[itemId];
      }
    }

    // Update user document with the modified cart data
    await User.findByIdAndUpdate(userId, { cartData });

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      cartData
    });
  } catch (error) {
    console.error('Error in removeFromCart controller:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
};

/**
 * Retrieve the current user's cart data
 * Route: POST /api/cart/get or GET /api/cart
 * Access: Private (Requires Auth Middleware)
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;

    // Find the user by ID
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Retrieve user's cartData or default to an empty object
    const cartData = userData.cartData || {};

    return res.status(200).json({
      success: true,
      message: 'Cart data retrieved successfully',
      cartData
    });
  } catch (error) {
    console.error('Error in getCart controller:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve cart data',
      error: error.message
    });
  }
};

/**
 * Clear the user's cart (used after placing an order or resetting cart)
 * Route: POST /api/cart/clear
 * Access: Private (Requires Auth Middleware)
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;

    // Find the user by ID
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Reset cartData to an empty object
    await User.findByIdAndUpdate(userId, { cartData: {} });

    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cartData: {}
    });
  } catch (error) {
    console.error('Error in clearCart controller:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};
