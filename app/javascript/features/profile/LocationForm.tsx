import React, { useState } from "react";
import { COUNTRIES, countryName } from "../../shared/constants/countries";
import { MAP_VISIBILITIES } from "../map/constants";
import { apiClient } from "../../shared/api/client";
import { TextField, TextArea, Select, Button, FormError } from "../../shared/ui";
import type { LocationFormValues } from "./types";

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

export default function LocationForm({ initial, onSaved }: LocationFormProps) {
  const [form, setForm] = useState<LocationFormValues>({
    current_city: initial.current_city || "",
    current_country: initial.current_country || "",
    latitude: initial.latitude?.toString() || "",
    longitude: initial.longitude?.toString() || "",
    map_visibility: initial.map_visibility || "everyone",
    bio: initial.bio || "",
  });
  const [saving, setSaving] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

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
        setError("Could not find coordinates for this location. Try a different city name.");
      }
    } catch {
      setError("Geocoding failed. You can enter coordinates manually.");
    } finally {
      setGeocoding(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await apiClient.patch("/api/v1/me/update_location", {
        current_city: form.current_city,
        current_country: form.current_country,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        map_visibility: form.map_visibility,
        bio: form.bio,
      });
      setSaved(true);
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card mb-6">
      <h3 className="mt-0">Your location on the map</h3>
      <form onSubmit={save}>
        <div className="filters mb-3">
          <div className="min-w-[140px] flex-1">
            <TextField
              label="City"
              value={form.current_city}
              onChange={(e) => setForm({ ...form, current_city: e.target.value })}
              placeholder="e.g. Lisbon"
            />
          </div>
          <div className="min-w-[140px] flex-1">
            <Select
              label="Country"
              value={form.current_country}
              onChange={(e) => setForm({ ...form, current_country: e.target.value })}
              options={COUNTRIES}
            />
          </div>
          <div className="flex items-end pb-0.5">
            <Button
              type="button"
              variant="secondary"
              onClick={geocode}
              loading={geocoding}
              loadingText="Finding…"
            >
              Find coordinates
            </Button>
          </div>
          <div className="min-w-[100px] flex-1">
            <TextField
              label="Lat"
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              placeholder="38.7167"
            />
          </div>
          <div className="min-w-[100px] flex-1">
            <TextField
              label="Lng"
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              placeholder="-9.1333"
            />
          </div>
          <div className="min-w-[200px] flex-1">
            <Select
              label="Who can see my pin?"
              value={form.map_visibility}
              onChange={(e) => setForm({ ...form, map_visibility: e.target.value })}
              options={MAP_VISIBILITIES}
              placeholder=""
            />
          </div>
        </div>
        <TextArea
          label="Short bio (optional)"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="e.g. Youth worker, KA1 trainer, looking to reconnect!"
          className="mb-3"
        />
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            loading={saving}
            loadingText="Saving…"
            disabled={!form.latitude || !form.longitude}
          >
            Save my pin
          </Button>
          {saved && <span className="text-sm text-green-600">Saved ✓</span>}
        </div>
        <FormError error={error} />
      </form>
    </div>
  );
}
