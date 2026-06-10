import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../App";
import { COUNTRIES, KEY_ACTIONS, EXPERTISES } from "../constants";

export default function Register() {
  const [org, setOrg] = useState({ name: "", country: "", oid: "", website: "", description: "", key_actions: [], expertises: [] });
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const { setMe } = useAuth();
  const navigate = useNavigate();

  const toggle = (field, value) =>
    setOrg((o) => ({
      ...o,
      [field]: o[field].includes(value) ? o[field].filter((v) => v !== value) : [...o[field], value],
    }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const me = await api.post("/api/v1/registration", { organization: org, user });
      setMe(me);
      navigate("/app/waitlist");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="container">
      <h1>Register your NGO</h1>
      <p className="muted">Registrations are reviewed before access is granted (waitlist).</p>
      <form className="stack" onSubmit={submit}>
        <h3>Organization</h3>
        <label>Name <input value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} required /></label>
        <label>Country
          <select value={org.country} onChange={(e) => setOrg({ ...org, country: e.target.value })} required>
            <option value="">Select…</option>
            {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </label>
        <label>Erasmus+ OID <input value={org.oid} onChange={(e) => setOrg({ ...org, oid: e.target.value })} placeholder="E10000000" /></label>
        <label>Website <input value={org.website} onChange={(e) => setOrg({ ...org, website: e.target.value })} /></label>
        <label>Description <textarea rows="3" value={org.description} onChange={(e) => setOrg({ ...org, description: e.target.value })} /></label>
        <fieldset>
          <legend>Key actions of interest</legend>
          {KEY_ACTIONS.map((ka) => (
            <label key={ka} style={{ fontWeight: "normal" }}>
              <input type="checkbox" style={{ width: "auto" }} checked={org.key_actions.includes(ka)} onChange={() => toggle("key_actions", ka)} /> {ka}
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Fields of expertise</legend>
          {EXPERTISES.map((ex) => (
            <label key={ex} style={{ fontWeight: "normal" }}>
              <input type="checkbox" style={{ width: "auto" }} checked={org.expertises.includes(ex)} onChange={() => toggle("expertises", ex)} /> {ex}
            </label>
          ))}
        </fieldset>
        <h3>Your account</h3>
        <label>Your name <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} required /></label>
        <label>Email <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} required /></label>
        <label>Password <input type="password" minLength="8" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} required /></label>
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit">Join the waitlist</button>
        <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </main>
  );
}
