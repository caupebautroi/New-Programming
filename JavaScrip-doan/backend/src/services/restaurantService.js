const Restaurant = require('../models/Restaurant');

class RestaurantService {
    async getAllRestaurants() {
        return await Restaurant.getAll();
    }

    async getRestaurantDetails(id) {
        if (!id) throw new Error("ID nhà hàng không hợp lệ");
        const restaurant = await Restaurant.getById(id);
        if (!restaurant) throw new Error("Không tìm thấy nhà hàng");
        return restaurant;
    }

    async searchEverything(query) {
        if (!query) return await Restaurant.getAll();
        return await Restaurant.search(query);
    }
}

module.exports = new RestaurantService();