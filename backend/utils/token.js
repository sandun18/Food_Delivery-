import jwt from 'jsonwebtoken';

/**
 * Generate a JSON Web Token (JWT) with user ID encoded, expiring in 7 days
 * @param {string} id - User ID (_id from MongoDB)
 * @returns {string} - Signed JWT token string
 */
export const createToken = (id) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  // Sign token with user ID and 7-day expiration
  return jwt.sign({ id }, secret, {
    expiresIn: '7d'
  });
};

export default createToken
