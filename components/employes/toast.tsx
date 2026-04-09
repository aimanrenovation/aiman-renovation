"use client";

import { useToast } from "@/lib/employes/use-toast";

const variantStyles: Record<string, string> = {
  success: "bg-green-600",
  error: "bg-[#E50000]",
  info: "bg-blue-600",
};

export function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-50 mx-auto flex max-w-md flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-slide-up w-full rounded-2xl px-5 py-3 text-center text-sm font-medium text-white shadow-sm ${variantStyles[t.variant]}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
