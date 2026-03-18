// 1. Giả lập dữ liệu JSON (Mock Data)
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('restaurant-list');

    // Hàm gọi API từ Backend
    async function loadData() {
        try {
            const response = await fetch('http://localhost:3000/api/restaurants');
            const restaurants = await response.json();
            renderRestaurants(restaurants);
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu từ server:", err);
        }
    }

    loadData(); // Gọi hàm này thay cho renderRestaurants(allRestaurants) cũ
});
// 2. Hàm xử lý hiển thị
const UIController = {
    init: function() {
        this.renderRestaurants(mockData.restaurants);
        this.renderDishes(mockData.dishes);
    },

    // Render danh sách cửa hàng
    renderRestaurants: function(data) {
        const container = document.getElementById('restaurant-list');
        if (!data || data.length === 0) {
            container.innerHTML = "<p>Không tìm thấy cửa hàng nào.</p>";
            return;
        }

        container.innerHTML = data.map(shop => `
            <article class="card">
                <img src="${shop.image}" alt="${shop.name}" class="card-img" onerror="this.src='https://via.placeholder.com/300x180?text=No+Image'">
                <div class="card-content">
                    <h3 class="card-title">${shop.name}</h3>
                    <div class="card-info">
                        <span><i class="fa fa-star"></i> ${shop.rating}</span>
                        <span><i class="fa fa-clock"></i> ${shop.time}</span>
                    </div>
                    <p style="font-size: 13px; color: #a4b0be; margin-top: 5px;">${shop.category}</p>
                </div>
            </article>
        `).join('');
    },

    // Render danh sách món ăn
    renderDishes: function(data) {
        const container = document.getElementById('dish-list');
        container.innerHTML = data.map(dish => `
            <article class="card">
                <img src="${dish.image}" alt="${dish.name}" class="card-img">
                <div class="card-content">
                    <h3 class="card-title">${dish.name}</h3>
                    <div class="card-info">
                        <span class="price">${dish.price}</span>
                        <span>${dish.restaurant}</span>
                    </div>
                    <button class="btn-add-cart" style="width:100%; margin-top:10px; padding:8px; border:none; background:var(--primary-color); color:#fff; border-radius:5px; cursor:pointer;">Thêm vào giỏ</button>
                </div>
            </article>
        `).join('');
    }
};

// 3. Chạy khi trang web load xong
document.addEventListener('DOMContentLoaded', () => {
    UIController.init();
});

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('restaurant-list');
    
    // --- HÀM LẤY DỮ LIỆU TỪ DATABASE QUA API ---
    async function fetchRestaurants() {
        try {
            const response = await fetch('http://localhost:3000/api/restaurants');
            const data = await response.json();
            renderRestaurants(data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
            container.innerHTML = `<p>Không thể kết nối tới Server Backend.</p>`;
        }
    }

    // --- HÀM VẼ GIAO DIỆN (Giữ nguyên logic của bạn) ---
    function renderRestaurants(restaurantsToRender) {
        if (!restaurantsToRender || restaurantsToRender.length === 0) {
            container.innerHTML = `<p style="text-align:center;">Không tìm thấy kết quả nào.</p>`;
            return;
        }

        container.innerHTML = restaurantsToRender.map(shop => `
            <a href="restaurant.html?id=${shop.id}" class="card">
                <div class="card-img-wrapper">
                    <img src="${shop.image}" alt="${shop.name}" class="card-img">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${shop.name}</h3>
                    <span class="badge-rating"><i class="fa fa-star"></i> ${shop.rating}</span>
                    <span class="badge-category">${shop.category}</span>
                </div>
            </a>
        `).join('');
    }

    fetchRestaurants(); // Gọi hàm lấy dữ liệu khi trang web load
});