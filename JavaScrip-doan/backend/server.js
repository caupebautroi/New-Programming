require('dotenv').config();
const app = require('./app'); 
const db = require('./src/config/db');

const PORT = process.env.PORT || 3000;

db.getConnection()
    .then(connection => {
        console.log('✅ Đã kết nối MySQL thành công!');
        connection.release();

        // Bật server khi DB đã sẵn sàng
        app.listen(PORT, () => {
            console.log(`🚀 Server Backend đang chạy tại: http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Lỗi kết nối Database. Server chưa được bật!', err.message);
        process.exit(1);
    });