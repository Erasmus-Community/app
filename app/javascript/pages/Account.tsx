import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api";
import { useAuth } from "../App";
import { TextField, Button, FormError } from "../components/ui";

export default function Account() {
  const { me, setMe } = useAuth();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    setDeleting(true);
    try {
      await apiClient.delete("/api/v1/me");
      setMe(null);
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
      setDeleting(false);
    }
  };

  if (!me) return null;

  return (
    <>
      <h1>Account</h1>

      <div className="card mb-6">
        <h3 className="mt-0">Your details</h3>
        <p>
          <strong>Name:</strong> {me.user.name}
        </p>
        <p>
          <strong>Email:</strong> {me.user.email}
        </p>
        {me.organization && (
          <p>
            <strong>Organization:</strong> {me.organization.name}
          </p>
        )}
      </div>

      <div className="card border border-red-400">
        <h3 className="mt-0 text-red-600">Delete account and data</h3>
        <p>
          Under the General Data Protection Regulation (GDPR), you have the
          right to request the erasure of your personal data. This action will:
        </p>
        <ul className="pl-6 leading-loose">
          <li>Permanently delete your account and login credentials</li>
          <li>Remove your name, email, bio, and location from the platform</li>
          <li>Remove your pin from the alumni map</li>
          {me.organization && (
            <li>
              If you are the only member of your organization, the organization
              and all its data will also be deleted
            </li>
          )}
        </ul>
        <p className="font-semibold">
          This action is immediate and irreversible. There is no way to recover
          your data.
        </p>

        {!confirming ? (
          <Button variant="danger" onClick={() => setConfirming(true)}>
            Request data deletion
          </Button>
        ) : (
          <div className="mt-3 rounded-lg bg-red-50 p-4">
            <p className="mb-3 mt-0">
              Type <strong>DELETE</strong> below to confirm:
            </p>
            <TextField
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              autoFocus
            />
            <div className="mt-3 flex gap-2">
              <Button
                variant="danger"
                disabled={confirmText !== "DELETE"}
                loading={deleting}
                loadingText="Deleting…"
                onClick={handleDelete}
              >
                Permanently delete my account
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setConfirming(false);
                  setConfirmText("");
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
            </div>
            <FormError error={error} />
          </div>
        )}
      </div>
    </>
  );
}
