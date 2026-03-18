let currentCart = [];
let cartKey = '';
let currentUser = null;
let isEditingDelivery = true; 

document.addEventListener('DOMContentLoaded', () => {
    currentUser = JSON.parse(localStorage.getItem('foodie_currentUser'));
    
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    cartKey = `foodie_cart_${currentUser.username}`;
    currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    const savedInfo = JSON.parse(localStorage.getItem(`foodie_delivery_${currentUser.username}`));
    if (savedInfo && savedInfo.name && savedInfo.phone && savedInfo.address) {
        isEditingDelivery = false; 
    }

    renderCart(); 
});

window.saveTempDeliveryInfo = function() {
    if (!isEditingDelivery) return; 
    const info = {
        name: document.getElementById('dl-name') ? document.getElementById('dl-name').value.trim() : '',
        phone: document.getElementById('dl-phone') ? document.getElementById('dl-phone').value.trim() : '',
        address: document.getElementById('dl-address') ? document.getElementById('dl-address').value.trim() : '',
        note: document.getElementById('dl-note') ? document.getElementById('dl-note').value.trim() : ''
    };
    localStorage.setItem(`foodie_delivery_${currentUser.username}`, JSON.stringify(info));
}

window.confirmDelivery = function() {
    saveTempDeliveryInfo(); 
    const info = JSON.parse(localStorage.getItem(`foodie_delivery_${currentUser.username}`));
    if (!info.name || !info.phone || !info.address) {
        alert("⚠️ Vui lòng điền đầy đủ Tên, Số điện thoại và Địa chỉ giao hàng!");
        return;
    }
    isEditingDelivery = false;
    renderCart();
}

window.editDelivery = function() {
    isEditingDelivery = true;
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-main-view');
    if (!container) return;

    if (currentCart.length === 0) {
        container.innerHTML = `
            <div style="width: 100%; text-align: center; padding: 60px 20px; background: #fff; border-radius: 16px;">
                <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" style="width: 150px; opacity: 0.5; margin-bottom: 20px;">
                <h3 style="color: var(--text-muted);">Giỏ hàng của bạn đang trống</h3>
                <a href="index.html" class="btn-primary" style="display: inline-block; width: auto; margin-top: 20px; padding: 12px 30px;">Tiếp tục mua sắm</a>
            </div>
        `;
        return;
    }

    let totalAmount = 0;

    // CẬP NHẬT: Không dùng allDishes nữa, dùng trực tiếp dữ liệu trong item
    const cartItemsHTML = currentCart.map(item => {
        const priceNum = parseInt(String(item.price).replace(/[^0-9]/g, ''));
        totalAmount += priceNum * item.quantity;

        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/90?text=No+Image'">
                <div class="cart-item-info">
                    <h3 style="font-size: 18px; color: var(--text-main); margin-bottom: 5px;">${item.name}</h3>
                    <p style="color: var(--primary-color); font-weight: bold;">${item.price}</p>
                </div>
                <div class="cart-controls">
                    <button onclick="changeQuantity(${item.dishId}, -1)"><i class="fa fa-minus"></i></button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.dishId}, 1)"><i class="fa fa-plus"></i></button>
                </div>
                <button class="btn-remove" onclick="removeDish(${item.dishId})" title="Xóa món này">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');

    const savedInfo = JSON.parse(localStorage.getItem(`foodie_delivery_${currentUser.username}`)) || { name: '', phone: '', address: '', note: '' };
    let deliveryBlockHTML = isEditingDelivery ? `
        <div class="delivery-card">
            <h3><i class="fa-solid fa-pen-to-square"></i> Thông tin giao hàng</h3>
            <div class="delivery-form">
                <input type="text" id="dl-name" value="${savedInfo.name}" placeholder="Họ tên *" onkeyup="saveTempDeliveryInfo()">
                <input type="text" id="dl-phone" value="${savedInfo.phone}" placeholder="Số điện thoại *" onkeyup="saveTempDeliveryInfo()">
                <input type="text" id="dl-address" value="${savedInfo.address}" placeholder="Địa chỉ *" onkeyup="saveTempDeliveryInfo()">
                <textarea id="dl-note" placeholder="Ghi chú..." onkeyup="saveTempDeliveryInfo()">${savedInfo.note}</textarea>
            </div>
            <button class="btn-primary" style="background: #22C55E;" onclick="confirmDelivery()">Xác nhận địa chỉ</button>
        </div>` : `
        <div class="delivery-card delivery-summary">
            <div>
                <h3><i class="fa-solid fa-location-dot"></i> Giao đến:</h3>
                <p><strong>${savedInfo.name}</strong> | ${savedInfo.phone}</p>
                <p>${savedInfo.address}</p>
            </div>
            <button class="btn-edit-address" onclick="editDelivery()">Thay đổi</button>
        </div>`;

    container.innerHTML = `
        <div class="cart-items-wrapper">${deliveryBlockHTML}${cartItemsHTML}</div>
        <div class="cart-summary">
            <h3>Hóa đơn</h3>
            <div class="summary-row"><span>Tạm tính:</span><b>${totalAmount.toLocaleString('vi-VN')}đ</b></div>
            <div class="summary-row"><span>Phí giao hàng:</span><span>15.000đ</span></div>
            <div class="summary-total"><span>Tổng:</span><span style="color:var(--primary-color)">${(totalAmount + 15000).toLocaleString('vi-VN')}đ</span></div>
            <button class="btn-primary" onclick="checkout()">Đặt hàng ngay</button>
        </div>`;
}

window.changeQuantity = function(dishId, change) {
    const itemIndex = currentCart.findIndex(i => i.dishId === dishId);
    if (itemIndex > -1) {
        currentCart[itemIndex].quantity += change;
        if (currentCart[itemIndex].quantity <= 0) currentCart.splice(itemIndex, 1);
        localStorage.setItem(cartKey, JSON.stringify(currentCart));
        renderCart();
    }
}

window.removeDish = function(dishId) {
    currentCart = currentCart.filter(item => item.dishId !== dishId);
    localStorage.setItem(cartKey, JSON.stringify(currentCart));
    renderCart();
}

window.checkout = async function() {
    if (isEditingDelivery) {
        alert("Vui lòng xác nhận thông tin giao hàng!");
        return;
    }
    const savedInfo = JSON.parse(localStorage.getItem(`foodie_delivery_${currentUser.username}`));
    
    let orderTotal = 0;
    const orderItems = currentCart.map(item => {
        const priceNum = parseInt(String(item.price).replace(/[^0-9]/g, ''));
        orderTotal += priceNum * item.quantity;
        return { dish_name: item.name, price: item.price, quantity: item.quantity };
    });

    const orderData = {
        user_id: currentUser.id,
        total_price: orderTotal + 15000,
        address: savedInfo.address,
        phone: savedInfo.phone,
        receiver_name: savedInfo.name,
        note: savedInfo.note,
        items: orderItems
    };

    try {
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        if (response.ok) {
            const result = await response.json();
            alert(`🎉 Thành công! Mã đơn: #${result.orderId}`);
            localStorage.removeItem(cartKey);
            window.location.href = "index.html"; 
        }
    } catch (error) {
        alert("Lỗi kết nối Server!");
    }
}