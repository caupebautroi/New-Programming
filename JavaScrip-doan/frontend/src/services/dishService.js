import axiosClient from "../api/axiosClient";

// Lấy danh sách món ăn của 1 nhà hàng
export const getDishesByRestaurant = (restaurantId) =>
  axiosClient.get(`/restaurants/${restaurantId}/dishes`);

// Thêm món ăn mới
export const addDish = (dishData) =>
  axiosClient.post("/dishes", dishData);

// Sửa món ăn
export const updateDish = (dishId, dishData) =>
  axiosClient.put(`/dishes/${dishId}`, dishData);

// Xóa món ăn
export const deleteDish = (dishId) =>
  axiosClient.delete(`/dishes/${dishId}`);