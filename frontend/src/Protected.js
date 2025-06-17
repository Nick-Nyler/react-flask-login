import React, { useEffect, useState } from "react";
import axios from "axios";

function Protected() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data.logged_in_as))
      .catch((err) => alert("Unauthorized"));
  }, []);

  return (
    <div>
      <h2>Protected Page</h2>
      {user ? (
        <p>
          Logged in as {user.email} (Role: {user.role})
        </p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Protected;