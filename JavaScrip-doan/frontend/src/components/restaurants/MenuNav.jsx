import { useState } from "react";
import "./MenuNav.css";

const MenuNav = () => {
  // Danh sách các danh mục món ăn
  const categories = [
    "Offers", "Burgers", "Fries", "Snacks", "Salads", 
    "Cold drinks", "Happy Meal®", "Desserts", "Hot drinks", "Sauces", "Orbit®"
  ];

  // State để theo dõi tab đang được chọn, mặc định là "Offers"
  const [activeTab, setActiveTab] = useState("Offers");

  return (
    <div className="menu-nav-wrapper mt-4 mb-5">
      <div className="container">
        <div className="menu-nav-list d-flex align-items-center">
          
          {categories.map((category, index) => (
            <button
              key={index}
              // Thêm class 'active' nếu tab này đang được chọn
              className={`menu-nav-item ${activeTab === category ? "active" : ""}`}
              onClick={() => setActiveTab(category)}
            >
              {category}
            </button>
          ))}

        </div>
      </div>
    </div>
  );
};

export default MenuNav;