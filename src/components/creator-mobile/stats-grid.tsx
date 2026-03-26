import { FireStreakIcon } from "@/components/creator-mobile/home-icons";

// Activity dot data for streak grid: true = active (orange), false = inactive (gray)
const streakData = [
  // M    T    W    T    F    S    S   (rows = time slots, cols = days)
  [true,  false, false, false, true,  false, false],
  [false, false, true,  false, true,  true,  false],
  [true,  true,  true,  true,  true,  true,  false],
  [false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false],
];

const days = ["M", "T", "W", "T", "F", "S", "S"];

function StreakCard() {
  return (
    <div className="flex flex-col rounded-[18px]" style={{ background: "white" }}>
      {/* Header */}
      <div className="flex items-center gap-[5px] px-4 pt-[14.5px]" style={{ height: 32.5 }}>
        {/* Fire icon */}
        <div className="flex h-[15px] w-[15px] items-center justify-center">
          <FireStreakIcon />
        </div>
        <span className="flex-1 text-[15px] font-bold leading-[120%] tracking-[0.03em]" style={{ color: "#24231F" }}>
          6 days streak
        </span>
      </div>

      {/* Activity grid */}
      <div className="flex flex-col gap-2.5 px-2.5 pb-2.5 pt-[13px]">
        {/* Day labels */}
        <div className="flex justify-between px-0">
          {days.map((day, i) => (
            <div key={i} className="flex-1 text-center text-[13px] font-bold uppercase leading-[100%] tracking-[0.04em]" style={{ color: "#9D9890" }}>
              {day}
            </div>
          ))}
        </div>

        {/* Dot grid */}
        <div className="flex">
          {days.map((_, colIdx) => (
            <div key={colIdx} className="flex flex-1 flex-col items-center justify-center gap-2.5">
              {streakData.map((row, rowIdx) => (
                <div key={rowIdx} className="flex h-[13px] w-[13px] items-center justify-center">
                  <div
                    className="rounded-full"
                    style={{
                      width: 8,
                      height: 3,
                      background: row[colIdx]
                        ? "#FF5600"
                        : colIdx === 6 && rowIdx === 2
                          ? "rgba(255, 86, 0, 0.25)"
                          : "#CDC8C2",
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniBarChart({
  lineColor,
  fillColor,
  height = 108,
}: {
  lineColor: string;
  fillColor: string;
  height?: number;
}) {
  return (
    <div className="relative w-full" style={{ height }}>
      {/* Grid lines */}
      <svg width="100%" height={height} className="absolute inset-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={i}
            x1={`${(i + 1) * 9.09}%`}
            y1="0"
            x2={`${(i + 1) * 9.09}%`}
            y2={height}
            stroke="#F0EFED"
            strokeWidth="1"
          />
        ))}
      </svg>
      {/* Area + line */}
      <svg width="100%" height={height} className="absolute inset-0" preserveAspectRatio="none" viewBox={`0 0 191 ${height}`}>
        <defs>
          <linearGradient id={`grad-${lineColor}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.15" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={fillColor === "gray"
            ? `M0,${height * 0.38} C40,${height * 0.4} 80,${height * 0.35} 120,${height * 0.42} S160,${height * 0.3} 191,${height * 0.38} V${height} H0 Z`
            : lineColor === "#00CE2A"
              ? `M0,${height * 0.72} C30,${height * 0.65} 60,${height * 0.5} 95,${height * 0.4} S150,${height * 0.32} 191,${height * 0.28} V${height} H0 Z`
              : `M0,${height * 0.88} C30,${height * 0.82} 60,${height * 0.7} 95,${height * 0.78} S150,${height * 0.68} 191,${height * 0.12} V${height} H0 Z`
          }
          fill={`url(#grad-${lineColor})`}
        />
        <path
          d={fillColor === "gray"
            ? `M0,${height * 0.38} C40,${height * 0.4} 80,${height * 0.35} 120,${height * 0.42} S160,${height * 0.3} 191,${height * 0.38}`
            : lineColor === "#00CE2A"
              ? `M0,${height * 0.72} C30,${height * 0.65} 60,${height * 0.5} 95,${height * 0.4} S150,${height * 0.32} 191,${height * 0.28}`
              : `M0,${height * 0.88} C30,${height * 0.82} 60,${height * 0.7} 95,${height * 0.78} S150,${height * 0.68} 191,${height * 0.12}`
          }
          fill="none"
          stroke={lineColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function StatCard({
  label,
  value,
  change,
  changeColor,
  changeDirection,
  lineColor,
}: {
  label: string;
  value: string;
  change?: string;
  changeColor?: string;
  changeDirection?: "up" | "down";
  lineColor: string;
}) {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-[18px]"
      style={{ background: "white", border: "2px solid white" }}
    >
      {/* Header */}
      <div className="flex flex-col gap-1 px-4 pb-[14px] pt-[14.5px]">
        <span className="text-[15px] font-medium leading-[120%] tracking-[0.03em]" style={{ color: "#9D9890" }}>
          {label}
        </span>
        <div className="flex items-end justify-between gap-1">
          <span className="text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>
            {value}
          </span>
          {change && (
            <div className="flex items-center gap-0.5">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                {changeDirection === "up" ? (
                  <path d="M7.5 3L12 10H3L7.5 3Z" fill={changeColor} />
                ) : (
                  <path d="M7.5 12L3 5H12L7.5 12Z" fill={changeColor} />
                )}
              </svg>
              <span className="text-[15px] font-bold leading-[120%] tracking-[0.03em]" style={{ color: changeColor }}>
                {change}
              </span>
            </div>
          )}
          {!change && (
            <span className="text-[15px] font-bold leading-[120%] tracking-[0.03em]" style={{ color: "#9D9890" }}>
              =
            </span>
          )}
        </div>
      </div>

      {/* Chart */}
      <MiniBarChart
        lineColor={lineColor}
        fillColor={change ? "colored" : "gray"}
        height={108}
      />
    </div>
  );
}

export function StatsGrid() {
  return (
    <div className="flex flex-col gap-0.5">
      {/* Row 1: Streak + Approved */}
      <div className="flex gap-0.5">
        <div className="flex-1">
          <StreakCard />
        </div>
        <div className="flex-1">
          <StatCard
            label="approved"
            value="87%"
            lineColor="#9D9890"
          />
        </div>
      </div>

      {/* Row 2: This week + Views */}
      <div className="flex gap-0.5">
        <div className="flex-1">
          <StatCard
            label="this week"
            value="$64"
            change="$32"
            changeColor="#00CE2A"
            changeDirection="up"
            lineColor="#00CE2A"
          />
        </div>
        <div className="flex-1">
          <StatCard
            label="views"
            value="24.5K"
            change="4%"
            changeColor="#FF001F"
            changeDirection="down"
            lineColor="#FF001F"
          />
        </div>
      </div>
    </div>
  );
}
