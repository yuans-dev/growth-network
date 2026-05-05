export default function NotAuthorizedPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-2xl font-semibold text-[var(--color-ink)]">
        Not authorized
      </h1>
      <p className="mt-3 text-sm text-[var(--color-muted)]">
        You do not have permission to view this page.
      </p>
    </div>
  );
}
