import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../api";
import { useAuth } from "../App";
import {
  TextField,
  Button,
  Checkbox,
  FormError,
  FormStack,
} from "../components/ui";
import type { MeResponse } from "../types";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setMe } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const me = await apiClient.post<MeResponse>("/api/v1/registration", {
        user: form,
      });
      setMe(me);
      navigate("/app/alumni-map");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <main className="container">
      <h1>Create your account</h1>
      <p className="muted">Join the Erasmus+ NGO Hub network.</p>
      <FormStack onSubmit={submit}>
        <TextField
          label="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <TextField
          label="Password"
          type="password"
          minLength={8}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <Checkbox
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          required
        >
          I agree to the{" "}
          <Link to="/terms" target="_blank">
            Terms and Conditions
          </Link>
        </Checkbox>
        <FormError error={error} />
        <Button type="submit" disabled={!accepted}>
          Create account
        </Button>
        <p className="muted">
          Already registered? <Link to="/login">Log in</Link>
        </p>
        <p className="muted">
          Want to register your organization? You can do that after creating
          your account.
        </p>
      </FormStack>
    </main>
  );
}
