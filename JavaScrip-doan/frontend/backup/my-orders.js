document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('foodie_currentUser'));
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    const container = document.getElementById('customer-order-list');

    async function fetchMyOrders() {
        try {
            const response = await fetch(`http://localhost:3000/api/orders/user/${currentUser.id}`);
            if (!response.ok) throw new Error("Lỗi khi tải đơn hàng");
            
            const myOrders = await response.json();
            renderMyOrders(myOrders);
        } catch (error) {
            console.error("Lỗi:", error);
            container.innerHTML = `<div style="text-align:center; color: red;">Không thể kết nối với máy chủ.</div>`;
        }
    }

    function renderMyOrders(myOrders) {
        if (myOrders.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; background: var(--card-bg); border-radius: 16px; border: 1px dashed #ccc;">
                    <h3 style="color: var(--text-main); margin-bottom: 10px;">Bạn chưa đặt đơn hàng nào!</h3>
                    <a href="index.html" class="btn-primary" style="display: inline-block; width: auto; padding: 10px 25px;">Khám phá ẩm thực</a>
                </div>
            `;
            return;
        }

        container.innerHTML = myOrders.map(order => {
            const safeItems = order.items || [];
            const safeTotal = order.total_price || 0;
            const safeStatus = order.status || 'Chờ xác nhận';
            
            const orderDate = new Date(order.created_at).toLocaleString('vi-VN');

            let statusColor = '#EAB308'; let statusIcon = 'fa-clock';
            if (safeStatus === 'Đang chuẩn bị') { statusColor = '#3B82F6'; statusIcon = 'fa-fire-burner'; }
            if (safeStatus === 'Đang giao') { statusColor = '#A855F7'; statusIcon = 'fa-motorcycle'; }
            if (safeStatus === 'Hoàn thành') { statusColor = '#22C55E'; statusIcon = 'fa-circle-check'; }
            if (safeStatus === 'Đã hủy') { statusColor = '#EF4444'; statusIcon = 'fa-circle-xmark'; }

            const itemsHTML = safeItems.map(item => 
                `<div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #eee;">
                    <span><b style="color: var(--primary-color);">x${item.quantity}</b> ${item.dish_name}</span>
                    <span style="font-weight: bold;">${item.price}</span>
                </div>`
            ).join('');

            const canCancel = safeStatus === 'Chờ xác nhận';

            return `
                <div class="card" style="margin-bottom: 25px; border: 1px solid #F1F3F5;">
                    <div style="padding: 15px 20px; background: #FAFAFB; display: flex; justify-content: space-between;">
                        <div>
                            <span style="font-weight: 800; font-size: 16px;">Mã ĐH: ${order.id}</span>
                            <span style="color: var(--text-muted); font-size: 13px; margin-left: 10px;">${orderDate}</span>
                        </div>
                        <span style="background: ${statusColor}15; color: ${statusColor}; padding: 6px 15px; border-radius: 50px; font-weight: bold;">
                            <i class="fa-solid ${statusIcon}"></i> ${safeStatus}
                        </span>
                    </div>
                    
                    <div style="padding: 20px;">
                        ${itemsHTML}
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                            ${canCancel 
                                ? `<button onclick="cancelOrder(${order.id})" style="color: #EF4444; border: 1px solid #EF4444; padding: 8px 15px; border-radius: 8px; cursor: pointer;">Hủy đơn hàng</button>` 
                                : `<span style="color: var(--text-muted); font-size: 13px; font-style: italic;">Đơn hàng đang xử lý.</span>`
                            }
                            <div style="text-align: right;">
                                <span>Tổng thanh toán:</span>
                                <span style="color: var(--primary-color); font-size: 20px; font-weight: 800; margin-left: 10px;">
                                    ${Number(safeTotal).toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 3. Hàm xử lý Hủy đơn hàng (Gọi API PUT/PATCH lên server)
    window.cancelOrder = async function(orderId) {
        const isConfirmed = await showConfirm('Hủy đơn hàng', 'Bạn có chắc chắn muốn hủy bỏ đơn hàng này không?');
        if (!isConfirmed) return;

        try {
            const response = await fetch(`http://localhost:3000/api/orders/${orderId}/cancel`, {
                method: 'PUT'
            });

            if (response.ok) {
                await showPopup('Thành công', 'Đã hủy đơn hàng theo yêu cầu của bạn.', 'success');
                fetchMyOrders();
            } else {
                showPopup('Lỗi', 'Không thể hủy đơn hàng lúc này.', 'error');
            }
        } catch (error) {
            showPopup('Mất kết nối', 'Không thể gọi API Backend.', 'error');
        }
    }

    fetchMyOrders();
});