import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../shared/api/client";
import { useAuth } from "../../App";
import { COUNTRIES } from "../../shared/constants/countries";
import { KEY_ACTIONS, EXPERTISES } from "./constants";
import {
  TextField,
  TextArea,
  Select,
  Button,
  CheckboxGroup,
  FormError,
  FormStack,
} from "../../shared/ui";
import type { MeResponse } from "../auth/types";

interface OrgForm {
  name: string;
  country: string;
  oid: string;
  website: string;
  description: string;
  key_actions: string[];
  expertises: string[];
}

export default function RegisterOrganization() {
  const { me, setMe } = useAuth();
  const navigate = useNavigate();
  const [org, setOrg] = useState<OrgForm>({
    name: "",
    country: "",
    oid: "",
    website: "",
    description: "",
    key_actions: [],
    expertises: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const updated = await apiClient.post<MeResponse>(
        "/api/v1/organizations",
        { organization: org },
      );
      setMe(updated);
      navigate("/app/waitlist");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (me?.organization) {
    navigate("/app/alumni-map", { replace: true });
    return null;
  }

  return (
    <main className="container">
      <h1>Register your organization</h1>
      <p className="muted">
        Registrations are reviewed before full access is granted (waitlist).
      </p>
      <FormStack onSubmit={submit}>
        <TextField
          label="Organization name"
          value={org.name}
          onChange={(e) => setOrg({ ...org, name: e.target.value })}
          required
        />
        <Select
          label="Country"
          value={org.country}
          onChange={(e) => setOrg({ ...org, country: e.target.value })}
          options={COUNTRIES}
          required
        />
        <TextField
          label="Erasmus+ OID"
          value={org.oid}
          onChange={(e) => setOrg({ ...org, oid: e.target.value })}
          placeholder="E10000000"
        />
        <TextField
          label="Website"
          value={org.website}
          onChange={(e) => setOrg({ ...org, website: e.target.value })}
        />
        <TextArea
          label="Description"
          value={org.description}
          onChange={(e) => setOrg({ ...org, description: e.target.value })}
        />
        <CheckboxGroup
          legend="Key actions of interest"
          options={KEY_ACTIONS}
          selected={org.key_actions}
          onChange={(v) => setOrg({ ...org, key_actions: v })}
        />
        <CheckboxGroup
          legend="Fields of expertise"
          options={EXPERTISES}
          selected={org.expertises}
          onChange={(v) => setOrg({ ...org, expertises: v })}
        />
        <FormError error={error} />
        <Button type="submit" loading={submitting} loadingText="Submitting…">
          Register organization
        </Button>
      </FormStack>
    </main>
  );
}
