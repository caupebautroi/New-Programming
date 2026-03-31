import { useState, useEffect } from "react";
import "./MenuNav.css";

const MenuNav = ({ categories = [] }) => {
  const [activeTab, setActiveTab] = useState("Offers");

  const navItems = ["Offers", ...categories];

  useEffect(() => {
    if (navItems.length > 0) {
      setActiveTab(navItems[0]);
    }
  }, [categories]);

  const handleClick = (category) => {
    setActiveTab(category);

    if (category === "Offers") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const sectionId = `category-${category}`;
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="menu-nav-wrapper mt-4 mb-5">
      <div className="container">
        <div className="menu-nav-list d-flex align-items-center">
          {navItems.map((category) => (
            <button
              key={category}
              className={`menu-nav-item ${activeTab === category ? "active" : ""}`}
              onClick={() => handleClick(category)}
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