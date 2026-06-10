import React, { useEffect, useState } from "react";
import { api } from "../api";
import { countryName } from "../constants";

export default function Connections() {
  const [connections, setConnections] = useState([]);

  const load = async () => setConnections(await api.get("/api/v1/connections"));
  useEffect(() => { load(); }, []);

  const respond = async (id, status) => {
    await api.patch(`/api/v1/connections/${id}`, { status });
    load();
  };

  const pendingIncoming = connections.filter((c) => c.status === "pending" && !c.requested_by_me);
  const pendingOutgoing = connections.filter((c) => c.status === "pending" && c.requested_by_me);
  const accepted = connections.filter((c) => c.status === "accepted");

  return (
    <>
      <h1>My network</h1>

      {pendingIncoming.length > 0 && (
        <>
          <h2>Requests to review</h2>
          {pendingIncoming.map((c) => (
            <div className="card row" key={c.id}>
              <div>
                <strong>{c.organization.name}</strong> <span className="muted">· {countryName(c.organization.country)}</span>
                {c.message && <p className="muted">"{c.message}"</p>}
              </div>
              <div>
                <button className="btn" onClick={() => respond(c.id, "accepted")}>Accept</button>{" "}
                <button className="btn secondary" onClick={() => respond(c.id, "declined")}>Decline</button>
              </div>
            </div>
          ))}
        </>
      )}

      <h2>Connected organizations</h2>
      {accepted.map((c) => (
        <div className="card" key={c.id}>
          <strong>{c.organization.name}</strong> <span className="muted">· {countryName(c.organization.country)}</span>
          {c.organization.members && (
            <p className="muted">Contacts: {c.organization.members.map((m) => `${m.name} <${m.email}>`).join(", ")}</p>
          )}
        </div>
      ))}
      {accepted.length === 0 && <p className="muted">No connections yet — find partners in the directory.</p>}

      {pendingOutgoing.length > 0 && (
        <>
          <h2>Sent requests</h2>
          {pendingOutgoing.map((c) => (
            <div className="card" key={c.id}>
              <strong>{c.organization.name}</strong> <span className="badge pending">pending</span>
            </div>
          ))}
        </>
      )}
    </>
  );
}
