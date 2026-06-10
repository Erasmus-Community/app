import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { COUNTRIES, countryName } from "../constants";

export default function VacancyBoard() {
  const [vacancies, setVacancies] = useState([]);
  const [filters, setFilters] = useState({ urgent: "", country: "" });

  useEffect(() => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    api.get(`/api/v1/vacancies?${params}`).then(setVacancies);
  }, [filters]);

  return (
    <>
      <h1>Participant vacancies</h1>
      <p className="muted">Open slots in approved projects. Urgent vacancies (dropouts) appear first. Post vacancies from a project page.</p>
      <div className="filters">
        <label style={{ fontWeight: "normal" }}>
          <input type="checkbox" style={{ width: "auto" }} checked={filters.urgent === "true"}
                 onChange={(e) => setFilters({ ...filters, urgent: e.target.checked ? "true" : "" })} /> Urgent only
        </label>
        <select value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })}>
          <option value="">Sending from any country</option>
          {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
        </select>
      </div>

      {vacancies.map((v) => (
        <div className="card" key={v.id}>
          <div className="row">
            <div>
              {v.urgent && <span className="badge urgent">URGENT</span>}{" "}
              <strong><Link to={`/app/vacancies/${v.id}`}>{v.title}</Link></strong>
              <p className="muted">
                {v.project.title} · {countryName(v.project.venue_country)} ·{" "}
                {v.project.starts_on} → {v.project.ends_on} · by {v.project.organization.name}
              </p>
              <p className="muted">
                {v.slots} slot(s){v.deadline ? ` · apply by ${v.deadline}` : ""}
                {v.countries.length > 0 ? ` · sending countries: ${v.countries.map(countryName).join(", ")}` : ""}
              </p>
            </div>
            <Link className="btn secondary" to={`/app/vacancies/${v.id}`}>View</Link>
          </div>
        </div>
      ))}
      {vacancies.length === 0 && <p className="muted">No open vacancies right now.</p>}
    </>
  );
}
