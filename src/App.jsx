import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import NotesPage from "./pages/NotesPage";
import AboutPage from "./pages/AboutPage";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { UserProvider, useUser } from "./context/UserContext";
import "./App.css"; 

// Protected Route component using User Context
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUser();
  return isAuthenticated ? children : <Navigate to="/" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useUser(); 
  const isAdmin = user?.username === "shrinivas";
  return isAdmin ? children : <Navigate to="/home" />;
};

// Main App component
const AppContent = () => {
  const { isAuthenticated } = useUser(); // ADD THIS

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route 
            path="/" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/home" />} 
          />  
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/home" element={<NotesPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route 
                        path="/dash" 
                        element={
                          <AdminRoute>
                            <DashboardPage />
                          </AdminRoute>
                        } 
                      />
                      <Route path="*" element={<Navigate to="/home" />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

// Wrap the entire app with UserProvider
const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;