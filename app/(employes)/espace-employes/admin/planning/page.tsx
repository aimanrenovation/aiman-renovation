"use client";

import { PlanningGrid } from "@/components/employes/admin/planning-grid";

export default function PlanningPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Planning</h1>
      <PlanningGrid />
    </div>
  );
}
