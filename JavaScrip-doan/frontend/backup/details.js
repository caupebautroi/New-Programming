document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id'); // Lấy ID từ URL

    const infoContainer = document.getElementById('restaurant-info');
    const menuContainer = document.getElementById('menu-list');

    // Kiểm tra nếu không có ID trên URL
    if (!restaurantId) {
        infoContainer.innerHTML = `<h2>Không tìm thấy mã cửa hàng.</h2>`;
        return;
    }

    // 1. LẤY THÔNG TIN NHÀ HÀNG TỪ SERVER
    let currentRestaurant = null;
    try {
        const response = await fetch(`http://localhost:3000/api/restaurants/${restaurantId}`);
        if (!response.ok) throw new Error("Cửa hàng không tồn tại");
        currentRestaurant = await response.json();
    } catch (error) {
        console.error("Lỗi lấy thông tin quán:", error);
    }

    // Nếu fetch lỗi hoặc không có dữ liệu, hiển thị thông báo và dừng lại
    if (!currentRestaurant) {
        infoContainer.innerHTML = `<h2>Cửa hàng không tồn tại hoặc đã đóng cửa.</h2>`;
        return;
    }

    // Kiểm tra quyền chủ cửa hàng (so sánh ID hoặc username tùy DB của bạn)
    const currentUser = JSON.parse(localStorage.getItem('foodie_currentUser'));
    // Lưu ý: currentRestaurant.owner phải khớp với trường trong DB của bạn
    const isOwner = currentUser && currentRestaurant.owner === currentUser.username;

    // Hiển thị thông tin nhà hàng
    infoContainer.innerHTML = `
        <h1 style="font-size: 32px; font-weight: 800; color: var(--text-main);">${currentRestaurant.name}</h1>
        <div style="display: flex; gap: 15px; margin-top: 15px;">
            <span class="badge-rating"><i class="fa fa-star"></i> ${currentRestaurant.rating}</span>
            <span class="badge-category">${currentRestaurant.category}</span>
            ${isOwner ? `<span class="owner-badge" style="background: #ffd700; color: #000; padding: 2px 8px; border-radius: 4px; font-weight: bold;"><i class="fa-solid fa-crown"></i> Cửa hàng của bạn</span>` : ''}
        </div>
    `;

    // 2. HÀM VẼ GIAO DIỆN THỰC ĐƠN
    async function renderMenu() {
        let restaurantDishes = [];
        try {
            // Gọi API lấy danh sách món ăn
            const res = await fetch(`http://localhost:3000/api/restaurants/${restaurantId}/dishes`);
            restaurantDishes = await res.json();
        } catch (error) {
            console.error("Lỗi lấy menu:", error);
            menuContainer.innerHTML = `<p>Không thể tải thực đơn lúc này.</p>`;
            return;
        }

        let menuHTML = '';

        // Nếu là chủ quán, hiển thị thêm thẻ "Thêm món mới"
        if (isOwner) {
            menuHTML += `
                <article class="card add-dish-card" style="border: 2px dashed #ccc; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                    <h3><i class="fa fa-plus-circle"></i> Thêm món mới</h3>
                    <form onsubmit="handleAddNewDish(event, ${restaurantId})" style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
                        <input type="text" id="new-dish-name" placeholder="Tên món ăn" required style="padding: 8px;">
                        <input type="text" id="new-dish-price" placeholder="Giá (VD: 45.000đ)" required style="padding: 8px;">
                        <input type="text" id="new-dish-img" placeholder="Link ảnh (Tùy chọn)" style="padding: 8px;">
                        <button type="submit" class="btn-primary" style="padding: 10px; cursor: pointer;">Tạo món</button>
                    </form>
                </article>
            `;
        }

        if (restaurantDishes.length === 0 && !isOwner) {
            menuHTML += `<p class="empty-msg" style="grid-column: 1/-1; text-align: center; padding: 40px;">Cửa hàng này hiện chưa có món ăn nào.</p>`;
        } else {
            // Render danh sách món ăn từ DB
            menuHTML += restaurantDishes.map(dish => `
                <article class="card">
                    <div class="card-img-wrapper">
                        <img src="${dish.image}" onerror="this.src='https://via.placeholder.com/300x180?text=Food'">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${dish.name}</h3>
                        <div class="card-info"><span class="price" style="color: var(--primary-color); font-weight: bold;">${dish.price}</span></div>
                        <button class="btn-primary" onclick="addToCart(${dish.id}, '${dish.name}', '${dish.price}', '${dish.image}')" style="margin-top: 10px; cursor: pointer;">
                            <i class="fa fa-plus"></i> Thêm vào giỏ
                        </button>
                    </div>
                </article>
            `).join('');
        }
        menuContainer.innerHTML = menuHTML;
    }

    // Gọi hàm render lần đầu
    renderMenu();

    // Xử lý thêm món mới
    window.handleAddNewDish = async function(event, currentResId) {
        event.preventDefault();
        const name = document.getElementById('new-dish-name').value.trim();
        let price = document.getElementById('new-dish-price').value.trim();
        let image = document.getElementById('new-dish-img').value.trim() || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
        
        // Tự thêm đơn vị tiền tệ nếu thiếu
        if (!price.includes('đ')) price += 'đ';

        const newDish = { restaurant_id: currentResId, name, price, image };
        try {
            const response = await fetch('http://localhost:3000/api/dishes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDish)
            });
            if (response.ok) {
                alert(`✅ Đã thêm món "${name}" thành công!`);
                event.target.reset(); // Xóa form sau khi thêm thành công
                renderMenu(); // Tải lại danh sách món
            }
        } catch (error) {
            alert("Lỗi kết nối server khi thêm món!");
        }
    }
});

// Hàm thêm vào giỏ hàng
function addToCart(dishId, name, price, image) {
    const currentUser = JSON.parse(localStorage.getItem('foodie_currentUser'));

    if (!currentUser) {
        alert("Vui lòng đăng nhập để thêm món vào giỏ hàng!");
        return;
    }

    const cartKey = `foodie_cart_${currentUser.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingItem = cart.find(item => item.dishId === dishId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ 
            dishId: dishId, 
            name: name, 
            price: price, 
            image: image,
            quantity: 1 
        });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));

    // Cập nhật số lượng hiển thị trên icon giỏ hàng
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if(cartCountEl) cartCountEl.innerText = totalItems;
    
    // Hiển thị thông báo (nếu có phần tử snackbar)
    const snackbar = document.getElementById('cart-snackbar');
    if(snackbar) {
        snackbar.classList.add('show');
        setTimeout(() => snackbar.classList.remove('show'), 3500);
    } else {
        alert(`Đã thêm ${name} vào giỏ hàng!`);
    }
}