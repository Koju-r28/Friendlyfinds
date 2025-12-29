import React, { useState } from "react";
import "./LoginSignup.css";

import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";

const LoginSignup = () => {
  const [action, setAction] = useState("Sign Up");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 SIGNUP API CALL
  const handleSignup = () => {
    fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
      })
      .catch(err => {
        console.error(err);
        alert("Signup failed");
      });
  };

  // 🔹 LOGIN API CALL
  const handleLogin = () => {
    fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
      })
      .catch(err => {
        console.error(err);
        alert("Login failed");
      });
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        {action === "Sign Up" && (
          <div className="input">
            <img src={user_icon} alt="" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
        )}

        <div className="input">
          <img src={email_icon} alt="" />
          <input
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="input">
          <img src={password_icon} alt="" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
      </div>

      {action === "Login" && (
        <div className="forgot-password">
          Lost Password? <span>Click Here!</span>
        </div>
      )}

      <div className="submit-container">
        <div
          className={action === "Login" ? "submit gray" : "submit"}
          onClick={() => {
            setAction("Sign Up");
            handleSignup();
          }}
        >
          Sign Up
        </div>

        <div
          className={action === "Sign Up" ? "submit gray" : "submit"}
          onClick={() => {
            setAction("Login");
            handleLogin();
          }}
        >
          Login
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
