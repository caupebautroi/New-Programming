import { NavLink, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);

  // ✅ parse giá
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    const numericString = priceString.toString().replace(/\D/g, "");
    return parseInt(numericString, 10) || 0;
  };

  // ✅ format giá
  const formatPrice = (number) => {
    return number.toLocaleString("vi-VN") + " VND";
  };

  // ✅ tổng số lượng
  const totalItems = cart.reduce((total, item) => {
    return total + (item.quantity || 1);
  }, 0);

  // ✅ tổng tiền chuẩn (đã fix lỗi file 1)
  const totalPrice = cart.reduce((total, item) => {
    return total + parsePrice(item.price) * (item.quantity || 1);
  }, 0);

  return (
    <div>

      {/* ================= TOP BAR ================= */}
      <div className="topbar">
        <div className="container topbar-inner">

          {/* LEFT */}
          <div className="topbar-left">
            <div className="promo">
              🌟 Get 5% off your first order,
              <span className="promo-code"> Promo: FATTY5</span>
            </div>
          </div>

          {/* CENTER */}
          <div className="topbar-center">
            <div className="location">
              <span className="location-icon">📍</span>

              <span className="location-text">
                475A Dien Bien Phu, Ho Chi Minh City
              </span>

              <span className="change-location">
                Change Location
              </span>
            </div>
          </div>

          {/* RIGHT (CART CLICKABLE) */}
          <div className="topbar-right">
            <Link
              to="/cart"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="cart-box" style={{ cursor: "pointer" }}>

                <div className="cart-section cart-icon">🧺</div>

                <div className="cart-section">
                  {totalItems} Items
                </div>

                <div className="cart-section">
                  {formatPrice(totalPrice)}
                </div>

                <div className="cart-section cart-arrow">↓</div>

              </div>
            </Link>
          </div>

        </div>
      </div>

      {/* ================= NAVBAR ================= */}
      <div className="navbar-main">
        <div className="container navbar-inner">

          {/* LOGO */}
          <div className="logo">
            <Link to="/">
              Order<span>.vn</span>
            </Link>
          </div>

          {/* NAV LINKS */}
          <div className="nav-links">

            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
              Home
            </NavLink>

            <NavLink to="/menu" className={({ isActive }) => isActive ? "active" : ""}>
              Browse Menu
            </NavLink>

            <NavLink to="/offers" className={({ isActive }) => isActive ? "active" : ""}>
              Special Offers
            </NavLink>

            <NavLink to="/restaurants" className={({ isActive }) => isActive ? "active" : ""}>
              Restaurants
            </NavLink>

            <NavLink to="/track" className={({ isActive }) => isActive ? "active" : ""}>
              Track Order
            </NavLink>

          </div>

          {/* RIGHT SIDE */}
          <div className="nav-right">
            <div
              className="login-btn"
              onClick={() => navigate("/login")}
            >
              Login / Signup     
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Navbar;