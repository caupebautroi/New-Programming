const Order = require('../models/Order');

class OrderService {
    async placeOrder(orderData) {
        const { user_id, total_price, address, phone, receiver_name, items } = orderData;

        // 1. Validation (Kiểm tra dữ liệu)
        if (!user_id) throw new Error("Chưa xác định người dùng (User ID)");
        if (!items || items.length === 0) throw new Error("Giỏ hàng đang trống");
        if (!phone || !address || !receiver_name) throw new Error("Thiếu thông tin giao hàng");
        if (total_price <= 0) throw new Error("Tổng tiền không hợp lệ");

        // 2. Gọi Model để lưu vào Database (Đã dùng Transaction cực an toàn)
        const newOrder = await Order.create(orderData, {
            include: ['items'] // Thay 'items' bằng tên alias (as) bạn đã cấu hình trong Model
        });
        
        // 3. (Tùy chọn mở rộng sau này) - Có thể gửi Email xác nhận hoặc thông báo cho cửa hàng ở đây
        
        return newOrder.id;
    }
}

module.exports = new OrderService();