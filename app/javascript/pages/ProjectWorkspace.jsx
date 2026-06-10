import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { COUNTRIES, countryName } from "../constants";

function Tasks({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueOn, setDueOn] = useState("");

  const load = () => api.get(`/api/v1/projects/${projectId}/tasks`).then(setTasks);
  useEffect(() => { load(); }, [projectId]);

  const add = async (e) => {
    e.preventDefault();
    await api.post(`/api/v1/projects/${projectId}/tasks`, { task: { title, due_on: dueOn || null } });
    setTitle(""); setDueOn("");
    load();
  };

  const toggle = async (t) => {
    await api.patch(`/api/v1/projects/${projectId}/tasks/${t.id}`, { completed: !t.completed });
    load();
  };

  const remove = async (t) => {
    await api.delete(`/api/v1/projects/${projectId}/tasks/${t.id}`);
    load();
  };

  return (
    <>
      <form className="filters" onSubmit={add}>
        <input placeholder="New task…" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="date" value={dueOn} onChange={(e) => setDueOn(e.target.value)} />
        <button className="btn" type="submit">Add</button>
      </form>
      <ul className="clean">
        {tasks.map((t) => (
          <li className="card row" key={t.id}>
            <label style={{ fontWeight: "normal" }} className={t.completed ? "done" : ""}>
              <input type="checkbox" style={{ width: "auto" }} checked={t.completed} onChange={() => toggle(t)} />{" "}
              {t.title} {t.due_on && <span className="muted">· due {t.due_on}</span>}
            </label>
            <button className="btn danger" onClick={() => remove(t)}>Delete</button>
          </li>
        ))}
      </ul>
      {tasks.length === 0 && <p className="muted">No tasks yet.</p>}
    </>
  );
}

function Resources({ projectId }) {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ title: "", url: "" });

  const load = () => api.get(`/api/v1/projects/${projectId}/resources`).then(setResources);
  useEffect(() => { load(); }, [projectId]);

  const add = async (e) => {
    e.preventDefault();
    await api.post(`/api/v1/projects/${projectId}/resources`, { resource: { ...form, kind: "link" } });
    setForm({ title: "", url: "" });
    load();
  };

  return (
    <>
      <form className="filters" onSubmit={add}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="https://…" type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} required />
        <button className="btn" type="submit">Add link</button>
      </form>
      {resources.map((r) => (
        <div className="card row" key={r.id}>
          <span><a href={r.url} target="_blank" rel="noreferrer">{r.title}</a> <span className="muted">· added by {r.added_by}</span></span>
        </div>
      ))}
      {resources.length === 0 && <p className="muted">No shared links yet (infopacks, drive folders, dissemination materials…).</p>}
    </>
  );
}

function Roster({ projectId }) {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ full_name: "", email: "", notes: "" });

  const load = () => api.get(`/api/v1/projects/${projectId}/roster_entries`).then(setEntries);
  useEffect(() => { load(); }, [projectId]);

  const add = async (e) => {
    e.preventDefault();
    await api.post(`/api/v1/projects/${projectId}/roster_entries`, { roster_entry: form });
    setForm({ full_name: "", email: "", notes: "" });
    load();
  };

  const remove = async (entry) => {
    await api.delete(`/api/v1/projects/${projectId}/roster_entries/${entry.id}`);
    load();
  };

  return (
    <>
      <form className="filters" onSubmit={add}>
        <input placeholder="Participant name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
        <input placeholder="Email (optional)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Notes (dietary, etc.)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button className="btn" type="submit">Add participant</button>
      </form>
      {entries.map((entry) => (
        <div className="card row" key={entry.id}>
          <span>
            <strong>{entry.full_name}</strong> {entry.email && <span className="muted">· {entry.email}</span>}
            <span className="muted"> · sent by {entry.sending_org}</span>
            {entry.notes && <span className="muted"> · {entry.notes}</span>}
          </span>
          {entry.mine && <button className="btn danger" onClick={() => remove(entry)}>Remove</button>}
        </div>
      ))}
      {entries.length === 0 && <p className="muted">Roster is empty.</p>}
    </>
  );
}

