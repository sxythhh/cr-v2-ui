"use client";

import { cn } from "@/lib/utils";

export interface TeamMember {
  email: string;
  role: string;
}

interface TeamStepProps {
  members: TeamMember[];
  onUpdate: (members: TeamMember[]) => void;
}

const ROLES = ["Admin", "Manager", "Moderator", "Viewer"] as const;

export function TeamStep({ members, onUpdate }: TeamStepProps) {
  const addRow = () => onUpdate([...members, { email: "", role: "Manager" }]);
  const updateEmail = (i: number, email: string) =>
    onUpdate(members.map((m, j) => (j === i ? { ...m, email } : m)));
  const updateRole = (i: number, role: string) =>
    onUpdate(members.map((m, j) => (j === i ? { ...m, role } : m)));
  const removeRow = (i: number) => onUpdate(members.filter((_, j) => j !== i));

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-bold leading-[28px] tracking-[-0.02em] text-page-text">
          Add your team
        </h2>
        <p className="text-[13px] leading-[20px] text-page-text-muted">
          Invite team members to your workspace. You can always add more later.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {members.map((m, i) => (
          <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <input
              type="email"
              placeholder="colleague@company.com"
              value={m.email}
              onChange={(e) => updateEmail(i, e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border bg-card-bg px-3 text-[14px] font-medium text-page-text outline-none transition-colors placeholder:text-page-text-subtle focus:border-[#FF6207] sm:flex-1"
            />
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={m.role}
                  onChange={(e) => updateRole(i, e.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-border bg-card-bg px-3 pr-9 text-[13px] font-medium text-page-text outline-none transition-colors focus:border-[#FF6207] sm:w-auto"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-page-text-subtle">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {members.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-page-text-subtle transition-colors hover:bg-foreground/[0.04] hover:text-page-text-muted"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-[13px] font-medium text-page-text-subtle transition-colors hover:border-foreground/20 hover:text-page-text-muted"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        Add another
      </button>

      {/* Info */}
      <div className="rounded-xl bg-foreground/[0.03] px-4 py-3">
        <p className="text-[12px] font-medium leading-[18px] text-page-text-subtle">
          Existing team members will receive an email to verify their accounts. Their permissions carry over from v1. You can manage roles later in Settings.
        </p>
      </div>
    </div>
  );
}
