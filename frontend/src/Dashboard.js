import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    axios
      .get("http://localhost:5000/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
        if (err.response?.status === 401) {
          alert("Session expired, please log in again.");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          alert("Error loading dashboard. Please try again.");
        }
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {data.role === "admin" ? (
        <>
          <div className="stats-card">
            <h3>Total Users</h3>
            <p>{data.totalUsers}</p>
          </div>
          <div className="stats-card">
            <h3>Admin Count</h3>
            <p>{data.adminCount}</p>
          </div>
        </>
      ) : (
        <>
          <div className="stats-card">
            <h3>Email</h3>
            <p>{data.email}</p>
          </div>
          <div className="stats-card">
            <h3>Role</h3>
            <p>{data.role}</p>
          </div>
          <div className="stats-card">
            <h3>Joined</h3>
            <p>{data.created_at}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;