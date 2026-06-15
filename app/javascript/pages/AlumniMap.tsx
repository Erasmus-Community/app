import React, { useEffect, useRef, useState, useCallback } from "react";
import { Map, Marker, Popup, NavigationControl } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { apiClient } from "../api";
import { useAuth } from "../App";
import { countryName } from "../constants";
import type { AlumniPin } from "../types";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

interface PinSvgProps {
  fill: string;
  stroke: string;
  size?: number;
}

function PinSvg({ fill, stroke, size = 28 }: PinSvgProps) {
  const h = Math.round(size * 1.3125);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 32 42"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: "pointer" }}
    >
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
  const mapRef = useRef<{
    flyTo: (opts: {
      center: [number, number];
      zoom: number;
      duration: number;
    }) => void;
  } | null>(null);
  const [pins, setPins] = useState<AlumniPin[]>([]);
  const [selectedPin, setSelectedPin] = useState<AlumniPin | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPins = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<AlumniPin[]>("/api/v1/alumni_map");
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

  const handleMarkerClick = useCallback((pin: AlumniPin) => {
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
        <span className="muted">
          {pins.length} participant{pins.length !== 1 ? "s" : ""} on the map
        </span>
      </div>

      <div style={{ position: "relative" }}>
        {loading && (
          <p className="muted" style={{ padding: 16 }}>
            Loading map…
          </p>
        )}
        <div
          style={{
            width: "100%",
            height: "100vdh",
            minHeight: "100vdh",
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          <Map
            ref={mapRef as React.Ref<never>}
            initialViewState={{ longitude: 10, latitude: 50, zoom: 3.5 }}
            style={{ width: "100%", height: "100%" }}
            mapStyle={MAP_STYLE}
            attributionControl={{}}
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
                offset={[0, -40] as [number, number]}
                closeOnClick={false}
                onClose={() => setSelectedPin(null)}
                maxWidth="320px"
              >
                <div style={{ padding: 4 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <strong style={{ fontSize: 15 }}>{selectedPin.name}</strong>
                    {selectedPin.is_me && (
                      <span className="badge open" style={{ marginLeft: 4 }}>
                        You
                      </span>
                    )}
                  </div>
                  <p
                    className="muted"
                    style={{ margin: "4px 0", fontSize: 13 }}
                  >
                    {[
                      selectedPin.current_city,
                      countryName(selectedPin.current_country || ""),
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p
                    className="muted"
                    style={{ margin: "4px 0", fontSize: 13 }}
                  >
                    {selectedPin.organization.name} ·{" "}
                    {countryName(selectedPin.organization.country)}
                  </p>
                  {selectedPin.bio && (
                    <p style={{ margin: "8px 0", fontSize: 13 }}>
                      {selectedPin.bio}
                    </p>
                  )}
                  {selectedPin.projects.length > 0 && (
                    <>
                      <strong
                        style={{ fontSize: 13, display: "block", marginTop: 8 }}
                      >
                        Projects participated in
                      </strong>
                      <ul className="clean" style={{ margin: "4px 0" }}>
                        {selectedPin.projects.map((p) => (
                          <li
                            key={p.id}
                            style={{
                              padding: "3px 0",
                              borderBottom: "1px solid #eee",
                              fontSize: 12,
                            }}
                          >
                            <strong>{p.title}</strong>
                            <br />
                            <span className="muted">
                              {p.project_type.replace(/_/g, " ")}
                              {p.venue_country &&
                                ` · ${countryName(p.venue_country)}`}
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
        Click a pin to see a participant's projects and reconnect. Map data ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener"
        >
          OpenStreetMap
        </a>{" "}
        contributors. Tiles by{" "}
        <a href="https://carto.com/" target="_blank" rel="noopener">
          CARTO
        </a>
        .
      </p>
    </>
  );
}
