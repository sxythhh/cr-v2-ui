import { NicheChipGrid } from "@/components/creator-mobile/onboarding/niche-chips";

const filterCategories = [
  { label: "Gaming" },
  { label: "Beauty" },
  { label: "Finance" },
  { label: "Tech" },
  { label: "Fashion" },
  { label: "Lifestyle" },
  { label: "Comedy" },
  { label: "Food" },
];

export function FilterSheet() {
  return (
    <div
      className="flex flex-col rounded-[55px]"
      style={{ background: "white" }}
    >
      {/* Header */}
      <div className="flex items-center px-[34px] pt-[34px]">
        <span className="flex-1 text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>
          filters
        </span>
        {/* Close button */}
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[32px]">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M6 6L16 16M16 6L6 16" stroke="#D6D4D2" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[34px] p-[34px]">
        {/* Categories */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[15px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#9D9890" }}>
            categories
          </span>
          <NicheChipGrid chips={filterCategories} />
        </div>

        {/* Min CPM */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#9D9890" }}>
            min CPM
          </span>
          <div
            className="flex items-center rounded-3xl px-5 py-4"
            style={{ background: "#F7F7F6" }}
          >
            <span className="text-[18px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#9D9890" }}>
              $0.00
            </span>
          </div>
        </div>

        {/* Min Budget */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#9D9890" }}>
            min budget
          </span>
          <div
            className="flex items-center rounded-3xl px-5 py-4"
            style={{ background: "#F7F7F6" }}
          >
            <span className="text-[18px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#9D9890" }}>
              $0.00
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          <div
            className="flex h-14 items-center justify-center rounded-3xl"
            style={{ background: "#D6D4D2" }}
          >
            <span className="text-[18px] font-semibold leading-[120%] tracking-[0.025em] text-white">
              apply
            </span>
          </div>
          <div
            className="flex h-14 items-center justify-center rounded-3xl"
            style={{ background: "#D6D4D2" }}
          >
            <span className="text-[18px] font-semibold leading-[120%] tracking-[0.025em] text-white">
              clear all
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
