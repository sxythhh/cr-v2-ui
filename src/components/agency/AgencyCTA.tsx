"use client";

import Image from "next/image";

import type { AgencyData } from "./types";

export function AgencyCTA({ agency }: { agency: AgencyData }) {
  return (
    <>
      <style>{`
        .agency-cta {
          position: relative;
          display: flex;
          align-items: center;
          padding: 20px;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(234, 232, 230, 0.6);
        }
        .agency-cta-inner {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 16px;
          border-radius: 8px;
          width: 100%;
        }
        .agency-cta-card {
          width: 100%;
        }
        @media (min-width: 768px) {
          .agency-cta-inner {
            flex-direction: row;
            align-items: center;
            gap: 50px;
          }
          .agency-cta-card {
            width: 360px;
            flex-shrink: 0;
          }
        }
      `}</style>
      <section className="agency-cta">
        <div className="agency-cta-inner">
          {/* Left — text content */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-1.08px", color: "#060612", marginBottom: 10 }}>
              Ready to launch your campaign?
            </h2>
            <p style={{ fontSize: 18, fontWeight: 500, lineHeight: "22px", letterSpacing: "-0.54px", color: "#060612" }}>
              Get started and reach thousands of creators today.
            </p>
          </div>

          {/* Right — booking card */}
          <div className="agency-cta-card">
            <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: 20, borderRadius: 16, backgroundColor: "#fff", border: "1px solid #eae8e6" }}>
              {/* Avatars */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="relative" style={{ width: 50, height: 50, borderRadius: "50%", overflow: "hidden" }}>
                  <Image
                    src={agency.logo}
                    alt={agency.name}
                    fill
                    className="object-cover"
                    sizes="50px"
                  />
                </div>
                <span style={{ fontSize: 20, fontWeight: 500, color: "#69686E" }}>
                  +
                </span>
                <div style={{ width: 50, height: 50, borderRadius: "50%", backgroundColor: "#060612", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 500, color: "#fff" }}>
                    You
                  </span>
                </div>
              </div>

              {/* Text */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <h3 style={{ fontSize: 22, fontWeight: 500, lineHeight: "26px", letterSpacing: "-0.66px", color: "#060612", margin: 0 }}>
                  Quick 15-minute call
                </h3>
                <p style={{ fontSize: 16, fontWeight: 500, lineHeight: "19px", color: "#69686E", margin: 0 }}>
                  Pick a time that works for you.
                </p>
              </div>

              {/* CTA buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  type="button"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 48, borderRadius: 40, backgroundColor: "#000", border: "none", cursor: "pointer" }}
                >
                  <span style={{ fontSize: 16, fontWeight: 500, color: "#fff" }}>
                    Contact
                  </span>
                </button>
                <button
                  type="button"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 48, borderRadius: 40, backgroundColor: "#fff", border: "1px solid #eae8e6", cursor: "pointer" }}
                >
                  <span style={{ fontSize: 16, fontWeight: 500, color: "#060612" }}>
                    Invite to Workspace
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
