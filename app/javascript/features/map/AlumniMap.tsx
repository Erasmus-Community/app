import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  Map as MapGL,
  Marker,
  Popup,
  NavigationControl,
} from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { apiClient } from "../../shared/api/client";
import { useAuth } from "../../App";
import { countryName } from "../../shared/constants/countries";
import { projectTypeLabel } from "../organization/constants";
import { MAP_STYLE } from "./constants";
import { COUNTRY_CENTROIDS } from "./countryCentroids";
import type { AlumniPin, AlumniPinProject, VenuePin } from "./types";

// ── Pin SVGs ─────────────────────────────────────────────────────

/** Teardrop — marks a person's current location */
function LocationPinSvg({
  fill,
  stroke,
  size = 28,
}: {
  fill: string;
  stroke: string;
  size?: number;
}) {
  const h = Math.round(size * 1.3125);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 32 42"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer drop-shadow-sm"
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

/** Diamond flag — marks a project venue country */
function VenuePinSvg({ isMe, size = 22 }: { isMe: boolean; size?: number }) {
  // Diamond shape with a small dot in the centre
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer drop-shadow-sm"
    >
      <rect
        x="12"
        y="1"
        width="15"
        height="15"
        rx="2"
        transform="rotate(45 12 12)"
        fill={isMe ? "#ffd617" : "#ffffff"}
        stroke="#1f4e9c"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="3" fill="#1f4e9c" />
    </svg>
  );
}

// ── Overlay action buttons ───────────────────────────────────────

