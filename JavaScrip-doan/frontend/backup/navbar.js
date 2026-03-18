// --- KIỂM TRA TRẠNG THÁI HIỂN THỊ TRÊN NAVBAR ---
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('foodie_currentUser'));
    const navBar = document.querySelector('nav');

    if (currentUser && navBar) {
        // Cập nhật giao diện Navbar với Dropdown Menu
        navBar.innerHTML = `
            <a href="#" onclick="handleCartClick(event)" style="text-decoration:none; color:var(--text-main); font-weight:600;">
                <i class="fa fa-shopping-cart"></i> Giỏ hàng
            </a>
            
            <div style="display: flex; align-items: center; gap: 15px; margin-left: 20px;">
                <span style="font-weight: 700; color: var(--primary-color);">
                    <i class="fa-solid fa-circle-user"></i> Chào, ${currentUser.username}
                </span>
                
                <div class="user-dropdown">
                    <button class="btn-settings" onclick="toggleDropdown(event)" title="Cài đặt tài khoản">
                        <i class="fa-solid fa-gear"></i>
                    </button>
                    
                    <div class="dropdown-menu" id="userDropdown">
                        <a href="profile.html" class="dropdown-item">
                            <i class="fa-solid fa-user-pen"></i> Quản lý Hồ sơ
                        </a>
                        
                        <a href="my-orders.html" class="dropdown-item">
                            <i class="fa-solid fa-receipt"></i> Đơn mua của tôi
                        </a>
                        
                        <a href="profile.html?tab=store" class="dropdown-item">
                            <i class="fa-solid fa-store"></i> Cửa hàng của tôi
                        </a>
                        
                        <a href="store-manager.html" class="dropdown-item" style="color: #22C55E;">
                            <i class="fa-solid fa-clipboard-list"></i> Quản lý Đơn hàng (Shop)
                        </a>
                        <hr style="border: 0; border-top: 1px solid #F1F3F5; margin: 0;">

                        <div class="dropdown-item logout" onclick="handleLogout()">
                            <i class="fa-solid fa-right-from-bracket"></i> Đăng xuất
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
});

// --- HÀM ẨN/HIỆN DROPDOWN MENU ---
function toggleDropdown(event) {
    event.stopPropagation(); // Ngăn sự kiện click truyền ra ngoài (tránh việc menu vừa mở đã bị đóng)
    const dropdown = document.getElementById("userDropdown");
    if(dropdown) {
        dropdown.classList.toggle("show");
    }
}

// --- TÍNH NĂNG SENIOR: ĐÓNG MENU KHI CLICK RA NGOÀI MÀN HÌNH ---
window.addEventListener('click', function(event) {
    const dropdown = document.getElementById("userDropdown");
    const btnSettings = document.querySelector('.btn-settings');
    
    // Nếu dropdown đang mở, VÀ người dùng click vào một nơi KHÔNG PHẢI là menu hay nút bánh răng
    if (dropdown && dropdown.classList.contains('show') && !dropdown.contains(event.target) && !btnSettings.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// --- XỬ LÝ SỰ KIỆN BẤM VÀO NÚT "GIỎ HÀNG" TRÊN THANH NAVBAR ---
function handleCartClick(event) {
    event.preventDefault(); // Ngăn trình duyệt nhảy lên đầu trang
    
    const currentUser = JSON.parse(localStorage.getItem('foodie_currentUser'));
    
    // Nếu đã đăng nhập -> Chuyển sang trang giỏ hàng
    if (currentUser) {
        window.location.href = "cart.html";
        return;
    }

    // Nếu CHƯA đăng nhập -> Sinh ra Pop-up (Modal) và hiển thị
    if (!document.getElementById('auth-modal')) {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="modal-overlay" id="auth-modal">
                <div class="modal-content">
                    <h3><i class="fa-solid fa-lock" style="color: var(--primary-color);"></i> Yêu cầu đăng nhập</h3>
                    <p>Oops! Bạn cần đăng nhập tài khoản để có thể xem giỏ hàng và đặt món.</p>
                    <div class="modal-actions">
                        <button class="btn-back" onclick="document.getElementById('auth-modal').classList.remove('active')">Đóng</button>
                        <a href="login.html" class="btn-primary" style="width: auto; padding: 10px 25px;">Đăng nhập ngay</a>
                    </div>
                </div>
            </div>
        `);
    }
    
    // Kích hoạt hiệu ứng hiện Pop-up
    document.getElementById('auth-modal').classList.add('active');
}