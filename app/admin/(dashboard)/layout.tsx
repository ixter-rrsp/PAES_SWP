import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/layout/sidebar";
import AdminTopbar from "@/components/admin/layout/topbar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <>
      <AdminSidebar />
      <div className="flex-1 md:ml-[260px] flex flex-col min-h-screen relative">
        <AdminTopbar />
        <main className="flex-1 p-margin-page bg-background">{children}</main>
      </div>
    </>
  );
}
