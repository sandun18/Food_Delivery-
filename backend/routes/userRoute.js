import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
import { authLimiter } from '../middleware/securityMiddleware.js';

const userRouter = express.Router();

// User Registration Route (Protected against Brute Force)
userRouter.post('/register', authLimiter, registerUser);

// User Login Route (Protected against Brute Force)
userRouter.post('/login', authLimiter, loginUser);

// User Profile Routes (Protected)
userRouter.get('/profile', authMiddleware, getProfile);
userRouter.put('/profile', authMiddleware, updateProfile);
userRouter.post('/profile', authMiddleware, updateProfile);

export default userRouter;

