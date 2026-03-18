import axiosClient from '../api/axiosClient';

export const createOrder = async (orderData) => {
    try {
        const response = await axiosClient.post('/orders', orderData);
        return response;
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        throw error;
    }
};

// Lấy đơn hàng theo User ID
export const getOrdersByUserId = async (userId) => {
    return await axiosClient.get(`/orders/user/${userId}`);
};

// Hủy đơn hàng
export const cancelOrderApi = async (orderId) => {
    return await axiosClient.put(`/orders/${orderId}/cancel`);
};

// Lấy danh sách đơn hàng mà khách đã đặt tại quán của user này
export const getStoreOrders = async (ownerId) => {
    return await axiosClient.get(`/orders/store/${ownerId}`);
};

// Cập nhật trạng thái đơn hàng (Chuẩn bị, Giao hàng, Hoàn thành...)
export const updateOrderStatusApi = async (orderId, status) => {
    return await axiosClient.put(`/orders/${orderId}/status`, { status });
};