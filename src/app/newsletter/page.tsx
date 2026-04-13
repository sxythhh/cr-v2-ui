"use client";

import { useState } from "react";

function MailIcon() {
  return (
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
      <path d="M1.5 1L7 5.5L12.5 1M1.5 10H12.5C13.0523 10 13.5 9.55228 13.5 9V2C13.5 1.44772 13.0523 1 12.5 1H1.5C0.947715 1 0.5 1.44772 0.5 2V9C0.5 9.55228 0.947715 10 1.5 10Z" stroke="#626261" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" className={className}>
      <path d="M0.992647 6.96071H14.2131L8.95924 1.70683C8.86271 1.61563 8.78546 1.506 8.73205 1.38442C8.67863 1.26284 8.65015 1.13179 8.64826 0.999005C8.64638 0.866224 8.67115 0.734415 8.7211 0.611373C8.77104 0.488331 8.84516 0.376554 8.93906 0.282655C9.03296 0.188756 9.14474 0.11464 9.26778 0.0646924C9.39082 0.0147447 9.52263 -0.0100211 9.65541 -0.0081401C9.78819 -0.00625909 9.91924 0.0222305 10.0408 0.0756436C10.1624 0.129057 10.272 0.206309 10.3632 0.30283L17.3112 7.25295C17.4973 7.439 17.6018 7.69132 17.6018 7.95442C17.6018 8.21751 17.4973 8.46984 17.3112 8.65589L10.3632 15.6049C10.1753 15.7825 9.92557 15.8798 9.66706 15.8761C9.40855 15.8725 9.16166 15.7681 8.97885 15.5853C8.79603 15.4025 8.69171 15.1556 8.68805 14.8971C8.68439 14.6386 8.78168 14.3889 8.95924 14.2009L14.2131 8.94707H0.992647C0.729381 8.94707 0.476897 8.84248 0.29074 8.65633C0.104582 8.47017 0 8.21768 0 7.95442C0 7.69115 0.104582 7.43867 0.29074 7.25251C0.476897 7.06635 0.729381 6.96071 0.992647 6.96071Z" fill="currentColor" />
    </svg>
  );
}

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.includes("@")) {
      setSubmitted(true);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#FFFFF2] p-4">
      <div
        className="flex w-full max-w-[760px] flex-col items-center px-[30px] py-0"
        style={{
          background: "radial-gradient(108.79% 108.79% at 50% 119.79%, #FBBB80 0%, #FFFFF2 99%)",
          gap: 50,
          minHeight: 371,
          borderRadius: 24,
        }}
      >
        {/* Top section */}
        <div className="flex w-full max-w-[700px] flex-col items-center gap-[10px] pt-[50px]">
          {/* Heading */}
          <div className="flex w-full max-w-[700px] flex-col items-center">
            <h1
              className="text-center font-[family-name:var(--font-inter)]"
              style={{
                fontSize: 72,
                fontWeight: 700,
                lineHeight: "72px",
                letterSpacing: "-0.04em",
                color: "#1A1A1A",
              }}
            >
              Stay in the loop
            </h1>
            <p
              className="mt-4 max-w-[500px] text-center font-[family-name:var(--font-inter)]"
              style={{
                fontSize: 17,
                fontWeight: 400,
                lineHeight: "26px",
                letterSpacing: "-0.02em",
                color: "rgba(37, 37, 37, 0.6)",
              }}
            >
              Get the latest updates on new features, creator tools, and platform news delivered straight to your inbox.
            </p>
          </div>
        </div>

        {/* Input section */}
        <div className="flex w-full max-w-[600px] flex-col items-start gap-[10px]">
          {submitted ? (
            <div className="flex w-full flex-col items-center gap-3 py-2">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#34D399]/20">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 10L8.5 13.5L15 6.5" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-[family-name:var(--font-inter)] text-[15px] font-medium tracking-[-0.03em] text-[#1A1A1A]">
                You&apos;re on the list!
              </span>
            </div>
          ) : (
            <>
              {/* Input row */}
              <div className="flex w-full items-center gap-[10px]">
                {/* Email input */}
                <div className="flex-1">
                  <div
                    className="flex items-center gap-[10px] rounded-[10px] px-4 py-3"
                    style={{
                      background: "linear-gradient(180deg, #FFFFFF -10.42%, rgba(255, 255, 255, 0.01) 68.75%), #EAE8E6",
                      boxShadow: "0px 12px 6px rgba(0, 0, 0, 0.01), 0px 9px 5px rgba(0, 0, 0, 0.02), 0px 4px 4px rgba(0, 0, 0, 0.04), 0px 1px 2px rgba(0, 0, 0, 0.05), inset 0px 2px 0px #FFFFFF, inset 0px -2px 0px rgba(255, 255, 255, 0.3)",
                      height: 46,
                    }}
                  >
                    <MailIcon />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                      placeholder="Enter your Email..."
                      className="flex-1 bg-transparent font-[family-name:var(--font-inter)] text-[15px] font-medium tracking-[-0.03em] text-[#252525] outline-none placeholder:text-[rgba(37,37,37,0.7)]"
                    />
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={handleSubmit}
                  className="group relative flex h-[46px] shrink-0 cursor-pointer items-center overflow-hidden rounded-[12px] pl-[4px] pr-5 transition-transform active:scale-[0.98]"
                  style={{
                    background: "radial-gradient(60.93% 50% at 51.43% 0%, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.0028) 100%), radial-gradient(45.76% 79.17% at 50% 118.75%, rgba(255, 144, 37, 0.31) 0%, rgba(255, 144, 37, 0) 100%), #110D0C",
                    border: "1px solid #0A0B0B",
                    boxShadow: "inset 0px 1.5px 0px rgba(255, 255, 255, 0.36), 2px 3px 7px rgba(0, 0, 0, 0.18), 7px 10px 12px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  {/* Hover fill */}
                  <div
                    className="absolute left-[3px] top-[3px] bottom-[3px] w-[38px] rounded-[10px] transition-[width] duration-300 ease-out group-hover:w-[calc(100%-6px)]"
                    style={{
                      background: "linear-gradient(180deg, #F4F3F2 0%, #D9D9D7 100%)",
                      border: "1px solid #E8E7E5",
                    }}
                  />

                  {/* Icon — centered in the white square */}
                  <div className="relative z-10 flex size-[38px] shrink-0 items-center justify-center text-[#242828]">
                    <ArrowIcon />
                  </div>

                  {/* Text */}
                  <span
                    className="relative z-10 ml-2 whitespace-nowrap font-[family-name:var(--font-inter)] text-[#F4F3F2] transition-colors duration-300 group-hover:text-[#1A1A1A]"
                    style={{ fontSize: 15, fontWeight: 600, lineHeight: "20px" }}
                  >
                    Join the waitlist
                  </span>
                </button>
              </div>

              {/* Subtext */}
              <div className="flex w-full items-center justify-center">
                <span
                  className="font-[family-name:var(--font-inter)]"
                  style={{
                    fontSize: 13.2,
                    fontWeight: 500,
                    lineHeight: "17px",
                    letterSpacing: "-0.5px",
                    color: "#5D5959",
                  }}
                >
                  Early access. No spam
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
