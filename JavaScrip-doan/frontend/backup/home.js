document.addEventListener('DOMContentLoaded', async () => {
    const restaurantList = document.getElementById('restaurant-list');

    try {
        // 1. Gọi API từ Server Node.js (app.js đang chạy ở port 3000)
        const response = await fetch('http://localhost:3000/api/restaurants');
        
        if (!response.ok) {
            throw new Error('Lấy dữ liệu thất bại từ Server');
        }

        const restaurants = await response.json();

        // 2. Xử lý trường hợp database trống
        if (restaurants.length === 0) {
            restaurantList.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>Hiện chưa có nhà hàng nào trong database.</p>";
            return;
        }

        // 3. Đổ dữ liệu vào HTML
        restaurantList.innerHTML = restaurants.map(res => `
            <article class="card" onclick="window.location.href='details.html?id=${res.id}'" style="cursor:pointer">
                <div class="card-img-wrapper">
                    <img src="${res.image}" alt="${res.name}" class="card-img" onerror="this.src='https://via.placeholder.com/300x180?text=Food'">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${res.name}</h3>
                    <div class="card-info">
                        <span class="badge-rating"><i class="fa fa-star"></i> ${res.rating}</span>
                        <span class="badge-category">${res.category}</span>
                    </div>
                    <div class="card-footer">
                        <span><i class="fa-regular fa-clock"></i> ${res.time_delivery}</span>
                    </div>
                </div>
            </article>
        `).join('');

    } catch (error) {
        console.error("Lỗi:", error);
        restaurantList.innerHTML = `<p style='grid-column: 1/-1; color:red; text-align: center;'>Lỗi kết nối: ${error.message}. Hãy kiểm tra Server (node app.js)!</p>`;
    }
});