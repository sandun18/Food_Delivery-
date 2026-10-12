import mongoose from 'mongoose';

// Define Order Schema
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required']
    },
    items: {
      type: Array,
      required: [true, 'Order items are required'],
      default: []
    },
    amount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    address: {
      type: Object,
      required: [true, 'Delivery address is required']
    },
    status: {
      type: String,
      default: 'Food Processing',
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['COD', 'Card'],
        message: '{VALUE} is not a valid payment method'
      },
      default: 'COD'
    },
    payment: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Prevent model overwrite in development mode
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
