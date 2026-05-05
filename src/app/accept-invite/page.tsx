"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers";

export default function AcceptInvitePage() {
  const router = useRouter();
  const { user, signedIn, isInvitedAccount, completeInviteClaim } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    confirmPassword: "",
    pdpaConsent: false,
    ndaLight: false,
    nonCircumvention: false,
  });
  const [error, setError] = useState("");

  const canSubmit = useMemo(
    () =>
      !!formData.fullName.trim() &&
      !!formData.password &&
      !!formData.confirmPassword &&
      formData.pdpaConsent &&
      formData.ndaLight &&
      formData.nonCircumvention,
    [formData],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!signedIn || !isInvitedAccount) {
      setError("You do not have a pending invite to claim.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const { error: updateError } = await completeInviteClaim({
      name: formData.fullName.trim(),
      password: formData.password,
    });
    if (updateError) {
      setError(updateError);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] px-[5%] py-12">
      <div className="mx-auto max-w-[720px] rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-8">
        <p className="text-xs font-600 uppercase tracking-[0.14em] text-[var(--color-muted)]">
          Invitation Claim
        </p>
        <h1 className="mt-3 text-3xl font-700 text-[var(--color-ink)]">
          Activate your invited account
        </h1>
        <p className="mt-2 text-sm text-[var(--color-body)]">
          {user?.email
            ? `Invitee email: ${user.email}`
            : "Sign in with your invited email to claim access."}
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-600 text-[var(--color-ink)]">
              Full name
            </label>
            <input
              value={formData.fullName}
              onChange={(event) => {
                setError("");
                setFormData((prev) => ({
                  ...prev,
                  fullName: event.target.value,
                }));
              }}
              className="mt-1 w-full rounded-lg border border-[var(--color-hairline)] px-4 py-3"
              placeholder="Your full name"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-600 text-[var(--color-ink)]">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(event) => {
                  setError("");
                  setFormData((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }));
                }}
                className="mt-1 w-full rounded-lg border border-[var(--color-hairline)] px-4 py-3"
                placeholder="Create password"
              />
            </div>
            <div>
              <label className="block text-sm font-600 text-[var(--color-ink)]">
                Confirm password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(event) => {
                  setError("");
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: event.target.value,
                  }));
                }}
                className="mt-1 w-full rounded-lg border border-[var(--color-hairline)] px-4 py-3"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <div className="space-y-2 rounded-lg bg-[var(--color-surface-soft)] p-4 text-sm text-[var(--color-body)]">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={formData.pdpaConsent}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    pdpaConsent: event.target.checked,
                  }))
                }
                className="mt-1"
              />
              <span>I consent to PDPA-PH data handling terms.</span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={formData.ndaLight}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    ndaLight: event.target.checked,
                  }))
                }
                className="mt-1"
              />
              <span>I accept the NDA-light agreement.</span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={formData.nonCircumvention}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    nonCircumvention: event.target.checked,
                  }))
                }
                className="mt-1"
              />
              <span>I accept the non-circumvention agreement.</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-lg bg-[var(--color-primary)] py-3 font-600 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Activate Account
          </button>
        </form>
      </div>
    </div>
  );
}
