const features = [
  {
    iconBg: "#A62BFF",
    iconBorder: "#8900E3",
    title: "matched to your niches",
    subtitle: "no endless scrolling",
  },
  {
    iconBg: "#FDC000",
    iconBorder: "#DB9C00",
    title: "priority applications",
    subtitle: "brands see you first",
  },
  {
    iconBg: "#00C277",
    iconBorder: "#00A465",
    title: "rank up, unlock faster",
    subtitle: "higher rank = more frequent batches",
  },
];

export function FeatureRows() {
  return (
    <div className="flex flex-col gap-[17px] px-[34px] pb-[34px]">
      {features.map((f, i) => (
        <div key={i} className="flex items-center gap-4">
          {/* Icon */}
          <div
            className="flex h-[53px] w-[53px] shrink-0 items-center justify-center rounded-2xl"
            style={{ background: "#F7F7F6" }}
          >
            <div
              className="rounded-[4px]"
              style={{
                width: 29,
                height: 29,
                background: f.iconBg,
                border: `0.78px solid ${f.iconBorder}`,
                boxShadow: `inset 0.6px 1.5px 0.3px rgba(255,255,255,0.5), inset -0.3px -1.2px 1.8px ${f.iconBorder}`,
              }}
            />
          </div>
          {/* Text */}
          <div className="flex flex-col gap-[5px]">
            <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#24231F" }}>
              {f.title}
            </span>
            <span className="text-[15px] font-medium leading-[120%] tracking-[0.03em]" style={{ color: "#6E6A5E" }}>
              {f.subtitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
