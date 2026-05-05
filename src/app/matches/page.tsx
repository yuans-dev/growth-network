"use client";

import Link from "next/link";
import BottomNav from "../_components/BottomNav";

const allMatches = [
  {
    id: "match-1",
    score: 91,
    summary: "Cross-border distribution fit",
    otherParty: "Meridian Capital",
    otherSector: "Venture Capital",
    ask: ["Growth capital", "SEA distribution"],
    offer: ["Operator network", "Board support"],
    status: "pending" as const,
    reason: "Your ASK (Growth capital) matches their OFFER (Early-stage funding)",
  },
  {
    id: "match-2",
    score: 86,
    summary: "Supply chain optimization",
    otherParty: "Vanta Logistics",
    otherSector: "Supply Chain",
    ask: ["Working capital"],
    offer: ["Procurement leverage"],
    status: "accepted" as const,
    reason: "Your OFFER (Product roadmap) matches their ASK (Enterprise features)",
  },
  {
    id: "match-3",
    score: 82,
    summary: "Governance and reporting upgrade",
    otherParty: "Helix Advisory",
    otherSector: "Consulting",
    ask: ["Governance support"],
    offer: ["Financial controls"],
    status: "pending" as const,
    reason: "Your ASK (Board advisor) matches their OFFER (Governance consulting)",
  },
  {
    id: "match-4",
    score: 78,
    summary: "Regional expansion",
    otherParty: "Nexus Ventures",
    otherSector: "Investment",
    ask: ["Market entry support"],
    offer: ["Network access"],
    status: "pending" as const,
    reason: "Complementary growth strategies in Southeast Asia",
  },
  {
    id: "match-5",
    score: 75,
    summary: "Technology integration",
    otherParty: "CloudCore Systems",
    otherSector: "Infrastructure",
    ask: ["Technical partnership"],
    offer: ["API integration"],
    status: "declined" as const,
    reason: "Your integration requirements align with their services",
  },
];

export default function MatchesPage() {
  const handleAcceptMatch = (matchId: string) => {
    console.log("accept-match", matchId);
  };

  const handleDeclineMatch = (matchId: string) => {
    console.log("decline-match", matchId);
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)]">
      {/* Header */}
      <section className="border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-[5%] py-12">
        <div className="mx-auto max-w-[1280px]">
          <Link
            href="/dashboard"
            className="text-sm font-500 text-[var(--color-primary)] hover:underline"
          >
            ← Back to dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-700 text-[var(--color-ink)]">
            Your matches
          </h1>
          <p className="mt-2 text-[var(--color-body)]">
            Top 5 matches generated every 2–4 weeks by Growth Advisors
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="px-[5%] py-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="space-y-6">
            {allMatches.map((match) => (
              <div
                key={match.id}
                className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-8 hover:shadow-md transition-shadow"
              >
                {/* Header with Score */}
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    {/* Fit Score and Status */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="rounded-full bg-[var(--color-primary)] px-4 py-1 text-sm font-600 text-white">
                        {match.score} fit score
                      </span>
                      <span className={`text-xs font-600 px-3 py-1 rounded-full ${
                        match.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        match.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {match.status === 'pending' ? '⏳ Pending' : match.status === 'accepted' ? '✓ Accepted' : '✗ Declined'}
                      </span>
                    </div>

                    {/* Summary */}
                    <h2 className="text-xl font-600 text-[var(--color-ink)]">
                      {match.summary}
                    </h2>
                    <p className="mt-2 text-[var(--color-body)]">
                      {match.reason}
                    </p>

                    {/* Other Party Info */}
                    <div className="mt-4 rounded-lg bg-[var(--color-surface-soft)] p-4">
                      <p className="text-xs font-600 text-[var(--color-muted)] uppercase">
                        Other party
                      </p>
                      <p className="mt-1 font-600 text-[var(--color-ink)]">
                        {match.otherParty}
                      </p>
                      <p className="text-sm text-[var(--color-body)]">
                        {match.otherSector}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    {match.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAcceptMatch(match.id)}
                          className="rounded-lg bg-[var(--color-primary)] px-6 py-2 font-500 text-white hover:bg-[var(--color-primary-active)] whitespace-nowrap"
                        >
                          Accept match
                        </button>
                        <button
                          onClick={() => handleDeclineMatch(match.id)}
                          className="rounded-lg border border-[var(--color-hairline)] px-6 py-2 font-500 text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)] whitespace-nowrap"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {match.status === 'accepted' && (
                      <button
                        className="rounded-lg bg-green-500 px-6 py-2 font-500 text-white whitespace-nowrap cursor-default"
                      >
                        ✓ Matched
                      </button>
                    )}
                    {match.status === 'declined' && (
                      <button
                        className="rounded-lg bg-gray-200 px-6 py-2 font-500 text-[var(--color-muted)] whitespace-nowrap cursor-default"
                      >
                        ✗ Declined
                      </button>
                    )}
                  </div>
                </div>

                {/* ASK and OFFER Details */}
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border border-[var(--color-hairline-soft)] bg-[var(--color-surface-soft)] p-4">
                    <p className="text-xs font-600 text-[var(--color-muted)] uppercase">
                      Their ASK
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {match.ask.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-blue-100 px-3 py-1 text-xs font-500 text-blue-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-[var(--color-hairline-soft)] bg-[var(--color-surface-soft)] p-4">
                    <p className="text-xs font-600 text-[var(--color-muted)] uppercase">
                      Their OFFER
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {match.offer.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-green-100 px-3 py-1 text-xs font-500 text-green-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-12 rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-6">
            <p className="text-sm font-600 text-[var(--color-muted)] uppercase">
              How matching works
            </p>
            <ul className="mt-4 space-y-3 text-sm text-[var(--color-body)]">
              <li>• <strong>Fit scores</strong> reflect alignment across sector focus, stage, and ASK/OFFER fit</li>
              <li>• <strong>Accepting</strong> a match consumes 1 credit and notifies the Growth Advisor</li>
              <li>• Once <strong>both parties accept</strong>, the Advisor facilitates the introduction</li>
              <li>• <strong>Declined matches</strong> are not re-surfaced; new matches arrive in the next cycle</li>
            </ul>
          </div>
        </div>
      </div>

      <BottomNav activeStage={2} nextHref="/deal-board" nextLabel="Deal board →" />
    </div>
  );
}
