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

/**
 * Remove a food item
 * @route POST /api/food/remove
 * @access Public / Admin
 */
export const removeFood = async (req, res) => {
  try {
    const foodId = req.body.id || req.body._id;

    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: 'Food ID is required'
      });
    }

    // 1. Find the food item to retrieve its image filename
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    // 2. Remove the associated image file from uploads folder using fs.unlink
    if (food.image) {
      const imagePath = path.join('uploads', food.image);
      fs.unlink(imagePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.warn(`Warning: Could not delete image ${food.image}:`, err.message);
        }
      });
    }

    // 3. Delete the food item from database
    await Food.findByIdAndDelete(foodId);

    return res.status(200).json({
      success: true,
      message: 'Food item removed successfully'
    });
  } catch (error) {
    console.error('Error removing food item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove food item',
      error: error.message
    });
  }
};

/**
 * Filter food items by category
 * @route GET /api/food/category/:cat
 * @access Public
 */
export const getFoodByCategory = async (req, res) => {
  try {
    const { cat } = req.params;

    if (!cat || !cat.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category parameter is required'
      });
    }

    const trimmedCategory = cat.trim();
    let query = {};

    // If category is 'all', fetch all items; otherwise match case-insensitively
    if (trimmedCategory.toLowerCase() !== 'all') {
      const sanitizedCat = trimmedCategory.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query = { category: { $regex: new RegExp(`^${sanitizedCat}$`, 'i') } };
    }

    const foods = await Food.find(query);

    return res.status(200).json({
      success: true,
      category: trimmedCategory,
      count: foods.length,
      data: foods
    });
  } catch (error) {
    console.error('Error fetching food by category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch food items by category',
      error: error.message
    });
  }
};



