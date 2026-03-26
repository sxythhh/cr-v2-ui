const icons = [
  // Left cluster
  { size: 58.67, bg: "#FF009D", radius: 21, left: 0, top: 24 },
  { size: 48, bg: "#FF005B", radius: 17, left: 78.67, top: 0 },
  { size: 53.33, bg: "#0084FF", radius: 19, left: 66.67, top: 74.67 },
  { size: 26.67, bg: "#DA8539", radius: 9.5, left: 128, top: 50.67 },
  { size: 21.33, bg: "#FFAC00", radius: 7.6, left: 13.33, top: 106.67 },
  // Right cluster
  { size: 58.67, bg: "#FFAC00", radius: 21, left: 298.67, top: 24 },
  { size: 53.33, bg: "#00BF76", radius: 19, left: 337.33, top: 74.67 },
  { size: 48, bg: "#00B5FF", radius: 17, left: 330.67, top: 0 },
  { size: 26.67, bg: "#AB49FF", radius: 9.5, left: 302.67, top: 50.67 },
  { size: 21.33, bg: "#FF005B", radius: 7.6, left: 422.67, top: 106.67 },
];

export function BrandIcons() {
  return (
    <div className="relative" style={{ width: 453.33, height: 128 }}>
      {/* Left fade */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-10"
        style={{
          width: 240,
          height: 196,
          top: -34,
          background: "linear-gradient(90deg, white 0%, transparent 100%)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Right fade */}
      <div
        className="pointer-events-none absolute right-[-78px] top-0 z-10"
        style={{
          width: 240,
          height: 196,
          top: -34,
          background: "linear-gradient(270deg, white 0%, transparent 100%)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Icon bubbles */}
      {icons.map((icon, i) => (
        <div
          key={i}
          className="absolute flex items-center justify-center"
          style={{
            width: icon.size,
            height: icon.size,
            left: icon.left,
            top: icon.top,
            background: icon.bg,
            borderRadius: icon.radius,
          }}
        >
          <div
            className="rounded-sm"
            style={{
              width: icon.size * 0.36,
              height: icon.size * 0.36,
              background: "white",
              borderRadius: icon.radius * 0.3,
            }}
          />
        </div>
      ))}

      {/* Center avatar */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[32px]"
        style={{
          width: 96,
          height: 96,
          background: "linear-gradient(135deg, #FF8A50 0%, #FF5600 100%)",
        }}
      />
    </div>
  );
}