function Partners({ project, reload }) {
  const [network, setNetwork] = useState([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (project.is_lead) api.get("/api/v1/organizations/network").then(setNetwork);
  }, [project.id]);

  const add = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post(`/api/v1/projects/${project.id}/partnerships`, { organization_id: selected });
      setSelected("");
      reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const available = network.filter((o) => !(project.partners || []).some((p) => p.id === o.id));

  return (
    <>
      {(project.partners || []).map((p) => (
        <div className="card" key={p.id}><strong>{p.name}</strong> <span className="muted">· {countryName(p.country)}</span></div>
      ))}
      {(project.partners || []).length === 0 && <p className="muted">No partner organizations added yet.</p>}
      {project.is_lead && (
        <form className="filters" onSubmit={add}>
          <select value={selected} onChange={(e) => setSelected(e.target.value)} required>
            <option value="">Add from your network…</option>
            {available.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
          <button className="btn" type="submit" disabled={!selected}>Add partner</button>
          {error && <p className="error">{error}</p>}
        </form>
      )}
    </>
  );
}

function Vacancies({ project }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", slots: 1, participant_profile: "", deadline: "", urgent: false, countries: [] });
  const [created, setCreated] = useState([]);
  const [error, setError] = useState(null);

  const create = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const v = await api.post(`/api/v1/projects/${project.id}/vacancies`, { vacancy: form });
      setCreated([...created, v]);
      setShowForm(false);
      setForm({ title: "", slots: 1, participant_profile: "", deadline: "", urgent: false, countries: [] });
    } catch (err) {
      setError(err.message);
    }
  };

  if (!project.is_lead) return <p className="muted">Only the lead organization posts vacancies for this project.</p>;

  return (
    <>
      <p className="muted">Posted vacancies appear on the shared <Link to="/app/vacancies">vacancy board</Link>.</p>
      {created.map((v) => (
        <div className="card" key={v.id}><Link to={`/app/vacancies/${v.id}`}>{v.title}</Link> <span className="badge open">posted</span></div>
      ))}
      {showForm ? (
        <div className="card">
          <form className="stack" onSubmit={create}>
            <label>Title <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. 2 participants from Portugal" /></label>
            <label>Slots <input type="number" min="1" value={form.slots} onChange={(e) => setForm({ ...form, slots: Number(e.target.value) })} /></label>
            <label>Participant profile <textarea rows="2" value={form.participant_profile} onChange={(e) => setForm({ ...form, participant_profile: e.target.value })} placeholder="Age range, language level, interests…" /></label>
            <label>Deadline <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></label>
            <label style={{ fontWeight: "normal" }}>
              <input type="checkbox" style={{ width: "auto" }} checked={form.urgent} onChange={(e) => setForm({ ...form, urgent: e.target.checked })} />{" "}
              Urgent (participant dropped out)
            </label>
            <label>Eligible sending countries (none = any)
              <select multiple value={form.countries} onChange={(e) => setForm({ ...form, countries: Array.from(e.target.selectedOptions, (o) => o.value) })}>
                {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
              </select>
            </label>
            {error && <p className="error">{error}</p>}
            <button className="btn" type="submit">Post vacancy</button>
          </form>
        </div>
      ) : (
        <button className="btn" onClick={() => setShowForm(true)}>Post a vacancy</button>
      )}
    </>
  );
}

export default function ProjectWorkspace() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tab, setTab] = useState("tasks");

  const load = () => api.get(`/api/v1/projects/${id}`).then(setProject);
  useEffect(() => { load(); }, [id]);

  if (!project) return null;

  const tabs = [
    ["tasks", "Tasks"], ["resources", "Links & files"], ["roster", "Roster"],
    ["partners", "Partners"], ["vacancies", "Vacancies"],
  ];

  return (
    <>
      <h1>{project.title} <span className="badge">{project.key_action}</span> <span className="badge">{project.status}</span></h1>
      <p className="muted">
        {countryName(project.venue_country)} · {project.starts_on} → {project.ends_on} ·{" "}
        {project.is_lead ? "your organization leads" : `led by ${project.lead.name}`}
      </p>

      <div className="tabs">
        {tabs.map(([key, label]) => (
          <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      {tab === "tasks" && <Tasks projectId={project.id} />}
      {tab === "resources" && <Resources projectId={project.id} />}
      {tab === "roster" && <Roster projectId={project.id} />}
      {tab === "partners" && <Partners project={project} reload={load} />}
      {tab === "vacancies" && <Vacancies project={project} />}
    </>
  );
}
