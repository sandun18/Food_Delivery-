import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Admin Protection Middleware
 * Verifies JWT token and ensures the authenticated user has 'admin' role.
 * Restricts sensitive administrative actions (e.g. adding, deleting food items).
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
const adminAuth = async (req, res, next) => {
  try {
    let token;

    // 1. Extract token from Authorization header or custom 'token' header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const customToken = req.headers.token || req.headers.Token;

    if (authHeader) {
      if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      } else {
        token = authHeader;
      }
    } else if (customToken) {
      if (typeof customToken === 'string' && customToken.startsWith('Bearer ')) {
        token = customToken.split(' ')[1];
      } else {
        token = customToken;
      }
    }

    // 2. Check if token exists
    if (!token || (typeof token === 'string' && token.trim() === '')) {
      return res.status(401).json({
        success: false,
        message: 'Not Authorized, token missing. Please login as admin.'
      });
    }

    // 3. Verify JWT Secret exists
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not configured in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Internal server error: JWT secret not configured'
      });
    }

    // 4. Verify and decode token
    const decoded = jwt.verify(token, secret);
    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not Authorized, invalid token payload.'
      });
    }

    // 5. Find user in database to check role
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.'
      });
    }

    // 6. Verify admin privileges
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Admin privileges required.'
      });
    }

    // 7. Inject admin user details into request object
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    console.error('Admin Auth Middleware Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not Authorized, token invalid or expired. Please login again.'
    });
  }
};

export default adminAuth;
export { adminAuth };
