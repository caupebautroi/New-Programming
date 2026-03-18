const db = require('../config/db');

class User {
    static async create(userData) {
            try {
                const { username, email, password } = userData; 

                const [result] = await db.execute(
                    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                    [username, email, password]
                );
                return result;
            } catch (error) {
                // Dòng này cực kỳ quan trọng để bạn biết MySQL đang chửi gì
                console.error("=== LỖI MYSQL TẠI BẢNG USERS ===", error.message);
                throw error;
            }
        }

    // 2. Thêm hàm này để dùng khi Đăng ký (kiểm tra trùng lặp)
    static async findByUsernameOrEmail(username, email) {
        const sql = "SELECT * FROM users WHERE username = ? OR email = ?";
        const [rows] = await db.execute(sql, [username, email]);
        return rows[0];
    }

    // 3. Hàm này dùng cho Đăng nhập
    static async findForLogin(identifier, password) {
        // Lưu ý: Ở đây ta tìm theo username/email, sau đó Service sẽ check password
        const sql = "SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?";
        const [rows] = await db.execute(sql, [identifier, identifier, password]);
        return rows[0];
    }

    // 4. Các hàm cập nhật Profile
    static async updateProfile(id, data) {
        const { username, email, full_name, phone } = data;
        const sql = "UPDATE users SET username=?, email=?, full_name=?, phone=? WHERE id=?";
        return await db.execute(sql, [username, email, full_name, phone, id]);
    }

    // 5. Đổi mật khẩu
    static async updatePassword(id, oldPassword, newPassword) {
        const [rows] = await db.execute("SELECT password FROM users WHERE id=?", [id]);
        if (rows.length === 0 || rows[0].password !== oldPassword) {
            throw new Error("Mật khẩu cũ không chính xác!");
        }
        return await db.execute("UPDATE users SET password=? WHERE id=?", [newPassword, id]);
    }
}

module.exports = User;