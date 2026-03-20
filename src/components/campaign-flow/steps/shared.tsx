export function Divider() {
  return null;
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, children, className }: FieldProps) {
  return (
    <div className={className ? `flex flex-col gap-2 ${className}` : "flex flex-col gap-2"}>
      <span className="text-xs font-normal tracking-[-0.02em] text-page-text-muted">{label}</span>
      {children}
    </div>
  );
}

export function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card-bg border border-border shadow-[0px_1px_2px_rgba(0,0,0,0.03)] rounded-2xl ${className ?? ""}`}>
      <div className="flex flex-col p-5 gap-4">
        {children}
      </div>
    </div>
  );
}

export function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-base font-medium tracking-[-0.02em] text-page-text">{title}</h3>
      {description && <p className="text-sm font-normal tracking-[-0.02em] text-page-text-subtle">{description}</p>}
    </div>
  );
}

export function SegmentedControl({ options, value, onChange }: { options: { label: string; value: string; icon?: React.ReactNode }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="inline-flex self-start items-center p-0.5 gap-0.5 bg-[rgba(37,37,37,0.06)] dark:bg-[rgba(255,255,255,0.06)] rounded-xl">
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex items-center justify-center gap-1.5 h-8 px-4 text-sm font-medium tracking-[-0.02em] rounded-[10px] transition-all ${
              isActive
                ? "bg-white dark:bg-[#2a2a2a] shadow-[0px_2px_4px_rgba(0,0,0,0.06)] text-page-text"
                : "text-page-text-subtle"
            }`}
            type="button"
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export const INPUT_CLASS = "w-full h-10 px-3.5 bg-[rgba(37,37,37,0.04)] dark:bg-[rgba(255,255,255,0.06)] rounded-[14px] text-sm font-normal tracking-[-0.02em] text-page-text placeholder:text-[rgba(37,37,37,0.4)] dark:placeholder:text-[rgba(255,255,255,0.4)] outline-none focus:ring-1 focus:ring-[rgba(37,37,37,0.15)] dark:focus:ring-[rgba(255,255,255,0.15)]";
