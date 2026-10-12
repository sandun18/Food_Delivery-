/**
 * Graceful 404 Not Found Route Handler
 * Intercepts requests to non-existent API routes and returns a friendly JSON response
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
};

/**
 * Centralized Global Error Handler Middleware
 * Intercepts all unhandled errors across controllers and routes,
 * formats them into user-friendly JSON responses, and sanitizes stack traces.
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const errorHandler = (err, req, res, next) => {
  // If headers are already sent, delegate to standard Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Determine status code (default to 500 if status is currently 200 OK)
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Internal Server Error';

  // 1. Mongoose Invalid ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID format: '${err.value}' for resource '${err.path || 'item'}'`;
  }

  // 2. Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    message = `Duplicate key error: '${value}' is already in use for '${field}'`;
  }

  // 3. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors || {})
      .map((val) => val.message)
      .join(', ');
  }

  // 4. JWT Authentication Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Not Authorized: Invalid token provided';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Not Authorized: Authentication token expired. Please login again';
  }

  // 5. Multer File Upload Error
  if (err.name === 'MulterError') {
    statusCode = 400;
    message = `File upload error: ${err.message}`;
  }

  // Log error in non-test environments
  if (process.env.NODE_ENV !== 'test') {
    console.error(`❌ [Centralized Error] [${req.method}] ${req.originalUrl}:`, err.message);
  }

  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default {
  notFoundHandler,
  errorHandler
};
