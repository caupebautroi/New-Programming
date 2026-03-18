const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/', orderController.createOrder);
router.get('/user/:userId', orderController.getUserOrders);
router.put('/:id/cancel', orderController.cancelOrder);
router.get('/store/:ownerId', orderController.getStoreOrders);
router.put('/:id/status', orderController.updateOrderStatus);

// Bất cứ ai gọi hàm tạo đơn hàng đều PHẢI có token hợp lệ
router.post('/', verifyToken, orderController.createOrder); 

// Chủ quán muốn xem đơn hoặc cập nhật cũng PHẢI có token
router.get('/store/:ownerId', verifyToken, orderController.getStoreOrders);
router.put('/:id/status', verifyToken, orderController.updateOrderStatus);

module.exports = router;