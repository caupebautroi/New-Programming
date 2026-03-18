import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// THÊM TOKEN VÀO MỌI REQUEST TRƯỚC KHI GỬI ĐI
axiosClient.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage (chúng ta đã chốt dùng tên foodie_token ở bài trước)
        const token = localStorage.getItem('foodie_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// XỬ LÝ LỖI CHUNG KHI BACKEND TRẢ VỀ
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // Nếu Backend báo lỗi 401 (Hết hạn Token hoặc chưa đăng nhập)
        if (error.response && error.response.status === 401) {
            console.error("Token không hợp lệ hoặc đã hết hạn!");
            // Tùy chọn: Có thể ép đăng xuất và chuyển về trang Login tại đây
            // localStorage.removeItem('foodie_token');
            // localStorage.removeItem('foodie_currentUser');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;