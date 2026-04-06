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
  externalReferenceId: string;
  address?: string;
  city?: string;
  zip?: string;
}): Promise<MagicPlanProject> {
  const res = await fetch(`${MAGICPLAN_BASE_URL}/projects`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      name: params.name,
      email: "contact@aiman-renovation.fr",
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

  return res.json();
}

export function getMagicPlanDeepLink(projectId: string): string {
  return `magicplanstd://project/${projectId}`;
}

export function verifyWebhookKey(key: string): boolean {
  return key.trim() === (process.env.MAGICPLAN_API_KEY || "").trim();
}
