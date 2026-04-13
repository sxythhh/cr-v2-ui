export default function AgenciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="agencies-root">
      <style>{`html:has(.agencies-root) { scrollbar-width: none; -ms-overflow-style: none; } html:has(.agencies-root)::-webkit-scrollbar { display: none; }`}</style>
      {children}
    </div>
  );
}
