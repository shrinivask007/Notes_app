import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>📝 NotesApp</h1>
        </div>

        <nav className="nav-menu">
          <a href="/" className="nav-link">Home</a>
          <a href="/about" className="nav-link">About App</a>
          <a href="#contact" className="nav-link">Contact Us</a>
        </nav>

        <div className="nav-auth">
          <button className="auth-btn login-btn">Login</button>
          <button className="auth-btn signup-btn">Sign Up</button>
        </div>
      </div>
    </header>
  );
};

export default Header;