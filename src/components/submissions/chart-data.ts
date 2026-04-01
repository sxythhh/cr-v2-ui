import type { AnalyticsPocPerformanceLineChartData } from "@/components/analytics-poc/types";

export const SUBMISSIONS_CHART_POINTS = [
  { index: 0, label: "Jan 5", views: 8400, engagement: 3.2, likes: 1200, comments: 400, shares: 180 },
  { index: 1, label: "Jan 8", views: 12000, engagement: 4.1, likes: 2400, comments: 600, shares: 290 },
  { index: 2, label: "Jan 11", views: 28000, engagement: 5.0, likes: 4800, comments: 1400, shares: 480 },
  { index: 3, label: "Jan 14", views: 52000, engagement: 4.8, likes: 8200, comments: 2600, shares: 620 },
  { index: 4, label: "Jan 17", views: 74000, engagement: 4.5, likes: 10800, comments: 3200, shares: 710 },
  { index: 5, label: "Jan 20", views: 86000, engagement: 4.3, likes: 12400, comments: 3800, shares: 750 },
  { index: 6, label: "Jan 23", views: 92000, engagement: 4.6, likes: 13600, comments: 4200, shares: 780 },
  { index: 7, label: "Jan 26", views: 88000, engagement: 4.4, likes: 13000, comments: 4000, shares: 740 },
  { index: 8, label: "Jan 30", views: 82000, engagement: 4.2, likes: 12200, comments: 3600, shares: 690 },
  { index: 9, label: "Feb 2", views: 78000, engagement: 4.0, likes: 11800, comments: 3400, shares: 660 },
  { index: 10, label: "Feb 5", views: 72000, engagement: 3.8, likes: 11200, comments: 3000, shares: 600 },
];

export const SUBMISSIONS_CHART_DATA: AnalyticsPocPerformanceLineChartData = {
  datasets: {
    daily: SUBMISSIONS_CHART_POINTS,
    cumulative: SUBMISSIONS_CHART_POINTS,
  },
  leftDomain: [0, 100000],
  rightDomain: [0, 8],
  rightYLabels: ["8%", "6%", "4%", "2%", "0%"],
  series: [
    { axis: "left", color: "#4D81EE", domain: [0, 100000], key: "views", label: "Views", tooltipValueType: "number", yLabels: ["100k", "75k", "50k", "25k", "0"] },
    { axis: "left", color: "#DA5597", domain: [0, 15000], key: "likes", label: "Likes", tooltipValueType: "number", yLabels: ["15k", "11k", "7.5k", "3.75k", "0"] },
    { axis: "left", color: "#E9A23B", domain: [0, 5000], key: "comments", label: "Comments", tooltipValueType: "number", yLabels: ["5k", "3.75k", "2.5k", "1.25k", "0"] },
    { axis: "left", color: "#888888", domain: [0, 1000], key: "shares", label: "Shares", tooltipValueType: "number", yLabels: ["1k", "750", "500", "250", "0"] },
  ],
  xTicks: [
    { index: 0, label: "Jan 5" },
    { index: 2, label: "Jan 11" },
    { index: 4, label: "Jan 17" },
    { index: 6, label: "Jan 23" },
    { index: 8, label: "Jan 30" },
    { index: 10, label: "Feb 5" },
  ],
  yLabels: ["100k", "75k", "50k", "25k", "0"],
};
