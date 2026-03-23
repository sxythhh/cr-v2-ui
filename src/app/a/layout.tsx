export default function AgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="light min-h-screen bg-[#F4F3F2] [&_button]:cursor-pointer"
      data-theme="light"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif", colorScheme: "light" }}
    >
      {children}
    </div>
  );
}
