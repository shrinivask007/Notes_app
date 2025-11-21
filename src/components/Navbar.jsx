import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser(); 
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    navigate("/");
    logout();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>📝 NotesApp</h1>
        </div>

        <nav className="nav-menu">
          <a href="/home" className="nav-link">Home</a>
          <a href="/about" className="nav-link">About App</a>
          {user && user.username === "shrinivas" && (
            <a href="/dash" className="nav-link">Dashboard</a>
          )}
        </nav>

        <div className="nav-auth">
          {user && (
            <div className="user-greeting">
              <span className="user-emoji">👤</span>
              <span className="greeting-text">{user.username}</span>
            </div>
          )}

          <button 
            className="auth-btn signup-btn" 
            onClick={handleLogout}
          >
            Logout
          </button>
          
          <button 
            className="dark-mode-btn"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;