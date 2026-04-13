"use client";

import Link from "next/link";
import { DubNav } from "@/components/lander/dub-nav";

/* ── Dollar icon (circle with $ sign) ─────────────────────────── */

function DollarIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.6665 16.0003C2.6665 8.63653 8.63604 2.66699 15.9998 2.66699C23.3636 2.66699 29.3332 8.63653 29.3332 16.0003C29.3332 23.3641 23.3636 29.3337 15.9998 29.3337C8.63604 29.3337 2.6665 23.3641 2.6665 16.0003ZM15.9998 7.46329C16.5521 7.46329 16.9998 7.911 16.9998 8.46329V9.61444C18.142 9.83615 19.149 10.4336 19.7778 11.3033C20.1014 11.7508 20.0009 12.3759 19.5534 12.6996C19.1058 13.0232 18.4807 12.9227 18.1571 12.4752C17.7797 11.9533 16.996 11.5188 15.9998 11.5188H15.6192C14.2698 11.5188 13.5739 12.3586 13.5739 12.9551V13.0597C13.5739 13.517 13.9067 14.0861 14.701 14.4037L18.0415 15.74C19.3992 16.2831 20.4258 17.4736 20.4258 18.941C20.4258 20.8341 18.8091 22.1364 16.9998 22.4225V23.5374C16.9998 24.0896 16.5521 24.5374 15.9998 24.5374C15.4476 24.5374 14.9998 24.0896 14.9998 23.5374V22.3862C13.8576 22.1645 12.8507 21.567 12.2219 20.6974C11.8983 20.2498 11.9987 19.6247 12.4463 19.3011C12.8938 18.9775 13.519 19.0779 13.8426 19.5255C14.2199 20.0474 15.0037 20.4818 15.9998 20.4818H16.2498C17.6713 20.4818 18.4258 19.5953 18.4258 18.941C18.4258 18.4836 18.0929 17.9146 17.2987 17.5969L13.9582 16.2607C12.6004 15.7176 11.5739 14.5271 11.5739 13.0597V12.9551C11.5739 11.0758 13.2088 9.80257 14.9998 9.56072V8.46329C14.9998 7.911 15.4476 7.46329 15.9998 7.46329Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ── Whop logo ────────────────────────────────────────────────── */

function WhopLogo() {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
      <path d="M3.17762 -0.000976562C1.86403 -0.000976562 0.958502 0.561988 0.273238 1.19861C0.273238 1.19861 -0.00346338 1.45473 3.28554e-05 1.46253L2.87794 4.27344L5.75532 1.46253C5.21042 0.729801 4.18304 -0.000976562 3.17762 -0.000976562Z" fill="#FCF6F5" />
      <path d="M10.2839 -0.000976562C8.9703 -0.000976562 8.06477 0.561987 7.37947 1.19861C7.37947 1.19861 7.12677 1.4479 7.11531 1.46253L3.55811 4.93738L6.43153 7.74389L12.8616 1.46253C12.3167 0.729802 11.2898 -0.000976562 10.2839 -0.000976562Z" fill="#FCF6F5" />
      <path d="M17.4092 -0.000976562C16.0956 -0.000976562 15.1901 0.561987 14.5048 1.19861C14.5048 1.19861 14.2416 1.44984 14.2316 1.46253L7.11572 8.41368L7.86892 9.14933C9.0342 10.2875 10.9416 10.2875 12.1069 9.14933L19.9779 1.46253H19.9869C19.442 0.729802 18.4151 -0.000976562 17.4092 -0.000976562Z" fill="#FCF6F5" />
    </svg>
  );
}

/* ── Content Rewards star logo ─────────────────────────────────── */

