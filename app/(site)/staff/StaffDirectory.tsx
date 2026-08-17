"use client";

import { useMemo, useState } from "react";
import type { StaffMember } from "@/types";

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function StaffCard({ member }: { member: StaffMember }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow flex flex-col items-center p-6 text-center group">
      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-surface-container-low group-hover:border-primary transition-colors flex items-center justify-center bg-tertiary-fixed-dim">
        {member.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="w-full h-full object-cover" src={member.photo_url} alt={member.full_name} />
        ) : (
          <span className="font-headline-md text-headline-md text-tertiary">
            {initialsFor(member.full_name)}
          </span>
        )}
      </div>
      <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{member.full_name}</h3>
      <p className="font-label-md text-label-md text-primary mb-4">{member.role}</p>
      {member.email ? (
        <a
          href={`mailto:${member.email}`}
          className="mt-auto px-4 py-2 rounded border border-primary text-primary hover:bg-primary-container hover:text-on-primary-container transition-colors font-label-sm text-label-sm w-full flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">mail</span>
          Contact
        </a>
      ) : (
        <span className="mt-auto px-4 py-2 rounded border border-outline-variant text-on-surface-variant/60 font-label-sm text-label-sm w-full flex items-center justify-center gap-2 cursor-default">
          No contact listed
        </span>
      )}
    </div>
  );
}

export default function StaffDirectory({ staff }: { staff: StaffMember[] }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");

  const departments = useMemo(() => {
    const set = new Set(staff.map((s) => s.department).filter((d): d is string => !!d));
    return Array.from(set).sort();
  }, [staff]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return staff.filter((s) => {
      const matchesQuery =
        !q || s.full_name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q);
      const matchesDept = department === "all" || s.department === department;
      return matchesQuery && matchesDept;
    });
  }, [staff, query, department]);

  const grouped = useMemo(() => {
    const map = new Map<string, StaffMember[]>();
    for (const member of filtered) {
      const key = member.department || "Other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(member);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <>
      <div className="mb-12 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-body-md text-body-md bg-transparent"
            placeholder="Search staff by name or role..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-body-md text-body-md bg-transparent min-w-[200px]"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {staff.length === 0 && (
        <div className="text-center py-16 text-on-surface-variant font-body-lg text-body-lg">
          The staff directory hasn&apos;t been published yet — check back soon.
        </div>
      )}

      {staff.length > 0 && filtered.length === 0 && (
        <div className="text-center py-16 text-on-surface-variant font-body-lg text-body-lg">
          No staff match your search.
        </div>
      )}

      {grouped.map(([deptName, members]) => (
        <section key={deptName} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-headline-lg text-headline-lg text-primary">{deptName}</h2>
            <div className="flex-grow h-px bg-outline-variant" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
            {members.map((member) => (
              <StaffCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
