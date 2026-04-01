import { DebugThemeToggle } from "@/components/debug-theme-toggle";

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <DebugThemeToggle />
    </>
  );
}
