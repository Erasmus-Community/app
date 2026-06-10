import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { KEY_ACTIONS, PROJECT_TYPES, COUNTRIES, countryName } from "../constants";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", key_action: "KA1", project_type: "youth_exchange", venue_country: "", starts_on: "", ends_on: "", description: "" });
  const [error, setError] = useState(null);

  const load = () => api.get("/api/v1/projects").then(setProjects);
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/api/v1/projects", { project: form });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="row">
        <h1>My projects</h1>
        <button className="btn" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "New project"}</button>
      </div>

      {showForm && (
        <div className="card">
          <form className="stack" onSubmit={create}>
            <label>Title <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
            <label>Key action
              <select value={form.key_action} onChange={(e) => setForm({ ...form, key_action: e.target.value })}>
                {KEY_ACTIONS.map((ka) => <option key={ka} value={ka}>{ka}</option>)}
              </select>
            </label>
            <label>Type
              <select value={form.project_type} onChange={(e) => setForm({ ...form, project_type: e.target.value })}>
                {PROJECT_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <label>Venue country
              <select value={form.venue_country} onChange={(e) => setForm({ ...form, venue_country: e.target.value })}>
                <option value="">Select…</option>
                {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
              </select>
            </label>
            <label>Start <input type="date" value={form.starts_on} onChange={(e) => setForm({ ...form, starts_on: e.target.value })} /></label>
            <label>End <input type="date" value={form.ends_on} onChange={(e) => setForm({ ...form, ends_on: e.target.value })} /></label>
            <label>Description <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            {error && <p className="error">{error}</p>}
            <button className="btn" type="submit">Create project</button>
          </form>
        </div>
      )}

      {projects.map((p) => (
        <div className="card row" key={p.id}>
          <div>
            <strong><Link to={`/app/projects/${p.id}`}>{p.title}</Link></strong>{" "}
            <span className="badge">{p.key_action}</span> <span className="badge">{p.status}</span>
            <p className="muted">
              {countryName(p.venue_country)} · {p.starts_on} → {p.ends_on} ·{" "}
              {p.is_lead ? "Lead organization" : `Led by ${p.lead.name}`}
            </p>
          </div>
          <Link className="btn secondary" to={`/app/projects/${p.id}`}>Open workspace</Link>
        </div>
      ))}
      {projects.length === 0 && !showForm && <p className="muted">No projects yet. Create one to start recruiting participants and collaborating with partners.</p>}
    </>
  );
}
