const restaurantService = require('../services/restaurantService');
const dishService = require('../services/dishService');
const Restaurant = require('../models/Restaurant');

class RestaurantController {
    // API 1: Lấy chi tiết 1 nhà hàng
    async getRestaurantById(req, res, next) {
        try {
            const restaurant = await restaurantService.getRestaurantDetails(req.params.id);
            res.json(restaurant);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    // API 2: Lấy danh sách món ăn của 1 nhà hàng
    async getRestaurantDishes(req, res, next) {
        try {
            const dishes = await dishService.getDishesByRestaurant(req.params.id);
            res.json(dishes);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Thêm hàm này vào trong class RestaurantController
    async getAllRestaurants(req, res, next) {
        try {
            const restaurants = await restaurantService.getAllRestaurants();
            res.json(restaurants);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createRestaurant(req, res) {
        try {
            const { name, category, time_delivery, image, owner } = req.body;

            // Kiểm tra dữ liệu bắt buộc
            if (!name || !owner) {
                return res.status(400).json({ error: "Thiếu tên cửa hàng hoặc thông tin chủ quán!" });
            }

            const newRestaurant = await Restaurant.create({
                name,
                category,
                time_delivery: time_delivery || "15-20 phút",
                image: image || "https://via.placeholder.com/300x180?text=Food",
                owner,
                rating: 5.0,
                status: 'Approved' // Gán thẳng Approved để hiện ngay lên trang chủ
            });

            // CHỈ GỬI PHẢN HỒI MỘT LẦN DUY NHẤT
            res.status(201).json({
                message: "Tạo cửa hàng thành công!",
                data: newRestaurant
            });
        } catch (error) {
            console.error("Lỗi createRestaurant:", error);
            res.status(500).json({ error: error.message });
        }
    }
}



module.exports = new RestaurantController();