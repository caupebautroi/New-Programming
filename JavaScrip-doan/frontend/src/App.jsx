import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./layouts/Navbar.jsx";
import Cart from "./pages/Home/Cart.jsx"
import Home from "./pages/Home/Home.jsx";
import RestaurantMenu from "./pages/Home/RestaurantMenu.jsx";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import Restaurants from "./components/home/Restaurants.jsx";

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
        <Route path="/login" element={<Login />} />
        <Route path="/restaurant/menu/:id" element={<RestaurantMenu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurants" element={<Restaurants />} />
      </Routes>
    </>
  );
}

export default App;