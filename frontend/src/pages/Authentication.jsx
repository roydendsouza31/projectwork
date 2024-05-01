import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Authentication.css";
import axios from "axios";

const Authentication = ({ mode, role }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
    userName: "",
    shopName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = user;
    if (email.trim() === "" || password.trim() === "") {
      alert("Please enter both email and password");
    } else if (!validateEmail(email)) {
      alert("Please enter a valid email address");
    } else {
      axios
        .post("http://localhost:5000/CustomerLogin", user)
        .then((res) => {
          if (res.status === 200) {
            navigate("/");
          } else {
            alert("User not found. Please signup.");
          }
        })
        .catch((error) => {
          console.error("Error logging in:", error);
        });
    }
  };

  return (
    <div className="Authentication">
      <h1>
        {role} {mode}
      </h1>
      {mode === "Register" && (
        <input
          type="text"
          placeholder="Enter your name"
          name="userName"
          value={user.userName}
          onChange={handleChange}
        />
      )}
      {mode === "Register" && role === "Seller" && (
        <input
          type="text"
          placeholder="Create your shop name"
          name="shopName"
          value={user.shopName}
          onChange={handleChange}
        />
      )}
      <input
        type="email"
        placeholder="Enter your email"
        name="email"
        value={user.email}
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        value={user.password}
        onChange={handleChange}
      />
      <div className="button" onClick={handleSubmit}>
        {mode}
      </div>
      <p>
        {mode === "Register"
          ? "Already have an account?"
          : "Don't have an account?"}{" "}
        <Link to={`/${role}${mode === "Register" ? "login" : "register"}`}>
          {mode === "Register" ? "Log in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
};

export default Authentication;
