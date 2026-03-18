import "./Login.css";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="login-page">

      {/* Back to home */}
      <div className="back-home" onClick={() => navigate("/")}>
        ← Back to Home
      </div>

      <div className="login-container">

        <h2>Welcome Back!</h2>
        <p>Enter your details to continue ordering.</p>

        {/* Email / Phone */}
        <div className="input-group">
          <input
            type="text"
            placeholder="Email or Phone Number"
          />
        </div>

        {/* Password */}
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
          />
        </div>

        <div className="forgot-password">
          Forgot Password?
        </div>

        {/* Login button */}
        <button className="login-btn">
          Login
        </button>

        <p className="or-text">Or login with</p>

        {/* Social login */}
        <div className="social-login">
          <button>G</button>
          <button>f</button>
          <button>👤</button>
        </div>

        <p>
          Don't have an account?{" "}
          <Link to="/register">Sign up now</Link>
        </p>

      </div>

    </div>
  );
};

export default Login;