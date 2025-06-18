import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Protected() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    axios
      .get("http://localhost:5000/protected", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.logged_in_as);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Protected page error:", err);
        if (err.response?.status === 401) {
          alert("Session expired, please log in again.");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          alert("Error accessing protected page. Please try again.");
        }
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <p>Loading protected content...</p>;
  
  return (
    <div>
      <h2>Protected Page</h2>
      {user ? (
        <p>You are logged in as: <strong>{user.email}</strong> (Role: <strong>{user.role}</strong>)</p>
      ) : (
        <p>Content is restricted.</p>
      )}
    </div>
  );
}

export default Protected;