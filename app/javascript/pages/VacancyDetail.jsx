import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { countryName } from "../constants";

export default function VacancyDetail() {
  const { id } = useParams();
  const [v, setV] = useState(null);
  const [interest, setInterest] = useState({ participant_count: 1, message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const load = () => api.get(`/api/v1/vacancies/${id}`).then(setV);
  useEffect(() => { load(); }, [id]);

  if (!v) return null;

  const express = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post(`/api/v1/vacancies/${id}/interests`, interest);
      setSent(true);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const respond = async (interestId, status) => {
    await api.patch(`/api/v1/vacancies/${id}/interests/${interestId}`, { status });
    load();
  };

  const markFilled = async () => {
    await api.patch(`/api/v1/vacancies/${id}`, { vacancy: { status: "filled" } });
    load();
  };

  const publicUrl = v.public_token ? `${window.location.origin}/v/${v.public_token}` : null;

  return (
    <>
      <h1>
        {v.urgent && <span className="badge urgent">URGENT</span>} {v.title}{" "}
        <span className={`badge ${v.status === "open" ? "open" : ""}`}>{v.status}</span>
      </h1>
      <div className="card">
        <p><strong>{v.project.title}</strong> · {countryName(v.project.venue_country)} · {v.project.starts_on} → {v.project.ends_on}</p>
        <p className="muted">Hosted by {v.project.organization.name} ({countryName(v.project.organization.country)})</p>
        <p>{v.participant_profile || "No specific participant profile."}</p>
        <p className="muted">
          {v.slots} slot(s){v.deadline ? ` · apply by ${v.deadline}` : ""}
          {v.countries.length > 0 ? ` · sending countries: ${v.countries.map(countryName).join(", ")}` : ""}
        </p>
        {publicUrl && (
          <p className="muted">Shareable public link: <a href={publicUrl}>{publicUrl}</a></p>
        )}
      </div>

      {v.mine ? (
        <>
          <div className="row">
            <h2>Interest from organizations</h2>
            {v.status === "open" && <button className="btn" onClick={markFilled}>Mark as filled</button>}
          </div>
          {(v.interests || []).map((i) => (
            <div className="card row" key={i.id}>
              <div>
                <strong>{i.organization.name}</strong> <span className="muted">· {countryName(i.organization.country)} · {i.participant_count} participant(s)</span>
                {i.message && <p className="muted">"{i.message}"</p>}
              </div>
              <div>
                {i.status === "pending" ? (
                  <>
                    <button className="btn" onClick={() => respond(i.id, "accepted")}>Accept</button>{" "}
                    <button className="btn secondary" onClick={() => respond(i.id, "declined")}>Decline</button>
                  </>
                ) : (
                  <span className="badge">{i.status}</span>
                )}
              </div>
            </div>
          ))}
          {(v.interests || []).length === 0 && <p className="muted">No interest expressed yet.</p>}
        </>
      ) : (
        v.status === "open" && (
          <div className="card">
            <h2>Send participants</h2>
            {sent ? (
              <p>Interest sent — the hosting organization will get back to you.</p>
            ) : (
              <form className="stack" onSubmit={express}>
                <label>Number of participants
                  <input type="number" min="1" value={interest.participant_count}
                         onChange={(e) => setInterest({ ...interest, participant_count: Number(e.target.value) })} />
                </label>
                <label>Message
                  <textarea rows="3" value={interest.message}
                            onChange={(e) => setInterest({ ...interest, message: e.target.value })} />
                </label>
                {error && <p className="error">{error}</p>}
                <button className="btn" type="submit">Express interest</button>
              </form>
            )}
          </div>
        )
      )}
    </>
  );
}
