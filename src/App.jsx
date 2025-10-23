import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import NotesPage from "./pages/NotesPage";
import AboutPage from "./pages/AboutPage";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import "./App.css";

const App = () => {
  const isAuthenticated = () => {
    return localStorage.getItem("isLoggedIn") === "true";
  };

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LoginPage />} />  
          <Route path="/*" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/home" element={<NotesPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="*" element={<Navigate to="/home" />} />
                  </Routes>
                </main>
                <Footer />
              </>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;