import React from "react";
import "./collection.css";
import BookImg from "../../Components/Assets/book.png";
import PaperholderImg from "../../Components/Assets/paperholder.png";
import DrafterImg from "../../Components/Assets/drafter.png";
import TscaleImg from "../../Components/Assets/Tscale.png";
import LampImg from "../../Components/Assets/lamp.png";
import SetSquareImg from "../../Components/Assets/setsquare.png";

// Your stationery items
const items = [
  {
    id: 1,
    label: "Like New",
    title: "Engineering Calculus Textbook (8th Ed)",
    price: "RS 800",
    seller: "Sudha",
    image: BookImg
  },
  {
    id: 2,
    label: "New",
    title: "Paper Holder",
    price: "RS 200",
    seller: "Retu Koju",
    image: PaperholderImg
  },
  {
    id: 3,
    label: "Used",
    title: "Drafter",
    price: "RS 200",
    seller: "Ritu Koju",
    image: DrafterImg
  },
   {
    id: 4,
    label: "Used",
    title: "Tscale",
    price: "RS 200",
    seller: "Ritu Koju",
    image: TscaleImg
  },
   {
    id: 5,
    label: "Used",
    title: "Lamp",
    price: "RS 200",
    seller: "Ritu Koju",
    image: LampImg
  },{
    id: 6,
    label: "Used",
    title: "Set Square",
    price: "RS 200",
    seller: "Ritu Koju",
    image: SetSquareImg
  }
];

export default function Collection() {
  return (
    <div className="collection-page">

      {/* Sidebar Filters */}
      <aside className="filters">
        <h3>Filters</h3>
        <p className="filter-title">Price Range</p>
        <input type="range" min="5" max="100" />
        <p className="filter-title">Condition</p>
        <label><input type="checkbox" defaultChecked /> New / Unopened</label>
        <label><input type="checkbox" /> Good</label>
        <label><input type="checkbox" /> Fair</label>
        <button className="apply-btn">Apply Filters</button>
      </aside>

      {/* Items Grid */}
      <main className="items-area">
        <h2>Stationery & School Supplies</h2>
        <p className="subtitle">Browsing {items.length} items</p>

        <div className="grid">
          {items.map(item => (
            <div key={item.id} className="card">
              <img src={item.image} alt={item.title} />
              {item.label && <span className="badge">{item.label}</span>}
              <h4>{item.title}</h4>
              <div className="price-row">
                <strong>{item.price}</strong>
                <small>{item.seller}</small>
              </div>
              <button className="contact-btn">Contact Seller</button>
            </div>
          ))}
        </div>
      </main>

    </div>
  );
}
