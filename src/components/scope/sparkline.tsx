export function Sparkline({
  data,
  w = 120,
  h = 28,
  color = "var(--color-scope-accent)",
  fill = true,
}: {
  data: number[];
  w?: number;
  h?: number;
  color?: string;
  fill?: boolean;
}) {
  if (data.length < 2) {
    return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} />;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => [i * step, h - 2 - ((v - min) / range) * (h - 4)] as const);
  const path = points
    .map((pt, i) => `${i === 0 ? "M" : "L"}${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`)
    .join(" ");
  const fillPath = `${path} L${w} ${h} L0 ${h} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      {fill && <path d={fillPath} fill={color} opacity="0.15" />}
      <path
        d={path}
        stroke={color}
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
