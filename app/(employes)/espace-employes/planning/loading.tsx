import { SkeletonCard } from "@/components/employes/skeleton";

export default function PlanningLoading() {
  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <div className="h-7 w-48 animate-pulse rounded bg-neutral-200" />
      <div className="flex flex-col gap-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
