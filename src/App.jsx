import Home from "./Home"; 
import React from "react";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <Home />

      <div className="hero-container">
        <h1 className="hero-title">Welcome to Friendly Finds! 💗</h1>

        <p className="hero-desc">
          "Where Yesterday’s Finds Become Today’s Treasures." 🌿✨
        </p>
      </div>
    </>
  );
}


export default App;
