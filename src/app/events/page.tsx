"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  fetchEvents,
  markEventAttendance,
  registerForEvent,
} from "@/lib/app-data";
import { useAuth } from "../providers";

type UpcomingEvent = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  max_attendees: number | null;
  registered: boolean;
  attended: boolean;
};

type PastEvent = {
  id: string;
  title: string;
  type: string;
  starts_at: string;
};

export default function EventsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState<UpcomingEvent[]>([]);
  const [past, setPast] = useState<PastEvent[]>([]);

  const load = async () => {
    if (!user?.id) return;
    const next = await fetchEvents(supabase, user.id);
    setUpcoming(next.upcoming as UpcomingEvent[]);
    setPast(next.past as PastEvent[]);
  };

  useEffect(() => {
    void load();
  }, [user?.id]);

  const handleRegister = async (eventId: string) => {
    if (!user?.id) return;
    const { error } = await registerForEvent(supabase, user.id, eventId);
    if (error) {
      window.alert(error);
      return;
    }
    await load();
  };

  const handleAttendance = async (eventId: string) => {
    if (!user?.id) return;
    const { error } = await markEventAttendance(supabase, user.id, eventId);
    if (error) {
      window.alert(error);
      return;
    }
    await load();
  };

  return (
    <div className="min-h-screen bg-(--color-canvas)">
      <section className="border-b border-(--color-hairline) bg-(--color-surface-soft) px-[5%] py-10">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/dashboard"
            className="text-sm text-(--color-primary) hover:underline"
          >
            ← Back to dashboard
          </Link>
          <h1 className="mt-3 text-3xl font-semibold text-(--color-ink)">
            Events
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-[5%] py-10">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-(--color-ink)">Upcoming</h2>
          {upcoming.length === 0 ? (
            <EmptyState text="No upcoming events scheduled." />
          ) : (
            upcoming.map((event) => (
              <article
                key={event.id}
                className="rounded-[16px] border border-(--color-hairline) bg-(--color-canvas) p-5"
              >
                <h3 className="text-base font-semibold text-(--color-ink)">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-(--color-body)">
                  {new Date(event.starts_at).toLocaleString()} ·{" "}
                  {event.location || "TBD"}
                </p>
                {event.description && (
                  <p className="mt-2 text-sm text-(--color-body)">
                    {event.description}
                  </p>
                )}
                <div className="mt-4 flex gap-3">
                  {event.registered ? (
                    <>
                      <span className="rounded-[8px] bg-green-100 px-3 py-2 text-xs font-semibold text-green-700">
                        Registered
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAttendance(event.id)}
                        className="gn-btn-secondary"
                      >
                        Mark attended
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRegister(event.id)}
                      className="gn-btn-primary"
                    >
                      Register
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-(--color-ink)">Past</h2>
          {past.length === 0 ? (
            <EmptyState text="No past events available." />
          ) : (
            past.map((event) => (
              <article
                key={event.id}
                className="rounded-[16px] border border-(--color-hairline) bg-(--color-surface-soft) p-4"
              >
                <h3 className="text-sm font-semibold text-(--color-ink)">
                  {event.title}
                </h3>
                <p className="mt-1 text-xs text-(--color-muted)">
                  {new Date(event.starts_at).toLocaleDateString()}
                </p>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-[16px] border border-(--color-hairline) bg-(--color-surface-soft) p-6 text-sm text-(--color-body)">
      {text}
    </div>
  );
}
