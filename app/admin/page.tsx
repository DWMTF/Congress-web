import { redirect } from "next/navigation";
import { getCurrentUserWithRole } from "@/lib/auth/roles";
import Navbar from "@/components/Navbar";
import AdminDashboard from "@/components/Admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Console",
  description: "Administrative console for managing registrations, users, and audit logs.",
};

export default async function AdminPage() {
  const current = await getCurrentUserWithRole();

  if (!current) {
    redirect("/login?next=/admin");
  }

  if (!current.isAdmin) {
    redirect("/?error=unauthorized_admin");
  }

  return (
    <main className="min-h-screen bg-paper pb-16">
      <Navbar />
      <AdminDashboard
        currentUser={{
          id: current.user.id,
          email: current.user.email ?? "",
          role: current.role,
        }}
      />
    </main>
  );
}
