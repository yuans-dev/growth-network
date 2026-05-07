"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers";
import { createClient } from "@/lib/supabase/client";
import {
  fetchUserMatches,
  respondToMatch,
  type MatchRecord,
} from "@/lib/app-data";
import { getHomePathForRole } from "@/lib/auth/access";

type UIMatch = MatchRecord & { counterpart_name: string | null };

export default function MatchesPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user, role } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<UIMatch[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadMatches = async () => {
    if (!user?.id) return;
    const rows = await fetchUserMatches(supabase, user.id);
    setMatches(rows);
  };

  useEffect(() => {
    if (role && ["advisor", "admin"].includes(role)) {
      router.replace(getHomePathForRole(role));
      return;
    }

    void loadMatches();
  }, [role, router, user?.id]);

  const handleDecision = async (
    match: UIMatch,
    decision: "accepted" | "declined",
  ) => {
    if (!user?.id) return;
    setBusyId(match.id);
    const { error } = await respondToMatch(supabase, user.id, match, decision);
    setBusyId(null);
    if (error) {
      window.alert(error);
      return;
    }
    await loadMatches();
  };

  const handleGenerateAIMatches = async () => {
    setIsGenerating(true);
    const response = await fetch("/api/matching/generate", {
      method: "POST",
    });

    const payload = (await response.json()) as {
      error?: string;
      generated?: number;
    };
    setIsGenerating(false);

    if (!response.ok) {
      window.alert(payload.error || "Failed to generate AI matches.");
      return;
    }

    await loadMatches();
    window.alert(`Generated ${payload.generated ?? 0} match recommendations.`);
  };

  return (
    <div className="min-h-screen bg-(--color-canvas)">
      <section className="border-b border-(--color-hairline) bg-(--color-surface-soft) px-[5%] py-10">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/dashboard"
            className="text-sm text-(--color-primary) hover:underline"
          >
            Back to dashboard
          </Link>
          <h1 className="mt-3 text-3xl font-semibold text-(--color-ink)">
            Your matches
          </h1>
          <div className="mt-4">
            {role !== "advisor" && role !== "admin" && (
              <button
                type="button"
                onClick={handleGenerateAIMatches}
                className="gn-btn-primary"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate AI Matches"}
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-5 px-[5%] py-10">
        {matches.length === 0 ? (
          <EmptyState text="No active matches yet for this cycle." />
        ) : (
          matches.map((match) => {
            const statusClass =
              match.status === "accepted"
                ? "bg-green-100 text-green-700"
                : match.status === "declined"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-yellow-100 text-yellow-700";

            return (
              <div
                key={match.id}
                className="rounded-2xl border border-(--color-hairline) bg-(--color-canvas) p-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-(--color-primary) px-3 py-1 text-xs font-semibold text-white">
                    {match.fit_score ?? "-"} fit
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                  >
                    {match.status}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-(--color-ink)">
                  {match.summary || "Strategic compatibility match"}
                </h2>
                <p className="mt-2 text-sm text-(--color-body)">
                  Counterpart: {match.counterpart_name || "Verified member"}
                </p>
                <div className="mt-5 flex gap-3">
                  <button
                    disabled={match.status !== "pending" || busyId === match.id}
                    onClick={() => handleDecision(match, "accepted")}
                    className="gn-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                  >
                    Accept
                  </button>
                  <button
                    disabled={match.status !== "pending" || busyId === match.id}
                    onClick={() => handleDecision(match, "declined")}
                    className="gn-btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                  >
                    Decline
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-(--color-hairline) bg-(--color-surface-soft) p-8 text-sm text-(--color-body)">
      {text}
    </div>
  );
}
