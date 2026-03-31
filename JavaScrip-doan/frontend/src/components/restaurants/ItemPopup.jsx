import React, { useState, useEffect } from "react";
import "./ItemPopup.css";

function ItemPopup({ item, onClose, onNext }) {
  const [quantity, setQuantity] = useState(1);
console.log("Kiểm tra dữ liệu truyền vào Popup Bước 1:", item);
  const parsePrice = (priceValue) => {
    if (!priceValue) return 0;
    if (typeof priceValue === "number") return priceValue;

    return parseInt(priceValue.toString().replace(/\D/g, ""), 10) || 0;
  };

  const formatPrice = (value) => {
    return Number(value || 0).toLocaleString("vi-VN") + " VND";
  };

  const unitPrice = parsePrice(item?.price);
  const [totalPrice, setTotalPrice] = useState(unitPrice);

  useEffect(() => {
    setTotalPrice(unitPrice * quantity);
  }, [quantity, unitPrice]);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleNextStep = () => {
    const itemWithData = {
      ...item,
      quantity,
      totalPrice,
    };

    if (onNext) {
      onNext(itemWithData);
    } else {
      console.error("Lỗi: Chưa truyền prop onNext vào ItemPopup!");
    }
  };

  if (!item) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close-btn" onClick={onClose}>
          ✕
        </button>

        <img
          src={item.image || item.img || "https://via.placeholder.com/600x300?text=Food"}
          alt={item.name}
          className="popup-header-img"
        />

        <div className="popup-body">
          <div className="popup-breadcrumbs">
            <strong>Menu</strong> &gt; {item.name}
          </div>

          <h3 className="popup-subtitle">Select quantity</h3>

          <div className="item-row-selected">
            <div className="item-info-left">
              <img
                src={item.image || item.img || "https://via.placeholder.com/100?text=Food"}
                alt={item.name}
                className="item-thumb"
              />
              <div className="item-divider"></div>
              <span className="item-display-name">{item.name}</span>
            </div>

            <div className="quantity-control">
              <button className="qty-btn" onClick={handleDecrease}>
                −
              </button>
              <div className="qty-number-box">
                <span>{quantity}</span>
              </div>
              <button className="qty-btn" onClick={handleIncrease}>
                +
              </button>
            </div>
          </div>

          <div className="popup-footer">
            <div className="total-price-tag">
              <span className="label">Total </span>
              <span className="value">{formatPrice(totalPrice)}</span>
            </div>

            <div className="footer-actions">
              <button className="btn-cancel" onClick={onClose}>
                Take me back
              </button>

              <button className="btn-confirm" onClick={handleNextStep}>
                Next Step ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemPopup;