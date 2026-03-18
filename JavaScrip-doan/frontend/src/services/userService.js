import axiosClient from '../api/axiosClient';

// Cập nhật thông tin cơ bản
export const updateProfile = async (userId, updateData) => {
    return await axiosClient.put(`/users/${userId}`, updateData);
};

// Đổi mật khẩu
export const changePassword = async (userId, passwordData) => {
    return await axiosClient.put(`/users/${userId}/password`, passwordData);
};

// Đăng ký cửa hàng mới
export const registerStore = async (storeData) => {
    return await axiosClient.post('/restaurants', storeData);
};