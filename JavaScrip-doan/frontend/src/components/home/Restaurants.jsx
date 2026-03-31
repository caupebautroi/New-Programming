import "./Restaurants.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllRestaurants } from "../../services/restaurantService";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError("");

        const restaurantData = await getAllRestaurants();
        setRestaurants(Array.isArray(restaurantData) ? restaurantData : []);

        setRestaurants(restaurantData);
      } catch (err) {
        console.error("Lỗi lấy danh sách nhà hàng:", err);
        setError("Không thể tải danh sách nhà hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5">
        <h4 className="restaurant-title">Popular Restaurants</h4>
        <p>Loading restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <h4 className="restaurant-title">Popular Restaurants</h4>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="container mt-5">
        <h4 className="restaurant-title">Popular Restaurants</h4>
        <p>Chưa có nhà hàng nào.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h4 className="restaurant-title">Popular Restaurants</h4>

      <div className="restaurant-grid">
        {restaurants.map((res) => (
          <Link
            to={`/restaurant/menu/${res.id}`}
            key={res.id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="restaurant-card">
              <div className="restaurant-logo">
                <img
                  src={res.image || "https://via.placeholder.com/300x200?text=Restaurant"}
                  alt={res.name}
                />
              </div>

              <div className="restaurant-name">{res.name}</div>

              <div className="restaurant-meta">
                <small>
                  ⭐ {res.rating || "0.0"} • {res.time_delivery || "N/A"}
                </small>
              </div>

              <div className="restaurant-category">
                <small>{res.category || "Food"}</small>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Restaurants;