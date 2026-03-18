const Dish = require('../models/Dish');

class DishService {
    async getDishesByRestaurant(restaurantId) {
        if (!restaurantId) throw new Error("Thiếu ID nhà hàng");
        return await Dish.getByRestaurantId(restaurantId);
    }

    async createDish(dishData) {
        const { restaurant_id, name, price } = dishData;
        
        // Kiểm tra tính hợp lệ của dữ liệu (Validation)
        if (!restaurant_id || !name || !price) {
            throw new Error("Vui lòng điền đầy đủ Tên, Giá và ID nhà hàng");
        }

        // Gọi Model lưu vào DB
        return await Dish.add(dishData);
    }
}

module.exports = new DishService();