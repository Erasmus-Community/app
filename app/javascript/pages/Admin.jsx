import React, { useEffect, useState } from "react";
import { api } from "../api";
import { countryName } from "../constants";

export default function Admin() {
  const [orgs, setOrgs] = useState([]);
  const [status, setStatus] = useState("waitlisted");

  const load = () => api.get(`/api/v1/admin/organizations?status=${status}`).then(setOrgs);
  useEffect(() => { load(); }, [status]);

  const act = async (id, action) => {
    await api.patch(`/api/v1/admin/organizations/${id}/${action}`);
    load();
  };

  return (
    <>
      <h1>Admin — organization waitlist</h1>
      <div className="filters">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="waitlisted">Waitlisted</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      {orgs.map((o) => (
        <div className="card row" key={o.id}>
          <div>
            <strong>{o.name}</strong> <span className="muted">· {countryName(o.country)} · OID: {o.oid || "—"}</span>
            {o.website && <span className="muted"> · <a href={o.website} target="_blank" rel="noreferrer">{o.website}</a></span>}
            {o.description && <p className="muted">{o.description}</p>}
            {o.members && <p className="muted">Contact: {o.members.map((m) => `${m.name} <${m.email}>`).join(", ")}</p>}
          </div>
          {status === "waitlisted" && (
            <div>
              <button className="btn" onClick={() => act(o.id, "approve")}>Approve</button>{" "}
              <button className="btn danger" onClick={() => act(o.id, "reject")}>Reject</button>
            </div>
          )}
        </div>
      ))}
      {orgs.length === 0 && <p className="muted">Nothing here.</p>}
    </>
  );
}
