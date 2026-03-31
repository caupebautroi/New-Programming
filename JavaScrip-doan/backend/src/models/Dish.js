const db = require('../config/db');

class Dish {
   static async getByRestaurantId(restaurantId) {
    // 1. Lấy danh sách món ăn của nhà hàng
    const [dishes] = await db.execute("SELECT * FROM dishes WHERE restaurant_id = ?", [restaurantId]);

    // 2. Chạy vòng lặp để lấy thêm Extra cho TỪNG món ăn
    for (let i = 0; i < dishes.length; i++) {
        const dishId = dishes[i].id;
        
        // Truy vấn bảng dish_extras dựa vào ID của món ăn
        const [extras] = await db.execute("SELECT name, price FROM dish_extras WHERE dish_id = ?", [dishId]);
        
        // Gắn mảng tên extra vào món ăn (VD: ["Phủ phô mai", "Thêm tương ớt"])
        dishes[i].extras = extras.map(extra => extra.name);
    }
        console.log("Dữ liệu món ăn chuẩn bị gửi đi:", JSON.stringify(dishes, null, 2));
    // 3. Trả về danh sách món ăn đã có kèm Extra
    return dishes;
}

    static async create(restaurant_id, name, price, image) {
        const sql = "INSERT INTO dishes (restaurant_id, name, price, image) VALUES (?, ?, ?, ?)";
        const [result] = await db.execute(sql, [restaurant_id, name, price, image]);
        return result;
    }
}

module.exports = Dish;