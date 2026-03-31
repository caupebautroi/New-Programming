import React from 'react';
import './MenuCategory.css';

function MenuCategory({ title, items, onOpenPopup }) {
  return (
    <div className="menu-category"id={`category-${title}`}>
      <h2 className="category-title">{title}</h2>
      
      <div className="category-grid">
        {items.map((item) => (
          <div key={item.id} className="food-card">
            
            {/* Phần text bên trái */}
            <div className="food-info">
              <h4 className="food-name">{item.name}</h4>
              <p className="food-desc">{item.desc}</p>
              <p className="food-price">{item.price}</p>
            </div>
            
            {/* Phần ảnh bên phải */}
            <div className="food-image-box">
              <img 
                src={item.image || item.img} 
                alt={item.name} 
                className="food-img"
              />
              
              {/* Nút cộng */}
              <div className="add-btn-wrapper">
                <button 
                  className="add-btn"
                  onClick={() => {
                    if (onOpenPopup) {
                      // BỔ SUNG: Gắn thêm 'categoryTitle' (VD: "Pizzas") vào item để CustomizationPopup biết
                      onOpenPopup({ ...item, categoryTitle: title });
                    }
                  }}
                >
                  +
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuCategory;