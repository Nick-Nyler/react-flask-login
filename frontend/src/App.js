import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Protected from "./Protected";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="nav-bar">
          <Link to="/">Login</Link> | <Link to="/signup">Signup</Link> | <Link to="/protected">Protected</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/protected" element={<Protected />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App