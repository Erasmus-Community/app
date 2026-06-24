import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../shared/api/client";
import { useAuth } from "../../App";
import { TextField, Button, FormError, FormStack } from "../../shared/ui";
import type { MeResponse } from "./types";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setMe } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const me = await apiClient.post<MeResponse>("/api/v1/session", {
        email,
        password,
      });
      setMe(me);
      navigate(
        me.organization?.status === "approved"
          ? "/app/alumni-map"
          : "/app/waitlist",
      );
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <main className="container">
      <h1>Log in</h1>
      <FormStack onSubmit={submit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FormError error={error} />
        <Button type="submit">Log in</Button>
        <p className="muted">
          New organization? <Link to="/register">Register here</Link>
        </p>
      </FormStack>
    </main>
  );
}
