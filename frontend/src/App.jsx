import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar";
import Home from "./pages/home/Home";
import LoginSignup from "./pages/LoginSignup/LoginSignup";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      {/* ✅ Navbar visible only after login */}
      {isAuthenticated && <Navbar />}

      <Routes>
        {/* Login Page */}
        <Route
          path="/login"
          element={<LoginSignup setIsAuthenticated={setIsAuthenticated} />}
        />

        {/* Home Page (Protected) */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
