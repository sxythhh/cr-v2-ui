"use client";

import * as React from "react";
import { BusinessOnboardingTypeform } from "@/components/forms/business-onboarding-typeform";

export default function FormsDemoEmbed() {
  React.useLayoutEffect(() => {
    // Force light mode + transparent page bg so the form blends into any host (Framer, etc.)
    const html = document.documentElement;
    const body = document.body;
    html.classList.remove("dark");
    const prevHtmlBg = html.style.backgroundColor;
    const prevBodyBg = body.style.backgroundColor;
    html.style.backgroundColor = "transparent";
    body.style.backgroundColor = "transparent";
    return () => {
      html.style.backgroundColor = prevHtmlBg;
      body.style.backgroundColor = prevBodyBg;
    };
  }, []);

  return (
    <div className="bg-transparent p-4">
      <div className="mx-auto w-full max-w-xl">
        <div className="rounded-2xl border border-[rgba(37,37,37,0.08)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <BusinessOnboardingTypeform
            onComplete={(data) => {
              if (typeof window !== "undefined" && window.parent !== window) {
                window.parent.postMessage(
                  { type: "forms-demo:complete", data },
                  "*",
                );
              }
              console.log("Embed form complete:", data);
            }}
          />
        </div>
      </div>
    </div>
  );
}
