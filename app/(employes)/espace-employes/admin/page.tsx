import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  redirect("/espace-employes/admin/dashboard");
}
