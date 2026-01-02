import React from "react";
import Navbar from '../../Components/Navbar/Navbar';
import "./collection.css";

import BookImg from "../../Components/Assets/book.png";
import PaperholderImg from "../../Components/Assets/paperholder.png";
import DrafterImg from "../../Components/Assets/drafter.png";
import TscaleImg from "../../Components/Assets/Tscale.png";
import LampImg from "../../Components/Assets/lamp.png";
import SetSquareImg from "../../Components/Assets/setsquare.png";

const items = [
  { id: 1, label: "Like New", title: "Engineering Calculus (8th Ed)", price: 800, seller: "Sudha", image: BookImg },
  { id: 2, label: "New", title: "Paper Holder", price: 200, seller: "Retu Koju", image: PaperholderImg },
  { id: 3, label: "Used", title: "Drafter", price: 200, seller: "Ritu Koju", image: DrafterImg },
  { id: 4, label: "Used", title: "T-Scale", price: 200, seller: "Ritu Koju", image: TscaleImg },
  { id: 5, label: "Used", title: "Study Lamp", price: 200, seller: "Ritu Koju", image: LampImg },
  { id: 6, label: "Used", title: "Set Square", price: 200, seller: "Ritu Koju", image: SetSquareImg }
];

export default function Collection() {
  return (
    <>
      {/* Render Navbar at top */}
      <Navbar />

      <div className="stationary-page">

        {/* Header same style as furniture */}
        <header className="stationary-header">
          <div className="header-content">
            <h1>Stationery Marketplace</h1>
            <p>Buy & resell gently-used stationery and study materials</p>
          </div>
        </header>

        <div className="stationary-container">

          {/* Sidebar Filters */}
          <aside className="stationary-sidebar">
            <div className="filter-section">
              <h3>Price Range</h3>
              <input type="range" min="5" max="100" />
            </div>

            <div className="filter-section">
              <h3>Condition</h3>
              <label className="radio-label">
                <input type="checkbox" defaultChecked /> New / Unopened
              </label>
              <label className="radio-label">
                <input type="checkbox" /> Good
              </label>
              <label className="radio-label">
                <input type="checkbox" /> Fair
              </label>
            </div>

            <button className="apply-btn">Apply Filters</button>
          </aside>

          {/* Main Content */}
          <main className="stationary-main">
            <div className="results-header">
              <h2>Stationery Items</h2>
              <span className="results-count">{items.length} items</span>
            </div>

            <div className="stationary-grid">
              {items.map(item => (
                <div key={item.id} className="stationary-card">

                  <div className="card-image">
                    <img src={item.image} alt={item.title} />
                    {item.label && <span className="condition-badge">{item.label}</span>}
                  </div>

                  <div className="card-content">
                    <h3 className="item-name">{item.title}</h3>
                    <div className="item-price">Rs. {item.price}</div>
                    <div className="item-meta">
                      <div className="seller">👤 Seller: {item.seller}</div>
                    </div>
                    <div className="card-actions">
                      <button className="btn-contact">Contact Seller</button>
                      <button className="btn-favorite">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </main>

        </div>
      </div>
    </>
  );
}
