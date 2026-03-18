const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthService {
    /**
     * Logic Đăng ký tài khoản
     */
    async registerUser(userData) {
        const { username, email, password } = userData;

        // 1. Kiểm tra trùng lặp (Username hoặc Email)
        const existingUser = await User.findByUsernameOrEmail(username, email);
        if (existingUser) {
            // Ném lỗi để Controller bắt được
            const error = new Error('Tên đăng nhập hoặc Email đã tồn tại!');
            error.statusCode = 400;
            throw error;
        }

        // 2. Tạo User mới trong Database
        // Lưu ý: Trong thực tế nên dùng bcrypt để mã hóa password trước khi lưu
        return await User.create({ username, email, password });
    }

    /**
     * Logic Đăng nhập
     */
    async loginUser(identifier, password) {
        // 1. Tìm user và kiểm tra mật khẩu
        const user = await User.findForLogin(identifier, password);
        
        if (!user) {
            const error = new Error('Sai tài khoản hoặc mật khẩu!');
            error.statusCode = 401;
            throw error;
        }

        // 2. Tạo JWT Token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Trả về dữ liệu sạch (loại bỏ mật khẩu trước khi gửi về client)
        const { password: _, ...userSafeData } = user;
        
        return { 
            user: userSafeData, 
            token 
        };
    }
}

module.exports = new AuthService();