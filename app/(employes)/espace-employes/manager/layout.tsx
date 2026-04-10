import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getEmployeSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function ManagerLayout({ children }: { children: ReactNode }) {
  const session = await getEmployeSession();
  if (!session) redirect("/espace-employes/login");

  if (session.role !== "chef_chantier" && session.role !== "patron") {
    redirect("/espace-employes/dashboard");
  }

  return <>{children}</>;
}
