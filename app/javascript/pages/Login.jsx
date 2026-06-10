import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../App";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setMe } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const me = await api.post("/api/v1/session", { email, password });
      setMe(me);
      navigate(me.organization.status === "approved" ? "/app/directory" : "/app/waitlist");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="container">
      <h1>Log in</h1>
      <form className="stack" onSubmit={submit}>
        <label>Email <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Password <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit">Log in</button>
        <p className="muted">New organization? <Link to="/register">Register here</Link></p>
      </form>
    </main>
  );
}
