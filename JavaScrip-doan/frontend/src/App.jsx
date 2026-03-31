import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./layouts/Navbar.jsx";
import Cart from "./pages/Home/Cart.jsx";
import Home from "./pages/Home/Home.jsx";
import RestaurantMenu from "./pages/Home/RestaurantMenu.jsx";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import Restaurants from "./components/home/Restaurants.jsx";
import PaymentMethod from "./pages/Home/PaymentMethod";
import TrackingOrder from "./pages/Home/TrackingOrder";
import AdminRoute from "./routes/AdminRoute";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminManageDishes from "./pages/Admin/AdminManageDishes";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotFound = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h2>404 - Page Not Found</h2>
  </div>
);

function App() {
  const location = useLocation();

  const hideNavbarPaths = ["/login", "/register"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurant/menu/:id" element={<RestaurantMenu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment-method" element={<PaymentMethod />} />
        <Route path="/tracking-order" element={<TrackingOrder />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/dishes" element={<AdminRoute><AdminManageDishes /></AdminRoute>} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;