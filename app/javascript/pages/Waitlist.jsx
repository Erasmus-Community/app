import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../App";

export default function Waitlist() {
  const { me, loading } = useAuth();
  if (loading) return null;
  if (!me) return <Navigate to="/login" replace />;
  if (!me.organization) return <Navigate to="/app/register-organization" replace />;
  if (me.organization.status === "approved") return <Navigate to="/app/alumni-map" replace />;

  const rejected = me.organization.status === "rejected";
  return (
    <main className="container">
      <div className="card">
        <h1>{rejected ? "Registration not approved" : "You're on the waitlist"}</h1>
        <p>
          {rejected
            ? "Unfortunately your organization's registration was not approved. If you believe this is a mistake, contact support."
            : `Thanks for registering ${me.organization.name}. An administrator will review your organization and you'll get access once approved.`}
        </p>
      </div>
    </main>
  );
}
