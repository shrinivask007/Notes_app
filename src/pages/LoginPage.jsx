import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ulid } from "ulid";
import { useUser } from "../context/UserContext"; 
import "./LoginPage.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { setUserData } = useUser();

  const encrypt = (input) => {
    return btoa(input);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {

      const token = `X${ulid()}`;      
      console.log("Generated token:", token);
      
      const preValidateResponse = await fetch(`https://dev.cloudio.io/v1/x`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Application': 'SignIn',
          'Content-Type': 'application/json',
          'X-Token': token,
        },
        body: JSON.stringify({ x: token }),
      });

      if (!preValidateResponse.ok) {
        const text = await preValidateResponse.text();
        throw new Error(`Pre-validation failed: ${text}`);
      }

      const preValidateData = await preValidateResponse.json();
      const xToken = preValidateData.x;
      
      console.log("Received x-token:", xToken);


      const authResponse = await fetch(`https://dev.cloudio.io/v1/auth`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Application': 'SignIn',
          'Content-Type': 'application/json',
          'X-Token': `${token}${xToken}`,
        },
        body: JSON.stringify({
          un: encrypt(username.trim()),
          pw: encrypt(password.trim()),
          is_admin_url: false,
          is_native_login: true,
        })
      });

      const authData = await authResponse.json();
      console.log("Auth response:", authData);
      
      if (authData.status === 'OK') {
        const userData = {
          username: username,
          id: username,
          jwt: authData.jwt,
          token: token,
          x: authData.x
        };

        setUserData(userData);
        
        setError("");
        navigate("/home");
      } else {
        throw new Error(authData.message || "Login failed");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome to NotesApp</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={loading}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;