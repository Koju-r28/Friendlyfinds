import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";

const LoginSignup = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const handleAuth = () => {
    // No API for now (frontend only)
    setIsAuthenticated(true);
    navigate("/");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <h1>
          Turn your old <br />
          Goods into <span>new possibilities.</span>
        </h1>
        <p>
          Join the most trusted student marketplace inside your University.
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Get Started</h2>

          <div className="auth-tabs">
            <button
              className={!isLogin ? "active" : ""}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
            <button
              className={isLogin ? "active" : ""}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
          </div>

          {!isLogin && <input type="text" placeholder="Full Name" />}
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />

          <button className="primary-btn" onClick={handleAuth}>
            {isLogin ? "Login" : "Create Account →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
