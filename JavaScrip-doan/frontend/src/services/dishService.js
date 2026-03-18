import axiosClient from '../api/axiosClient';

// Lấy danh sách món ăn của 1 nhà hàng
export const getDishesByRestaurant = async (restaurantId) => {
    return await axiosClient.get(`/restaurants/${restaurantId}/dishes`);
};

// Thêm món ăn mới (Dành cho chủ quán)
export const addDish = async (dishData) => {
    return await axiosClient.post('/dishes', dishData);
};