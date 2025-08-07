"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
  signedUpAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: User[] = await response.json();
        setUsers(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "50px auto", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>All Users</h1>
      {users.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>No users found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>ID</th>
              <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Display Name</th>
              <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Email</th>
              <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Signed Up At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.id}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.displayName || "N/A"}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.primaryEmail || "N/A"}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{new Date(user.signedUpAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}