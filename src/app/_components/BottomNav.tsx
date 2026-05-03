"use client";

import Link from "next/link";

type BottomNavProps = {
  activeStage: number;
  nextHref?: string;
  nextLabel?: string;
};

const stages = [0, 1, 2, 3, 4];

export default function BottomNav({
  activeStage,
  nextHref,
  nextLabel,
}: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-nav-bg)] backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between px-[5%]">
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {stages.map((stage) => (
            <span
              key={stage}
              className={`h-[6px] w-[6px] rounded-full ${
                stage === activeStage
                  ? "bg-[var(--color-accent)] animate-pulse"
                  : "bg-[#333333]"
              }`}
            />
          ))}
        </div>
        <div className="flex flex-1 justify-end">
          {nextHref && nextLabel ? (
            <Link
              className="inline-flex items-center gap-3 rounded-[4px] bg-[var(--color-accent)] px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-on-accent)] shadow-[0_0_20px_var(--color-accent-glow-sm)]"
              href={nextHref}
            >
              <span className="hidden sm:inline">{nextLabel}</span>
              <span className="sm:hidden">Next -&gt;</span>
            </Link>
          ) : (
            <div className="h-[40px]" />
          )}
        </div>
      </div>
    </div>
  );
}
