"use client";
// @ts-nocheck

import { useState, useMemo, useCallback } from 'react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/vn/ui/card';
import { formatNumber } from '@/lib/vn-utils';

// Base data point type with common fields
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataPoint = Record<string, any> & {
  date: string;
};

type MetricOption = {
  key: string;
  label: string;
  color: string;
  format?: 'number' | 'percent';
};

type LineConfig = {
  dataKey: string;
  color: string;
  name: string;
};

interface LineChartProps {
  title?: string;
  data: DataPoint[];
  showLegend?: boolean;
  height?: number;
  metricOptions?: MetricOption[];
  defaultMetric?: string;
  lines?: LineConfig[];
}

const defaultMetricOptions: MetricOption[] = [
  { key: 'views', label: 'Views', color: '#F78711' },
];

// Calculate nice Y-axis ticks with headroom
function calculateNiceYAxisDomain(data: DataPoint[], metricKeys: string[]): { domain: [number, number]; ticks: number[] } {
  const allValues: number[] = [];
  metricKeys.forEach(key => {
    data.forEach(d => {
      const value = (d as unknown as Record<string, number>)[key];
      if (typeof value === 'number') {
        allValues.push(value);
      }
    });
  });

  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;

  // Nice intervals for different ranges
  let interval: number;
  if (maxValue <= 10) {
    interval = 2;
  } else if (maxValue <= 50) {
    interval = 10;
  } else if (maxValue <= 100) {
    interval = 25;
  } else if (maxValue <= 500) {
    interval = 100;
  } else if (maxValue <= 1000) {
    interval = 250;
  } else if (maxValue <= 5000) {
    interval = 1000;
  } else if (maxValue <= 10000) {
    interval = 2500;
  } else if (maxValue <= 50000) {
    interval = 10000;
  } else if (maxValue <= 100000) {
    interval = 25000;
  } else if (maxValue <= 500000) {
    interval = 100000;
  } else if (maxValue <= 1000000) {
    interval = 250000;
  } else {
    interval = 500000;
  }

  // Calculate domain with headroom (one extra interval above max)
  const niceMin = 0;
  const niceMax = Math.ceil(maxValue / interval) * interval + interval;

  // Generate ticks
  const ticks: number[] = [];
  for (let tick = niceMin; tick <= niceMax; tick += interval) {
    ticks.push(tick);
  }

  // Limit to ~5-6 ticks max
  if (ticks.length > 6) {
    const newInterval = interval * 2;
    ticks.length = 0;
    const newMax = Math.ceil(maxValue / newInterval) * newInterval + newInterval;
    for (let tick = niceMin; tick <= newMax; tick += newInterval) {
      ticks.push(tick);
    }
    return { domain: [niceMin, newMax], ticks };
  }

  return { domain: [niceMin, niceMax], ticks };
}

const CustomTooltip = ({ active, payload, format }: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number; payload?: DataPoint }>;
  label?: string;
  format?: 'number' | 'percent';
}) => {
  if (active && payload && payload.length > 0) {
    const displayLabel = payload[0]?.payload?.fullDate;
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-xl pointer-events-none">
        <p className="text-sm text-zinc-400 mb-2">{displayLabel}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-zinc-300">{entry.name}:</span>
            <span className="text-sm font-medium text-zinc-100">
              {format === 'percent' ? `${entry.value}%` : formatNumber(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function LineChart({
  title,
  data,
  height = 300,
  metricOptions = defaultMetricOptions,
  defaultMetric,
  lines,
}: LineChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricOption>(
    metricOptions.find(m => m.key === defaultMetric) || metricOptions[0]
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Determine if we're in multi-line mode (using lines prop) or single-line mode (using metricOptions)
  const isMultiLineMode = lines && lines.length > 0;

  // Get the metric keys for Y-axis calculation
  const metricKeys = useMemo(() => {
    if (isMultiLineMode) {
      return lines!.map(l => l.dataKey);
    }
    return [selectedMetric.key];
  }, [isMultiLineMode, lines, selectedMetric.key]);

  // Calculate nice Y-axis domain and ticks
  const { domain, ticks } = useMemo(() =>
    calculateNiceYAxisDomain(data, metricKeys),
    [data, metricKeys]
  );

  // Calculate tick interval for X-axis - show ~5-7 labels max
  const tickInterval = useMemo(() => {
    const totalDays = data.length;
    if (totalDays <= 7) return 1;
    if (totalDays <= 14) return 2;
    if (totalDays <= 21) return 3;
    if (totalDays <= 35) return 5;
    if (totalDays <= 60) return 10;
    if (totalDays <= 90) return 14;
    if (totalDays <= 180) return 30;
    // For very long ranges, show monthly-ish labels
    return Math.ceil(totalDays / 6);
  }, [data.length]);

  // Format dates for display - each point gets its formatted date
  const formattedData = useMemo(() => {
    return data.map((d, i) => ({
      ...d,
      index: i,
      fullDate: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  }, [data]);

  const showDropdown = !isMultiLineMode && metricOptions.length > 1;

  // Prevent click selection on chart
  const handleChartClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {showDropdown ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-lg font-semibold text-zinc-100 hover:text-orange-400 transition-colors"
              >
                {selectedMetric.label}
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 py-1">
                    {metricOptions.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => {
                          setSelectedMetric(option);
                          setDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-700 transition-colors ${
                          selectedMetric.key === option.key
                            ? 'text-orange-400 bg-zinc-700/50'
                            : 'text-zinc-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <CardTitle className="text-base sm:text-lg">{title || selectedMetric.label}</CardTitle>
          )}

          {/* Legend for multi-line mode */}
          {isMultiLineMode && (
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {lines!.map((line) => (
                <div key={line.dataKey} className="flex items-center gap-1.5 sm:gap-2">
                  <div
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                    style={{ backgroundColor: line.color }}
                  />
                  <span className="text-xs text-zinc-400">{line.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-8 pb-4">
        <div
          onClick={handleChartClick}
          onMouseDown={handleChartClick}
          style={{ userSelect: 'none' }}
        >
          <ResponsiveContainer width="100%" height={height}>
            <RechartsLineChart
              data={formattedData}
              margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="index"
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval={tickInterval - 1}
                tick={{ fill: '#71717a' }}
                tickFormatter={(index) => {
                  const point = formattedData[index];
                  return point ? point.fullDate : '';
                }}
              />
              <YAxis
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={domain}
                ticks={ticks}
                tickFormatter={(value) =>
                  selectedMetric.format === 'percent'
                    ? `${value}%`
                    : formatNumber(value)
                }
                width={50}
              />
              <Tooltip
                content={<CustomTooltip format={selectedMetric.format} />}
                isAnimationActive={false}
                cursor={{ stroke: '#52525b', strokeWidth: 1 }}
                allowEscapeViewBox={{ x: false, y: false }}
              />
              {isMultiLineMode ? (
                // Multi-line mode: render all lines
                lines!.map((line) => (
                  <Line
                    key={line.dataKey}
                    type="monotone"
                    dataKey={line.dataKey}
                    name={line.name}
                    stroke={line.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5, fill: line.color, stroke: line.color }}
                    isAnimationActive={false}
                  />
                ))
              ) : (
                // Single-line mode: render selected metric
                <Line
                  type="monotone"
                  dataKey={selectedMetric.key}
                  name={selectedMetric.label}
                  stroke={selectedMetric.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: selectedMetric.color, stroke: selectedMetric.color }}
                  isAnimationActive={false}
                />
              )}
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
