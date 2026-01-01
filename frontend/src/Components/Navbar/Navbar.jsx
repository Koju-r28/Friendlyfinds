import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import search_icon from "../Assets/Search_Icon.png";

const Navbar = () => {
  const [search,setSearch]=useState("");
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo">
        <NavLink to="/">
          <img src={logo} alt="logo" />
        </NavLink>
      </div>

      {/* Menu */}
      <ul className="nav-menu">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>

        <li>
          <NavLink to="/collections">Collections</NavLink>
        </li>

        <li>
          <NavLink to="/contact">Contact</NavLink>
        </li>

        <li>
          <NavLink to="/collections">
            <img src={cart_icon} alt="cart" className="cart-icon" />
          </NavLink>
        </li>
      </ul>
       {/* Search */}
      <div className="nav-search">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>
          <img src={search_icon} alt="search" />
        </button>
      </div>

      {/* Login Button */}
      <NavLink to="/login">
        <button className="login-btn">Login</button>
      </NavLink>
    </nav>
  );
};

export default Navbar;
