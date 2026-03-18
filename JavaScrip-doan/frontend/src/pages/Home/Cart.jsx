import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";
import "./Cart.css";

import RestaurantHero from "../../components/restaurants/RestaurantHero";
import CustomerReviews from "../../components/restaurants/CustomerReviews";
import AppBanner from "../../components/home/AppBanner";

// DATABASE
const restaurantDatabase = {
  "1": { 
    name: "McDonald's Điện Biên Phủ",
    bannerImg: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    openTime: "Open until 3:00 AM",
    rating: { score: 4.5, count: "1,360" },
    reviews: [],
    categories: [{ items: [{ name: "Big Mac" }] }]
  }
};

const leftMenuItems = [
  "Pizzas", "Garlic Bread", "Calzone", "Kebabas"
];

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);

  const [activeMenu, setActiveMenu] = useState(leftMenuItems[0]);

  // ✅ từ file 2
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    return parseInt(priceString.toString().replace(/\D/g, ""), 10) || 0;
  };

  const formatPrice = (number) => {
    return number.toLocaleString("vi-VN") + " VND";
  };

  // ✅ giữ logic an toàn từ file 1
  if (!cart) return <p>Loading...</p>;

  const subTotal = cart.reduce(
    (sum, item) => sum + parsePrice(item.price) * (item.quantity || 1),
    0
  );

  const deliveryFee = cart.length > 0 ? 65000 : 0;
  const total = subTotal + deliveryFee;

  const cartRestaurant =
    cart.length > 0
      ? restaurantDatabase["1"]
      : restaurantDatabase["1"];

  return (
    <div className="bg-light pb-5">

      {/* HERO */}
      <RestaurantHero restaurant={cartRestaurant} />

      <div className="container mt-4">

        <h2>Your Cart</h2>

        {/* ✅ từ file 1 */}
        {cart.length === 0 && <p>Cart is empty</p>}

        <div className="row">

          {/* LEFT MENU */}
          <div className="col-md-3 mb-4">
            <div className="bg-white border rounded shadow-sm">
              <ul className="list-group list-group-flush">
                {leftMenuItems.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => setActiveMenu(item)}
                    className={`list-group-item ${
                      activeMenu === item ? "bg-dark text-white" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CART ITEMS */}
          <div className="col-md-5 mb-4">

            {cart.length === 0 ? (
              <div className="text-center py-5 bg-white rounded shadow-sm">
                <h4>Your basket is empty 🛒</h4>
                <Link to="/" className="btn btn-warning mt-2">
                  Go shopping
                </Link>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="card mb-3 p-3">

                  {/* ✅ giữ hiển thị basic */}
                  <h5>{item.name}</h5>

                  {/* fallback tránh lỗi */}
                  <p>{item.desc || "No description"}</p>

                  <p>
                    {formatPrice(
                      parsePrice(item.price) * (item.quantity || 1)
                    )}
                  </p>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item.name)}
                  >
                    Remove
                  </button>

                </div>
              ))
            )}

          </div>

          {/* SUMMARY */}
          <div className="col-md-4">
            <div className="card p-3">
              <h4>Summary</h4>

              <p>Subtotal: {formatPrice(subTotal)}</p>
              <p>Delivery: {formatPrice(deliveryFee)}</p>

              <hr />

              <h5>Total: {formatPrice(total)}</h5>

              <button className="btn btn-warning w-100">
                Checkout
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <CustomerReviews
        reviews={cartRestaurant.reviews}
        rating={cartRestaurant.rating}
      />
      <AppBanner />

    </div>
  );
};

export default Cart;