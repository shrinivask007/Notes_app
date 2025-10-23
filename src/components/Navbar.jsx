import React, { useState} from "react";
import {useNavigate} from "react-router-dom";
import "./Navbar.css";


const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn","false");
    navigate("/");

  };

const [isDarkMode, setIsDarkMode] = useState(false);
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
          <a href="#contact" className="nav-link">Contact Us</a>
        </nav>

        <div className="nav-auth">
          
        <button 
            className="auth-btn signup-btn" 
            onClick={handleLogout}
          >Logout</button>
        <button 
        className="dark-mode-btn"
        onClick={toggleDarkMode}>
         {isDarkMode ? '☀️' : '🌙'}
        </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;