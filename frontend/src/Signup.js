import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
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
      const res = await axios.post("http://localhost:5000/signup", { email, password, role });
      alert(res.data.message + " You can now log in.");
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.response?.data.message || "Signup failed. Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="auth-form">
      <h2>Signup</h2>
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
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
}

export default Signup;