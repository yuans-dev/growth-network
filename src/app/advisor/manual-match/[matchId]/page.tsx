"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../providers";
import { createClient } from "@/lib/supabase/client";

type MatchRow = {
  id: string;
  member_a_id: string;
  member_b_id: string;
  fit_score: number | null;
  summary: string | null;
  status: string;
  member_a_status: string;
  member_b_status: string;
  created_at: string;
  updated_at: string | null;
};

type ProfileRow = {
  id: string;
  business_name: string | null;
  full_name: string | null;
  sector: string | null;
  stage: string | null;
  verification_status: string | null;
};

export default function MatchDetailPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const params = useParams<{ matchId: string }>();
  const { role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [match, setMatch] = useState<MatchRow | null>(null);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [form, setForm] = useState({ summary: "", fitScore: "" });

  useEffect(() => {
    if (role !== "advisor" && role !== "staff" && role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    const load = async () => {
      setLoading(true);
      const { data: matchData, error } = await supabase
        .from("matches")
        .select(
          "id, member_a_id, member_b_id, fit_score, summary, status, member_a_status, member_b_status, created_at, updated_at",
        )
        .eq("id", params.matchId)
        .single();

      if (error || !matchData) {
        setMessage("Match not found.");
        setLoading(false);
        return;
      }

      const { data: profileRows } = await supabase
        .from("profiles")
        .select(
          "id, business_name, full_name, sector, stage, verification_status",
        )
        .in("id", [matchData.member_a_id, matchData.member_b_id]);

      setMatch(matchData as MatchRow);
      setProfiles((profileRows ?? []) as ProfileRow[]);
      setForm({
        summary: matchData.summary ?? "",
        fitScore:
          typeof matchData.fit_score === "number"
            ? String(matchData.fit_score)
            : "",
      });
      setLoading(false);
    };

    void load();
  }, [params.matchId, role, router, supabase]);

  const memberA = profiles.find((profile) => profile.id === match?.member_a_id);
  const memberB = profiles.find((profile) => profile.id === match?.member_b_id);

  const handleSave = async () => {
    if (!match) return;
    setBusy(true);
    setMessage("");

    const res = await fetch(`/api/matching/manual/${match.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary: form.summary,
        fit_score: form.fitScore ? Number(form.fitScore) : null,
      }),
    });

    const payload = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMessage(payload.error || "Failed to save changes.");
      return;
    }

    setMessage("Match updated.");
  };

  const handleDelete = async () => {
    if (!match) return;
    if (!window.confirm("Delete this match?")) return;

    setBusy(true);
    setMessage("");

    const res = await fetch(`/api/matching/manual/${match.id}`, {
      method: "DELETE",
    });

    const payload = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMessage(payload.error || "Failed to delete match.");
      return;
    }

    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen px-[5%] py-12">
        <div className="mx-auto max-w-4xl rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-8">
          Loading match...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] px-[5%] py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-[20px] border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-muted)]">
            Advisor match detail
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">
            Edit or delete match
          </h1>
          <p className="mt-2 text-sm text-[var(--color-body)]">
            Use this page to update the match summary, fit score, or remove the
            match entirely.
          </p>
          {message && (
            <div className="mt-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700">
              {message}
            </div>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <InfoCard title="Member A" profile={memberA} />
          <InfoCard title="Member B" profile={memberB} />
        </section>

        <section className="rounded-[20px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-8 space-y-4">
          <div>
            <label className="block text-sm font-600 text-[var(--color-ink)]">
              Summary
            </label>
            <textarea
              className="gn-input mt-1 h-28"
              value={form.summary}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, summary: event.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-600 text-[var(--color-ink)]">
              Fit score
            </label>
            <input
              className="gn-input mt-1"
              type="number"
              min={0}
              max={100}
              value={form.fitScore}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, fitScore: event.target.value }))
              }
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="gn-btn-primary"
              type="button"
              onClick={handleSave}
              disabled={busy}
            >
              {busy ? "Saving..." : "Save changes"}
            </button>
            <button
              className="gn-btn-secondary"
              type="button"
              onClick={handleDelete}
              disabled={busy}
            >
              Delete match
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  profile,
}: {
  title: string;
  profile: ProfileRow | undefined;
}) {
  return (
    <div className="rounded-[20px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
        {title}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-[var(--color-ink)]">
        {profile?.business_name || profile?.full_name || "Unknown company"}
      </h2>
      <p className="mt-2 text-sm text-[var(--color-body)]">
        {profile?.sector || "Unspecified sector"} · Stage{" "}
        {profile?.stage || "n/a"}
      </p>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Verification: {profile?.verification_status || "unverified"}
      </p>
    </div>
  );
}
