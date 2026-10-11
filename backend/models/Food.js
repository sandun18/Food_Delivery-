import mongoose from 'mongoose';

// Define Food Item Schema
const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Food description is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Food price is required'],
      min: [0, 'Price cannot be negative']
    },
    image: {
      type: String,
      required: [true, 'Food image is required']
    },
    category: {
      type: String,
      required: [true, 'Food category is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent model overwrite in development mode
const Food = mongoose.models.Food || mongoose.model('Food', foodSchema);

export default Food;
