"use client";

import Link from "next/link";
import { DEAL_STAGES, DEAL_STAGE_DESCRIPTIONS } from "@/types/constants";

const dealsByStage = {
  "Discover": [
    {
      id: "deal-1",
      dealName: "Meridian x TechFlow",
      fitScore: 91,
      lastActivity: "2 days ago",
      nextStep: "Schedule discovery call",
      nextStepDue: "2024-05-20",
      isStaleFlagged: false,
    },
  ],
  "Intro": [
    {
      id: "deal-2",
      dealName: "Vanta x TechFlow",
      fitScore: 86,
      lastActivity: "5 days ago",
      nextStep: "Follow up with Vanta on discovery call",
      nextStepDue: "2024-05-15",
      isStaleFlagged: true,
    },
  ],
  "Proposal": [
    {
      id: "deal-3",
      dealName: "Helix x TechFlow",
      fitScore: 82,
      lastActivity: "1 day ago",
      nextStep: "Send revised proposal",
      nextStepDue: "2024-05-18",
      isStaleFlagged: false,
    },
  ],
  "Negotiation": [
    {
      id: "deal-4",
      dealName: "CloudCore x TechFlow",
      fitScore: 78,
      lastActivity: "3 days ago",
      nextStep: "Review redlined terms",
      nextStepDue: "2024-05-19",
      isStaleFlagged: true,
    },
  ],
  "Closed": [
    {
      id: "deal-5",
      dealName: "Nexus x TechFlow",
      fitScore: 88,
      lastActivity: "1 week ago",
      nextStep: null,
      nextStepDue: null,
      isStaleFlagged: false,
    },
  ],
};

export default function DealBoardPage() {
  const handleMoveCard = (dealId: string, fromStage: string, toStage: string) => {
    console.log("move-deal", { dealId, fromStage, toStage });
  };

  const handleUpdateDeal = (dealId: string) => {
    console.log("update-deal", dealId);
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-soft)]">
      {/* Header */}
      <section className="border-b border-[var(--color-hairline)] bg-[var(--color-canvas)] px-[5%] py-12">
        <div className="mx-auto max-w-full">
          <Link
            href="/dashboard"
            className="text-sm font-500 text-[var(--color-primary)] hover:underline"
          >
            ← Back to dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-700 text-[var(--color-ink)]">
            Deal board
          </h1>
          <p className="mt-2 text-[var(--color-body)]">
            Track progress and move deals forward
          </p>
        </div>
      </section>

      {/* Kanban Board */}
      <div className="overflow-x-auto px-[5%] py-12">
        <div className="mx-auto w-full max-w-full">
          <div className="flex gap-6 min-w-[fit-content]">
            {DEAL_STAGES.map((stage) => (
              <div
                key={stage}
                className="w-96 flex-shrink-0 rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)]"
              >
                {/* Stage Header */}
                <div className="border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4">
                  <h2 className="font-600 text-[var(--color-ink)]">{stage}</h2>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {DEAL_STAGE_DESCRIPTIONS[stage]}
                  </p>
                  <div className="mt-3 rounded-lg bg-[var(--color-canvas)] px-2 py-1 text-center text-sm font-600 text-[var(--color-muted)]">
                    {dealsByStage[stage as keyof typeof dealsByStage]?.length || 0} deals
                  </div>
                </div>

                {/* Cards */}
                <div className="space-y-3 p-4">
                  {dealsByStage[stage as keyof typeof dealsByStage]?.map((deal) => (
                    <div
                      key={deal.id}
                      className={`rounded-lg border p-4 cursor-pointer hover:shadow-md transition-all ${
                        deal.isStaleFlagged
                          ? 'border-orange-300 bg-orange-50'
                          : 'border-[var(--color-hairline)] bg-[var(--color-canvas)]'
                      }`}
                    >
                      {/* Deal Header */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-600 text-[var(--color-ink)] text-sm">
                          {deal.dealName}
                        </h3>
                        {deal.isStaleFlagged && (
                          <span className="text-lg">⚠️</span>
                        )}
                      </div>

                      {/* Deal Stats */}
                      <div className="mt-3 flex gap-2 text-xs text-[var(--color-muted)]">
                        <span className="rounded-full bg-[var(--color-surface-soft)] px-2 py-1">
                          📊 {deal.fitScore} fit
                        </span>
                        <span className="rounded-full bg-[var(--color-surface-soft)] px-2 py-1">
                          ⏱️ {deal.lastActivity}
                        </span>
                      </div>

                      {/* Next Step */}
                      {deal.nextStep && (
                        <div className="mt-3 rounded-lg bg-[var(--color-surface-soft)] p-2">
                          <p className="text-xs font-600 text-[var(--color-muted)]">
                            Next step
                          </p>
                          <p className="mt-1 text-xs text-[var(--color-body)]">
                            {deal.nextStep}
                          </p>
                          {deal.nextStepDue && (
                            <p className="mt-1 text-xs text-[var(--color-muted)]">
                              Due: {deal.nextStepDue}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        onClick={() => handleUpdateDeal(deal.id)}
                        className="mt-3 w-full rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-xs font-500 text-white hover:bg-[var(--color-primary-active)]"
                      >
                        Update
                      </button>
                    </div>
                  ))}

                  {(!dealsByStage[stage as keyof typeof dealsByStage] ||
                    dealsByStage[stage as keyof typeof dealsByStage]?.length === 0) && (
                    <p className="py-8 text-center text-sm text-[var(--color-muted)]">
                      No deals yet
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Box */}
      <section className="px-[5%] py-8">
        <div className="mx-auto max-w-full rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6">
          <p className="text-sm font-600 text-[var(--color-muted)] uppercase">
            Deal board discipline
          </p>
          <ul className="mt-4 space-y-3 text-sm text-[var(--color-body)]">
            <li>• <strong>Update every 7 days</strong> or your deal will be flagged as stale</li>
            <li>• <strong>Move cards forward</strong> when stage criteria are met</li>
            <li>• <strong>Set next steps</strong> with clear due dates</li>
            <li>• <strong>Advisor review</strong> required before moving to Closed</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
