import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/layout/sidebar";
import AdminTopbar from "@/components/admin/layout/topbar";
import { SidebarProvider } from "@/components/admin/layout/sidebar-context";

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
    <SidebarProvider>
      <AdminSidebar />
      <div className="flex-1 md:ml-[260px] flex flex-col min-h-screen relative min-w-0">
        <AdminTopbar />
        <main className="flex-1 p-4 md:p-margin-page bg-background overflow-x-hidden">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
