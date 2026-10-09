import mongoose from 'mongoose';
import validator from 'validator';

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'Please enter a valid email address'
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    cartData: {
      type: Object,
      default: {}
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    minimize: false, // Ensures empty cartData object {} is saved in MongoDB
    timestamps: true // Adds createdAt and updatedAt fields
  }
);

// Prevent model overwrite in development mode
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
