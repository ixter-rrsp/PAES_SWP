"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useSidebar } from "./sidebar-context";

export default function AdminTopbar() {
  const router = useRouter();
  const { toggle } = useSidebar();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="bg-surface docked full-width top-0 sticky border-b border-outline-variant flex justify-between items-center h-16 px-4 md:px-margin-page gap-2 z-30 transition-all">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          onClick={toggle}
          aria-label="Open menu"
          className="text-on-surface-variant hover:bg-surface-container-low p-2 -ml-2 rounded-full transition-colors duration-200 flex items-center justify-center shrink-0 md:hidden"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <Image src="/PAES.svg" alt="Pag-Asa Elementary School logo" width={28} height={28} className="shrink-0" />
          <span className="font-headline-sm text-headline-sm font-bold text-primary truncate">
            Pag-Asa Elementary School
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        <div className="flex items-center gap-2 md:gap-4 pl-2 md:pl-4 border-l border-outline-variant py-1">
          <button
            onClick={handleLogout}
            className="font-label-lg text-label-lg text-primary hover:bg-surface-container-low px-2 md:px-3 py-1.5 rounded-DEFAULT transition-colors duration-200 whitespace-nowrap"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
