const dishService = require('../services/dishService');

class DishController {
    async createDish(req, res, next) {
        try {
            const dishId = await dishService.createDish(req.body);
            res.status(201).json({ message: "Thêm món thành công!", id: dishId });
        } catch (error) {
            // Lỗi do người dùng nhập thiếu dữ liệu (400 Bad Request)
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new DishController();