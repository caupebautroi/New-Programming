const db = require('../config/db');

class Restaurant {
    static async getAll() {
        const [rows] = await db.execute("SELECT * FROM restaurants");
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute("SELECT * FROM restaurants WHERE id = ?", [id]);
        return rows[0];
    }

    static async search(term) {
        const searchTerm = `%${term}%`;
        const sql = `
            SELECT DISTINCT r.* FROM restaurants r
            LEFT JOIN dishes d ON r.id = d.restaurant_id
            WHERE r.name LIKE ? OR r.category LIKE ? OR d.name LIKE ?`;
        const [rows] = await db.execute(sql, [searchTerm, searchTerm, searchTerm]);
        return rows;
    }
}

module.exports = Restaurant;