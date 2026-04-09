import { requireActiveEmploye } from "@/lib/employes/guards";
import { FicheMissionClient } from "@/components/employes/fiche-mission";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MissionPage({ params }: Props) {
  await requireActiveEmploye();
  const { id } = await params;

  return <FicheMissionClient chantierId={id} />;
}
