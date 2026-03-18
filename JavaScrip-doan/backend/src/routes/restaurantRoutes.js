const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/', restaurantController.getAllRestaurants);

// Đón luồng GET lấy chi tiết nhà hàng
router.get('/:id', restaurantController.getRestaurantById);

// Đón luồng GET lấy thực đơn
router.get('/:id/dishes', restaurantController.getRestaurantDishes);

router.post('/', restaurantController.createRestaurant);

module.exports = router;