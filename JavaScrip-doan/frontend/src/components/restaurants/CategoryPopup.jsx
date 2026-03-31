import React from "react";
import "./CategoryPopup.css";
import { useNavigate } from "react-router-dom";

const CategoryPopup = ({ categoryName, items = [], onClose }) => {
  const navigate = useNavigate();

  const handleRestaurantClick = (restaurantId) => {
    onClose();
    navigate(`/restaurant/menu/${restaurantId}`);
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="category-popup-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="popup-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="category-popup-header">
          <h2>
            🔥 Nhà hàng thuộc danh mục: <span>{categoryName}</span>
          </h2>
          <p>Tìm thấy {items.length} nhà hàng phù hợp</p>
        </div>

        <div className="category-items-grid">
          {items.length > 0 ? (
            items.map((restaurant) => (
              <div key={restaurant.id} className="cat-item-card">
                <img
                  src={
                    restaurant.image ||
                    "https://via.placeholder.com/300x200?text=Restaurant"
                  }
                  alt={restaurant.name}
                  className="cat-item-img actionable-img"
                  onClick={() => handleRestaurantClick(restaurant.id)}
                  title={`Bấm để tới nhà hàng ${restaurant.name}`}
                />

                <div className="cat-item-info">
                  <h4 className="cat-item-name">{restaurant.name}</h4>

                  <p className="cat-item-price">
                    ⭐ {restaurant.rating || "0.0"} •{" "}
                    {restaurant.time_delivery || "N/A"}
                  </p>

                  <div className="cat-restaurant-badge">
                    🍽️ {restaurant.category || "Food"}
                  </div>

                  <div
                    className="btn-go-restaurant"
                    onClick={() => handleRestaurantClick(restaurant.id)}
                  >
                    Tới nhà hàng ➔
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-items-found">
              <p>Chưa có nhà hàng nào trong danh mục này.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPopup;