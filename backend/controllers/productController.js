// controllers/productController.js
const Product = require('../models/Product');

// Add new thread product
exports.addThreadProduct = async (req, res) => {
  try {
    // Parse product data from the request body
    let productData;
    try {
      productData = typeof req.body.productData === 'string' 
        ? JSON.parse(req.body.productData) 
        : req.body;
    } catch (error) {
      productData = req.body;
    }
    
    // Handle images from multer
    const images = [];
    
    if (req.files && req.files.length > 0) {
      // Convert uploaded files to base64
      for (const file of req.files) {
        images.push({
          name: file.originalname,
          contentType: file.mimetype,
          base64Data: file.buffer.toString('base64')
        });
      }
    }
    
    // Create new product with the provided data
    const newProduct = new Product({
      ...productData,
      images
    });
    
    // Save the product to the database
    await newProduct.save();
    
    // Return success response
    res.status(201).json({
      success: true,
      message: 'Thread product added successfully',
      product: {
        id: newProduct._id,
        name: newProduct.name,
        category: newProduct.category
      }
    });
  } catch (error) {
    console.error('Error adding thread product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add thread product',
      error: error.message
    });
  }
};

// Get all thread products
exports.getAllThreadProducts = async (req, res) => {
  try {
    // Fetch all products with selected fields (excluding large base64 image data)
    const products = await Product.find()
      .select('-images.base64Data')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error fetching thread products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch thread products',
      error: error.message
    });
  }
};

// Get thread product by ID
exports.getThreadProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Thread product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching thread product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch thread product',
      error: error.message
    });
  }
};

// Update thread product
exports.updateThreadProduct = async (req, res) => {
  try {
    // Parse product data from the request body
    let productData;
    try {
      productData = typeof req.body.productData === 'string' 
        ? JSON.parse(req.body.productData) 
        : req.body;
    } catch (error) {
      productData = req.body;
    }
    
    // Handle image updates if needed
    let updateData = { ...productData, updatedAt: Date.now() };
    
    // Handle new images if provided
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        name: file.originalname,
        contentType: file.mimetype,
        base64Data: file.buffer.toString('base64')
      }));
      
      // Get current product to append or replace images
      const currentProduct = await Product.findById(req.params.id);
      if (currentProduct) {
        if (req.body.replaceImages === 'true') {
          // Replace all images
          updateData.images = newImages;
        } else {
          // Append to existing images
          updateData.images = [...currentProduct.images, ...newImages];
        }
      }
    }
    
    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Thread product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Thread product updated successfully',
      product: {
        id: updatedProduct._id,
        name: updatedProduct.name,
        category: updatedProduct.category
      }
    });
  } catch (error) {
    console.error('Error updating thread product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update thread product',
      error: error.message
    });
  }
};

// Delete thread product
exports.deleteThreadProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Thread product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Thread product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting thread product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete thread product',
      error: error.message
    });
  }
};