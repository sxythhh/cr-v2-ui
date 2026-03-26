export function MobileShell({
  children,
  bg = "white",
  className = "",
}: {
  children: React.ReactNode;
  bg?: string;
  className?: string;
}) {
  return (
    <div className="flex min-h-dvh justify-center bg-neutral-100">
      <div
        className={`relative flex w-full max-w-[420px] flex-col ${className}`}
        style={{ background: bg }}
      >
        {children}
      </div>
    </div>
  );
}
