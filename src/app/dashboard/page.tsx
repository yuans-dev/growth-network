"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../providers";
import { createClient } from "@/lib/supabase/client";
import { fetchDashboardSummary } from "@/lib/app-data";

export default function DashboardPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    pendingMatches: 0,
    activeDeals: 0,
    adCredits: 0,
    profile: null as null | {
      full_name: string | null;
      stage: string | null;
      verification_status: string | null;
    },
  });

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      const next = await fetchDashboardSummary(supabase, user.id);
      if (!active) return;
      setSummary(next);
      setIsLoading(false);
    };

    void load();

    return () => {
      active = false;
    };
  }, [supabase, user?.id]);

  return (
    <div className="min-h-screen bg-(--color-canvas) px-[5%] py-12">
      <div className="mx-auto w-full max-w-7xl space-y-10">
        <section className="rounded-[20px] border border-(--color-hairline) bg-(--color-surface-soft) p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-(--color-muted)">
            Member portal
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-(--color-ink)">
            {summary.profile?.full_name || "Welcome"}
          </h1>
          <p className="mt-2 text-sm text-(--color-body)">
            Stage {summary.profile?.stage || "0"} · Verification{" "}
            {summary.profile?.verification_status || "unverified"}
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Pending matches"
            value={isLoading ? "..." : String(summary.pendingMatches)}
          />
          <MetricCard
            label="Active deals"
            value={isLoading ? "..." : String(summary.activeDeals)}
          />
          <MetricCard
            label="Ad credits"
            value={isLoading ? "..." : String(summary.adCredits)}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <QuickLink
            href="/matches"
            title="Matches"
            subtitle="Review and respond to current cycle proposals"
          />
          <QuickLink
            href="/deal-board"
            title="Deal board"
            subtitle="Keep cards updated within SLA windows"
          />
          <QuickLink
            href="/profile"
            title="Profile"
            subtitle="Maintain ASK/OFFER and business details"
          />
          <QuickLink
            href="/documents"
            title="Documents"
            subtitle="Submit and track KYC verification files"
          />
          <QuickLink
            href="/events"
            title="Events"
            subtitle="Register and mark attendance for sessions"
          />
          <QuickLink
            href="/payments"
            title="Payments"
            subtitle="Review billing and credit activity"
          />
        </section>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-(--color-hairline) bg-(--color-canvas) p-5">
      <p className="text-xs uppercase tracking-[0.12em] text-(--color-muted)">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-(--color-primary)">
        {value}
      </p>
    </div>
  );
}

function QuickLink({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[16px] border border-(--color-hairline) bg-(--color-canvas) p-5 transition hover:border-(--color-border-strong)"
    >
      <h2 className="text-base font-semibold text-(--color-ink)">{title}</h2>
      <p className="mt-2 text-sm text-(--color-body)">{subtitle}</p>
    </Link>
  );
}
