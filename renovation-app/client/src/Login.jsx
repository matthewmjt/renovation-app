// client/src/Login.jsx
import { useState } from "react";
import { api } from "./api.js";

export default function Login({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await api.auth.login(password);
      onLogin();
    } catch {
      setError("Incorrect password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAF8", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ width: 340, padding: 40, background: "white", borderRadius: 16, border: "1px solid #EEEBE6", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, marginBottom: 6 }}>Renovation</h1>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 28 }}>Enter your password to continue.</p>
        <form onSubmit={submit}>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", fontSize: 14, border: "1px solid #DEDBD6", borderRadius: 8, outline: "none", marginBottom: 10, fontFamily: "inherit" }}
          />
          {error && <div style={{ fontSize: 12, color: "#E53935", marginBottom: 10 }}>{error}</div>}
          <button type="submit" disabled={loading || !password}
            style={{ width: "100%", padding: "10px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "inherit" }}>
            {loading ? "Checking…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
