export default function TopHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-nav-bg)] backdrop-blur-md">
      <div className="mx-auto flex h-[64px] w-full max-w-[1280px] items-center gap-4 px-[5%]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            Logo
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
              The Growth Network
            </p>
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-label)]">
              by Exoasia
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
