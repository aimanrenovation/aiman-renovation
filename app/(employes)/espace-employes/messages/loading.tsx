export default function MessagesLoading() {
  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <div className="h-7 w-32 animate-pulse rounded bg-neutral-200" />
      <ul className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-neutral-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
