import React, { useState } from "react";
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
    <div className="card mb-4">
      <h3 className="mt-0">Your location on the map</h3>
      <form
        onSubmit={save}
        className="flex flex-wrap items-end gap-3"
      >
        <div className="min-w-[140px] flex-1">
          <label>City</label>
          <input
            value={form.current_city}
            onChange={(e) => setForm({ ...form, current_city: e.target.value })}
            placeholder="e.g. Lisbon"
          />
        </div>
        <div className="min-w-[140px] flex-1">
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
        <div className="shrink-0">
          <button
            type="button"
            className="btn secondary"
            onClick={geocode}
            disabled={geocoding}
          >
            {geocoding ? "Finding…" : "Find coordinates"}
          </button>
        </div>
        <div className="min-w-[100px] flex-1">
          <label>Lat</label>
          <input
            type="number"
            step="any"
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: e.target.value })}
            placeholder="e.g. 38.7167"
          />
        </div>
        <div className="min-w-[100px] flex-1">
          <label>Lng</label>
          <input
            type="number"
            step="any"
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: e.target.value })}
            placeholder="e.g. -9.1333"
          />
        </div>
        <div className="min-w-[180px] flex-1">
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
        <div className="w-full max-w-lg">
          <label>Short bio (optional)</label>
          <input
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="e.g. Youth worker, KA1 trainer, looking to reconnect!"
          />
        </div>
        <div className="w-full">
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
