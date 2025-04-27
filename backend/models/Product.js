// models/Product.js
const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: String,
  hexCode: String
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  colors: [colorSchema],
  sizes: [String],
  features: [String],
  specifications: {
    material: String,
    length: String,
    thickness: String,
    tensileStrength: String,
    finish: String
  },
  images: [
    {
      name: String,
      contentType: String,
      base64Data: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;