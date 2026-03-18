const db = require('../config/db');

class Dish {
    static async getByRestaurantId(resId) {
        const [rows] = await db.execute("SELECT * FROM dishes WHERE restaurant_id = ?", [resId]);
        return rows;
    }

    static async create(restaurant_id, name, price, image) {
        const sql = "INSERT INTO dishes (restaurant_id, name, price, image) VALUES (?, ?, ?, ?)";
        const [result] = await db.execute(sql, [restaurant_id, name, price, image]);
        return result;
    }
}

module.exports = Dish;