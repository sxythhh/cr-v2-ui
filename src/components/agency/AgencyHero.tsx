"use client";

import Image from "next/image";

import { AgencyImageCard } from "./AgencyImageCard";
import { AgencyBookingWidget } from "./AgencyBookingWidget";
import { AgencyDetails } from "./AgencyDetails";
import { StarRating } from "./StarRating";

import type { AgencyData } from "./types";

export function AgencyHero({ agency }: { agency: AgencyData }) {
  return (
    <>
      <style>{`
        .agency-hero {
          display: flex;
          flex-direction: column;
          gap: 32px;
          padding: 7px 0;
        }
        .agency-hero-left,
        .agency-hero-right {
          width: 100%;
        }
        .agency-hero-left {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .agency-hero-right {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        @media (min-width: 1024px) {
          .agency-hero {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
            gap: 48px;
          }
          .agency-hero-left {
            width: 480px;
            flex-shrink: 0;
          }
          .agency-hero-right {
            width: 457px;
          }
        }
      `}</style>
      <section className="agency-hero">
        {/* Left — Image card + details */}
        <div className="agency-hero-left">
          <AgencyImageCard campaigns={agency.campaigns} />
          <AgencyDetails agency={agency} />
        </div>

        {/* Right — Identity + form */}
        <div className="agency-hero-right">
          {/* Agency identity */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="relative rounded-xl overflow-hidden bg-black" style={{ width: 60, height: 60, flexShrink: 0, boxShadow: "0 0 0 2.86px rgba(112,111,111,0.22)" }}>
              <Image
                src={agency.logo}
                alt={agency.name}
                fill
                className="object-cover rounded-[11px]"
                sizes="60px"
              />
            </div>
            <h1 style={{ fontSize: 46, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-1.84px", color: "#000", margin: 0 }}>
              {agency.name}
            </h1>
            {agency.verified && (
              <div className="group relative shrink-0 self-center">
                <Image
                  src="/icons/verified-light.png"
                  alt="Verified Agency"
                  width={22}
                  height={22}
                />
              </div>
            )}
          </div>

          {/* Rating */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <StarRating count={agency.rating} />
            <span style={{ fontSize: 15, fontWeight: 500, lineHeight: "27px", letterSpacing: "-0.3px", color: "#545454" }}>
              Review by {agency.reviewCount} users worldwide
            </span>
          </div>

          {/* Booking widget */}
          <AgencyBookingWidget />
        </div>
      </section>
    </>
  );
}
