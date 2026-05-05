"use client";

import BottomNav from "./_components/BottomNav";

const agendaItems = [
  "Deal alignment framework",
  "Verification and access standards",
  "Matching cycle structure",
  "Advisor review checkpoints",
  "Event conversion protocols",
  "Deal board discipline",
];

const attendeeArchetypes = [
  {
    title: "Founder / Operator",
    detail: "Scaling leaders seeking verified introductions and capital fit.",
  },
  {
    title: "Capital Allocator",
    detail: "Investors and family offices prioritizing structured deal flow.",
  },
  {
    title: "Strategic Operator",
    detail: "Operators with execution leverage and real outcomes to offer.",
  },
  {
    title: "Growth Advisor",
    detail: "Sector specialists who guide standards and introductions.",
  },
];

const proofStats = [
  { value: "2.3M", label: "Deal value validated" },
  { value: "147", label: "Verified members" },
  { value: "92%", label: "Match acceptance" },
];

export default function Home() {
  const handleRegister = () => {
    console.log("register-masterclass");
  };

  const handleIntake = () => {
    console.log("book-intake");
  };

  return (
    <div className="pb-[96px]">
      <section className="relative gn-hero overflow-hidden px-[10%] py-40">
        <div className="relative z-10 mx-auto grid w-full max-w-[1200px] gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="gn-badge">
              <span className="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
              Free mini-masterclass
            </span>
            <div className="mt-6 font-display text-[clamp(56px,9vw,120px)] font-700 leading-[0.95]">
              <div className="text-[var(--color-ink)]">
                Where verified
              </div>
              <div className="text-[var(--color-primary)]">introductions</div>
              <div className="text-[var(--color-ink)]">
                become real deals
              </div>
            </div>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-body)]">
              The Growth Network is a private deal environment. AI filters
              signal. Advisors protect standards. Nothing moves without consent.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                className="gn-btn-primary"
                type="button"
                onClick={handleRegister}
              >
                Register now →
              </button>
              <button
                className="gn-btn-secondary"
                type="button"
                onClick={handleIntake}
              >
                Book intake call
              </button>
            </div>
          </div>
          <form
            className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-8"
            onSubmit={(event) => {
              event.preventDefault();
              handleRegister();
            }}
          >
            <p className="text-sm font-600 text-[var(--color-muted)] uppercase tracking-wide">Request access</p>
            <p className="mt-4 text-sm text-[var(--color-body)]">
              Submit your details for the intake call and masterclass invite.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                className="gn-input"
                aria-label="First name"
                placeholder="First name"
              />
              <input
                className="gn-input"
                aria-label="Last name"
                placeholder="Last name"
              />
            </div>
            <div className="mt-4 grid gap-4">
              <input
                className="gn-input"
                aria-label="Work email"
                placeholder="Work email"
              />
              <input
                className="gn-input"
                aria-label="Company"
                placeholder="Company"
              />
              <input
                className="gn-input"
                aria-label="Role"
                placeholder="Role"
              />
            </div>
            <button className="mt-6 w-full gn-btn-primary" type="submit">
              Request invite →
            </button>
            <p className="mt-4 text-xs text-[var(--color-muted)]">
              Access is gated. Verification follows before any introductions.
            </p>
          </form>
        </div>
      </section>

      <section className="bg-[var(--color-surface-soft)] px-[5%] py-32">
        <div className="mx-auto w-full max-w-[1280px]">
          <p className="text-sm font-600 text-[var(--color-muted)] uppercase tracking-wide">Masterclass agenda</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {agendaItems.map((item) => (
              <div key={item} className="gn-card">
                <h3 className="text-base font-600 uppercase tracking-wide text-[var(--color-ink)]">
                  {item}
                </h3>
                <p className="mt-3 text-sm text-[var(--color-body)]">
                  Designed for operators who value signal, standards, and real
                  execution.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-canvas)] px-[5%] py-32">
        <div className="mx-auto w-full max-w-[1280px]">
          <p className="text-sm font-600 text-[var(--color-muted)] uppercase tracking-wide">Ideal attendee</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {attendeeArchetypes.map((item) => (
              <div key={item.title} className="gn-card">
                <h3 className="text-base font-600 uppercase tracking-wide text-[var(--color-ink)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--color-body)]">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-surface-strong)] px-[5%] py-32">
        <div className="relative z-10 mx-auto w-full max-w-[1280px]">
          <p className="text-sm font-600 text-[var(--color-muted)] uppercase tracking-wide">Results</p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {proofStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-8"
              >
                <div className="text-5xl font-700 leading-none text-[var(--color-primary)]">
                  {stat.value}
                </div>
                <div className="mt-4 text-sm font-600 text-[var(--color-muted)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-canvas)] px-[5%] py-32">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-6 text-left">
          <div className="font-display text-[clamp(32px,6vw,56px)] font-700 leading-tight">
            <div className="text-[var(--color-ink)]">
              Join the room
            </div>
            <div className="text-[var(--color-primary)]">built for closure</div>
          </div>
          <p className="max-w-2xl text-lg text-[var(--color-body)]">
            The Growth Network is not open access. Start with the masterclass,
            then move into verification and matching.
          </p>
          <button
            className="gn-btn-primary"
            type="button"
            onClick={handleRegister}
          >
            Reserve seat →
          </button>
        </div>
      </section>

      <BottomNav
        activeStage={0}
        nextHref="/stage-1"
        nextLabel="Stage 01 - Membership →"
      />
    </div>
  );
}
