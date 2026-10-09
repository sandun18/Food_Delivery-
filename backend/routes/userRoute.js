import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const userRouter = express.Router();

// User Registration Route
userRouter.post('/register', registerUser);

// User Login Route
userRouter.post('/login', loginUser);

export default userRouter;

