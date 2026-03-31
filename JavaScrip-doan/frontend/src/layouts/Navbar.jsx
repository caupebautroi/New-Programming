import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import { CartContext } from "../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useContext(CartContext);

  const [deliveryAddress, setDeliveryAddress] = useState(
    localStorage.getItem("deliveryAddress") || "475A Dien Bien Phu, Ho Chi Minh City"
  );

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser =
      localStorage.getItem("foodie_currentUser") ||
      localStorage.getItem("currentUser") ||
      localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem("deliveryAddress", deliveryAddress);
  }, [deliveryAddress]);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("foodie_currentUser") ||
      localStorage.getItem("currentUser") ||
      localStorage.getItem("user");

    setCurrentUser(savedUser ? JSON.parse(savedUser) : null);
  }, [location.pathname]);

  const parsePrice = (priceValue) => {
    if (!priceValue) return 0;
    if (typeof priceValue === "number") return priceValue;
    return parseInt(priceValue.toString().replace(/\D/g, ""), 10) || 0;
  };

  const formatPrice = (number) => {
    return Number(number || 0).toLocaleString("vi-VN") + " VND";
  };

  const getOptionExtraTotal = (options) => {
    if (!Array.isArray(options) || options.length === 0) return 0;
    return options.reduce((sum, opt) => sum + (opt.extraPrice || 0), 0);
  };

  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => {
      const basePrice = parsePrice(item.price);
      const extraPrice = getOptionExtraTotal(item.options);
      const unitFinalPrice = basePrice + extraPrice;
      return total + unitFinalPrice * (item.quantity || 1);
    }, 0);
  }, [cart]);

  const displayName = useMemo(() => {
    if (!currentUser) return "";
    return (
      currentUser.full_name ||
      currentUser.fullName ||
      currentUser.username ||
      currentUser.name ||
      currentUser.email ||
      "User"
    );
  }, [currentUser]);

  const handleChangeLocation = () => {
    const newAddress = prompt("Enter new location:", deliveryAddress);

    if (newAddress && newAddress.trim() !== "") {
      const trimmedAddress = newAddress.trim();
      setDeliveryAddress(trimmedAddress);

      const savedOrder = localStorage.getItem("currentOrder");
      if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder);
        const updatedOrder = {
          ...parsedOrder,
          address: trimmedAddress,
          restaurant: {
            ...parsedOrder.restaurant,
            address: trimmedAddress,
          },
        };
        localStorage.setItem("currentOrder", JSON.stringify(updatedOrder));
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("foodie_token");
    localStorage.removeItem("foodie_currentUser");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user");

    setCurrentUser(null);
    navigate("/");
  };

  return (
    <div>
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-left">
            <div className="promo">
              🌟 Get 5% off your first order,
              <span className="promo-code"> Promo: FATTY5</span>
            </div>
          </div>

          <div className="topbar-center">
            <div className="location">
              <span className="location-icon">📍</span>

              <span className="location-text">{deliveryAddress}</span>

              <span
                className="change-location"
                onClick={handleChangeLocation}
                style={{ cursor: "pointer" }}
              >
                Change Location
              </span>
            </div>
          </div>

          <div className="topbar-right">
            <Link
              to="/cart"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="cart-box" style={{ cursor: "pointer" }}>
                <div className="cart-section cart-icon">🧺</div>
                <div className="cart-section">{totalItems} Items</div>
                <div className="cart-section">{formatPrice(totalPrice)}</div>
                <div className="cart-section cart-arrow">↓</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="navbar-main">
        <div className="container navbar-inner">
          <div className="logo">
            <Link to="/">
              Order<span>.vn</span>
            </Link>
          </div>

          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
              Home
            </NavLink>

            <NavLink
              to="/restaurants"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Restaurants
            </NavLink>

            {currentUser?.role === "admin" ? (
              <>
                <NavLink
                  to="/admin/dishes"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Manage Dishes
                </NavLink>

                <NavLink
                  to="/admin/orders"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Manage Orders
                </NavLink>
              </>
            ) : (
              <NavLink
                to="/tracking-order"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Track Order
              </NavLink>
            )}
          </div>

          <div className="nav-right">
            {currentUser ? (
              <div className="user-auth-box">
                <span className="user-name-badge">
                   {displayName}
                </span>

                <button className="logout-btn" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div
                className="login-btn"
                onClick={() => navigate("/login")}
              >
                Login / Signup
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;