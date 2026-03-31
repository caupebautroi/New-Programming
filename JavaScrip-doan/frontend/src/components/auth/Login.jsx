import { useState } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../services/authService";

const decodeJwtPayload = (token) => {
  try {
    if (!token) return null;

    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Không decode được token:", error);
    return null;
  }
};

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.identifier.trim() || !form.password.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin đăng nhập.");
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        identifier: form.identifier,
        email: form.identifier,
        username: form.identifier,
        phone: form.identifier,
        password: form.password,
      });

      console.log("Login response:", response);

      const token =
        response?.token ||
        response?.accessToken ||
        response?.jwt ||
        "";

      const tokenPayload = decodeJwtPayload(token);

      const user = response?.user || {
        id:
          tokenPayload?.id ||
          tokenPayload?.userId ||
          tokenPayload?.sub ||
          null,
        username:
          tokenPayload?.username ||
          tokenPayload?.name ||
          form.identifier,
        full_name:
          tokenPayload?.full_name ||
          tokenPayload?.fullName ||
          tokenPayload?.username ||
          form.identifier,
        email: tokenPayload?.email || form.identifier,
        role:
          tokenPayload?.role ||
          response?.role ||
          "customer",
      };

      if (token) {
        localStorage.setItem("foodie_token", token);
      }

      localStorage.setItem("foodie_currentUser", JSON.stringify(user));

      console.log("Saved user:", user);

      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error?.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="back-home" onClick={() => navigate("/")}>
        ← Back to Home
      </div>

      <div className="login-container">
        <h2>Welcome Back!</h2>
        <p>Enter your details to continue ordering.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="identifier"
              placeholder="Email / Username / Phone Number"
              value={form.identifier}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="or-text">Or login with</p>

        <div className="social-login">
          <button type="button">G</button>
          <button type="button">f</button>
          <button type="button">👤</button>
        </div>

        <p>
          Don't have an account? <Link to="/register">Sign up now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;