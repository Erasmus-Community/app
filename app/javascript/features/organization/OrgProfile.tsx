import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../../shared/api/client";
import { useAuth } from "../../App";
import { COUNTRIES } from "../../shared/constants/countries";
import { countryName } from "../../shared/constants/countries";
import { KEY_ACTIONS, PROJECT_TYPES, projectTypeLabel } from "./constants";
import {
  TextField,
  TextArea,
  Select,
  Button,
  FormError,
  FormStack,
} from "../../shared/ui";
import type { OrgProfileResponse, Project, CreateProjectForm } from "./types";

// ── Create Project Form ──────────────────────────────────────────

const EMPTY_FORM: CreateProjectForm = {
  title: "",
  project_type: "",
  key_action: "",
  venue_country: "",
  starts_on: "",
  ends_on: "",
  description: "",
};

function CreateProjectPanel({
  organizationId,
  onCreated,
}: {
  organizationId: number;
  onCreated: (project: Project) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateProjectForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof CreateProjectForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const created = await apiClient.post<Project>(
        `/api/v1/organizations/${organizationId}/projects`,
        { project: form },
      );
      onCreated(created);
      setForm(EMPTY_FORM);
      setOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        + New project
      </Button>
    );
  }

  return (
    <div className="card mb-4 border border-eu-blue/20">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="m-0">New Erasmus+ project</h3>
        <button
          onClick={() => { setOpen(false); setForm(EMPTY_FORM); }}
          className="cursor-pointer border-0 bg-transparent text-gray-400 hover:text-gray-700"
          aria-label="Cancel"
        >
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <FormStack onSubmit={submit}>
        <TextField
          label="Project title"
          value={form.title}
          onChange={set("title")}
          required
        />
        <div className="flex gap-3">
          <Select
            label="Project type"
            value={form.project_type}
            onChange={set("project_type")}
            options={PROJECT_TYPES}
            required
            className="flex-1"
          />
          <Select
            label="Key action"
            value={form.key_action}
            onChange={set("key_action")}
            options={KEY_ACTIONS.map((k) => [k, k])}
            required
            className="flex-1"
          />
        </div>
        <div className="flex gap-3">
          <Select
            label="Venue country"
            value={form.venue_country}
            onChange={set("venue_country")}
            options={COUNTRIES}
            className="flex-1"
          />
          <TextField
            label="Start date"
            type="date"
            value={form.starts_on}
            onChange={set("starts_on")}
            className="flex-1"
          />
          <TextField
            label="End date"
            type="date"
            value={form.ends_on}
            onChange={set("ends_on")}
            className="flex-1"
          />
        </div>
        <TextArea
          label="Description (optional)"
          value={form.description}
          onChange={set("description")}
          placeholder="Short description of the project objectives and activities…"
        />
        <FormError error={error} />
        <div className="flex gap-2">
          <Button type="submit" loading={submitting} loadingText="Creating…">
            Create project
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => { setOpen(false); setForm(EMPTY_FORM); }}
          >
            Cancel
          </Button>
        </div>
      </FormStack>
    </div>
  );
}

// ── Participant list ─────────────────────────────────────────────

function ParticipantList({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);

  if (project.participants.length === 0) {
    return <p className="muted text-xs">No participants yet.</p>;
  }

  return (
    <div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="muted cursor-pointer border-0 bg-transparent p-0 text-xs hover:text-gray-700"
      >
        {expanded ? "▾" : "▸"} {project.participants.length} participant{project.participants.length !== 1 ? "s" : ""}
      </button>
      {expanded && (
        <ul className="clean mt-2 space-y-1">
          {project.participants.map((p) => (
            <li key={p.id} className="flex items-baseline gap-2 text-sm">
              <span className="font-medium">{p.name}</span>
              <span className="muted text-xs">{p.email}</span>
              {(p.current_city || p.current_country) && (
                <span className="muted text-xs">
                  · {[p.current_city, countryName(p.current_country || "")].filter(Boolean).join(", ")}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Project card ─────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="card">
      <div className="row mb-1">
        <div>
          <strong>{project.title}</strong>
          <span className="badge ml-2">{project.key_action}</span>
          <span className="badge ml-1">{projectTypeLabel(project.project_type)}</span>
        </div>
        {project.venue_country && (
          <span className="muted text-sm">{countryName(project.venue_country)}</span>
        )}
      </div>
      {(project.starts_on || project.ends_on) && (
        <p className="muted my-1 text-xs">
          {[project.starts_on, project.ends_on].filter(Boolean).join(" → ")}
        </p>
      )}
      {project.description && (
        <p className="my-2 text-sm">{project.description}</p>
      )}
      <ParticipantList project={project} />
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────

export default function OrgProfile() {
  const { id } = useParams<{ id: string }>();
  const { me } = useAuth();
  const [data, setData] = useState<OrgProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiClient
      .get<OrgProfileResponse>(`/api/v1/organizations/${id}`)
      .then(setData)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container"><p className="muted">Loading…</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!data) return null;

  const { organization: org, viewer_role, projects } = data;
  const isOwner = viewer_role === "owner";

  const handleProjectCreated = (project: Project) => {
    setData((d) => d ? { ...d, projects: [project, ...d.projects] } : d);
  };

  return (
    <div className="container wide">
      {/* Org header */}
      <div className="card mb-6">
        <div className="row mb-2">
          <div>
            <h1 className="mb-0">{org.name}</h1>
            <p className="muted mt-1 mb-0">
              {countryName(org.country)}
              {org.website && (
                <>
                  {" · "}
                  <a href={org.website} target="_blank" rel="noopener noreferrer">
                    {org.website.replace(/^https?:\/\//, "")}
                  </a>
                </>
              )}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className={`badge ${org.status === "approved" ? "open" : org.status === "rejected" ? "urgent" : "pending"}`}>
              {org.status}
            </span>
            {isOwner && <span className="badge open">Owner</span>}
          </div>
        </div>

        {org.description && <p className="mt-2 text-sm">{org.description}</p>}

        <div className="mt-3 flex flex-wrap gap-1">
          {org.key_actions.map((ka) => (
            <span key={ka} className="badge">{ka}</span>
          ))}
          {org.expertises.map((ex) => (
            <span key={ex} className="badge">{ex}</span>
          ))}
        </div>

        {/* Contact info — only visible to owners */}
        {isOwner && org.oid && (
          <p className="muted mt-3 text-sm">OID: <span className="font-mono">{org.oid}</span></p>
        )}
      </div>

      {/* Projects section */}
      <div className="row mb-4">
        <h2 className="m-0">Projects</h2>
        {isOwner && (
          <CreateProjectPanel
            organizationId={org.id}
            onCreated={handleProjectCreated}
          />
        )}
      </div>

      {projects.length === 0 ? (
        <div className="card text-center text-gray-400">
          <p className="my-6">No projects yet.{isOwner ? " Create your first one above." : ""}</p>
        </div>
      ) : (
        <div className="space-y-0">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
