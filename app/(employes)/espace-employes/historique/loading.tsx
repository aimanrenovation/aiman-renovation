import { SkeletonCard } from "@/components/employes/skeleton";

export default function HistoriqueLoading() {
  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <div className="h-7 w-40 animate-pulse rounded bg-neutral-200" />
      {/* Tab bar skeleton */}
      <div className="flex gap-2">
        <div className="h-9 w-24 animate-pulse rounded-lg bg-neutral-200" />
        <div className="h-9 w-24 animate-pulse rounded-lg bg-neutral-200" />
      </div>
      <div className="flex flex-col gap-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
