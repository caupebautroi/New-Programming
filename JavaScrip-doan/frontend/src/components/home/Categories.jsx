import React, { useEffect, useState } from "react";
import "./Categories.css";
import CategoryPopup from "../restaurants/CategoryPopup";
import { getAllRestaurants } from "../../services/restaurantService";

const categories = [
  {
    name: "Fast food",
    restaurants: "Popular choices",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
  },
  {
    name: "Pizza",
    restaurants: "Hot deals",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
  },
  {
    name: "Gà rán",
    restaurants: "Crispy favorites",
    img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500",
  },
  {
    name: "Cơm",
    restaurants: "Vietnamese meals",
    img: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=500",
  },
  {
    name: "Bún / Mì",
    restaurants: "Local taste",
    img: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500",
  },
  {
    name: "Drinks",
    restaurants: "Refreshing picks",
    img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500",
  },
];

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi tải categories:", error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleCategoryClick = (categoryName) => {
    const keyword = categoryName.toLowerCase();

    const results = restaurants.filter((restaurant) => {
      const text = `${restaurant.name || ""} ${restaurant.category || ""}`.toLowerCase();

      if (keyword === "fast food") {
        return (
          text.includes("fastfood") ||
          text.includes("fast food") ||
          text.includes("burger") ||
          text.includes("gà") ||
          text.includes("fried chicken") ||
          text.includes("pizza")
        );
      }

      if (keyword === "pizza") return text.includes("pizza");
      if (keyword === "gà rán") return text.includes("gà") || text.includes("chicken");
      if (keyword === "cơm") return text.includes("cơm");
      if (keyword === "bún / mì") {
        return text.includes("bún") || text.includes("mì") || text.includes("phở");
      }
      if (keyword === "drinks") {
        return text.includes("drink") || text.includes("tea") || text.includes("coffee");
      }

      return text.includes(keyword);
    });

    setFilteredRestaurants(results);
    setSelectedCategory(categoryName);
  };

  return (
    <div className="container mt-5">
      <h4 className="category-title">Order.vn Popular Categories 🍔</h4>

      <div className="categories-grid">
        {categories.map((cat, index) => (
          <div
            className="category-card"
            key={index}
            onClick={() => handleCategoryClick(cat.name)}
            style={{ cursor: "pointer" }}
          >
            <div className="category-image">
              <img src={cat.img} alt={cat.name} />
            </div>

            <div className="category-info">
              <h6>{cat.name}</h6>
              <p>{cat.restaurants}</p>
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="mt-3">Loading categories...</p>}

      {selectedCategory && (
        <CategoryPopup
          categoryName={selectedCategory}
          items={filteredRestaurants}
          onClose={() => setSelectedCategory(null)}
          isRestaurantList={true}
        />
      )}
    </div>
  );
};

export default Categories;