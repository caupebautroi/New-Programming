import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getOrdersByUserId } from "../../services/orderService";
import "./TrackingOrder.css";

const TrackingOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const savedOrder = localStorage.getItem("currentOrder");
  const parsedSavedOrder = savedOrder ? JSON.parse(savedOrder) : null;

  const [orderData, setOrderData] = useState(location.state || parsedSavedOrder);
  const [loadingLatest, setLoadingLatest] = useState(false);

  const currentUser =
    JSON.parse(localStorage.getItem("foodie_currentUser")) ||
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(localStorage.getItem("user"));

  const currentUserId = currentUser?.id;

  const formatPrice = (number) => {
    return Number(number || 0).toLocaleString("vi-VN") + " VND";
  };

  useEffect(() => {
    const fetchLatestOrderStatus = async () => {
      if (!orderData?.orderId && !orderData?.id) return;
      if (!currentUserId) return;

      try {
        setLoadingLatest(true);

        const orders = await getOrdersByUserId(currentUserId);
        const orderList = Array.isArray(orders) ? orders : [];

        const currentOrderId = Number(orderData.orderId || orderData.id);

        const latestOrder = orderList.find(
          (order) => Number(order.id) === currentOrderId
        );

        if (latestOrder) {
          const mergedOrder = {
            ...orderData,
            ...latestOrder,
            orderId: latestOrder.id || orderData.orderId,
            createdAt:
              latestOrder.created_at ||
              orderData.createdAt ||
              orderData.created_at,
            created_at:
              latestOrder.created_at ||
              orderData.created_at ||
              orderData.createdAt,
            receiver_name:
              latestOrder.receiver_name || orderData.receiver_name,
            phone: latestOrder.phone || orderData.phone,
            address: latestOrder.address || orderData.address,
            restaurant: {
              ...orderData.restaurant,
              address:
                latestOrder.address ||
                orderData.restaurant?.address ||
                orderData.address,
            },
          };

          setOrderData(mergedOrder);
          localStorage.setItem("currentOrder", JSON.stringify(mergedOrder));
        }
      } catch (error) {
        console.error("Lỗi lấy trạng thái đơn hàng mới nhất:", error);
      } finally {
        setLoadingLatest(false);
      }
    };

    fetchLatestOrderStatus();
  }, [currentUserId]);

  const normalizedStatus = useMemo(() => {
    const rawStatus = (orderData?.status || "").toLowerCase().trim();

    if (
      rawStatus.includes("chờ") ||
      rawStatus.includes("confirm") ||
      rawStatus.includes("confirmed")
    ) {
      return "confirmed";
    }

    if (rawStatus.includes("chuẩn bị") || rawStatus.includes("preparing")) {
      return "preparing";
    }

    if (
      rawStatus.includes("giao") ||
      rawStatus.includes("delivery") ||
      rawStatus.includes("out for delivery")
    ) {
      return "delivering";
    }

    if (rawStatus.includes("ready") || rawStatus.includes("pickup")) {
      return "ready_pickup";
    }

    if (
      rawStatus.includes("hoàn thành") ||
      rawStatus.includes("delivered") ||
      rawStatus.includes("picked up") ||
      rawStatus.includes("completed")
    ) {
      return "completed";
    }

    if (rawStatus.includes("cancel") || rawStatus.includes("hủy")) {
      return "cancelled";
    }

    return "confirmed";
  }, [orderData]);

  const trackingSteps = useMemo(() => {
    if (!orderData) return [];

    const isPickup = orderData.paymentOption === "pickup";

    if (normalizedStatus === "cancelled") {
      return [
        { label: "Order Confirmed", active: true, done: true },
        { label: "Order Cancelled", active: true, done: false },
      ];
    }

    if (isPickup) {
      return [
        {
          label: "Order Confirmed",
          active: true,
          done: true,
        },
        {
          label: "Preparing Your Order",
          active:
            normalizedStatus === "preparing" ||
            normalizedStatus === "ready_pickup" ||
            normalizedStatus === "completed",
          done:
            normalizedStatus === "ready_pickup" ||
            normalizedStatus === "completed",
        },
        {
          label: "Ready for Pickup",
          active:
            normalizedStatus === "ready_pickup" ||
            normalizedStatus === "completed",
          done: normalizedStatus === "completed",
        },
        {
          label: "Picked Up",
          active: normalizedStatus === "completed",
          done: normalizedStatus === "completed",
        },
      ];
    }

    return [
      {
        label: "Order Confirmed",
        active: true,
        done: true,
      },
      {
        label: "Preparing Your Order",
        active:
          normalizedStatus === "preparing" ||
          normalizedStatus === "delivering" ||
          normalizedStatus === "completed",
        done:
          normalizedStatus === "delivering" ||
          normalizedStatus === "completed",
      },
      {
        label: "Out for Delivery",
        active:
          normalizedStatus === "delivering" ||
          normalizedStatus === "completed",
        done: normalizedStatus === "completed",
      },
      {
        label: "Delivered",
        active: normalizedStatus === "completed",
        done: normalizedStatus === "completed",
      },
    ];
  }, [orderData, normalizedStatus]);

  if (!orderData) {
    return (
      <div className="tracking-page">
        <div className="tracking-container">
          <div className="tracking-card">
            <h1>No active order</h1>
            <p>You do not have any order to track yet.</p>
            <div className="tracking-actions">
              <button className="primary-btn" onClick={() => navigate("/")}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isPickup = orderData.paymentOption === "pickup";

  const estimatedText = isPickup
    ? "Estimated pickup time: 15 - 20 minutes"
    : "Estimated delivery time: 20 - 30 minutes";

  const displayAddress = isPickup
    ? orderData.restaurant?.address || "Pickup at restaurant"
    : orderData.address ||
      orderData.restaurant?.address ||
      localStorage.getItem("deliveryAddress") ||
      "Delivery address not available";

  const displayOrderId = orderData.orderId || orderData.id || "N/A";
  const displayStatus = orderData.status || "Chờ xác nhận";

  const displayReceiver =
    orderData.receiver_name || localStorage.getItem("receiverName") || "N/A";

  const displayPhone =
    orderData.phone || localStorage.getItem("receiverPhone") || "N/A";

  return (
    <div className="tracking-page">
      <div className="tracking-container">
        <div className="tracking-left">
          <div className="tracking-card">
            <div className="success-box">
              <div className="success-icon">✓</div>
              <div>
                <h1>
                  {normalizedStatus === "cancelled"
                    ? "Order Cancelled"
                    : "Order Confirmed"}
                </h1>
                <p>
                  {normalizedStatus === "cancelled"
                    ? "Your order has been cancelled."
                    : "Your order has been placed successfully."}
                </p>
                {loadingLatest && (
                  <small style={{ color: "#666" }}>
                    Đang đồng bộ trạng thái mới nhất...
                  </small>
                )}
              </div>
            </div>

            <div className="tracking-info">
              <h2>Tracking Status</h2>
              <p className="estimated-time">{estimatedText}</p>

              <div className="timeline">
                {trackingSteps.map((step, index) => (
                  <div className="timeline-step" key={index}>
                    <div
                      className={`timeline-dot ${
                        step.active ? "active" : "inactive"
                      }`}
                    />
                    <div className="timeline-content">
                      <h4>{step.label}</h4>
                      <p>
                        {step.done
                          ? "Completed"
                          : step.active
                          ? "Current order progress"
                          : "Upcoming step"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pickup-delivery-box">
              <h3>
                {isPickup ? "Pickup Information" : "Delivery Information"}
              </h3>

              <p>
                <strong>Restaurant:</strong>{" "}
                {orderData.restaurant?.name || "Restaurant"}
              </p>

              <p>
                <strong>Address:</strong> {displayAddress}
              </p>

              <p>
                <strong>Receiver:</strong> {displayReceiver}
              </p>

              <p>
                <strong>Phone:</strong> {displayPhone}
              </p>

              <p>
                <strong>Payment Method:</strong>{" "}
                {isPickup
                  ? "Store Pickup & Pay at Store"
                  : "Cash on Delivery"}
              </p>
            </div>

            <div className="tracking-actions">
              <button className="secondary-btn" onClick={() => navigate("/")}>
                Back to Home
              </button>

              <button className="primary-btn" onClick={() => navigate("/")}>
                Order Again
              </button>
            </div>
          </div>
        </div>

        <div className="tracking-right">
          <div className="summary-card">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items</span>
              <span>{orderData.summary?.items || 0}</span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(orderData.summary?.subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>{isPickup ? "Pickup Fee" : "Delivery Fee"}</span>
              <span>{formatPrice(orderData.summary?.deliveryFee)}</span>
            </div>

            <hr />

            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(orderData.summary?.total)}</span>
            </div>

            <div className="order-id-box">
              <h3>Order Details</h3>

              <p>
                <strong>Order ID:</strong> #{displayOrderId}
              </p>

              <p>
                <strong>Status:</strong> {displayStatus}
              </p>

              <p>
                <strong>Created At:</strong>{" "}
                {orderData.createdAt || orderData.created_at || "N/A"}
              </p>
            </div>

            {orderData.cartItems && orderData.cartItems.length > 0 && (
              <div className="order-id-box mt-3">
                <h3>Items</h3>
                {orderData.cartItems.map((item, index) => (
                  <p key={index}>
                    {item.name} x {item.quantity || 1}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingOrder;