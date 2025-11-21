import React, { createContext, useContext, useState, useEffect } from "react";
import { logoutUser } from "../api/cloudioService"; 

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

 
  useEffect(() => {
    const storedUser = sessionStorage.getItem('userData');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        sessionStorage.removeItem('userData');
      }
    }
    setIsLoading(false); 
  }, []);

  const setUserData = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    sessionStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      if (user?.x) {
        await logoutUser(user);
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      sessionStorage.removeItem('userData');
    }
  };

  const value = {
    user,
    isAuthenticated,
    setUserData,
    logout,
    isLoading 
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};