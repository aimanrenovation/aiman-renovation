import { redirect } from "next/navigation";

/**
 * Root /espace-employes → redirect to dashboard.
 * Without this page.tsx, Next.js returns 404 on the index route.
 */
export default function EmployesIndexPage() {
  redirect("/espace-employes/dashboard");
}
