import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../App";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState(null);
  const { setMe } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const me = await api.post("/api/v1/registration", { user: form });
      setMe(me);
      navigate("/app/alumni-map");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="container">
      <h1>Create your account</h1>
      <p className="muted">Join the Erasmus+ NGO Hub network.</p>
      <form className="stack" onSubmit={submit}>
        <label>Your name <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
        <label>Email <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        <label>Password <input type="password" minLength="8" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
        <label style={{ fontWeight: "normal", display: "flex", alignItems: "flex-start", gap: 8 }}>
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            required
            style={{ width: "auto", marginTop: 4 }}
          />
          <span>
            I agree to the <Link to="/terms" target="_blank">Terms and Conditions</Link>
          </span>
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit" disabled={!accepted}>Create account</button>
        <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
        <p className="muted">Want to register your organization? You can do that after creating your account.</p>
      </form>
    </main>
  );
}
