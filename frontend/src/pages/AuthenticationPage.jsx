import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authUser } from "../redux/userHandle";
import "./AuthenticationPage.css";
import Popup from "../components/Popup";

const AuthenticationPage = ({ mode, role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, error, currentRole } = useSelector(
    (state) => state.user
  );

  const [toggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !password) {
      return;
    }

    if (mode === "Register") {
      if (!name || (role === "Seller" && !shopName)) {
        return;
      }

      const fields =
        role === "Seller"
          ? { name, email, password, role, shopName }
          : { name, email, password, role };
      dispatch(authUser(fields, role, mode));
    } else if (mode === "Login") {
      const fields = { email, password };
      dispatch(authUser(fields, role, mode));
    }
    setLoader(true);
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
      <div class="container">
        <form onSubmit={handleSubmit}>
          <h4 class="heading">
            {role} {mode}
          </h4>

          {role === "Seller" && mode === "Register" && (
            <p class="paragraph">
              Create your own shop by registering as an seller.
              <br />
              You will be able to add products and sell them.
            </p>
          )}

          {role === "Customer" && mode === "Register" && (
            <p class="paragraph">Register now to explore and buy products.</p>
          )}

          {mode === "Login" && (
            <p class="paragraph">Welcome back! Please enter your details</p>
          )}

          {mode === "Register" && (
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {mode === "Register" && role === "Seller" && (
            <input
              type="text"
              placeholder="Create your shop name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type={toggle ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label class="checkbox-label">
            <input type="checkbox" />
            Remember me
          </label>
          <button type="submit">{loader ? "Loading..." : mode}</button>
          <div class="grid">
            {mode === "Register"
              ? "Already have an account?"
              : "Don't have an account?"}
            <Link
              to={mode === "Register" ? `/${role}login` : `/${role}register`}
            >
              {mode === "Register" ? "Log in" : "Sign up"}
            </Link>
          </div>
        </form>
      </div>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default AuthenticationPage;
