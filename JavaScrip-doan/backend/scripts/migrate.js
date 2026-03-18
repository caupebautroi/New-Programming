// backend/scripts/migrate.js

// Tận dụng lại cấu hình DB chuẩn mà chúng ta đã viết (dùng Pool)
const db = require('../src/config/db'); 

const mockData = {
    restaurants: [
        { id: 1, name: "KFC Vietnam", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500", rating: 4.5, time: "15-20 phút", category: "Thức ăn nhanh" },
        { id: 2, name: "Phở Thìn Cửa Đông", image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500", rating: 4.8, time: "10-15 phút", category: "Món Việt" }
    ],
    dishes: [
        { id: 101, restaurantId: 1, name: "Gà Rán (2 miếng)", price: "79.000đ", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500" },
        { id: 102, restaurantId: 1, name: "Burger Zinger", price: "55.000đ", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
        { id: 103, restaurantId: 2, name: "Phở Bò Tái Lăn", price: "65.000đ", image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500" }
    ]
};

async function runMigration() {
    console.log("🚀 Bắt đầu nạp dữ liệu mẫu vào MySQL...");
    
    try {
        
        for (const r of mockData.restaurants) {
            const sql = "INSERT IGNORE INTO restaurants (id, name, image, rating, time_delivery, category) VALUES (?, ?, ?, ?, ?, ?)";
            await db.execute(sql, [r.id, r.name, r.image, r.rating, r.time, r.category]);
        }
        console.log("✅ Đã nạp xong bảng Restaurants!");

        for (const d of mockData.dishes) {
            const sql = "INSERT IGNORE INTO dishes (id, restaurant_id, name, price, image) VALUES (?, ?, ?, ?, ?)";
            await db.execute(sql, [d.id, d.restaurantId, d.name, d.price, d.image]);
        }
        console.log("✅ Đã nạp xong bảng Dishes!");

        console.log("🎉 Hoàn tất quá trình Migrate!");
    } catch (error) {
        console.error("❌ Lỗi trong quá trình Migrate:", error.message);
    } finally {
        process.exit(); 
    }
}

runMigration();