import { SkeletonCard } from "@/components/employes/skeleton";

export default function MissionsLoading() {
  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <div className="h-7 w-44 animate-pulse rounded bg-neutral-200" />
      <div className="flex flex-col gap-3">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
