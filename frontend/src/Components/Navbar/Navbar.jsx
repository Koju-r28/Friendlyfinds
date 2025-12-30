import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../Assets/logo.png";

const Navbar = () => {
  const [search, setSearch] = useState("");

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
      </ul>

      {/* Search */}
      <div className="nav-search">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>🔍</button>
      </div>

      {/* Cart and Login */}
      <div className="nav-actions">
        <NavLink to="/cart" className="cart-link">
          🛒
        </NavLink>
        
        <NavLink to="/login">
          <button className="login-btn">Login</button>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;