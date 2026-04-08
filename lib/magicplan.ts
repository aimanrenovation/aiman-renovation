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
  // IMPORTANT: MagicPlan API v2 requires the `email` field to match an
  // existing user in the customer account. Passing an external client email
  // returns HTTP 401. So we always use AIMAN's email to create the project
  // under his account, and we tag the client via:
  //   - The project name (includes client email)
  //   - The external_reference_id (includes client email)
  // This way Aiman sees the project in his MagicPlan dashboard with clear
  // client identification, even though the client cannot directly access it.
  const res = await fetch(`${MAGICPLAN_BASE_URL}/projects`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      name: `${params.name} — ${params.clientEmail}`,
      email: "contact@aiman-renovation.fr",
      external_reference_id: `${params.externalReferenceId}__${params.clientEmail}`,
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
