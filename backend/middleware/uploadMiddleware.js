// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Configure disk storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Alternative: Use memory storage for base64 conversion
const memoryStorage = multer.memoryStorage();

// Set file filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Create multer instances
const uploadDisk = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

const uploadMemory = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

module.exports = {
  // Use these middleware functions in your routes
  uploadSingleDisk: uploadDisk.single('image'),          // For single file upload to disk
  uploadMultipleDisk: uploadDisk.array('images', 10),    // For multiple file upload to disk (max 10)
  uploadSingleMemory: uploadMemory.single('image'),      // For single file upload to memory
  uploadMultipleMemory: uploadMemory.array('images', 10) // For multiple file upload to memory (max 10)
};