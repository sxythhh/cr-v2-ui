"use client";

import Link from "next/link";

const docTypes = [
  {
    id: "brands",
    title: "Brand Documentation",
    description:
      "Learn how to launch campaigns, manage submissions, and grow your brand with Content Rewards.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: "creators",
    title: "Creator Documentation",
    description:
      "Discover how to find campaigns, submit content, and earn money as a creator.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function DocsHomePage() {
  return (
    <div className="py-12 sm:py-16 px-4 sm:px-10 max-w-[1088px]">
      <div className="flex flex-col items-start gap-3">
        <h1
          className="text-[32px] sm:text-[48px] font-medium self-stretch text-foreground"
          style={{
            fontFamily:
              "'ABC Oracle Unlicensed Trial', 'Mona Sans', sans-serif",
            letterSpacing: "-0.02em",
            lineHeight: "50px",
          }}
        >
          The platform for creator marketing
        </h1>
        <p
          className="text-[16px] font-normal max-w-[380px] text-foreground/50"
          style={{
            fontFamily:
              "'ABC Oracle Unlicensed Trial', 'Mona Sans', sans-serif",
            letterSpacing: "-0.01em",
            lineHeight: "25px",
          }}
        >
          Content Rewards connects brands and creators through verified
          campaigns, with transparent payouts and only a 7% platform fee.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mt-10">
        {docTypes.map((doc) => (
          <Link
            key={doc.id}
            href={`/docs/${doc.id}`}
            className="group text-left rounded-2xl p-7 cursor-pointer bg-foreground/[0.03] shadow-[inset_0px_2px_4px_rgba(0,0,0,0.08)] dark:shadow-[inset_0px_2px_4px_rgba(0,0,0,0.5)] border-0 no-underline block"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 text-[#ff6207]"
              style={{
                background:
                  "radial-gradient(48.86% 30.62% at 51.14% 96.87%, rgba(255,126,0,0.18) 0%, rgba(255,126,0,0) 100%), linear-gradient(180deg, rgba(255,255,255,0.08) 12.5%, rgba(255,255,255,0.01) 68.75%), var(--foreground-5, #1a1a1a)",
                boxShadow:
                  "0px 16px 6px rgba(0,0,0,0.04), 0px 9px 5px rgba(0,0,0,0.1), 0px 4px 4px rgba(0,0,0,0.16), 0px 1px 2px rgba(0,0,0,0.2), inset 0px 2px 0px rgba(255,255,255,0.06), inset 0px -2px 0px rgba(255,255,255,0.02)",
              }}
            >
              {doc.icon}
            </div>
            <h2
              className="text-[18px] sm:text-[20px] font-semibold text-foreground"
              style={{ letterSpacing: "-0.5px" }}
            >
              {doc.title}
            </h2>
            <p
              className="text-[14px] font-medium mt-2 text-foreground/50"
              style={{ letterSpacing: "-0.3px", lineHeight: "1.5" }}
            >
              {doc.description}
            </p>
            <div className="flex items-center gap-1.5 mt-5 text-[14px] font-medium transition-all duration-200 group-hover:gap-2.5 text-[#ff6207]">
              <span>Get started</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
