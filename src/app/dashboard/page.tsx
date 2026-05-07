"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../providers";
import { createClient } from "@/lib/supabase/client";
import {
  fetchAdvisorDashboardData,
  fetchDashboardSummary,
  type AdvisorCompanyRecord,
  type AdvisorMatchRecord,
} from "@/lib/app-data";

export default function DashboardPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user, role } = useAuth();
  const isAdvisorView = role && ["advisor", "admin"].includes(role);
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
  const [advisorData, setAdvisorData] = useState<{
    companies: AdvisorCompanyRecord[];
    matches: AdvisorMatchRecord[];
  }>({ companies: [], matches: [] });

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      if (isAdvisorView) {
        const next = await fetchAdvisorDashboardData(supabase);
        if (!active) return;
        setAdvisorData(next);
      } else {
        const next = await fetchDashboardSummary(supabase, user.id);
        if (!active) return;
        setSummary(next);
      }
      setIsLoading(false);
    };

    void load();

    return () => {
      active = false;
    };
  }, [supabase, user?.id, isAdvisorView]);

  const advisorDashboard = useMemo(() => {
    const counts = new Map<string, number>();
    const matchGroups = new Map<
      string,
      Array<{
        matchId: string;
        counterpartId: string;
        counterpartName: string;
        status: AdvisorMatchRecord["status"];
        fitScore: number | null;
      }>
    >();

    const companyNameById = new Map(
      advisorData.companies.map((company) => [
        company.id,
        company.business_name || company.full_name || "Verified company",
      ]),
    );

    advisorData.matches.forEach((match) => {
      const nameA =
        companyNameById.get(match.member_a_id) ?? "Verified company";
      const nameB =
        companyNameById.get(match.member_b_id) ?? "Verified company";

      counts.set(match.member_a_id, (counts.get(match.member_a_id) ?? 0) + 1);
      counts.set(match.member_b_id, (counts.get(match.member_b_id) ?? 0) + 1);

      const nextA = matchGroups.get(match.member_a_id) ?? [];
      nextA.push({
        matchId: match.id,
        counterpartId: match.member_b_id,
        counterpartName: nameB,
        status: match.status,
        fitScore: match.fit_score,
      });
      matchGroups.set(match.member_a_id, nextA);

      const nextB = matchGroups.get(match.member_b_id) ?? [];
      nextB.push({
        matchId: match.id,
        counterpartId: match.member_a_id,
        counterpartName: nameA,
        status: match.status,
        fitScore: match.fit_score,
      });
      matchGroups.set(match.member_b_id, nextB);
    });

    const companiesWithoutMatches = advisorData.companies.filter(
      (company) => (counts.get(company.id) ?? 0) === 0,
    );

    const companiesWithMatches = advisorData.companies
      .filter((company) => (counts.get(company.id) ?? 0) > 0)
      .map((company) => ({
        ...company,
        matches: matchGroups.get(company.id) ?? [],
      }));

    const pendingPairs = advisorData.matches.filter(
      (match) => match.status === "pending",
    ).length;
    const acceptedPairs = advisorData.matches.filter(
      (match) => match.status === "accepted",
    ).length;

    return {
      totalCompanies: advisorData.companies.length,
      companiesWithoutMatches,
      companiesWithMatches,
      pendingPairs,
      acceptedPairs,
    };
  }, [advisorData]);

  if (isAdvisorView) {
    return (
      <div className="min-h-screen bg-(--color-canvas) px-[5%] py-12">
        <div className="mx-auto w-full max-w-7xl space-y-10">
          <section className="rounded-[20px] border border-(--color-hairline) bg-(--color-surface-soft) p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-(--color-muted)">
              Advisor console
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-(--color-ink)">
              Matching visibility
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-(--color-body)">
              Review which companies have no matches, inspect who is connected
              to who, and open the particle graph for a visual network view.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-4">
            <MetricCard
              label="Companies"
              value={
                isLoading ? "..." : String(advisorDashboard.totalCompanies)
              }
            />
            <MetricCard
              label="No matches"
              value={
                isLoading
                  ? "..."
                  : String(advisorDashboard.companiesWithoutMatches.length)
              }
            />
            <MetricCard
              label="Pending pairs"
              value={isLoading ? "..." : String(advisorDashboard.pendingPairs)}
            />
            <MetricCard
              label="Accepted pairs"
              value={isLoading ? "..." : String(advisorDashboard.acceptedPairs)}
            />
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <QuickLink
              href="/advisor/manual-match"
              title="Advisor tools"
              subtitle="Create manual matches and manage introductions"
            />
            <QuickLink
              href="/advisor/network-graph"
              title="Particle network graph"
              subtitle="Visualize pending and accepted relationships"
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[20px] border border-(--color-hairline) bg-(--color-canvas) p-6">
              <h2 className="text-lg font-semibold text-(--color-ink)">
                Companies with no matches
              </h2>
              <p className="mt-1 text-sm text-(--color-body)">
                Companies without any match records yet.
              </p>
              <div className="mt-4 space-y-3">
                {advisorDashboard.companiesWithoutMatches.length === 0 ? (
                  <EmptyState text="Every company currently has at least one match record." />
                ) : (
                  advisorDashboard.companiesWithoutMatches.map((company) => (
                    <CompanyRow key={company.id} company={company} />
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[20px] border border-(--color-hairline) bg-(--color-canvas) p-6">
              <h2 className="text-lg font-semibold text-(--color-ink)">
                Companies matched with who
              </h2>
              <p className="mt-1 text-sm text-(--color-body)">
                Match relationships by company, including status badges.
              </p>
              <div className="mt-4 space-y-3">
                {advisorDashboard.companiesWithMatches.length === 0 ? (
                  <EmptyState text="No current match relationships found." />
                ) : (
                  advisorDashboard.companiesWithMatches.map((company) => (
                    <MatchGroupCard key={company.id} company={company} />
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

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
          {role && ["advisor", "admin"].includes(role) ? (
            <QuickLink
              href="/advisor/manual-match"
              title="Advisor tools"
              subtitle="Curate manual matches and manage advisor workflows"
            />
          ) : (
            <>
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
                subtitle="Maintain your matching profile and business details"
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
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function CompanyRow({ company }: { company: AdvisorCompanyRecord }) {
  return (
    <div className="rounded-[16px] border border-(--color-hairline) bg-(--color-surface-soft) p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-(--color-ink)">
            {company.business_name || company.full_name || "Verified company"}
          </h3>
          <p className="mt-1 text-sm text-(--color-body)">
            {company.sector || "Unspecified sector"} · Stage{" "}
            {company.stage || "n/a"}
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-(--color-muted)">
          {company.verification_status || "unverified"}
        </span>
      </div>
    </div>
  );
}

function MatchGroupCard({
  company,
}: {
  company: AdvisorCompanyRecord & {
    matches: Array<{
      matchId: string;
      counterpartId: string;
      counterpartName: string;
      status: string;
      fitScore: number | null;
    }>;
  };
}) {
  return (
    <div className="rounded-[16px] border border-(--color-hairline) bg-(--color-surface-soft) p-4">
      <h3 className="text-base font-semibold text-(--color-ink)">
        {company.business_name || company.full_name || "Verified company"}
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {company.matches.map((match) => (
          <Link
            key={match.matchId}
            href={`/advisor/manual-match/${match.matchId}`}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition hover:opacity-90 ${
              match.status === "accepted"
                ? "bg-emerald-100 text-emerald-700"
                : match.status === "pending"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-700"
            }`}
          >
            {match.counterpartName} · {match.status}
            {typeof match.fitScore === "number" ? ` · ${match.fitScore}` : ""}
          </Link>
        ))}
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

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-[16px] border border-dashed border-(--color-hairline) bg-(--color-surface-soft) p-4 text-sm text-(--color-body)">
      {text}
    </div>
  );
}
