export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-300" />
        </div>
        <div className="space-y-1 text-right">
          <div className="h-3 w-10 animate-pulse rounded bg-neutral-200" />
          <div className="h-3 w-10 animate-pulse rounded bg-neutral-300" />
        </div>
      </div>
      <div className="mt-3 h-8 w-full animate-pulse rounded-lg bg-neutral-200" />
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="flex flex-col gap-3">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
