import bcrypt from 'bcryptjs';

/**
 * Hash a plain text password using bcrypt with salt rounds of 10
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password string
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword
};

/**
 * Compare plain text password with hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password stored in database
 * @returns {Promise<boolean>} - True if match, otherwise false
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export default {
  hashPassword,
  comparePassword
};
