// server/index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Import models after setting up mongoose
const { userModel } = require("./models/goods.js");

// Connect to MongoDB
const connectDB = async () => {
  try {
    const url = process.env.MONGO_URI || "mongodb://localhost:27017/thread-store";
    await mongoose.connect(url);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Call the connect function
connectDB();

// API Routes
app.use('/api/products', productRoutes);

// User authentication route (should come before 404 handler)
app.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    
    if (user) {
      if (user.password === password) {
        res.json(user);
      } else {
        res.status(401).json("Incorrect password");
      }
    } else {
      res.status(404).json("User does not exist");
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json("Server error");
  }
});

// Handle 404s - make sure this is after all valid routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handling middleware - should be the last middleware
// Make sure this is actually a middleware function
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(err.stack);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});