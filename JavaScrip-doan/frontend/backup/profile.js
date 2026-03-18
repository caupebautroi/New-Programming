document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('foodie_currentUser'));
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    // Hiển thị thông tin lên UI
    document.getElementById('display-username').innerText = currentUser.username;
    document.getElementById('display-email').innerText = currentUser.email;

    document.getElementById('prof-username').value = currentUser.username;
    document.getElementById('prof-email').value = currentUser.email;
    
    // Tự động điền thêm thông tin cá nhân (nếu form của bạn có các trường này)
    const nameInput = document.getElementById('prof-fullname');
    const phoneInput = document.getElementById('prof-phone');
    if(nameInput) nameInput.value = currentUser.full_name || '';
    if(phoneInput) phoneInput.value = currentUser.phone || '';

    // Xử lý tự động mở tab nếu có query URL (ví dụ: profile.html?tab=store)
    const urlParams = new URLSearchParams(window.location.search);
    const tabToOpen = urlParams.get('tab');
    if (tabToOpen === 'store') {
        const storeBtn = document.querySelector('button[onclick="switchTab(\'store-tab\', this)"]');
        if (storeBtn) storeBtn.click();
    }
});

// --- HÀM CHUYỂN ĐỔI GIỮA CÁC TAB ---
function switchTab(tabId, btnElement) {
    document.querySelectorAll('.tab-pane').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btnElement.classList.add('active');
}

// --- HÀM CẬP NHẬT THÔNG TIN CÁ NHÂN (GỌI API MYSQL) ---
window.handleUpdateProfile = async function(event) {
    event.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('foodie_currentUser'));
    
    // Lấy dữ liệu từ form
    const updateData = {
        username: document.getElementById('prof-username').value.trim(),
        email: document.getElementById('prof-email').value.trim(),
        full_name: document.getElementById('prof-fullname') ? document.getElementById('prof-fullname').value.trim() : null,
        phone: document.getElementById('prof-phone') ? document.getElementById('prof-phone').value.trim() : null
    };

    try {
        const response = await fetch(`http://localhost:3000/api/users/${currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });

        const data = await response.json();

        if (response.ok) {
            // Cập nhật lại thông tin mới vào LocalStorage để UI nhận diện
            localStorage.setItem('foodie_currentUser', JSON.stringify({ ...currentUser, ...updateData }));
            await showPopup('Thành công', 'Thông tin hồ sơ đã được lưu lại!', 'success');
            window.location.reload();
        } else {
            showPopup('Lỗi', data.error || 'Tên đăng nhập hoặc Email đã tồn tại!', 'error');
        }
    } catch (error) {
        showPopup('Mất kết nối', 'Không thể gọi API Backend.', 'error');
    }
}

// --- HÀM ĐỔI MẬT KHẨU (GỌI API MYSQL) ---
window.handleChangePassword = async function(event) {
    event.preventDefault();
    const oldPwd = document.getElementById('old-pwd').value;
    const newPwd = document.getElementById('new-pwd').value;
    const confirmNewPwd = document.getElementById('confirm-new-pwd').value;

    if (newPwd.length < 6) return showPopup('Cảnh báo', 'Mật khẩu mới quá ngắn (tối thiểu 6 ký tự).', 'warning');
    if (newPwd !== confirmNewPwd) return showPopup('Cảnh báo', 'Mật khẩu xác nhận không khớp.', 'warning');

    const currentUser = JSON.parse(localStorage.getItem('foodie_currentUser'));

    try {
        const response = await fetch(`http://localhost:3000/api/users/${currentUser.id}/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd })
        });

        const data = await response.json();

        if (response.ok) {
            await showPopup('Thành công', 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.', 'success');
            localStorage.removeItem('foodie_currentUser'); 
            window.location.href = "login.html";
        } else {
            showPopup('Thất bại', data.error || 'Sai mật khẩu hiện tại.', 'error');
        }
    } catch (error) {
        showPopup('Mất kết nối', 'Không thể gọi API Backend.', 'error');
    }
}

// --- HÀM TẠO CỬA HÀNG (GỌI API MYSQL) ---
window.handleCreateStore = async function(event) {
    event.preventDefault();
    
    const name = document.getElementById('store-name').value.trim();
    const category = document.getElementById('store-category').value.trim();
    const time_delivery = document.getElementById('store-time').value.trim();
    let image = document.getElementById('store-image').value.trim();
    if (!image) image = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500";

    const currentUser = JSON.parse(localStorage.getItem('foodie_currentUser'));

    const storeData = { name, category, time_delivery, image, owner_id: currentUser.id };

    try {
        const response = await fetch('http://localhost:3000/api/restaurants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(storeData)
        });

        if (response.ok) {
            await showPopup('Thành công', `Cửa hàng "${name}" đã được tạo thành công!`, 'success');
            event.target.reset();
        } else {
            showPopup('Lỗi', 'Không thể tạo cửa hàng lúc này.', 'error');
        }
    } catch (error) {
        showPopup('Mất kết nối', 'Không thể gọi API Backend.', 'error');
    }
}