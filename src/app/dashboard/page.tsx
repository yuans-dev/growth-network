"use client";

import { useMemo, useState } from "react";

const roleCapabilities = {
  Explorer: [
    "Discover aligned opportunities",
    "Attend weekly sessions",
    "View profile and stage requirements",
  ],
  "Growth Partner": [
    "Participate in deal conversations",
    "Access match cycle outputs",
    "Update active deal cards",
  ],
  "Community Builder": [
    "Host chapter events",
    "Invite aligned members",
    "View chapter engagement digest",
  ],
  "Growth Advisor": [
    "Review KYC and risk classification",
    "Approve/decline introductions",
    "Confirm key deal stage transitions",
  ],
} as const;

const matchCards = [
  {
    id: "match-1",
    score: 91,
    summary: "Cross-border distribution fit",
    ask: ["Growth capital", "SEA distribution"],
    offer: ["Operator network", "Board support"],
  },
  {
    id: "match-2",
    score: 86,
    summary: "Supply chain optimization",
    ask: ["Working capital"],
    offer: ["Procurement leverage"],
  },
  {
    id: "match-3",
    score: 82,
    summary: "Governance and reporting upgrade",
    ask: ["Governance support"],
    offer: ["Financial controls"],
  },
];

const dealBoard = [
  {
    stage: "Discover",
    deals: ["Meridian x Aera", "Vanta x Helix"],
  },
  {
    stage: "Intro & Scoping",
    deals: ["Kinetic x Cobalt"],
  },
  {
    stage: "Proposal/Pilot",
    deals: ["Ardent x Mosaic"],
  },
  {
    stage: "Negotiation/Legal",
    deals: ["Lumen x Forge"],
  },
  {
    stage: "Closed-Won",
    deals: ["Axis x Northline"],
  },
  {
    stage: "Closed-Lost",
    deals: ["Orbit x Delta"],
  },
];

const events = [
  { id: "event-1", title: "Private Dinner", date: "May 18" },
  { id: "event-2", title: "Weekly Session", date: "May 22" },
  { id: "event-3", title: "Pitch Night", date: "May 28" },
];

export default function DashboardPage() {
  const [activeRole, setActiveRole] = useState<keyof typeof roleCapabilities>("Growth Partner");

  const roleSummary = useMemo(() => roleCapabilities[activeRole], [activeRole]);

  const handleRequestIntro = (matchId: string) => {
    console.log("dashboard-request-intro", matchId);
  };

  const handleOpenDeal = (deal: string) => {
    console.log("dashboard-open-deal", deal);
  };

  const handleRsvp = (eventId: string) => {
    console.log("dashboard-rsvp", eventId);
  };

  return (
    <div className="px-[5%] py-20 overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1280px] overflow-hidden">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="gn-overline">Member portal</p>
            <h1 className="mt-4 font-display text-[clamp(40px,6vw,80px)] font-black uppercase leading-[0.92]">
              Active match cycle
            </h1>
            <p className="mt-4 max-w-xl text-[15px] text-[var(--color-text-secondary)]">
              Advisor-approved matches, deal board status, and event access are
              centralized here.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[4px] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                Matches ready
              </p>
              <p className="mt-2 font-display text-[42px] font-black text-[var(--color-accent)]">
                5
              </p>
            </div>
            <div className="rounded-[4px] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                Active deals
              </p>
              <p className="mt-2 font-display text-[42px] font-black text-[var(--color-accent)]">
                3
              </p>
            </div>
            <div className="rounded-[4px] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                Ad credits
              </p>
              <p className="mt-2 font-display text-[42px] font-black text-[var(--color-accent)]">
                12
              </p>
            </div>
          </div>
        </div>

        <section className="mt-16 overflow-hidden">
          <p className="gn-overline">Role-based access</p>
          <div className="mt-8 rounded-[4px] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
            <p className="text-[13px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              Current role
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.keys(roleCapabilities).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setActiveRole(role as keyof typeof roleCapabilities)}
                  className={`rounded-full border px-4 py-2 text-[12px] uppercase tracking-[0.1em] ${
                    role === activeRole
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-text-on-accent)]"
                      : "border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-label)]"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <ul className="mt-5 space-y-2 text-[14px] text-[var(--color-text-secondary)]">
              {roleSummary.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-16 overflow-hidden">
          <p className="gn-overline">Matches</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3 min-w-0">
            {matchCards.map((match) => (
              <div key={match.id} className="gn-card min-w-0 p-6">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-label)]">
                    Score
                  </p>
                  <span className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-on-accent)]">
                    {match.score}
                  </span>
                </div>
                <p className="mt-4 text-[15px] font-semibold text-[var(--color-text-primary)]">
                  {match.summary}
                </p>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                      ASK
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 min-w-0">
                      {match.ask.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[var(--color-accent-border)] px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-[var(--color-text-label)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                      OFFER
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 min-w-0">
                      {match.offer.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-[var(--color-text-on-accent)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  className="mt-6 gn-btn-secondary"
                  type="button"
                  onClick={() => handleRequestIntro(match.id)}
                >
                  Request intro
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <p className="gn-overline">Deal board</p>
          <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
            {dealBoard.map((column) => (
              <div
                key={column.stage}
                className="min-w-[220px] flex-1 rounded-[4px] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                  {column.stage}
                </p>
                <div className="mt-4 space-y-3">
                  {column.deals.map((deal) => (
                    <button
                      key={deal}
                      className="w-full rounded-[4px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-3 text-left text-[13px]"
                      type="button"
                      onClick={() => handleOpenDeal(deal)}
                    >
                      {deal}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="gn-overline">Events</p>
            <div className="mt-8 space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-[4px] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                        {event.date}
                      </p>
                      <p className="mt-2 text-[15px] font-semibold text-[var(--color-text-primary)]">
                        {event.title}
                      </p>
                    </div>
                    <button
                      className="gn-btn-secondary"
                      type="button"
                      onClick={() => handleRsvp(event.id)}
                    >
                      RSVP
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="gn-overline">Ad credits</p>
            <div className="mt-8 rounded-[4px] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
              <p className="text-[15px] text-[var(--color-text-secondary)]">
                Credits promote verified businesses to capital and operator
                circles. Balance resets per cycle.
              </p>
              <button className="mt-6 gn-btn-secondary" type="button">
                View credit history
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
