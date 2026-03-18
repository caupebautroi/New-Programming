const express = require('express');
const cors = require('cors');

const restaurantRoutes = require('./src/routes/restaurantRoutes');
const authRoutes = require('./src/routes/authRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const dishRoutes = require('./src/routes/dishRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

// --- 1. MIDDLEWARE ---
app.use(cors()); 
app.use(express.json()); 

// --- 2. ROUTES ---
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/users', userRoutes);

// --- 3. STATIC FILES & ERROR HANDLING ---
app.use(express.static('public'));

// Centralized Error Handler (Xử lý lỗi tập trung)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Đã có lỗi xảy ra từ phía Server!' });
});

// Đoạn code này sẽ log ra mọi request gửi đến để bạn xem Server có nhận được không
app.use((req, res, next) => {
    console.log(`[DEBUG] Request: ${req.method} ${req.url}`);
    next();
});

// Đoạn code này sẽ báo lỗi nếu bạn gọi vào 1 route KHÔNG tồn tại
app.use((req, res) => {
    console.log(`[404] Người dùng gọi nhầm: ${req.method} ${req.url}`);
    res.status(404).json({ error: "Đường dẫn API này không tồn tại trên Server!" });
});

module.exports = app;