import { requirePatron } from "@/lib/employes/admin-guard";
import { ParrainageDashboard } from "@/components/employes/parrainage-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminParrainagesPage() {
  await requirePatron();

  return <ParrainageDashboard />;
}
