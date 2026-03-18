document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('foodie_currentUser'));
    if (!currentUser) return window.location.href = "login.html";

    const container = document.getElementById('order-list');

    // 1. Gọi API lấy dữ liệu đơn hàng dành riêng cho Chủ cửa hàng
    async function loadStoreOrders() {
        try {
            // Truyền ID của chủ cửa hàng lên server
            const response = await fetch(`http://localhost:3000/api/orders/store/${currentUser.id}`);
            if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");
            const orders = await response.json();
            renderOrders(orders);
        } catch (error) {
            container.innerHTML = `<p style="text-align: center; color: red;">Lỗi kết nối máy chủ.</p>`;
        }
    }

    // 2. Vẽ giao diện danh sách đơn hàng (GIỮ NGUYÊN CSS CỦA BẠN)
    function renderOrders(ordersToRender) {
        if (ordersToRender.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; background: var(--card-bg); border-radius: 16px; border: 1px dashed #ccc;">
                    <h3 style="color: var(--text-main); margin-bottom: 10px;">Cửa hàng chưa có đơn nào!</h3>
                    <p style="color: var(--text-muted);">Hãy cập nhật menu hấp dẫn hơn để thu hút khách nhé.</p>
                </div>`;
            return;
        }

        container.innerHTML = ordersToRender.map(order => {
            const itemsHTML = order.items.map(item => 
                `<div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 15px;">
                    <span><b style="color: var(--primary-color);">x${item.quantity}</b> ${item.dish_name}</span>
                </div>`
            ).join('');

            // Xử lý ngày tháng
            const orderDate = new Date(order.created_at).toLocaleString('vi-VN');

            // Chọn màu sắc cho Badge Trạng Thái
            let statusColor = '#EAB308'; 
            if (order.status === 'Đang chuẩn bị') statusColor = '#3B82F6';
            if (order.status === 'Đang giao') statusColor = '#A855F7';
            if (order.status === 'Hoàn thành') statusColor = '#22C55E';
            if (order.status === 'Đã hủy') statusColor = '#EF4444';

            return `
                <div class="card" style="margin-bottom: 20px; border: 1px solid #eee; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                    <div style="padding: 15px 20px; border-bottom: 1px dashed #eee; display: flex; justify-content: space-between; align-items: center; background: #FAFAFB;">
                        <div>
                            <span style="font-weight: bold; color: var(--text-main); font-size: 16px;">Mã ĐH: ${order.id}</span>
                            <span style="color: var(--text-muted); font-size: 13px; margin-left: 10px;"><i class="fa-regular fa-clock"></i> ${orderDate}</span>
                        </div>
                        <span style="background: ${statusColor}; color: white; padding: 5px 12px; border-radius: 50px; font-size: 13px; font-weight: bold;">
                            ${order.status}
                        </span>
                    </div>
                    
                    <div style="padding: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <h4 style="color: var(--text-muted); margin-bottom: 10px; font-size: 14px; text-transform: uppercase;">Thông tin giao hàng</h4>
                            <p><strong><i class="fa fa-user"></i> ${order.receiver_name}</strong> (${order.phone})</p>
                            <p><i class="fa fa-location-dot"></i> ${order.address}</p>
                            ${order.note ? `<p style="color: #FF7A00; font-style: italic; margin-top: 5px;">*Ghi chú: ${order.note}</p>` : ''}
                        </div>
                        <div style="background: #F8F9FA; padding: 15px; border-radius: 8px;">
                            <h4 style="color: var(--text-muted); margin-bottom: 10px; font-size: 14px; text-transform: uppercase;">Món khách đặt tại quán bạn</h4>
                            ${itemsHTML}
                        </div>
                    </div>

                    <div style="padding: 15px 20px; background: #fff; border-top: 1px solid #eee; display: flex; gap: 10px; align-items: center;">
                        <span style="font-weight: bold; color: var(--text-muted); font-size: 14px;">Cập nhật trạng thái:</span>
                        <select onchange="updateOrderStatus(${order.id}, this.value)" style="padding: 8px; border: 1px solid #ccc; border-radius: 6px; font-weight: bold; outline: none;">
                            <option value="Chờ xác nhận" ${order.status === 'Chờ xác nhận' ? 'selected' : ''}>Chờ xác nhận</option>
                            <option value="Đang chuẩn bị" ${order.status === 'Đang chuẩn bị' ? 'selected' : ''}>Đang chuẩn bị</option>
                            <option value="Đang giao" ${order.status === 'Đang giao' ? 'selected' : ''}>Đang giao</option>
                            <option value="Hoàn thành" ${order.status === 'Hoàn thành' ? 'selected' : ''}>Hoàn thành</option>
                            <option value="Đã hủy" ${order.status === 'Đã hủy' ? 'selected' : ''}>Hủy đơn</option>
                        </select>
                    </div>
                </div>`;
        }).join('');
    }

    // 3. Gọi API khi Chủ quán đổi Trạng thái đơn
    window.updateOrderStatus = async function(orderId, newStatus) {
        try {
            const response = await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // await showPopup("Cập nhật thành công", "Trạng thái đơn hàng đã thay đổi", "success");
                loadStoreOrders(); // Tải lại dữ liệu mới từ Database để vẽ lại màu sắc
            } else {
                showPopup("Lỗi", "Không thể cập nhật trạng thái", "error");
            }
        } catch (error) {
            showPopup("Lỗi kết nối", "Không thể gọi API Backend", "error");
        }
    }

    loadStoreOrders();
});