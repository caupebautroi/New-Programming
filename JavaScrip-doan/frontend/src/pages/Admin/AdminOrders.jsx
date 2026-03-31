import { useEffect, useState } from "react";
import {
  getStoreOrders,
  updateOrderStatusApi,
} from "../../services/orderService";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const currentUser =
    JSON.parse(localStorage.getItem("foodie_currentUser")) ||
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(localStorage.getItem("user"));

  const ownerId =
    currentUser?.id ||
    currentUser?.userId ||
    currentUser?.username ||
    currentUser?.email ||
    null;

  const formatPrice = (number) => {
    return Number(number || 0).toLocaleString("vi-VN") + " VND";
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("currentUser =", currentUser);
      console.log("ownerId =", ownerId);

      const data = await getStoreOrders(ownerId);
      console.log("getStoreOrders response =", data);

      const normalizedOrders = Array.isArray(data)
        ? data
        : data?.orders || data?.data || [];

      setOrders(normalizedOrders);
    } catch (err) {
      console.error("Lỗi lấy đơn hàng admin:", err);
      console.log("Status:", err?.response?.status);
      console.log("Response data:", err?.response?.data);
      console.log("Message:", err?.message);
      setError("Không thể tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ownerId) {
      fetchOrders();
    } else {
      setLoading(false);
      setError("Thiếu ownerId. Hãy đăng nhập lại admin.");
    }
  }, [ownerId]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatusApi(orderId, newStatus);

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      alert("Cập nhật trạng thái thất bại.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h2>Admin - Manage Orders</h2>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin - Manage Orders</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && orders.length === 0 && <p>Chưa có đơn hàng nào.</p>}

      {!error && orders.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Update</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.receiver_name || order.customer_name || "N/A"}</td>
                  <td>{order.phone || "N/A"}</td>
                  <td>{order.address || "N/A"}</td>
                  <td>{formatPrice(order.total_price || order.total)}</td>
                  <td>
                    <span className="fw-bold">{order.status}</span>
                  </td>
                  <td>{order.created_at || order.createdAt || "N/A"}</td>
                  <td>
                    <select
                      className="form-select"
                      value={order.status || "Chờ xác nhận"}
                      disabled={updatingId === order.id}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                    >
                      <option value="Chờ xác nhận">Chờ xác nhận</option>
                      <option value="Chuẩn bị">Chuẩn bị</option>
                      <option value="Đang giao">Đang giao</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;