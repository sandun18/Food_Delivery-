import fs from 'fs';
import path from 'path';
import Food from '../models/Food.js';

/**
 * Add a new food item
 * @route POST /api/food/add
 * @access Public / Admin
 */
export const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // 1. Verify image file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Food image is required'
      });
    }

    const imageFilename = req.file.filename;

    // 2. Validate required text fields
    if (!name || !description || price === undefined || price === '' || !category) {
      // Remove uploaded file if validation fails
      const filePath = path.join('uploads', imageFilename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.status(400).json({
        success: false,
        message: 'All fields (name, description, price, category) are required'
      });
    }

    // 3. Validate price is a positive number
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      const filePath = path.join('uploads', imageFilename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.status(400).json({
        success: false,
        message: 'Price must be a valid non-negative number'
      });
    }

    // 4. Create new food item
    const food = new Food({
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
      category: category.trim(),
      image: imageFilename
    });

    const savedFood = await food.save();

    return res.status(201).json({
      success: true,
      message: 'Food Added Successfully',
      data: savedFood
    });
  } catch (error) {
    console.error('Error adding food item:', error);

    // Clean up uploaded file in case of database error
    if (req.file && req.file.filename) {
      const filePath = path.join('uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to add food item',
      error: error.message
    });
  }
};

/**
 * Get all food items
 * @route GET /api/food/list
 * @access Public
 */
export const listFood = async (req, res) => {
  try {
    const foods = await Food.find({});
    return res.status(200).json({
      success: true,
      data: foods
    });
  } catch (error) {
    console.error('Error fetching food list:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch food items',
      error: error.message
    });
  }
};