interface MapAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function MapOverlayActions({
  actions,
  onDismiss,
}: {
  actions: MapAction[];
  onDismiss: (id: string) => void;
}) {
  if (actions.length === 0) return null;
  return (
    <div className="pointer-events-none absolute top-4 left-1/2 z-10 flex -translate-x-1/2 flex-wrap justify-center gap-2">
      {actions.map((action) => (
        <div
          key={action.id}
          className="pointer-events-auto flex items-center gap-1 rounded-full bg-white/90 shadow-md backdrop-blur-sm"
        >
          <button
            onClick={action.onClick}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border-0 bg-transparent px-3 py-1.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100"
          >
            {action.icon}
            {action.label}
          </button>
          <button
            onClick={() => onDismiss(action.id)}
            aria-label={`Dismiss ${action.label}`}
            className="mr-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700"
          >
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1l6 6M7 1L1 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Legend ───────────────────────────────────────────────────────

function MapLegend() {
  return (
    <div className="pointer-events-none absolute bottom-8 left-3 z-10 rounded-lg bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm">
      <div className="flex items-center gap-2 text-xs text-gray-700">
        <LocationPinSvg fill="#1f4e9c" stroke="#ffffff" size={16} />
        <span>Current location</span>
      </div>
      <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-700">
        <VenuePinSvg isMe={false} size={16} />
        <span>Project venue</span>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────

/** Build synthetic VenuePin objects from location pins' projects arrays.
 *  Groups multiple projects at the same country for the same user into one pin. */
function buildVenuePins(pins: AlumniPin[]): VenuePin[] {
  const result: VenuePin[] = [];

  for (const pin of pins) {
    if (!pin.projects.length) continue;

    // Group by venue_country
    const byCountry = new Map<string, AlumniPinProject[]>();
    for (const project of pin.projects) {
      if (!project.venue_country) continue;
      const coords = COUNTRY_CENTROIDS[project.venue_country];
      if (!coords) continue;
      const existing = byCountry.get(project.venue_country) ?? [];
      existing.push(project);
      byCountry.set(project.venue_country, existing);
    }

    for (const [country, projects] of byCountry.entries()) {
      const coords = COUNTRY_CENTROIDS[country]!;
      result.push({
        key: `venue-${pin.id}-${country}`,
        latitude: coords[1],
        longitude: coords[0],
        country,
        projects,
        participant: {
          id: pin.id,
          name: pin.name,
          organization: pin.organization,
        },
        is_me: pin.is_me,
      });
    }
  }

  return result;
}

// ── Main component ───────────────────────────────────────────────

type SelectedPin =
  | { type: "location"; pin: AlumniPin }
  | { type: "venue"; pin: VenuePin };

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
  const [selected, setSelected] = useState<SelectedPin | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissedActions, setDismissedActions] = useState<Set<string>>(
    new Set(),
  );

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

  const venuePins = useMemo(() => buildVenuePins(pins), [pins]);

  const flyTo = useCallback((lng: number, lat: number, zoom = 5) => {
    mapRef.current?.flyTo({ center: [lng, lat], zoom, duration: 1000 });
  }, []);

  const handleLocationClick = useCallback(
    (pin: AlumniPin) => {
      setSelected({ type: "location", pin });
      flyTo(pin.longitude, pin.latitude, 6);
    },
    [flyTo],
  );

  const handleVenueClick = useCallback(
    (pin: VenuePin) => {
      setSelected({ type: "venue", pin });
      flyTo(pin.longitude, pin.latitude, 5);
    },
    [flyTo],
  );

  const dismissAction = useCallback((id: string) => {
    setDismissedActions((prev) => new Set([...prev, id]));
  }, []);

  const flyToMyPin = useCallback(() => {
    const myPin = pins.find((p) => p.is_me);
    if (myPin) {
      setSelected({ type: "location", pin: myPin });
      flyTo(myPin.longitude, myPin.latitude, 6);
    }
  }, [pins, flyTo]);

  const allActions: MapAction[] = [
    ...(me && pins.some((p) => p.is_me)
      ? [
          {
            id: "find-me",
            label: "Find me",
            icon: (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="10" r="4" stroke="#1f4e9c" strokeWidth="2" />
                <path
                  d="M12 2v2M12 18v2M2 10h2M18 10h2"
                  stroke="#1f4e9c"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 14c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z"
                  fill="#1f4e9c"
                />
              </svg>
            ),
            onClick: flyToMyPin,
          },
        ]
      : []),
    {
      id: "refresh",
      label: "Refresh",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 12a8 8 0 018-8 8 8 0 016.32 3.09L21 10M20 12a8 8 0 01-8 8 8 8 0 01-6.32-3.09L3 14"
            stroke="#1f4e9c"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M21 6v4h-4M3 18v-4h4"
            stroke="#1f4e9c"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      onClick: loadPins,
    },
    ...(!me
      ? [
          {
            id: "sign-up",
            label: "Add yourself to the map",
            icon: (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="8" r="4" stroke="#1f4e9c" strokeWidth="2" />
                <path
                  d="M2 20c0-4 3.6-7 8-7"
                  stroke="#1f4e9c"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M18 14v6M15 17h6"
                  stroke="#1f4e9c"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ),
            onClick: () => {
              window.location.href = "/register";
            },
          },
        ]
      : []),
  ].filter((a) => !dismissedActions.has(a.id));

  // Popup position
  const popupLng =
    selected?.type === "location"
      ? selected.pin.longitude
      : selected?.pin.longitude ?? 0;
  const popupLat =
    selected?.type === "location"
      ? selected.pin.latitude
      : selected?.pin.latitude ?? 0;

  return (
    <div className="relative h-dvh w-full">
      <MapOverlayActions actions={allActions} onDismiss={dismissAction} />
      <MapLegend />
      {loading && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center pt-16">
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-sm text-gray-500 shadow-sm backdrop-blur-sm">
            Loading map…
          </span>
        </div>
      )}
      <div className="h-full w-full overflow-hidden">
        <MapGL
          ref={mapRef as React.Ref<never>}
          initialViewState={{ longitude: 10, latitude: 50, zoom: 3.5 }}
          style={{ width: "100%", height: "100%" }}
          mapStyle={MAP_STYLE}
          attributionControl={{}}
          projection="globe"
          maxZoom={7}
          minZoom={3}
        >
          <NavigationControl position="top-left" />

          {/* ── Location pins ── */}
          {pins.map((pin) => (
            <Marker
              key={`loc-${pin.id}`}
              longitude={pin.longitude}
              latitude={pin.latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleLocationClick(pin);
              }}
            >
              <LocationPinSvg
                fill={pin.is_me ? "#ffd617" : "#1f4e9c"}
                stroke={pin.is_me ? "#1f4e9c" : "#ffffff"}
                size={pin.is_me ? 36 : 28}
              />
            </Marker>
          ))}

          {/* ── Project venue pins ── */}
          {venuePins.map((vp) => (
            <Marker
              key={vp.key}
              longitude={vp.longitude}
              latitude={vp.latitude}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleVenueClick(vp);
              }}
            >
              <VenuePinSvg isMe={vp.is_me} size={vp.is_me ? 26 : 20} />
            </Marker>
          ))}

          {/* ── Popup ── */}
          {selected && (
            <Popup
              longitude={popupLng}
              latitude={popupLat}
              anchor="bottom"
              offset={
                selected.type === "location"
                  ? ([0, -40] as [number, number])
                  : ([0, -16] as [number, number])
              }
              closeOnClick={false}
              onClose={() => setSelected(null)}
              maxWidth="320px"
            >
              {selected.type === "location" ? (
                <LocationPopup pin={selected.pin} />
              ) : (
                <VenuePopup pin={selected.pin} />
              )}
            </Popup>
          )}
        </MapGL>
      </div>
    </div>
  );
}

// ── Popup content components ─────────────────────────────────────

function LocationPopup({ pin }: { pin: AlumniPin }) {
  return (
    <div className="p-1">
      <div className="mb-1 flex items-center gap-1.5">
        <LocationPinSvg fill="#1f4e9c" stroke="#ffffff" size={14} />
        <strong className="text-[15px]">{pin.name}</strong>
        {pin.is_me && <span className="badge open">You</span>}
      </div>
      <p className="muted my-1 text-[13px]">
        {[pin.current_city, countryName(pin.current_country || "")]
          .filter(Boolean)
          .join(", ")}
      </p>
      <p className="muted my-1 text-[13px]">
        {pin.organization.name} · {countryName(pin.organization.country)}
      </p>
      {pin.bio && <p className="my-2 text-[13px]">{pin.bio}</p>}
      {pin.projects.length > 0 && (
        <>
          <p className="muted mt-2 text-[11px] font-semibold uppercase tracking-wide">
            Projects participated in
          </p>
          <ul className="clean my-1">
            {pin.projects.map((p) => (
              <li
                key={p.id}
                className="border-b border-gray-100 py-0.5 text-xs"
              >
                <strong>{p.title}</strong>
                <br />
                <span className="muted">
                  {p.key_action} · {projectTypeLabel(p.project_type)}
                  {p.venue_country && ` · ${countryName(p.venue_country)}`}
                  {p.starts_on && ` · ${p.starts_on}`}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function VenuePopup({ pin }: { pin: VenuePin }) {
  return (
    <div className="p-1">
      <div className="mb-1 flex items-center gap-1.5">
        <VenuePinSvg isMe={pin.is_me} size={14} />
        <strong className="text-[14px]">
          Project venue · {countryName(pin.country)}
        </strong>
      </div>
      <p className="muted my-1 text-[13px]">
        Participant: <strong>{pin.participant.name}</strong>
        {pin.is_me && <span className="badge open ml-1">You</span>}
      </p>
      <p className="muted my-1 text-[13px]">
        {pin.participant.organization.name} ·{" "}
        {countryName(pin.participant.organization.country)}
      </p>
      <p className="muted mt-2 text-[11px] font-semibold uppercase tracking-wide">
        Projects here
      </p>
      <ul className="clean my-1">
        {pin.projects.map((p) => (
          <li key={p.id} className="border-b border-gray-100 py-0.5 text-xs">
            <strong>{p.title}</strong>
            <br />
            <span className="muted">
              {p.key_action} · {projectTypeLabel(p.project_type)}
              {p.starts_on && ` · ${p.starts_on}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
