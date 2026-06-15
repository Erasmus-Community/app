import React, { useEffect, useRef, useState, useCallback } from "react";
import { COUNTRIES, countryName, MAP_VISIBILITIES } from "../../constants";
import { apiClient } from "../../api";

interface LocationFormProps {
  initial: {
    current_city?: string;
    current_country?: string;
    latitude?: number;
    longitude?: number;
    map_visibility?: string;
    bio?: string;
  };
  onSaved: () => void;
}

const LocationForm: React.FC<LocationFormProps> = ({ initial, onSaved }) => {
  const [form, setForm] = useState({
    current_city: initial.current_city || "",
    current_country: initial.current_country || "",
    latitude: initial.latitude || "",
    longitude: initial.longitude || "",
    map_visibility: initial.map_visibility || "everyone",
    bio: initial.bio || "",
  });
  const [saving, setSaving] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocode = async () => {
    if (!form.current_city && !form.current_country) return;
    setGeocoding(true);
    setError(null);
    try {
      const q = [form.current_city, countryName(form.current_country)]
        .filter(Boolean)
        .join(", ");
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,
        { headers: { "User-Agent": "ErasmusNGOHub/1.0" } },
      );
      const data = await res.json();
      if (data.length > 0) {
        setForm((f) => ({
          ...f,
          latitude: parseFloat(data[0].lat).toFixed(4),
          longitude: parseFloat(data[0].lon).toFixed(4),
        }));
      } else {
        setError(
          "Could not find coordinates for this location. Try a different city name.",
        );
      }
    } catch {
      setError("Geocoding failed. You can enter coordinates manually.");
    } finally {
      setGeocoding(false);
    }
  };

  const save = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await apiClient.patch("/api/v1/me/update_location", {
        current_city: form.current_city,
        current_country: form.current_country,
        latitude: parseFloat(form.latitude as string),
        longitude: parseFloat(form.longitude as string),
        map_visibility: form.map_visibility,
        bio: form.bio,
      });
      onSaved();
    } catch (err: Error | any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <h3 style={{ marginTop: 0 }}>Your location on the map</h3>
      <form
        onSubmit={save}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "flex-end",
        }}
      >
        <div style={{ flex: "1 1 140px" }}>
          <label>City</label>
          <input
            value={form.current_city}
            onChange={(e) => setForm({ ...form, current_city: e.target.value })}
            placeholder="e.g. Lisbon"
          />
        </div>
        <div style={{ flex: "1 1 140px" }}>
          <label>Country</label>
          <select
            value={form.current_country}
            onChange={(e) =>
              setForm({ ...form, current_country: e.target.value })
            }
          >
            <option value="">Select…</option>
            {COUNTRIES.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: "0 0 auto" }}>
          <button
            type="button"
            className="btn secondary"
            onClick={geocode}
            disabled={geocoding}
          >
            {geocoding ? "Finding…" : "Find coordinates"}
          </button>
        </div>
        <div style={{ flex: "1 1 100px" }}>
          <label>Lat</label>
          <input
            type="number"
            step="any"
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: e.target.value })}
            placeholder="e.g. 38.7167"
          />
        </div>
        <div style={{ flex: "1 1 100px" }}>
          <label>Lng</label>
          <input
            type="number"
            step="any"
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: e.target.value })}
            placeholder="e.g. -9.1333"
          />
        </div>
        <div style={{ flex: "1 1 180px" }}>
          <label>Who can see my pin?</label>
          <select
            value={form.map_visibility}
            onChange={(e) =>
              setForm({ ...form, map_visibility: e.target.value })
            }
          >
            {MAP_VISIBILITIES.map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: "1 1 100%", maxWidth: 500 }}>
          <label>Short bio (optional)</label>
          <input
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="e.g. Youth worker, KA1 trainer, looking to reconnect!"
          />
        </div>
        <div style={{ flex: "1 1 100%" }}>
          <button
            type="submit"
            className="btn"
            disabled={saving || !form.latitude || !form.longitude}
          >
            {saving ? "Saving…" : "Save my pin"}
          </button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default LocationForm;
