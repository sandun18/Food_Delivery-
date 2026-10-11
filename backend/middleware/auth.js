import jwt from 'jsonwebtoken';

/**
 * Authentication Middleware for Protected Routes
 * Extracts token or Bearer token from request headers, verifies it using JWT_SECRET,
 * and injects the decoded user ID into req.user
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
const authMiddleware = async (req, res, next) => {
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
        message: 'Not Authorized, token missing. Please login again.'
      });
    }

    // 3. Verify JWT Secret existence
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Internal server error: JWT secret not configured'
      });
    }

    // 4. Verify and decode token
    const decoded = jwt.verify(token, secret);

    // Extract user ID from token payload (utils/token.js encodes { id })
    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not Authorized, invalid token payload.'
      });
    }

    // 5. Inject user ID into req.user as requested
    req.user = userId;

    // Also populate req.userId and req.body.userId for compatibility
    req.userId = userId;
    if (req.body && typeof req.body === 'object') {
      req.body.userId = req.body.userId || userId;
    }

    // 6. Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not Authorized, token invalid or expired. Please login again.'
    });
  }
};

export { authMiddleware, authMiddleware as auth };
export default authMiddleware;
