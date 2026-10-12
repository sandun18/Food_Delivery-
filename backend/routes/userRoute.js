import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router();

// User Registration Route
userRouter.post('/register', registerUser);

// User Login Route
userRouter.post('/login', loginUser);

// User Profile Routes (Protected)
userRouter.get('/profile', authMiddleware, getProfile);
userRouter.put('/profile', authMiddleware, updateProfile);
userRouter.post('/profile', authMiddleware, updateProfile);

export default userRouter;

