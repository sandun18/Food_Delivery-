import User from '../models/User.js';
import { hashPassword } from '../utils/password.js';
import createToken from '../utils/token.js';
import { validateRegisterInput } from '../utils/validateAuth.js';

/**
 * Register a new user
 * @route POST /api/user/register
 * @access Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate input data (email format & password length >= 8)
    const validation = validateRegisterInput(name, email, password);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email address'
      });
    }

    // 3. Hash user password
    const hashedPassword = await hashPassword(password);

    // 4. Create and save new user in database
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    // 5. Generate JWT token
    const token = createToken(savedUser._id);

    // 6. Return response with token and user details (excluding password)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        cartData: savedUser.cartData
      }
    });

  } catch (error) {
    console.error('Registration Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.'
    });
  }
};

export default {
  registerUser
};
