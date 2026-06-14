import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../App";
import { COUNTRIES, KEY_ACTIONS, EXPERTISES } from "../constants";

export default function RegisterOrganization() {
  const { me, setMe } = useAuth();
  const navigate = useNavigate();
  const [org, setOrg] = useState({ name: "", country: "", oid: "", website: "", description: "", key_actions: [], expertises: [] });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const toggle = (field, value) =>
    setOrg((o) => ({
      ...o,
      [field]: o[field].includes(value) ? o[field].filter((v) => v !== value) : [...o[field], value],
    }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const updated = await api.post("/api/v1/organizations", { organization: org });
      setMe(updated);
      navigate("/app/waitlist");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // If user already has an org, redirect
  if (me?.organization) {
    navigate("/app/alumni-map", { replace: true });
    return null;
  }

  return (
    <main className="container">
      <h1>Register your organization</h1>
      <p className="muted">Registrations are reviewed before full access is granted (waitlist).</p>
      <form className="stack" onSubmit={submit}>
        <label>Organization name <input value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} required /></label>
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
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Register organization"}
        </button>
      </form>
    </main>
  );
}
