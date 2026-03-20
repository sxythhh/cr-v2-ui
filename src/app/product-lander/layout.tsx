export default function ProductLanderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="lander-root min-h-dvh bg-white dark:bg-black">
      <style>{`html:has(.lander-root) { scrollbar-width: none; -ms-overflow-style: none; } html:has(.lander-root)::-webkit-scrollbar { display: none; }`}</style>
      {children}
    </div>
  );
}
