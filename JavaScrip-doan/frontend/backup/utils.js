
window.showPopup = function(title, message, type = 'success') {
    return new Promise((resolve) => {
        // Cài đặt màu sắc và icon theo loại thông báo
        let iconClass = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-xmark' : 'fa-bell');
        let iconColor = type === 'success' ? '#22C55E' : (type === 'error' ? '#EF4444' : '#FF7A00');

        const modalHTML = `
            <div class="modal-overlay active" id="custom-alert-modal" style="z-index: 9999;">
                <div class="modal-content" style="text-align: center; max-width: 380px;">
                    <i class="fa-solid ${iconClass}" style="color: ${iconColor}; font-size: 55px; margin-bottom: 15px;"></i>
                    <h3 style="margin-bottom: 10px; font-size: 22px; color: var(--text-main);">${title}</h3>
                    <p style="color: var(--text-muted); margin-bottom: 25px; line-height: 1.5; font-size: 15px;">${message}</p>
                    <button class="btn-primary" id="custom-alert-btn" style="width: 100%; background: ${iconColor}; font-size: 16px; padding: 12px;">Đồng ý</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Chờ người dùng bấm nút "Đồng ý"
        document.getElementById('custom-alert-btn').addEventListener('click', () => {
            document.getElementById('custom-alert-modal').remove();
            resolve(true); // Trả kết quả báo hiệu đã bấm xong
        });
    });
};

window.showConfirm = function(title, message) {
    return new Promise((resolve) => {
        const modalHTML = `
            <div class="modal-overlay active" id="custom-confirm-modal" style="z-index: 9999;">
                <div class="modal-content" style="text-align: center; max-width: 380px;">
                    <i class="fa-solid fa-circle-question" style="color: #FF7A00; font-size: 55px; margin-bottom: 15px;"></i>
                    <h3 style="margin-bottom: 10px; font-size: 22px; color: var(--text-main);">${title}</h3>
                    <p style="color: var(--text-muted); margin-bottom: 25px; line-height: 1.5; font-size: 15px;">${message}</p>
                    <div style="display: flex; gap: 15px;">
                        <button class="btn-back" id="btn-cancel" style="flex: 1; padding: 12px;">Hủy bỏ</button>
                        <button class="btn-primary" id="btn-confirm" style="flex: 1; background: #FF7A00; padding: 12px;">Chắc chắn</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        document.getElementById('btn-confirm').addEventListener('click', () => {
            document.getElementById('custom-confirm-modal').remove();
            resolve(true);
        });
        document.getElementById('btn-cancel').addEventListener('click', () => {
            document.getElementById('custom-confirm-modal').remove();
            resolve(false);
        });
    });
};