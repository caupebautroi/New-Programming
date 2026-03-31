import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const savedUser =
    JSON.parse(localStorage.getItem("foodie_currentUser")) ||
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(localStorage.getItem("user"));

  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }

  const role = (savedUser.role || "").toLowerCase();

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;