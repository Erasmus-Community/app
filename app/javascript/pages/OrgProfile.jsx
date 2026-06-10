import React, { useState } from "react";
import { api } from "../api";
import { useAuth } from "../App";
import { COUNTRIES, KEY_ACTIONS, EXPERTISES } from "../constants";

export default function OrgProfile() {
  const { me, setMe } = useAuth();
  const org = me.organization;
  const [form, setForm] = useState({
    name: org.name, country: org.country, oid: org.oid || "", website: org.website || "",
    description: org.description || "", key_actions: org.key_actions, expertises: org.expertises,
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const canEdit = me.user.org_role === "org_admin";

  const toggle = (field, value) =>
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value) ? f[field].filter((v) => v !== value) : [...f[field], value],
    }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null); setSaved(false);
    try {
      const updated = await api.patch(`/api/v1/organizations/${org.id}`, { organization: form });
      setMe({ ...me, organization: updated });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1>Organization profile</h1>
      {!canEdit && <p className="muted">Only org admins can edit the profile.</p>}
      <form className="stack" onSubmit={submit}>
        <label>Name <input value={form.name} disabled={!canEdit} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Country
          <select value={form.country} disabled={!canEdit} onChange={(e) => setForm({ ...form, country: e.target.value })}>
            {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </label>
        <label>Erasmus+ OID <input value={form.oid} disabled={!canEdit} onChange={(e) => setForm({ ...form, oid: e.target.value })} /></label>
        <label>Website <input value={form.website} disabled={!canEdit} onChange={(e) => setForm({ ...form, website: e.target.value })} /></label>
        <label>Description <textarea rows="4" value={form.description} disabled={!canEdit} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <fieldset>
          <legend>Key actions</legend>
          {KEY_ACTIONS.map((ka) => (
            <label key={ka} style={{ fontWeight: "normal" }}>
              <input type="checkbox" style={{ width: "auto" }} disabled={!canEdit} checked={form.key_actions.includes(ka)} onChange={() => toggle("key_actions", ka)} /> {ka}
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Expertise</legend>
          {EXPERTISES.map((ex) => (
            <label key={ex} style={{ fontWeight: "normal" }}>
              <input type="checkbox" style={{ width: "auto" }} disabled={!canEdit} checked={form.expertises.includes(ex)} onChange={() => toggle("expertises", ex)} /> {ex}
            </label>
          ))}
        </fieldset>
        {error && <p className="error">{error}</p>}
        {saved && <p style={{ color: "var(--green)" }}>Profile saved.</p>}
        {canEdit && <button className="btn" type="submit">Save</button>}
      </form>
    </>
  );
}
