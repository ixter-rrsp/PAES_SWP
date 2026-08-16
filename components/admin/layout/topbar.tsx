"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminTopbar() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="bg-surface docked full-width top-0 sticky border-b border-outline-variant flex justify-between items-center h-16 px-margin-page z-30 transition-all">
      <div className="flex-1 max-w-md relative flex items-center">
        <span className="material-symbols-outlined absolute left-3 text-on-surface-variant pointer-events-none">
          search
        </span>
        <input
          className="w-full pl-10 pr-4 py-1.5 bg-surface-container-low border border-transparent rounded-DEFAULT text-body-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow placeholder:text-on-surface-variant/70"
          placeholder="Search EduAdmin..."
          type="text"
        />
      </div>

      <div className="flex items-center gap-2">
        <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors duration-200 flex items-center justify-center relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors duration-200 flex items-center justify-center mr-4">
          <span className="material-symbols-outlined">help</span>
        </button>
        <div className="flex items-center gap-4 pl-4 border-l border-outline-variant py-1">
          <img
            className="w-8 h-8 rounded-full object-cover border border-outline-variant"
            alt="Admin avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqBObWEE-w5WVPxb8a5V_hiAeBYJcIAXiQAZtDZxXMEJU4I9XaTWrMx5guAcSs5jrB1jsGUuUlIb0FNIcbTz6Cz4OJNlOBX9ofgTxAFPdanfelhg4YnHLzBseTiiPyp6Wk85vx1ZQJ42IyXThMALSxI-VrdX8yPsxpn6ZTnZ4hmgBHdg9ycdo4EtOrqHTTs2xQqjOV5HD9Kh0ZlP-SW_P5eY_YWLr_6z3iIjYgS05Up_h6InhmM34i"
          />
          <button
            onClick={handleLogout}
            className="font-label-lg text-label-lg text-primary hover:bg-surface-container-low px-3 py-1.5 rounded-DEFAULT transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
