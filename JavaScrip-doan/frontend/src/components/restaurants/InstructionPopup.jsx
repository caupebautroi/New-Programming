import React, { useMemo, useState } from "react";
import "./InstructionPopup.css";

function InstructionPopup({ item, categoryTitle, onClose, onBack, onConfirm }) {
  const [instructions, setInstructions] = useState("");

  const parsePrice = (priceValue) => {
    if (!priceValue) return 0;
    if (typeof priceValue === "number") return priceValue;
    return parseInt(priceValue.toString().replace(/\D/g, ""), 10) || 0;
  };

  const formatPrice = (value) => {
    return Number(value || 0).toLocaleString("vi-VN") + " VND";
  };

  const finalPrice = useMemo(() => {
    const quantity = item.quantity || 1;
    const baseTotal = item.totalPrice || parsePrice(item.price) * quantity;

    const optionExtra =
      Array.isArray(item.options) && item.options.length > 0
        ? item.options.reduce((sum, opt) => sum + (opt.extraPrice || 0), 0)
        : 0;

    return baseTotal + optionExtra;
  }, [item]);

  const handleAdd = () => {
    onConfirm(instructions);
  };

  return (
    <div className="popup-overlay">
      <div className="custom-popup-content instruction-popup">
        <button className="popup-close-btn" onClick={onClose}>
          ✕
        </button>

        <img
          src={item.image || item.img || "https://via.placeholder.com/600x300?text=Food"}
          alt={item.name}
          className="custom-header-img"
        />

        <div className="custom-popup-body">
          <div className="custom-breadcrumbs">
            <strong>{categoryTitle}</strong> &gt; Customise {item.name} &gt;{" "}
            <strong>Instructions</strong>
          </div>

          <h3 className="custom-title" style={{ marginBottom: "20px" }}>
            Customise your {item.name}
          </h3>

          <div className="instruction-promo-banner">
            <img
              src={item.image || item.img || "https://via.placeholder.com/100?text=Food"}
              alt="thumb"
              className="promo-thumb"
            />
            <p>Add your special request</p>
          </div>

          <div className="instruction-input-container">
            <textarea
              className="instruction-textarea"
              placeholder="Write your special instructions here..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            ></textarea>
          </div>

          <div className="custom-popup-footer">
            <div className="total-orange-btn">
              Total to pay: {formatPrice(finalPrice)}
            </div>

            <div className="custom-footer-actions">
              <button className="btn-take-back" onClick={onBack}>
                Take me back
              </button>
              <button className="btn-next-green" onClick={handleAdd}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructionPopup;