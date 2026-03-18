const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');

// Đón luồng POST từ nút "Thêm món mới" trong detail.js
router.post('/', dishController.createDish);

module.exports = router;