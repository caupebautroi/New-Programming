// --- XỬ LÝ ĐĂNG NHẬP ---
async function handleLogin(event) {
    event.preventDefault(); 
    const identifier = document.getElementById('identifier').value.trim();
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password }) 
        });

        const data = await response.json();

        if (response.ok) {
            // 1. Lưu thông tin User
            localStorage.setItem('foodie_currentUser', JSON.stringify(data.user));
            // 2. TÍNH NĂNG MỚI: Lưu Token bảo mật Backend trả về
            localStorage.setItem('foodie_token', data.token);
            
            await showPopup('Thành công!', `Chào mừng ${data.user.username} quay trở lại!`, 'success');
            window.location.href = "index.html"; 
        } else {
            await showPopup('Đăng nhập thất bại', data.error || 'Thông tin không chính xác!', 'error');
        }
    } catch (error) {
        await showPopup('Lỗi kết nối', 'Không thể kết nối đến máy chủ Backend!', 'error');
    }
}

// --- XỬ LÝ ĐĂNG KÝ ---
async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password.length < 6) return showPopup('Lỗi bảo mật', 'Mật khẩu phải có ít nhất 6 ký tự!', 'warning');
    if (password !== confirmPassword) return showPopup('Lỗi nhập liệu', 'Mật khẩu xác nhận không khớp!', 'warning');

    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            await showPopup('Đăng ký thành công!', 'Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.', 'success');
            window.location.href = "login.html";
        } else {
            await showPopup('Trùng lặp', data.error || 'Tên đăng nhập hoặc Email đã tồn tại!', 'error');
        }
    } catch (error) {
        await showPopup('Lỗi kết nối', 'Không thể kết nối đến máy chủ!', 'error');
    }
}

// --- XỬ LÝ ĐĂNG XUẤT ---
function handleLogout() {
    // Xóa sạch cả User lẫn Token khi đăng xuất
    localStorage.removeItem('foodie_currentUser');
    localStorage.removeItem('foodie_token');
    window.location.href = "login.html"; 
}