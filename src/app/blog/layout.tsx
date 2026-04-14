export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-root">
      <style>{`html:has(.blog-root) { scrollbar-width: none; -ms-overflow-style: none; } html:has(.blog-root)::-webkit-scrollbar { display: none; }`}</style>
      {children}
    </div>
  );
}
