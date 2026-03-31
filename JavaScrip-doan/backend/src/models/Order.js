const db = require('../config/db');

class Order {
    static async create(orderData) {
        const {
            user_id,
            restaurant_id,
            total_price,
            address,
            phone,
            receiver_name,
            note,
            status,
            items
        } = orderData;

        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();

            const sqlOrder = `
                INSERT INTO orders (
                    user_id,
                    restaurant_id,
                    total_price,
                    address,
                    phone,
                    receiver_name,
                    note,
                    status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const [orderResult] = await conn.execute(sqlOrder, [
                user_id,
                restaurant_id,
                total_price,
                address,
                phone,
                receiver_name,
                note || null,
                status || 'Chờ xác nhận'
            ]);

            const orderId = orderResult.insertId;

            const sqlItems = `
                INSERT INTO order_items (order_id, dish_name, price, quantity)
                VALUES (?, ?, ?, ?)
            `;

            for (const item of items) {
                await conn.execute(sqlItems, [
                    orderId,
                    item.dish_name,
                    item.price,
                    item.quantity
                ]);
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

    static async getByUserId(userId) {
        const sql = `
            SELECT
                o.id,
                o.user_id,
                o.restaurant_id,
                o.total_price,
                o.receiver_name,
                o.phone,
                o.address,
                o.note,
                o.status,
                o.created_at,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'dish_name', oi.dish_name,
                        'price', oi.price,
                        'quantity', oi.quantity
                    )
                ) AS items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = ?
            GROUP BY
                o.id, o.user_id, o.restaurant_id, o.total_price,
                o.receiver_name, o.phone, o.address, o.note,
                o.status, o.created_at
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
            SELECT
                o.id,
                o.user_id,
                o.restaurant_id,
                o.total_price,
                o.receiver_name,
                o.phone,
                o.address,
                o.note,
                o.status,
                o.created_at,
                r.name AS restaurant_name,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'dish_name', oi.dish_name,
                        'price', oi.price,
                        'quantity', oi.quantity
                    )
                ) AS items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            INNER JOIN restaurants r ON o.restaurant_id = r.id
            INNER JOIN users u ON r.owner = u.username
            WHERE u.id = ?
            GROUP BY
                o.id, o.user_id, o.restaurant_id, o.total_price,
                o.receiver_name, o.phone, o.address, o.note,
                o.status, o.created_at, r.name
            ORDER BY o.created_at DESC
        `;
        const [rows] = await db.execute(sql, [ownerId]);
        return rows;
    }
}

module.exports = Order;