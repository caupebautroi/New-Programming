import React, { useMemo, useState } from "react";
import "./CustomizationPopup.css";

function CustomizationPopup({ item, categoryTitle, onClose, onBack, onNext }) {
  // Lấy danh sách extra từ trong item truyền sang (dữ liệu thật từ Database)
  // Nếu chưa có thì khởi tạo là mảng rỗng
  const extraList = item.extras || []; 
  console.log("Dữ liệu món ăn hiện tại:", item);
  
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Hàm này giữ lại nếu tương lai bạn có ý định chèn thêm giá vào database (ví dụ: "Thêm phô mai (+15k)")
  const parseExtraPrice = (optionText) => {
    if (!optionText) return 0;
    const match = optionText.match(/\+(\d+)\s*k/i);
    if (!match) return 0;
    return Number(match[1]) * 1000;
  };

  const formatPrice = (value) => {
    return Number(value || 0).toLocaleString("vi-VN") + " VND";
  };

  const toggleOption = (optionName) => {
    if (selectedOptions.includes(optionName)) {
      // Bỏ chọn
      setSelectedOptions(selectedOptions.filter((o) => o !== optionName));
    } else {
      // Chọn
      setSelectedOptions([...selectedOptions, optionName]);
    }
  };

  // Tính tổng tiền dựa trên các option đã chọn (hiện tại giá là 0đ vì DB của bạn đang set 0đ)
  const optionExtraTotal = useMemo(() => {
    return selectedOptions.reduce((sum, option) => sum + parseExtraPrice(option), 0);
  }, [selectedOptions]);

  const finalPrice = (item.totalPrice || 0) + optionExtraTotal;

  // Nếu món ăn không có Extra nào trong Database -> Báo không có tùy chọn và cho qua bước 3
  if (extraList.length === 0) {
    return (
      <div className="popup-overlay">
        <div
          className="custom-popup-content"
          style={{ textAlign: "center", padding: "50px" }}
        >
          <h3 style={{ marginBottom: "20px" }}>Món này không có tùy chọn thêm.</h3>

          <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
            <button className="btn-take-back" onClick={onBack}>
              Quay lại
            </button>
            <button className="btn-next-green" onClick={() => onNext([])}>
              Bước tiếp theo ➔
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-overlay">
      <div className="custom-popup-content">
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
            <strong>{categoryTitle}</strong> &gt; Tùy chỉnh {item.name}
          </div>

          <div className="custom-header-row">
            <h3 className="custom-title">Tùy chỉnh {item.name}</h3>
            <span className="selection-count">Đã chọn: {selectedOptions.length}</span>
          </div>

          <div className="options-container">
            <div className="option-section">
              <div className="section-title-badge">
                Tùy chọn thêm (Extras)
              </div>

              <div className="options-grid">
                {/* LẶP QUA DANH SÁCH EXTRA TỪ DATABASE */}
                {extraList.map((extraItem, idx) => {
                  // Đề phòng db trả về dạng {name: "Phủ phô mai"} hoặc chỉ là string "Phủ phô mai"
                  const optName = typeof extraItem === 'object' ? extraItem.name : extraItem;
                  const checked = selectedOptions.includes(optName);

                  return (
                    <label
                      key={idx}
                      className="checkbox-item"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOption(optName)}
                      />
                      <span className="checkmark"></span>
                      <span className="opt-name">{optName}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="custom-popup-footer">
            <div className="total-orange-btn">
              Tổng tiền: {formatPrice(finalPrice)}
            </div>

            <div className="custom-footer-actions">
              <button className="btn-take-back" onClick={onBack}>
                Quay lại
              </button>
              <button
                className="btn-next-green"
                onClick={() =>
                  onNext(
                    selectedOptions.map((option) => ({
                      name: option,
                      extraPrice: parseExtraPrice(option),
                    }))
                  )
                }
              >
                Tiếp tục ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomizationPopup;