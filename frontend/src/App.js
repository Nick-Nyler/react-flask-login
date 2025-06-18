import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Navigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Protected from "./Protected";
import Dashboard from "./Dashboard";
import "./App.css";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="app-container">
      <nav className="nav-bar">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link> | <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/">Login</Link> | <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>
      <Routes>
        {/* Pass setIsAuthenticated to Login */}
        <Route path="/" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />
        
        <Route path="/protected" element={isAuthenticated ? <Protected /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        
        <Route path="*" element={<p>Page Not Found</p>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;