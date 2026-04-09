"use client";

import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}

export function StatCard({ icon, label, value, sub }: StatCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-gray-700 bg-gray-800/50 p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600/20 text-red-400">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="mt-1 text-2xl font-bold text-white">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}
