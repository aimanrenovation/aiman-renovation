import { PlanningWeek } from "@/components/employes/planning-week";

export const dynamic = "force-dynamic";

export default function PlanningPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Mon planning</h1>
      <PlanningWeek />
    </div>
  );
}
