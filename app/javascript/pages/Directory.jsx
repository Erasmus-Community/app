import React, { useEffect, useState } from "react";
import { api } from "../api";
import { COUNTRIES, KEY_ACTIONS, EXPERTISES, countryName } from "../constants";

export default function Directory() {
  const [orgs, setOrgs] = useState([]);
  const [filters, setFilters] = useState({ q: "", country: "", key_action: "", expertise: "" });

  const load = async () => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    setOrgs(await api.get(`/api/v1/organizations?${params}`));
  };

  useEffect(() => { load(); }, [filters]);

  const connect = async (org) => {
    const message = window.prompt(`Message to ${org.name} (optional):`) ?? "";
    await api.post("/api/v1/connections", { addressee_id: org.id, message });
    load();
  };

  return (
    <>
      <h1>Partner directory</h1>
      <div className="filters">
        <input placeholder="Search name or description…" value={filters.q}
               onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <select value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })}>
          <option value="">All countries</option>
          {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
        </select>
        <select value={filters.key_action} onChange={(e) => setFilters({ ...filters, key_action: e.target.value })}>
          <option value="">All key actions</option>
          {KEY_ACTIONS.map((ka) => <option key={ka} value={ka}>{ka}</option>)}
        </select>
        <select value={filters.expertise} onChange={(e) => setFilters({ ...filters, expertise: e.target.value })}>
          <option value="">All expertise</option>
          {EXPERTISES.map((ex) => <option key={ex} value={ex}>{ex}</option>)}
        </select>
      </div>

      {orgs.map((org) => (
        <div className="card" key={org.id}>
          <div className="row">
            <div>
              <strong>{org.name}</strong> <span className="muted">· {countryName(org.country)}</span>
              <div>
                {org.key_actions.map((ka) => <span className="badge" key={ka}>{ka}</span>)}{" "}
                {org.expertises.map((ex) => <span className="badge" key={ex}>{ex}</span>)}
              </div>
              {org.description && <p className="muted">{org.description}</p>}
              {org.members && (
                <p className="muted">
                  Contacts: {org.members.map((m) => `${m.name} <${m.email}>`).join(", ")}
                </p>
              )}
            </div>
            <div>
              {!org.connection && <button className="btn" onClick={() => connect(org)}>Connect</button>}
              {org.connection?.status === "pending" && <span className="badge pending">Pending</span>}
              {org.connection?.status === "accepted" && <span className="badge open">Connected</span>}
            </div>
          </div>
        </div>
      ))}
      {orgs.length === 0 && <p className="muted">No organizations match these filters.</p>}
    </>
  );
}