function ContentRewardsLogo() {
  return (
    <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
      <path d="M1.46528 4.70024L2.33182 3.52641L2.63864 4.94587L4.03965 5.39511L2.76436 6.12145L2.76366 7.57274L1.66807 6.60218L0.266706 7.05002L0.865462 5.72365L0 4.5491L1.46528 4.70024Z" fill="currentColor" />
      <path d="M1.11974 10.3214L0.600885 9.17206L1.81544 9.56043L2.76472 8.71897L2.76507 9.97678L3.87061 10.6062L2.6564 10.9956L2.39041 12.2262L1.63965 11.2087L0.369692 11.3396L1.11974 10.3214Z" fill="currentColor" />
      <path d="M5.75495 13.1162L4.77833 13.0147L5.50777 12.3667L5.30393 11.4204L6.15483 11.9038L7.00573 11.4204L6.80188 12.3667L7.53168 13.0147L6.55471 13.1162L6.15483 14L5.75495 13.1162Z" fill="currentColor" />
      <path d="M10.6519 11.188L9.91254 12.1897L9.65045 10.9781L8.45507 10.595L9.54355 9.97502L9.54391 8.73645L10.4786 9.56496L11.6747 9.18254L11.1637 10.3144L11.9023 11.3168L10.6519 11.188Z" fill="currentColor" />
      <path d="M11.441 5.72188L12.0398 7.04826L10.6384 6.60042L9.54321 7.57098L9.5425 6.11968L8.26686 5.39334L9.66787 4.9441L9.9747 3.52465L10.8412 4.69848L12.3065 4.54734L11.441 5.72188Z" fill="currentColor" />
      <path d="M6.95247 1.76758L8.90606 1.97086L7.44681 3.26646L7.85451 5.15965L6.1527 4.19259L4.45125 5.15965L4.85859 3.26646L3.39934 1.97086L5.35294 1.76758L6.1527 0L6.95247 1.76758Z" fill="currentColor" />
    </svg>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function AffiliatePage() {
  return (
    <div className="flex min-h-screen flex-col bg-page-bg font-inter">
      <DubNav />

      <div className="relative flex flex-1 flex-col items-center px-3 pb-12 pt-2">
        {/* Back button */}
        <div className="flex w-full items-center px-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/[0.15] px-3 py-2 text-sm tracking-[-0.09px] text-foreground/70 transition-colors hover:bg-foreground/[0.04]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Link>
        </div>

        {/* Background blurs */}
        <div
          className="pointer-events-none absolute"
          style={{
            width: 1017,
            height: 741,
            left: -43,
            bottom: -210,
            background: "rgba(255, 144, 37, 0.3)",
            filter: "blur(150px)",
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            width: 667,
            height: 529,
            right: -100,
            bottom: -149,
            background: "rgba(255, 63, 213, 0.2)",
            filter: "blur(150px)",
            transform: "rotate(-7.94deg)",
          }}
        />

        {/* Star vector shape */}
        <svg
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ marginTop: -40 }}
          width="531"
          height="603"
          viewBox="0 0 531 603"
          fill="none"
        >
          <path d="M63.1118 202.446L100.435 151.888L113.65 213.025L173.993 232.375L119.065 263.66L119.035 326.169L71.8461 284.365L11.4874 303.655L37.2767 246.526L0 195.936L63.1118 202.446Z" fill="url(#paint0)" />
          <path d="M48.2286 444.558L25.881 395.054L78.1935 411.781L119.08 375.539L119.095 429.714L166.713 456.825L114.415 473.597L102.958 526.6L70.622 482.775L15.9232 488.412L48.2286 444.558Z" fill="url(#paint1)" />
          <path d="M247.874 564.933L205.809 560.561L237.228 532.653L228.448 491.892L265.097 512.715L301.747 491.892L292.967 532.653L324.4 560.561L282.321 564.933L265.097 603L247.874 564.933Z" fill="url(#paint2)" />
          <path d="M458.794 481.885L426.947 525.029L415.659 472.843L364.172 456.342L411.054 429.638L411.07 376.291L451.33 411.976L502.846 395.505L480.836 444.256L512.649 487.429L458.794 481.885Z" fill="url(#paint3)" />
          <path d="M492.78 246.45L518.573 303.579L458.213 284.289L411.04 326.093L411.009 263.584L356.066 232.299L416.409 212.949L429.624 151.812L466.947 202.37L530.059 195.86L492.78 246.45Z" fill="url(#paint4)" />
          <path d="M299.453 76.1322L383.597 84.8879L320.745 140.691L338.305 222.233L265.006 180.581L191.722 222.233L209.267 140.691L146.414 84.8879L230.559 76.1322L265.006 0L299.453 76.1322Z" fill="url(#paint5)" />
          <defs>
            <linearGradient id="paint0" x1="265.03" y1="0" x2="265.03" y2="603" gradientUnits="userSpaceOnUse"><stop stopOpacity="0.07" /><stop offset="1" stopOpacity="0.02" /></linearGradient>
            <linearGradient id="paint1" x1="265.03" y1="0" x2="265.03" y2="603" gradientUnits="userSpaceOnUse"><stop stopOpacity="0.07" /><stop offset="1" stopOpacity="0.02" /></linearGradient>
            <linearGradient id="paint2" x1="265.03" y1="0" x2="265.03" y2="603" gradientUnits="userSpaceOnUse"><stop stopOpacity="0.07" /><stop offset="1" stopOpacity="0.02" /></linearGradient>
            <linearGradient id="paint3" x1="265.03" y1="0" x2="265.03" y2="603" gradientUnits="userSpaceOnUse"><stop stopOpacity="0.07" /><stop offset="1" stopOpacity="0.02" /></linearGradient>
            <linearGradient id="paint4" x1="265.03" y1="0" x2="265.03" y2="603" gradientUnits="userSpaceOnUse"><stop stopOpacity="0.07" /><stop offset="1" stopOpacity="0.02" /></linearGradient>
            <linearGradient id="paint5" x1="265.03" y1="0" x2="265.03" y2="603" gradientUnits="userSpaceOnUse"><stop stopOpacity="0.07" /><stop offset="1" stopOpacity="0.02" /></linearGradient>
          </defs>
        </svg>

        {/* Card */}
        <div
          className="relative z-10 mt-auto mb-auto flex w-full max-w-[400px] flex-col items-center"
          style={{
            background: "linear-gradient(180deg, #FFFFFF -10.42%, rgba(255, 255, 255, 0.01) 68.75%), #EAE8E6",
            boxShadow: "0px 16px 6px rgba(0,0,0,0.01), 0px 9px 5px rgba(0,0,0,0.04), 0px 4px 4px rgba(0,0,0,0.07), 0px 1px 2px rgba(0,0,0,0.08)",
            borderRadius: 24,
          }}
        >
          <div className="flex w-full flex-col items-center justify-center gap-6 px-14 py-10">
            {/* Icon badge */}
            <div
              className="relative flex h-16 w-16 items-center justify-center rounded-full text-black/40"
              style={{
                background: "linear-gradient(0deg, #EBEBEB, #EBEBEB), linear-gradient(0deg, rgba(255,255,255,0.5), rgba(255,255,255,0.5)), #333333",
                backgroundBlendMode: "plus-darker, normal, color-dodge",
                boxShadow: "inset 0px 2px 0px #FFFFFF, inset 0px -2px 0px rgba(255,255,255,0.7)",
              }}
            >
              <DollarIcon />
            </div>

            {/* Welcome text */}
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1 text-xs text-black/70">
                <span>Welcome</span>
                <span>to</span>
                <ContentRewardsLogo />
                <span>Content</span>
                <span>Rewards</span>
              </div>
              <h1 className="text-center text-2xl font-semibold tracking-[-0.47px] text-black">
                Affiliate program
              </h1>
            </div>

            {/* Actions */}
            <div className="flex w-full flex-col items-center gap-4">
              {/* Continue with Whop button */}
              <button
                type="button"
                className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-6 pl-5 text-base font-semibold text-white transition-opacity hover:opacity-90"
                style={{
                  background: "radial-gradient(60.93% 50% at 51.43% 0%, rgba(255,255,255,0.265) 0%, rgba(255,255,255,0.0053) 100%), radial-gradient(31.76% 50.52% at 64.86% 100.52%, rgba(255,63,213,0.35) 0%, rgba(255,63,213,0) 100%), radial-gradient(31.58% 54.43% at 32.86% 102.32%, rgba(255,144,37,0.31) 0%, rgba(255,144,37,0) 100%), #110D0C",
                  boxShadow: "22.5px 33.3px 15.8px rgba(0,0,0,0.03), 12.5px 19.2px 13.3px rgba(0,0,0,0.09), 5.8px 8.3px 10px rgba(0,0,0,0.15), 1.7px 2.5px 5.8px rgba(0,0,0,0.18), inset 0px 1.25px 0px rgba(255,255,255,0.36)",
                }}
              >
                <WhopLogo />
                Continue with Whop
              </button>

              {/* Terms text */}
              <p className="text-center text-xs leading-[14px] text-black/55">
                By signing in you agree to the{" "}
                <a href="#" className="underline underline-offset-2 hover:text-black/70">
                  Terms of Service
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
