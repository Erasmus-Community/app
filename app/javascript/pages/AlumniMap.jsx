import React, { useEffect, useRef, useState, useCallback } from "react";
import { Map, Marker, Popup, NavigationControl } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { api } from "../api";
import { useAuth } from "../App";
import { COUNTRIES, countryName } from "../constants";

const MAP_VISIBILITIES = [
  ["everyone", "Everyone can see my pin"],
  ["connections", "Only my connections"],
];

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

function LocationForm({ initial, onSaved }) {
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
  const [error, setError] = useState(null);

  const geocode = async () => {
    if (!form.current_city && !form.current_country) return;
    setGeocoding(true);
    setError(null);
    try {
      const q = [form.current_city, countryName(form.current_country)].filter(Boolean).join(", ");
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,
        { headers: { "User-Agent": "ErasmusNGOHub/1.0" } }
      );
      const data = await res.json();
      if (data.length > 0) {
        setForm((f) => ({
          ...f,
          latitude: parseFloat(data[0].lat).toFixed(4),
          longitude: parseFloat(data[0].lon).toFixed(4),
        }));
      } else {
        setError("Could not find coordinates for this location. Try a different city name.");
      }
    } catch {
      setError("Geocoding failed. You can enter coordinates manually.");
    } finally {
      setGeocoding(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.patch("/api/v1/me/update_location", {
        current_city: form.current_city,
        current_country: form.current_country,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        map_visibility: form.map_visibility,
        bio: form.bio,
      });
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <h3 style={{ marginTop: 0 }}>Your location on the map</h3>
      <form onSubmit={save} style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
        <div style={{ flex: "1 1 140px" }}>
          <label>City</label>
          <input value={form.current_city} onChange={(e) => setForm({ ...form, current_city: e.target.value })} placeholder="e.g. Lisbon" />
        </div>
        <div style={{ flex: "1 1 140px" }}>
          <label>Country</label>
          <select value={form.current_country} onChange={(e) => setForm({ ...form, current_country: e.target.value })}>
            <option value="">Select…</option>
            {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </div>
        <div style={{ flex: "0 0 auto" }}>
          <button type="button" className="btn secondary" onClick={geocode} disabled={geocoding}>
            {geocoding ? "Finding…" : "Find coordinates"}
          </button>
        </div>
        <div style={{ flex: "1 1 100px" }}>
          <label>Lat</label>
          <input type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="e.g. 38.7167" />
        </div>
        <div style={{ flex: "1 1 100px" }}>
          <label>Lng</label>
          <input type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="e.g. -9.1333" />
        </div>
        <div style={{ flex: "1 1 180px" }}>
          <label>Who can see my pin?</label>
          <select value={form.map_visibility} onChange={(e) => setForm({ ...form, map_visibility: e.target.value })}>
            {MAP_VISIBILITIES.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
        </div>
        <div style={{ flex: "1 1 100%", maxWidth: 500 }}>
          <label>Short bio (optional)</label>
          <input value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="e.g. Youth worker, KA1 trainer, looking to reconnect!" />
        </div>
        <div style={{ flex: "1 1 100%" }}>
          <button type="submit" className="btn" disabled={saving || !form.latitude || !form.longitude}>
            {saving ? "Saving…" : "Save my pin"}
          </button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

function PinSvg({ fill, stroke, size = 28 }) {
  const h = Math.round(size * 1.3125);
  return (
    <svg width={size} height={h} viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer" }}>
      <path
        d="M16 0C7.16 0 0 7.16 0 16c0 12 16 26 16 26s16-14 16-26C32 7.16 24.84 0 16 0z"
        fill={fill}
        stroke={stroke}
        strokeWidth="2"
      />
      <circle cx="16" cy="16" r="7" fill={stroke} />
    </svg>
  );
}

export default function AlumniMap() {
  const { me } = useAuth();
  const mapRef = useRef(null);
  const [pins, setPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPins = async () => {
    setLoading(true);
    try {
      const data = await api.get("/api/v1/alumni_map");
      setPins(data);
    } catch {
      setPins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPins();
  }, []);

  const handleMarkerClick = useCallback((pin) => {
    setSelectedPin(pin);
    mapRef.current?.flyTo({
      center: [pin.longitude, pin.latitude],
      zoom: 6,
      duration: 1000,
    });
  }, []);

  return (
    <>
      <div className="row" style={{ marginBottom: 8 }}>
        <h1 style={{ marginBottom: 0 }}>Alumni map</h1>
        <span className="muted">{pins.length} participant{pins.length !== 1 ? "s" : ""} on the map</span>
      </div>

      {me && <LocationForm initial={me.user} onSaved={loadPins} />}

      <div style={{ position: "relative" }}>
        {loading && <p className="muted" style={{ padding: 16 }}>Loading map…</p>}
        <div
          style={{
            width: "100%",
            height: 560,
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          <Map
            ref={mapRef}
            initialViewState={{
              longitude: 10,
              latitude: 50,
              zoom: 3.5,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle={MAP_STYLE}
            attributionControl={true}
          >
            <NavigationControl position="top-left" />

            {pins.map((pin) => (
              <Marker
                key={pin.id}
                longitude={pin.longitude}
                latitude={pin.latitude}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  handleMarkerClick(pin);
                }}
              >
                <PinSvg
                  fill={pin.is_me ? "#ffd617" : "#1f4e9c"}
                  stroke={pin.is_me ? "#1f4e9c" : "#ffffff"}
                  size={pin.is_me ? 36 : 28}
                />
              </Marker>
            ))}

            {selectedPin && (
              <Popup
                longitude={selectedPin.longitude}
                latitude={selectedPin.latitude}
                anchor="bottom"
                offset={[0, -40]}
                closeOnClick={false}
                onClose={() => setSelectedPin(null)}
                maxWidth="320px"
              >
                <div style={{ padding: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <strong style={{ fontSize: 15 }}>{selectedPin.name}</strong>
                    {selectedPin.is_me && <span className="badge open" style={{ marginLeft: 4 }}>You</span>}
                  </div>
                  <p className="muted" style={{ margin: "4px 0", fontSize: 13 }}>
                    {[selectedPin.current_city, countryName(selectedPin.current_country)].filter(Boolean).join(", ")}
                  </p>
                  <p className="muted" style={{ margin: "4px 0", fontSize: 13 }}>
                    {selectedPin.organization.name} · {countryName(selectedPin.organization.country)}
                  </p>
                  {selectedPin.bio && <p style={{ margin: "8px 0", fontSize: 13 }}>{selectedPin.bio}</p>}
                  {selectedPin.projects.length > 0 && (
                    <>
                      <strong style={{ fontSize: 13, display: "block", marginTop: 8 }}>Projects participated in</strong>
                      <ul className="clean" style={{ margin: "4px 0" }}>
                        {selectedPin.projects.map((p) => (
                          <li key={p.id} style={{ padding: "3px 0", borderBottom: "1px solid #eee", fontSize: 12 }}>
                            <strong>{p.title}</strong>
                            <br />
                            <span className="muted">
                              {p.project_type.replace(/_/g, " ")}
                              {p.venue_country && ` · ${countryName(p.venue_country)}`}
                              {p.starts_on && ` · ${p.starts_on}`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </Popup>
            )}
          </Map>
        </div>
      </div>

      <p className="muted" style={{ marginTop: 12 }}>
        Click a pin to see a participant's projects and reconnect.
        Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors.
        Tiles by <a href="https://carto.com/" target="_blank" rel="noopener">CARTO</a>.
      </p>
    </>
  );
}
