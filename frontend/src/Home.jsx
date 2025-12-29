import React from "react";
import "./home.css";
import hero from "./components/Assets/hero.png";
import img1 from "./components/Assets/img1.jpg";
import img2 from "./components/Assets/img2.jpg";


const Home = () => {
  return (
    <div className="cute-home">
      <section className="cute-hero">
        <div className="cute-hero-text">
          <h1>Welcome 👋</h1>
          <p>Your cute & aesthetic space on the web</p>
          <button className="cute-btn">Start Exploring</button>
        </div>
        <img src={hero} className="cute-hero-img" alt="Hero" />
      </section>

      <section className="cute-section">
        <h2 className="cute-title">Cute Collections ✨</h2>

        <div className="cute-cards">
          <div className="cute-card">
            <img src={img1} alt="Soft Pastel" />
            <h3>Soft Pastel</h3>
          </div>

          <div className="cute-card">
            <img src={img2} alt="Aesthetic Mood" />
            <h3>Aesthetic Mood</h3>
          </div>

          <div className="cute-card">
            <img src={hero} alt="Minimal Art" />
            <h3>Minimal Art</h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
