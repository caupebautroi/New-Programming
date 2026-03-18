const db = require('../config/db');

class Order {
    static async create(orderData) {
        const { user_id, total_price, address, phone, receiver_name, note, items } = orderData;
        
        // Sử dụng Transaction để đảm bảo nếu lưu items lỗi thì order cũng không được tạo
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const sqlOrder = "INSERT INTO orders (user_id, total_price, address, phone, receiver_name, note) VALUES (?, ?, ?, ?, ?, ?)";
            const [orderResult] = await conn.execute(sqlOrder, [user_id, total_price, address, phone, receiver_name, note]);
            const orderId = orderResult.insertId;

            const sqlItems = "INSERT INTO order_items (order_id, dish_name, price, quantity) VALUES (?, ?, ?, ?)";
            for (const item of items) {
                await conn.execute(sqlItems, [orderId, item.dish_name, item.price, item.quantity]);
            }

            await conn.commit();
            return orderId;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
    // Thêm vào class Order
    static async getByUserId(userId) {
        // JOIN bảng orders với order_items để lấy đầy đủ chi tiết
        const sql = `
            SELECT o.*, 
                JSON_ARRAYAGG(JSON_OBJECT('dish_name', oi.dish_name, 'price', oi.price, 'quantity', oi.quantity)) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `;
        const [rows] = await db.execute(sql, [userId]);
        return rows;
    }

    static async updateStatus(orderId, status) {
        const sql = "UPDATE orders SET status = ? WHERE id = ?";
        return await db.execute(sql, [status, orderId]);
    }

    static async getByStoreOwner(ownerId) {
    const sql = `
        SELECT o.*, 
            JSON_ARRAYAGG(JSON_OBJECT('dish_name', oi.dish_name, 'price', oi.price, 'quantity', oi.quantity)) as items
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN dishes d ON oi.dish_name = d.name
        JOIN restaurants r ON d.restaurant_id = r.id
        WHERE r.owner_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `;
    const [rows] = await db.execute(sql, [ownerId]);
    return rows;
    }
}

module.exports = Order;