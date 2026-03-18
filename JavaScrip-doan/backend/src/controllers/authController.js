const authService = require('../services/authService');

class AuthController {
    async register(req, res, next) {
        try {
            const result = await authService.registerUser(req.body);
            res.status(201).json({ message: "Đăng ký thành công!", data: result });
        } catch (err) {
            // Trả về lỗi mà Service đã ném ra (400, 401, v.v.)
            res.status(err.statusCode || 500).json({ error: err.message });
        }
    }

    async login(req, res, next) {
        try {
            const { identifier, password } = req.body;
            const { user, token } = await authService.loginUser(identifier, password);
            
            res.status(200).json({ 
    message: "Đăng nhập thành công",
    token: token, 
    user: user  // Gồm id, username, email...
});
        } catch (err) {
            res.status(err.statusCode || 500).json({ error: err.message });
        }
    }
}
module.exports = new AuthController();