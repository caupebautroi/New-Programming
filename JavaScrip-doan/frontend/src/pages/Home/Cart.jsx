import { useContext, useMemo } from "react";
import { CartContext } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

import RestaurantHero from "../../components/restaurants/RestaurantHero";
import AppBanner from "../../components/home/AppBanner";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const parsePrice = (priceValue) => {
    if (!priceValue) return 0;
    if (typeof priceValue === "number") return priceValue;
    return parseInt(priceValue.toString().replace(/\D/g, ""), 10) || 0;
  };

  const formatPrice = (number) => {
    return Number(number || 0).toLocaleString("vi-VN") + " VND";
  };

  const getOptionNames = (options) => {
    if (!Array.isArray(options) || options.length === 0) return "";
    return options.map((opt) => opt.name).join(", ");
  };

  const getOptionExtraTotal = (options) => {
    if (!Array.isArray(options) || options.length === 0) return 0;
    return options.reduce((sum, opt) => sum + (opt.extraPrice || 0), 0);
  };

  const cartRestaurant = useMemo(() => {
    if (!cart || cart.length === 0) return null;

    const firstItem = cart[0];

    return {
      id: firstItem.restaurantId || null,
      name: firstItem.restaurantName || "Restaurant",
      bannerImg:
        firstItem.restaurantImage ||
        "https://via.placeholder.com/1200x400?text=Restaurant+Banner",
      slogan: "Delicious food delivered fast",
      minOrder: "50,000 VND",
      deliveryTime: "20 - 30 mins",
      openTime: "08:00 - 22:00",
      rating: {
        score: 4.5,
        count: "100+",
      },
      address:
        localStorage.getItem("deliveryAddress") ||
        "475A Dien Bien Phu, Ho Chi Minh City",
    };
  }, [cart]);

  const enrichedCart = useMemo(() => {
    return cart.map((item) => {
      const basePrice = parsePrice(item.price);
      const optionExtra = getOptionExtraTotal(item.options);
      const unitFinalPrice = basePrice + optionExtra;
      const quantity = item.quantity || 1;

      return {
        ...item,
        basePrice,
        optionExtra,
        unitFinalPrice,
        itemTotal: unitFinalPrice * quantity,
      };
    });
  }, [cart]);

  const subTotal = useMemo(() => {
    return enrichedCart.reduce((sum, item) => sum + item.itemTotal, 0);
  }, [enrichedCart]);

  const totalItems = useMemo(() => {
    return enrichedCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [enrichedCart]);

  const deliveryFee = enrichedCart.length > 0 ? 15000 : 0;
  const total = subTotal + deliveryFee;

  const handleIncrease = (item) => {
    updateQuantity(item.id, (item.quantity || 1) + 1);
  };

  const handleDecrease = (item) => {
    if ((item.quantity || 1) > 1) {
      updateQuantity(item.id, (item.quantity || 1) - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleRemove = (item) => {
    removeFromCart(item.id);
  };

  const handleCheckout = () => {
    if (enrichedCart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    navigate("/payment-method", {
      state: {
        cartItems: enrichedCart,
        restaurant: cartRestaurant,
        summary: {
          items: totalItems,
          subtotal: subTotal,
          deliveryFee,
          total,
        },
      },
    });
  };

  return (
    <div className="bg-light pb-5">
      {cartRestaurant && <RestaurantHero restaurant={cartRestaurant} />}

      <div className="container mt-4">
        <h2 className="mb-4 font-weight-bold">Your Cart</h2>

        <div className="row">
          <div className="col-md-8 mb-4">
            {enrichedCart.length === 0 ? (
              <div className="text-center py-5 bg-white rounded shadow-sm">
                <h4>Your basket is empty 🛒</h4>
                <Link
                  to="/"
                  className="btn btn-warning mt-3 font-weight-bold px-4 py-2"
                >
                  Go shopping
                </Link>
              </div>
            ) : (
              enrichedCart.map((item) => (
                <div
                  key={item.id}
                  className="card mb-3 p-3 shadow-sm border-0 rounded-lg"
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h5 className="font-weight-bold text-dark mb-1">
                        {item.name}
                      </h5>

                      <div className="text-muted small mb-1">
                        <strong>Base price:</strong> {formatPrice(item.basePrice)}
                      </div>

                      {item.options && item.options.length > 0 && (
                        <div className="text-muted small mb-1">
                          <strong>Custom options:</strong>{" "}
                          {getOptionNames(item.options)}
                        </div>
                      )}

                      {item.optionExtra > 0 && (
                        <div className="text-muted small mb-1">
                          <strong>Extra options:</strong>{" "}
                          {formatPrice(item.optionExtra)}
                        </div>
                      )}

                      {item.instructions && (
                        <div className="text-muted small mb-2 fst-italic">
                          <strong>Note:</strong> "{item.instructions}"
                        </div>
                      )}

                      <div className="text-muted small mb-1">
                        <strong>Unit total:</strong>{" "}
                        {formatPrice(item.unitFinalPrice)}
                      </div>

                      <div className="text-danger font-weight-bold mt-2">
                        {formatPrice(item.itemTotal)}
                      </div>
                    </div>

                    <div className="d-flex flex-column align-items-end ml-3">
                      <div className="d-flex align-items-center mb-3 bg-light rounded-pill px-2 py-1 border">
                        <button
                          className="btn btn-sm btn-light rounded-circle px-2 text-dark font-weight-bold"
                          onClick={() => handleDecrease(item)}
                        >
                          -
                        </button>

                        <span className="mx-3 font-weight-bold">
                          {item.quantity || 1}
                        </span>

                        <button
                          className="btn btn-sm btn-light rounded-circle px-2 text-dark font-weight-bold"
                          onClick={() => handleIncrease(item)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="btn btn-outline-danger btn-sm rounded-pill px-3"
                        onClick={() => handleRemove(item)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="col-md-4">
            <div className="card p-4 shadow-sm border-0 rounded-lg">
              <h4 className="font-weight-bold mb-4">Summary</h4>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Items:</span>
                <span className="font-weight-bold">{totalItems}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal:</span>
                <span className="font-weight-bold">{formatPrice(subTotal)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Delivery:</span>
                <span className="font-weight-bold">
                  {formatPrice(deliveryFee)}
                </span>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="font-weight-bold m-0">Total:</h5>
                <h4 className="text-danger font-weight-bold m-0">
                  {formatPrice(total)}
                </h4>
              </div>

              <button
                className="btn btn-success w-100 py-3 font-weight-bold rounded-lg"
                style={{ backgroundColor: "#008a45" }}
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      <AppBanner />
    </div>
  );
};

export default Cart;