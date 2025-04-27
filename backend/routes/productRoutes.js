// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { uploadMultipleMemory } = require('../middleware/uploadMiddleware');
const productController = require('../controllers/productController');

// Thread product routes
router.post('/thread', uploadMultipleMemory, productController.addThreadProduct);
router.get('/thread', productController.getAllThreadProducts);
router.get('/thread/:id', productController.getThreadProductById);
router.put('/thread/:id', uploadMultipleMemory, productController.updateThreadProduct);
router.delete('/thread/:id', productController.deleteThreadProduct);

module.exports = router;