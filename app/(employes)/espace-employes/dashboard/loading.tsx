import { SkeletonCard } from "@/components/employes/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      {/* Greeting */}
      <section>
        <div className="h-6 w-40 animate-pulse rounded bg-neutral-200" />
        <div className="mt-2 h-4 w-52 animate-pulse rounded bg-neutral-200" />
      </section>

      {/* Missions du jour */}
      <section>
        <div className="mb-2 h-3 w-36 animate-pulse rounded bg-neutral-200" />
        <div className="flex flex-col gap-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>

      {/* CTA */}
      <div className="h-14 w-full animate-pulse rounded-2xl bg-neutral-200" />
    </div>
  );
}
