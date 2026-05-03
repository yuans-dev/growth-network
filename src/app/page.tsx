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
              <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              Free mini-masterclass
            </span>
            <div className="mt-6 font-display text-[clamp(56px,9vw,120px)] font-black uppercase leading-[0.95] tracking-[-0.02em]">
              <div className="text-[var(--color-text-primary)]">
                Where verified
              </div>
              <div className="text-[var(--color-accent)]">introductions</div>
              <div className="text-[var(--color-text-primary)]">
                become real deals
              </div>
            </div>
            <p className="mt-6 max-w-xl text-[20px] leading-relaxed text-[var(--color-text-secondary)]">
              The Growth Network is a private deal environment. AI filters
              signal. Advisors protect standards. Nothing moves without consent.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                className="gn-btn-primary"
                type="button"
                onClick={handleRegister}
              >
                Register now -&gt;
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
            className="rounded-[8px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8"
            onSubmit={(event) => {
              event.preventDefault();
              handleRegister();
            }}
          >
            <p className="gn-overline">Request access</p>
            <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
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
              Request invite -&gt;
            </button>
            <p className="mt-4 text-xs text-[var(--color-text-muted)]">
              Access is gated. Verification follows before any introductions.
            </p>
          </form>
        </div>
      </section>

      <section className="bg-[var(--color-bg-surface)] px-[5%] py-32">
        <div className="mx-auto w-full max-w-[1280px]">
          <p className="gn-overline">Masterclass agenda</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {agendaItems.map((item) => (
              <div key={item} className="gn-card">
                <h3 className="text-[16px] font-semibold uppercase tracking-[0.05em]">
                  {item}
                </h3>
                <p className="mt-3 text-[15px] text-[var(--color-text-secondary)]">
                  Designed for operators who value signal, standards, and real
                  execution.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-[5%] py-32">
        <div className="mx-auto w-full max-w-[1280px]">
          <p className="gn-overline">Ideal attendee</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {attendeeArchetypes.map((item) => (
              <div key={item.title} className="gn-card">
                <h3 className="text-[16px] font-semibold uppercase tracking-[0.05em]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] text-[var(--color-text-secondary)]">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-[5%] py-32">
        <div className="absolute inset-0 bg-[var(--color-bg-surface)] opacity-90" />
        <div className="relative z-10 mx-auto w-full max-w-[1280px]">
          <p className="gn-overline">Results</p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {proofStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[4px] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-7"
              >
                <div className="font-display text-[56px] font-black leading-none text-[var(--color-accent)]">
                  {stat.value}
                </div>
                <div className="mt-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-[5%] py-32">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-6 text-left">
          <div className="font-display text-[clamp(48px,7vw,110px)] font-black uppercase leading-[0.92]">
            <div className="text-[var(--color-text-primary)]">
              Join the room
            </div>
            <div className="text-[var(--color-accent)]">built for closure</div>
          </div>
          <p className="max-w-2xl text-[18px] text-[var(--color-text-secondary)]">
            The Growth Network is not open access. Start with the masterclass,
            then move into verification and matching.
          </p>
          <button
            className="gn-btn-primary"
            type="button"
            onClick={handleRegister}
          >
            Reserve seat -&gt;
          </button>
        </div>
      </section>

      <BottomNav
        activeStage={0}
        nextHref="/stage-1"
        nextLabel="Stage 01 - Membership -&gt;"
      />
    </div>
  );
}
