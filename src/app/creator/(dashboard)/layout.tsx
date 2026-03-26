export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ fontFamily: 'var(--font-inter), "Inter", Arial, Helvetica, sans-serif' }}>
      {children}
    </div>
  );
}
