import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { countryName } from "../constants";

export default function PublicVacancy() {
  const { token } = useParams();
  const [v, setV] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/api/v1/public/vacancies/${token}`).then(setV).catch((e) => setError(e.message));
  }, [token]);

  if (error) return <main className="container"><p className="error">{error}</p></main>;
  if (!v) return null;

  return (
    <main className="container">
      <h1>{v.urgent && <span className="badge urgent">URGENT</span>} {v.title}</h1>
      <div className="card">
        <p><strong>{v.project.title}</strong> · {countryName(v.project.venue_country)} · {v.project.starts_on} → {v.project.ends_on}</p>
        <p className="muted">Hosted by {v.project.organization_name}</p>
        <p>{v.participant_profile || "No specific participant profile."}</p>
        <p className="muted">{v.slots} slot(s){v.deadline ? ` · apply by ${v.deadline}` : ""}</p>
        <p className="muted">Interested? Contact the sending organization that shared this link with you.</p>
      </div>
    </main>
  );
}
