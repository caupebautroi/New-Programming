import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!form.agree) {
      alert("You must agree to the terms!");
      return;
    }

    console.log(form);

    navigate("/login");
  };

  return (
    <div className="register-page">

      {/* BACK */}
      <div className="back-home" onClick={() => navigate("/")}>
        ← Back to Home
      </div>

      <div className="register-box">
        <h2>Create Account</h2>
        <p className="subtitle">
          Sign up to explore exclusive offers
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />

          {/* CHECKBOX */}
          <label className="checkbox">
            <input type="checkbox" />
            <p>
                I agree to the <span>Terms & Conditions</span>
            </p>
        </label>

          <button type="submit">
            Sign Up
          </button>

        </form>

        <p className="login-text">
          Already have an account?{" "}
          <Link to="/login">Login now</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;