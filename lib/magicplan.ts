const MAGICPLAN_BASE_URL = "https://cloud.magicplan.app/api/v2";

function getHeaders() {
  return {
    customer: (process.env.MAGICPLAN_CUSTOMER_ID || "").trim(),
    key: (process.env.MAGICPLAN_API_KEY || "").trim(),
    "Content-Type": "application/json",
  };
}

export interface MagicPlanProject {
  id: string;
  name: string;
  external_reference_id: string;
}

export async function createMagicPlanProject(params: {
  name: string;
  clientEmail: string;
  externalReferenceId: string;
  address?: string;
  city?: string;
  zip?: string;
}): Promise<MagicPlanProject> {
  // Pass the CLIENT's email so MagicPlan invites them to the project.
  // The project stays visible in AIMAN's account (via customer_id headers),
  // but the client also gets access through their own MagicPlan account.
  const res = await fetch(`${MAGICPLAN_BASE_URL}/projects`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      name: params.name,
      email: params.clientEmail,
      external_reference_id: params.externalReferenceId,
      address_1: params.address,
      city: params.city,
      zip: params.zip,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MagicPlan API error ${res.status}: ${text}`);
  }

  const json = await res.json();
  return json.data;
}

export function getMagicPlanDeepLink(projectId: string): string {
  return `magicplanstd://project/${projectId}`;
}

export function verifyWebhookKey(key: string): boolean {
  return key.trim() === (process.env.MAGICPLAN_API_KEY || "").trim();
}
