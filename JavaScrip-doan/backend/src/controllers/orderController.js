const orderService = require('../services/orderService');

class OrderController {
    async createOrder(req, res, next) {
        try {
            const orderData = req.body;
            const orderId = await orderService.placeOrder(orderData);
            
            res.status(201).json({ 
                message: "Đặt hàng thành công!", 
                orderId: orderId 
            });
        } catch (error) {
            next(error); 
        }
    }
    async getUserOrders(req, res, next) {
    try {
        const Order = require('../models/Order'); // Lấy trực tiếp từ Model cho nhanh
        const orders = await Order.getByUserId(req.params.userId);
        res.json(orders);
    } catch (error) {
        next(error);
    }
}

    async cancelOrder(req, res, next) {
        try {
            const Order = require('../models/Order');
            await Order.updateStatus(req.params.id, 'Đã hủy');
            res.json({ message: "Hủy đơn thành công" });
        } catch (error) {
            next(error);
        }
    }

    async getStoreOrders(req, res, next) {
        try {
            const Order = require('../models/Order');
            const orders = await Order.getByStoreOwner(req.params.ownerId);
            res.json(orders);
        } catch (error) {
            next(error);
        }
    }

    async updateOrderStatus(req, res, next) {
        try {
            const Order = require('../models/Order');
            await Order.updateStatus(req.params.id, req.body.status);
            res.json({ message: "Cập nhật thành công" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new OrderController();