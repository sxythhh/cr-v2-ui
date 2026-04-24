export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-page-bg px-4 py-10 sm:px-6">
      {children}
    </div>
  );
}
