"use client";

import Link from "next/link";
import BottomNav from "../_components/BottomNav";
import { EVENT_TYPES } from "@/types/constants";

const upcomingEvents = [
  {
    id: "event-1",
    title: "Private Dinner - May Edition",
    type: "dinner" as const,
    date: "May 18, 2024",
    time: "7:00 PM - 9:30 PM",
    location: "The Manila Hotel, Manila",
    attendees: 24,
    maxAttendees: 30,
    description: "Intimate dinner for founders and operators to build relationships and share growth strategies.",
    registered: true,
  },
  {
    id: "event-2",
    title: "Weekly Session - Product & Growth",
    type: "session" as const,
    date: "May 22, 2024",
    time: "10:00 AM - 11:30 AM",
    location: "Zoom + Growth Network HQ",
    attendees: 42,
    maxAttendees: null,
    description: "Monthly briefing on deal flow, platform updates, and growth frameworks for members.",
    registered: false,
  },
  {
    id: "event-3",
    title: "Pitch Night - May Demo Day",
    type: "pitch-night" as const,
    date: "May 28, 2024",
    time: "6:00 PM - 8:00 PM",
    location: "Growth Network HQ, Manila",
    attendees: 18,
    maxAttendees: 25,
    description: "Members pitch their ASKs and OFFERs. Get 1 pitch credit per event.",
    registered: false,
  },
  {
    id: "event-4",
    title: "Masterclass - Scaling from SME to Enterprise",
    type: "masterclass" as const,
    date: "June 5, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Growth Network HQ, Manila",
    attendees: 35,
    maxAttendees: 50,
    description: "Expert-led masterclass on organizational scaling, team building, and governance.",
    registered: false,
  },
];

const pastEvents = [
  {
    id: "past-1",
    title: "April Private Dinner",
    type: "dinner" as const,
    date: "April 20, 2024",
    attendees: 28,
  },
  {
    id: "past-2",
    title: "April Pitch Night",
    type: "pitch-night" as const,
    date: "April 26, 2024",
    attendees: 22,
  },
];

export default function EventsPage() {
  const handleRegister = (eventId: string) => {
    console.log("register-event", eventId);
  };

  const handleMarkAttended = (eventId: string) => {
    console.log("mark-attended", eventId);
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
            Events
          </h1>
          <p className="mt-2 text-[var(--color-body)]">
            Attend weekly sessions, dinners, and pitch nights
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="px-[5%] py-12">
        <div className="mx-auto max-w-[1280px]">
          {/* Upcoming Events */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-700 text-[var(--color-ink)]">
              Upcoming events
            </h2>
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-8"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    {/* Event Info */}
                    <div className="flex-1">
                      {/* Type Badge */}
                      <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-600 text-blue-700">
                        <span>{EVENT_TYPES[event.type].icon}</span>
                        <span>{EVENT_TYPES[event.type].label}</span>
                      </div>

                      {/* Title */}
                      <h3 className="mt-4 text-xl font-600 text-[var(--color-ink)]">
                        {event.title}
                      </h3>

                      {/* Details */}
                      <div className="mt-4 space-y-2 text-sm text-[var(--color-body)]">
                        <p>📅 {event.date}</p>
                        <p>🕐 {event.time}</p>
                        <p>📍 {event.location}</p>
                        <p>👥 {event.attendees} attending {event.maxAttendees && `/ ${event.maxAttendees} max`}</p>
                      </div>

                      {/* Description */}
                      <p className="mt-4 text-[var(--color-body)]">
                        {event.description}
                      </p>

                      {/* Pitch Credit Note */}
                      {event.type === "pitch-night" && (
                        <div className="mt-4 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                          <p className="text-sm font-500 text-yellow-700">
                            🎤 Earn 1 pitch credit at this event
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                      {event.registered ? (
                        <>
                          <button className="rounded-lg bg-green-500 px-6 py-2 font-500 text-white whitespace-nowrap cursor-default">
                            ✓ Registered
                          </button>
                          <button
                            onClick={() => handleMarkAttended(event.id)}
                            className="rounded-lg border border-[var(--color-ink)] px-6 py-2 font-500 text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)] whitespace-nowrap"
                          >
                            Mark attended
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleRegister(event.id)}
                          className="rounded-lg bg-[var(--color-primary)] px-6 py-2 font-500 text-white hover:bg-[var(--color-primary-active)] whitespace-nowrap"
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Past Events */}
          <section>
            <h2 className="mb-8 text-2xl font-700 text-[var(--color-ink)]">
              Past events
            </h2>
            <div className="space-y-4">
              {pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-xs font-600 text-gray-700">
                        <span>{EVENT_TYPES[event.type].icon}</span>
                        <span>{EVENT_TYPES[event.type].label}</span>
                      </div>
                      <h4 className="mt-2 font-600 text-[var(--color-ink)]">
                        {event.title}
                      </h4>
                      <p className="text-sm text-[var(--color-muted)]">
                        {event.date} • {event.attendees} attended
                      </p>
                    </div>
                    <button className="text-sm font-500 text-[var(--color-primary)] hover:underline">
                      View recap →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <BottomNav activeStage={2} nextHref="/documents" nextLabel="Documents →" />
    </div>
  );
}
