  import React from "react";
  import "./Navbar.css";
  import logo from "../Assets/logo.png";
  import cart_icon from "../Assets/cart_icon.png";

  const Navbar = () => {
    return (
      <nav className="navbar">
        <div className="nav-logo">
          <img src={logo} alt="logo" />
        </div>

        <ul className="nav-menu">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
          <li>
            <img src={cart_icon} alt="cart" className="cart-icon" />
            

          </li>
        </ul>

        <button className="login-btn">Login</button>
      </nav>
    );
  };

  export default Navbar;
