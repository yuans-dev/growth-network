"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchDealCards, touchDealCard } from "@/lib/app-data";
import { useAuth } from "../providers";

const BOARD_COLUMNS = [
  "Discover / Qualified",
  "Intro & Scoping",
  "Proposal / Pilot",
  "Negotiation / Legal",
  "Closed-Won / Pilot Go",
  "Closed-Lost / On Hold",
] as const;

type DealCard = {
  id: string;
  title: string;
  stage: string;
  fit_score: number | null;
  confidence: string;
  impact_projection: string | null;
  next_action: string | null;
  next_action_due: string | null;
  blocker: string | null;
  close_reason_code: string | null;
  last_updated_at: string;
};

export default function DealBoardPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  const [cards, setCards] = useState<DealCard[]>([]);

  const load = async () => {
    if (!user?.id) return;
    const next = (await fetchDealCards(supabase, user.id)) as DealCard[];
    setCards(next);
  };

  useEffect(() => {
    void load();
  }, [user?.id]);

  const handleTouch = async (id: string) => {
    const { error } = await touchDealCard(supabase, id);
    if (error) {
      window.alert(error);
      return;
    }
    await load();
  };

  const grouped = BOARD_COLUMNS.map((stage) => ({
    stage,
    cards: cards.filter((card) => card.stage === stage),
  }));

  return (
    <div className="min-h-screen bg-(--color-surface-soft)">
      <section className="border-b border-(--color-hairline) bg-(--color-canvas) px-[5%] py-10">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/dashboard"
            className="text-sm text-(--color-primary) hover:underline"
          >
            Back to dashboard
          </Link>
          <h1 className="mt-3 text-3xl font-semibold text-(--color-ink)">
            Deal board
          </h1>
        </div>
      </section>

      <div className="overflow-x-auto px-[5%] py-10">
        <div className="flex min-w-fit gap-5">
          {grouped.map((column) => (
            <div
              key={column.stage}
              className="w-80 shrink-0 rounded-[16px] border border-(--color-hairline) bg-(--color-canvas)"
            >
              <div className="border-b border-(--color-hairline) bg-(--color-surface-soft) p-4">
                <h2 className="text-sm font-semibold text-(--color-ink)">
                  {column.stage}
                </h2>
                <p className="mt-1 text-xs text-(--color-muted)">
                  {column.cards.length} cards
                </p>
              </div>
              <div className="space-y-3 p-3">
                {column.cards.map((card) => {
                  const ageDays = Math.floor(
                    (Date.now() - new Date(card.last_updated_at).getTime()) /
                      86400000,
                  );
                  const isStale = ageDays >= 7;
                  const isNegotiationEscalation =
                    column.stage === "Negotiation / Legal" && ageDays >= 14;

                  return (
                    <article
                      key={card.id}
                      className={`rounded-[12px] border p-3 ${
                        isStale
                          ? "border-orange-300 bg-orange-50"
                          : "border-(--color-hairline) bg-(--color-canvas)"
                      }`}
                    >
                      <h3 className="text-sm font-semibold text-(--color-ink)">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-xs text-(--color-body)">
                        Fit {card.fit_score ?? "-"} · {card.confidence}{" "}
                        confidence
                      </p>
                      {card.impact_projection && (
                        <p className="mt-1 text-xs text-(--color-body)">
                          {card.impact_projection}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-(--color-muted)">
                        {ageDays} days since update
                      </p>
                      {isStale && (
                        <p className="mt-1 text-xs font-semibold text-orange-700">
                          {isNegotiationEscalation
                            ? "Escalation: 14+ days in Negotiation / Legal"
                            : "Stale: 7+ days without update"}
                        </p>
                      )}
                      {card.next_action && (
                        <p className="mt-2 text-xs text-(--color-body)">
                          Next: {card.next_action}
                        </p>
                      )}
                      {card.close_reason_code && (
                        <p className="mt-1 text-xs text-(--color-body)">
                          Reason: {card.close_reason_code}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => handleTouch(card.id)}
                        className="mt-3 w-full rounded-[8px] bg-(--color-primary) px-3 py-1.5 text-xs font-medium text-white hover:bg-(--color-primary-active)"
                      >
                        Mark updated
                      </button>
                    </article>
                  );
                })}

                {column.cards.length === 0 && (
                  <div className="rounded-[12px] border border-dashed border-(--color-hairline) p-4 text-center text-xs text-(--color-muted)">
                    No cards
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
