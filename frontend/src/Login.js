import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Accept setIsAuthenticated as a prop
function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
      setError("Please enter a valid email address.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      
      // Crucial: Update the state in the parent App component
      setIsAuthenticated(true); 

      // Alert (optional, as you're navigating immediately)
      // alert(res.data.message); 

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data.message || "Login failed. Please check your credentials.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="auth-form">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <input 
        type="email"
        placeholder="Email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)} 
        required 
        minLength="6"
      />
      <button type="submit" disabled={loading}>
        {loading ? "Logging In..." : "Log In"}
      </button>
    </form>
  );
}

export default Login;