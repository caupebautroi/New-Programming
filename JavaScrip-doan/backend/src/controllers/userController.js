const User = require('../models/User');

class UserController {
    async updateProfile(req, res, next) {
        try {
            await User.updateProfile(req.params.id, req.body);
            res.json({ message: "Cập nhật thành công!" });
        } catch (error) {
            if(error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: "Tên đăng nhập hoặc Email đã tồn tại!" });
            }
            next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body;
            await User.updatePassword(req.params.id, oldPassword, newPassword);
            res.json({ message: "Đổi mật khẩu thành công!" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
module.exports = new UserController();