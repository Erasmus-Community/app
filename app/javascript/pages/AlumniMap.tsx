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
      className="cursor-pointer"
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
      <div className="row mb-2">
        <h1 className="mb-0">Alumni map</h1>
        <span className="muted">
          {pins.length} participant{pins.length !== 1 ? "s" : ""} on the map
        </span>
      </div>

      <div className="relative">
        {loading && <p className="muted p-4">Loading map…</p>}
        <div className="h-dvh min-h-dvh w-full overflow-hidden rounded-lg border border-gray-200">
          <Map
            ref={mapRef as React.Ref<never>}
            initialViewState={{
              longitude: 10,
              latitude: 50,
              zoom: 3.5,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle={MAP_STYLE}
            attributionControl={{}}
            projection="globe"
            maxZoom={4}
            minZoom={3}
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
                <div className="p-1">
                  <div className="mb-1 flex items-center justify-between">
                    <strong className="text-[15px]">{selectedPin.name}</strong>
                    {selectedPin.is_me && (
                      <span className="badge open ml-1">You</span>
                    )}
                  </div>
                  <p className="muted my-1 text-[13px]">
                    {[
                      selectedPin.current_city,
                      countryName(selectedPin.current_country || ""),
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p className="muted my-1 text-[13px]">
                    {selectedPin.organization.name} ·{" "}
                    {countryName(selectedPin.organization.country)}
                  </p>
                  {selectedPin.bio && (
                    <p className="my-2 text-[13px]">{selectedPin.bio}</p>
                  )}
                  {selectedPin.projects.length > 0 && (
                    <>
                      <strong className="mt-2 block text-[13px]">
                        Projects participated in
                      </strong>
                      <ul className="clean my-1">
                        {selectedPin.projects.map((p) => (
                          <li
                            key={p.id}
                            className="border-b border-gray-100 py-0.5 text-xs"
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

      <p className="muted mt-3">
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
