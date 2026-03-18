import axiosClient from '../api/axiosClient';

//lấy danh sách nhà hàng
export const getAllRestaurants = async () => {
    try {
        const response = await axiosClient.get('/restaurants');
        return response; 
    } catch (error) {
        console.error("Lỗi fetch nhà hàng:", error);
        throw error;
    }
};
// Lấy thông tin chi tiết 1 nhà hàng
export const getRestaurantById = async (id) => {
    return await axiosClient.get(`/restaurants/${id}`);
};

// Lấy danh sách món ăn của nhà hàng đó
export const getDishesByRestaurantId = async (id) => {
    return await axiosClient.get(`/restaurants/${id}/dishes`);
};