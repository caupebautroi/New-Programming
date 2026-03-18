const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Lấy token từ Header của Request (Frontend sẽ gửi lên)
    const token = req.header('Authorization');

    // 2. Nếu không có token -> Chặn
    if (!token) {
        return res.status(401).json({ error: "Truy cập bị từ chối. Bạn chưa đăng nhập!" });
    }

    try {
        // Token thường có dạng "Bearer xyz123...". Ta cần tách lấy phần "xyz123..."
        const tokenString = token.replace('Bearer ', '');
        
        // 3. Giải mã và kiểm tra tính hợp lệ của token
        const verifiedUser = jwt.verify(tokenString, process.env.JWT_SECRET);
        
        // 4. Lưu thông tin user vào Request để các Controller phía sau có thể xài
        req.user = verifiedUser; 
        
        // 5. Cho phép đi tiếp
        next(); 
    } catch (error) {
        res.status(400).json({ error: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};

module.exports = verifyToken;