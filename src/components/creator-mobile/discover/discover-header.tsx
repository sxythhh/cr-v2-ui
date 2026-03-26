export function DiscoverHeader({ activeTab }: { activeTab: "list" | "card" }) {
  return (
    <div className="flex flex-col gap-[34px] px-[34px] pb-0 pt-[17.5px]">
      {/* Title */}
      <span className="text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>
        discover
      </span>

      {/* Search + controls */}
      <div className="flex flex-col gap-2.5">
        {/* Search bar */}
        <div
          className="flex items-center rounded-3xl px-5 py-4"
          style={{ background: "#F7F7F6" }}
        >
          <span className="text-[18px] font-semibold leading-[120%] tracking-[0.025em]" style={{ color: "#9D9890" }}>
            Search
          </span>
        </div>

        {/* Filter + view toggle */}
        <div className="flex items-center gap-2.5">
          {/* Filter button */}
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl"
            style={{ background: "#F7F7F6" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 6L10 13V20L14 18V13L21 6V4H3V6Z" fill="#24231F" />
            </svg>
          </div>

          {/* View toggle */}
          <div
            className="flex flex-1 items-center rounded-3xl p-0.5"
            style={{ background: "#F7F7F6" }}
          >
            <div
              className="flex h-[52px] flex-1 items-center justify-center rounded-[22px]"
              style={{ background: activeTab === "list" ? "white" : "transparent" }}
            >
              <span
                className="text-[18px] font-semibold leading-[120%] tracking-[0.025em]"
                style={{ color: activeTab === "list" ? "#24231F" : "#9D9890" }}
              >
                List
              </span>
            </div>
            <div
              className="flex h-[52px] flex-1 items-center justify-center rounded-[22px]"
              style={{ background: activeTab === "card" ? "white" : "transparent" }}
            >
              <span
                className="text-[18px] font-semibold leading-[120%] tracking-[0.025em]"
                style={{ color: activeTab === "card" ? "#24231F" : "#9D9890" }}
              >
                Card
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
