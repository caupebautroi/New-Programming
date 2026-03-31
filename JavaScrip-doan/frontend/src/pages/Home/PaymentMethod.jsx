import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder } from "../../services/orderService";
import { toast } from "react-toastify";
import "./PaymentMethod.css";

const PaymentMethod = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [paymentOption, setPaymentOption] = useState("cash_delivery");
  const [receiverName, setReceiverName] = useState(
    localStorage.getItem("receiverName") || "Guest User"
  );
  const [phone, setPhone] = useState(
    localStorage.getItem("receiverPhone") || "0123456789"
  );
  const [address, setAddress] = useState(
    localStorage.getItem("deliveryAddress") ||
      "475A Dien Bien Phu, Ho Chi Minh City"
  );
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fallbackData = {
    cartItems: [],
    restaurant: {
      id: null,
      name: "Restaurant",
      address: "Restaurant address",
    },
    summary: {
      items: 0,
      subtotal: 0,
      deliveryFee: 0,
      total: 0,
    },
  };

  const orderData = location.state || fallbackData;

  const finalSummary = useMemo(() => {
    if (paymentOption === "pickup") {
      return {
        ...orderData.summary,
        deliveryFee: 0,
        total: orderData.summary.subtotal,
      };
    }

    return orderData.summary;
  }, [paymentOption, orderData.summary]);

  const formatPrice = (number) => {
    return Number(number || 0).toLocaleString("vi-VN") + " VND";
  };

  const getCurrentUserId = () => {
    const savedUser =
      JSON.parse(localStorage.getItem("foodie_currentUser")) ||
      JSON.parse(localStorage.getItem("currentUser")) ||
      JSON.parse(localStorage.getItem("user"));

    return savedUser?.id || 1;
  };

  const handleConfirmOrder = async () => {
    if (!orderData.cartItems || orderData.cartItems.length === 0) {
      toast.error("Giỏ hàng đang trống.");
      return;
    }

    if (!receiverName.trim() || !phone.trim()) {
      toast.error("Vui lòng nhập tên người nhận và số điện thoại.");
      return;
    }

    if (paymentOption === "cash_delivery" && !address.trim()) {
      toast.error("Vui lòng nhập địa chỉ giao hàng.");
      return;
    }

    try {
      setSubmitting(true);

      const finalAddress =
        paymentOption === "pickup"
          ? orderData.restaurant?.address || "Pickup at restaurant"
          : address;

      localStorage.setItem("receiverName", receiverName);
      localStorage.setItem("receiverPhone", phone);
      localStorage.setItem("deliveryAddress", finalAddress);

      const orderPayload = {
        user_id: getCurrentUserId(),
        restaurant_id:
          orderData.restaurant?.id ||
          orderData.cartItems?.[0]?.restaurantId ||
          null,
        total_price: finalSummary.total,
        receiver_name: receiverName,
        phone,
        address: finalAddress,
        note:
          paymentOption === "pickup"
            ? `Pickup order - Pay at store. ${note}`.trim()
            : note,
        status: "Chờ xác nhận",
        payment_method: paymentOption,
        items: (orderData.cartItems || []).map((item) => ({
          dish_name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
        })),
      };

      const createdOrder = await createOrder(orderPayload);

      const trackingPayload = {
        ...createdOrder,

        receiver_name: receiverName,
        phone: phone,
        address: finalAddress,
        note: note,

        paymentOption,
        restaurant: {
          ...orderData.restaurant,
          address: finalAddress,
        },
        summary: finalSummary,
        cartItems: orderData.cartItems || [],

        createdAt: createdOrder?.created_at || new Date().toISOString(),
        created_at: createdOrder?.created_at || new Date().toISOString(),

        orderId:
          createdOrder?.id ||
          createdOrder?.orderId ||
          createdOrder?.insertId ||
          null,

        status: createdOrder?.status || "Chờ xác nhận",
      };

      localStorage.setItem("currentOrder", JSON.stringify(trackingPayload));

      toast.success("Đặt hàng thành công!");

      navigate("/tracking-order", {
        state: trackingPayload,
      });
    } catch (error) {
      console.error("Lỗi khi xác nhận đơn hàng:", error);
      toast.error("Không thể tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-left">
          <div className="payment-card">
            <h1 className="payment-title">Payment Method</h1>
            <p className="payment-subtitle">
              Choose how you want to pay for your order
            </p>

            <div className="payment-methods">
              <label
                className={`method-option ${
                  paymentOption === "cash_delivery" ? "active" : ""
                }`}
              >
                <div className="method-left">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentOption === "cash_delivery"}
                    onChange={() => setPaymentOption("cash_delivery")}
                  />
                  <div>
                    <span className="method-name">Cash on Delivery</span>
                    <span className="method-desc">
                      Pay with cash when your order is delivered
                    </span>
                  </div>
                </div>
                <div className="method-badge">Available</div>
              </label>

              <label
                className={`method-option ${
                  paymentOption === "pickup" ? "active" : ""
                }`}
              >
                <div className="method-left">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentOption === "pickup"}
                    onChange={() => setPaymentOption("pickup")}
                  />
                  <div>
                    <span className="method-name">
                      Store Pickup & Pay at Store
                    </span>
                    <span className="method-desc">
                      Pick up your order at the restaurant and pay there
                    </span>
                  </div>
                </div>
                <div className="method-badge">Available</div>
              </label>
            </div>

            <div className="payment-form mt-4">
              <h3 className="mb-3">Receiver Information</h3>

              <div className="mb-3">
                <label className="form-label">Receiver Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  placeholder="Enter receiver name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              {paymentOption === "cash_delivery" ? (
                <div className="mb-3">
                  <label className="form-label">Delivery Address</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter delivery address"
                  />
                </div>
              ) : (
                <div className="mb-3">
                  <label className="form-label">Pickup Address</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={orderData.restaurant?.address || "Restaurant address"}
                    disabled
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Note</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any special note for your order"
                />
              </div>
            </div>

            <div className="cash-note">
              <h3>Important Notes</h3>
              {paymentOption === "cash_delivery" ? (
                <ul>
                  <li>Please prepare the correct amount in cash if possible.</li>
                  <li>The driver will collect the payment upon delivery.</li>
                  <li>Delivery fee is included in your final total.</li>
                </ul>
              ) : (
                <ul>
                  <li>You will pick up the order at the restaurant.</li>
                  <li>You can pay directly at the counter in cash.</li>
                  <li>No delivery fee is charged for pickup orders.</li>
                </ul>
              )}
            </div>

            <div className="payment-actions">
              <button className="back-btn" onClick={() => navigate("/cart")}>
                Back to Cart
              </button>

              <button
                className="place-order-btn"
                onClick={handleConfirmOrder}
                disabled={submitting}
              >
                {submitting ? "Placing Order..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>

        <div className="payment-right">
          <div className="summary-card">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items</span>
              <span>{finalSummary.items}</span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(finalSummary.subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>
                {paymentOption === "pickup" ? "Pickup Fee" : "Delivery Fee"}
              </span>
              <span>{formatPrice(finalSummary.deliveryFee)}</span>
            </div>

            <hr />

            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(finalSummary.total)}</span>
            </div>

            <div className="delivery-info">
              <h3>
                {paymentOption === "pickup"
                  ? "Pickup Information"
                  : "Delivery Information"}
              </h3>

              <p>
                <strong>Restaurant:</strong> {orderData.restaurant?.name}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {paymentOption === "pickup"
                  ? orderData.restaurant?.address || "Restaurant address"
                  : address}
              </p>
              <p>
                <strong>Order items:</strong> {finalSummary.items}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;