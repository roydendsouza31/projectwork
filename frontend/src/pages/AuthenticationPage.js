import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authUser } from "../redux/userHandle";
import styled from "styled-components";
import Popup from "../components/Popup";
import "./AuthenticationPage.css"

const Authentication = ({ mode, role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, error, currentRole } = useSelector(
    (state) => state.user
  );

  const [toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [userNameError, setUserNameError] = useState(false);
  const [shopNameError, setShopNameError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    console.log(email, password);
    if (!email || !password) {
      if (!email) setEmailError(true);
      if (!password) setPasswordError(true);
      return;
    }
    if (mode === "Register") {
      const name = event.target.userName.value;
      if (!name) {
        if (!name) setUserNameError(true);
        return;
      }
      if (role === "Seller") {
        const shopName = event.target.shopName.value;
        if (!shopName) {
          if (!shopName) setShopNameError(true);
          return;
        }
        const sellerFields = { name, email, password, role, shopName };
        dispatch(authUser(sellerFields, role, mode));
      } else {
        const customerFields = { name, email, password, role };
        dispatch(authUser(customerFields, role, mode));
      }
    } else if (mode === "Login") {
      const fields = { email, password };
      dispatch(authUser(fields, role, mode));
    }
    setLoader(true);
  };

  const handleInputChange = (event) => {
    const { name } = event.target;
    if (name === "email") setEmailError(false);
    if (name === "password") setPasswordError(false);
    if (name === "userName") setUserNameError(false);
    if (name === "shopName") setShopNameError(false);
  };

  useEffect(() => {
    if (status === "success" && currentRole !== null) {
      navigate("/");
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, currentUser, currentRole, navigate, error, response]);

  return (
    <>
      <div className="container">
        <div className="form-container">
          <h1 className="form-heading">{role} {mode}</h1>
          {role === "Seller" && mode === "Register" && (
            <p className="form-text">Create your own shop by registering as a seller. You will be able to add products and sell them.</p>
          )}
          {role === "Customer" && mode === "Register" && (
            <p className="form-text">Register now to explore and buy products.</p>
          )}
          {mode === "Login" && (
            <p className="form-text">Welcome back! Please enter your details.</p>
          )}
          <form onSubmit={handleSubmit} className="form">
            {mode === "Register" && (
              <input
                type="text"
                name="userName"
                placeholder="Enter your name"
                className={userNameError ? "error" : ""}
                onChange={handleInputChange}
              />
            )}
            {mode === "Register" && role === "Seller" && (
              <input
                type="text"
                name="shopName"
                placeholder="Create your shop name"
                className={shopNameError ? "error" : ""}
                onChange={handleInputChange}
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className={emailError ? "error" : ""}
              onChange={handleInputChange}
            />
            <input
              type={toggle ? "text" : "password"}
              name="password"
              placeholder="Password"
              className={passwordError ? "error" : ""}
              onChange={handleInputChange}
            />
            <div className="password-toggle">
              <input
                type="checkbox"
                id="show-password"
                onChange={() => setToggle(!toggle)}
              />
              <label htmlFor="show-password">Show Password</label>
            </div>
            <button type="submit" className="form-button">
              {loader ? <span>Loading...</span> : mode}
            </button>
            <div className="form-links">
              {mode === "Register"
                ? "Already have an account?"
                : "Don't have an account?"}
              <Link to={mode === "Register" ? `/${role}login` : `/${role}register`}>{mode === "Register" ? "Log in" : "Sign up"}</Link>
            </div>
          </form>
        </div>
      </div>
      {showPopup && <Popup message={message} setShowPopup={setShowPopup} />}
    </>
  );
};

export default Authentication;
