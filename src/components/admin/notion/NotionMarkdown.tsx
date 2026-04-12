"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function NotionMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-3 mt-6 text-[22px] font-bold text-white first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-2 mt-5 text-[18px] font-semibold text-white first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 mt-4 text-[15px] font-semibold text-white first:mt-0">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="mb-3 text-[14px] leading-relaxed text-white/70">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-white/60">{children}</em>
        ),
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#f6850f] underline decoration-[#f6850f]/30 hover:decoration-[#f6850f]">
            {children}
          </a>
        ),
        ul: ({ children }) => (
          <ul className="mb-3 ml-5 list-disc space-y-1 text-[14px] text-white/70">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-3 ml-5 list-decimal space-y-1 text-[14px] text-white/70">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-[14px] leading-relaxed text-white/70">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mb-3 border-l-2 border-[#f6850f]/40 pl-4 text-[14px] italic text-white/50">
            {children}
          </blockquote>
        ),
        code: ({ className, children, ...props }) => {
          const isBlock = className?.includes("language-");
          if (isBlock) {
            return (
              <pre className="mb-3 overflow-x-auto rounded-lg border border-white/[0.06] bg-white/[0.03] p-4">
                <code className="text-[13px] text-white/80">{children}</code>
              </pre>
            );
          }
          return (
            <code className="rounded bg-white/[0.08] px-1.5 py-0.5 text-[13px] text-[#f6850f]" {...props}>
              {children}
            </code>
          );
        },
        pre: ({ children }) => <>{children}</>,
        hr: () => <hr className="my-4 border-white/[0.08]" />,
        table: ({ children }) => (
          <div className="mb-3 overflow-x-auto rounded-lg border border-white/[0.06]">
            <table className="w-full text-[13px]">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="border-b border-white/[0.08] bg-white/[0.03]">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-3 py-2 text-left text-[12px] font-semibold uppercase tracking-wider text-white/40">{children}</th>
        ),
        td: ({ children }) => (
          <td className="border-t border-white/[0.04] px-3 py-2 text-white/60">{children}</td>
        ),
        img: ({ src, alt }) => (
          <img src={src} alt={alt ?? ""} className="mb-3 max-w-full rounded-lg" />
        ),
        input: ({ type, checked }) => {
          if (type === "checkbox") {
            return (
              <input type="checkbox" checked={checked} readOnly className="mr-2 accent-[#f6850f]" />
            );
          }
          return <input type={type} />;
        },
      }}
    />
  );
}
