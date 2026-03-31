const Order = require('../models/Order');

class OrderService {
    async placeOrder(orderData) {
        const {
            user_id,
            restaurant_id,
            total_price,
            address,
            phone,
            receiver_name,
            items
        } = orderData;

        if (!user_id) throw new Error("Chưa xác định người dùng (User ID)");
        if (!restaurant_id) throw new Error("Thiếu restaurant_id");
        if (!items || items.length === 0) throw new Error("Giỏ hàng đang trống");
        if (!phone || !address || !receiver_name) throw new Error("Thiếu thông tin giao hàng");
        if (total_price <= 0) throw new Error("Tổng tiền không hợp lệ");

        const orderId = await Order.create(orderData);
        return orderId;
    }
}

module.exports = new OrderService();