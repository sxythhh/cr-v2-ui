"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";

const COLOR_THEMES = [
  { id: "plum", primary: "#6366f1", secondary: "#4f46e5", gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" },
  { id: "melon", primary: "#10b981", secondary: "#059669", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
  { id: "peach", primary: "#f97316", secondary: "#ea580c", gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)" },
  { id: "apple", primary: "#22c55e", secondary: "#16a34a", gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" },
  { id: "rose", primary: "#f43f5e", secondary: "#e11d48", gradient: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)" },
  { id: "sky", primary: "#0ea5e9", secondary: "#0284c7", gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)" },
  { id: "amber", primary: "#f59e0b", secondary: "#d97706", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
  { id: "violet", primary: "#8b5cf6", secondary: "#7c3aed", gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" },
];

/* ── QR-like pattern generator ── */
function generateQrSvgPath(url: string, size: number): string {
  const hash = Array.from(url).reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
  const grid = 21;
  const cell = size / grid;
  const modules: boolean[][] = Array.from({ length: grid }, () => Array(grid).fill(false));
  const drawFinder = (r: number, c: number) => {
    for (let dr = 0; dr < 7; dr++)
      for (let dc = 0; dc < 7; dc++)
        if (dr === 0 || dr === 6 || dc === 0 || dc === 6 || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4))
          modules[r + dr][c + dc] = true;
  };
  drawFinder(0, 0);
  drawFinder(0, grid - 7);
  drawFinder(grid - 7, 0);
  for (let i = 8; i < grid - 8; i++) { modules[6][i] = i % 2 === 0; modules[i][6] = i % 2 === 0; }
  let seed = Math.abs(hash);
  for (let r = 0; r < grid; r++)
    for (let c = 0; c < grid; c++) {
      if (modules[r][c]) continue;
      if ((r < 9 && c < 9) || (r < 9 && c >= grid - 8) || (r >= grid - 8 && c < 9)) continue;
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      modules[r][c] = (seed >> 16) % 3 === 0;
    }
  let path = "";
  for (let r = 0; r < grid; r++)
    for (let c = 0; c < grid; c++)
      if (modules[r][c]) path += `M${c * cell},${r * cell}h${cell}v${cell}h-${cell}z`;
  return path;
}

function buildSvg(theme: typeof COLOR_THEMES[number], amount: string, date: string, username: string) {
  const width = 804;
  const height = 458;
  const qrPath = generateQrSvgPath(`https://contentrewards.cc/${username}`, 54);
  const name = username.replace("@", "");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFC745"/><stop offset="100%" stop-color="#FF9501"/></linearGradient>
      <linearGradient id="bo" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${theme.primary}"/><stop offset="100%" stop-color="${theme.secondary}"/></linearGradient>
      <linearGradient id="rg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="white" stop-opacity="0"/><stop offset="100%" stop-color="white" stop-opacity="0.4"/></linearGradient>
      <clipPath id="cc"><rect width="${width}" height="${height}" rx="24"/></clipPath>
    </defs>
    <style>text{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif}</style>
    <g clip-path="url(#cc)">
      <rect width="${width}" height="${height}" fill="${theme.primary}"/>
      <rect width="${width}" height="${height}" fill="url(#bo)" opacity="0.6"/>
      <g opacity="0.08" transform="scale(2)">
        <path d="M55.4 21.1L96.2 18.6 77.6 46 101.3 78.2 59.2 66.4 33 88.8 25.7 54 -14.2 35.7 23.3 26 24.8 -7.7z" fill="white"/>
        <path d="M178.3 80.9L202.1 105.7 171.2 100.9 159.2 123.5 145.7 94.5 114.6 83.7 137.2 70.6 129.9 41.2 157.4 62.2 184 54.8z" fill="white"/>
        <path d="M-29.4 91.1L-23.8 65 -4.7 92.5 26.3 97.4 8.6 115.7 22.1 144.7 -7.9 128.6 -30.5 141.7 -31.4 113.3 -58.9 92.4z" fill="white"/>
        <path d="M8.1 198.4L-12.6 180.3 17.3 182.8 31.5 165 41.6 186.8 71.1 193.9 47.4 204.8 51.5 227.1 26.7 212 -0.3 218.6z" fill="white"/>
        <path d="M122.4 233.8L102.1 235.2 112 222.8 101 208.5 121.6 213.5 135.1 203.3 137.9 218.8 157.3 226.7 138.4 231.3 136.9 246.4z" fill="white"/>
        <path d="M206.5 184.2L200.4 204 185.5 183.5 159.4 180.3 175.3 166.1 165.1 144.3 189.9 156.1 209.7 145.9 209.1 167.3 231.5 182.8z" fill="white"/>
      </g>
      <rect x="300" y="420" width="1467" height="223" fill="url(#rg)" transform="rotate(-28.54 300 420)" opacity="0.4"/>
      <rect x="250" y="180" width="1954" height="223" fill="url(#rg)" transform="rotate(-28.54 250 180)" opacity="0.4"/>
      <!-- "Earned with" + Content Rewards vector logo (right-aligned) -->
      <g transform="translate(${width - 260}, 10)">
        <text x="0" y="26" font-size="22" font-weight="600" fill="white" letter-spacing="-0.03em">Earned with</text>
        <g transform="translate(128, 0) scale(1.4)" fill="white">
          <path d="M11.55 0L13.07 3.45 16.8 3.85 14.01 6.37 14.79 10.07 11.55 8.18 8.3 10.07 9.08 6.37 6.3 3.85 10.03 3.45z"/>
          <path d="M11.55 27L12.33 25.23 14.25 25.02 12.82 23.73 13.22 21.83 11.55 22.8 9.88 21.83 10.28 23.73 8.85 25.02 10.77 25.23z"/>
          <path d="M4.45 6.77L5.03 9.54 7.71 10.42 5.27 11.83V14.67L3.18 12.77.51 13.65 1.65 11.06 0 8.76 2.8 9.06z"/>
          <path d="M5.27 16.6V19.14L7.45 20.41 5.06 21.2 4.53 23.68 3.05 21.63.55 21.89 2.03 19.84 1.01 17.52 3.4 18.3z"/>
          <path d="M18.65 6.77L18.06 9.54 15.39 10.42 17.83 11.83V14.67L19.91 12.77 22.59 13.65 21.44 11.06 23.1 8.76 20.3 9.06z"/>
          <path d="M17.83 16.6V19.14L15.65 20.41 18.04 21.2 18.56 23.68 20.04 21.63 22.55 21.89 21.07 19.84 22.09 17.52 19.7 18.3z"/>
          <path d="M33.39 11.78c-.88 0-1.66-.2-2.34-.61-.67-.41-1.2-.99-1.58-1.75-.38-.76-.57-1.68-.57-2.74 0-1.05.19-1.95.56-2.71.37-.77.9-1.36 1.57-1.78.67-.42 1.47-.63 2.38-.63 1.24 0 2.2.31 2.88.94.68.62 1.13 1.48 1.34 2.59l-1.86.1c-.12-.64-.37-1.15-.76-1.52-.39-.37-.93-.55-1.6-.55-.55 0-1.02.15-1.42.44-.4.29-.71.71-.93 1.24-.22.53-.33 1.16-.33 1.89s.11 1.37.33 1.9c.23.52.54.93.94 1.21.4.28.87.43 1.39.43.72 0 1.28-.2 1.67-.59.4-.4.66-.96.77-1.65l1.86.1c-.13.76-.38 1.42-.74 1.98-.37.55-.85.98-1.45 1.28-.59.29-1.3.44-2.11.44z"/>
          <path d="M41.93 11.73c-.72 0-1.35-.16-1.9-.47-.54-.32-.96-.77-1.26-1.35-.29-.58-.44-1.25-.44-2.03 0-.78.15-1.45.44-2.03.3-.58.72-1.02 1.26-1.34.54-.32 1.17-.48 1.9-.48.72 0 1.35.16 1.89.48.54.31.96.77 1.24 1.34.3.58.45 1.25.45 2.03s-.15 1.25-.45 1.83c-.29.58-.71 1.03-1.24 1.35-.54.31-1.17.47-1.89.47zm0-1.43c.57 0 1-.21 1.3-.63.31-.42.47-1.02.47-1.78 0-.75-.16-1.34-.47-1.76-.3-.43-.73-.65-1.3-.65-.56 0-1 .22-1.31.65-.31.42-.47 1.01-.47 1.76 0 .76.16 1.36.47 1.78.31.42.74.63 1.31.63z"/>
          <path d="M46.59 11.56V4.2h1.59l.07 2.07-.21-.08c.07-.52.22-.93.45-1.24.23-.31.5-.55.83-.69.33-.15.69-.22 1.08-.22.54 0 .99.12 1.35.36.38.24.66.57.85.98.19.41.29.9.29 1.45v4.73H51.14V7.4c0-.41-.04-.76-.12-1.05-.08-.28-.22-.5-.41-.65-.18-.16-.43-.23-.74-.23-.46 0-.84.17-1.12.5-.27.33-.41.81-.41 1.43v4.16h-1.75z"/>
          <path d="M56.94 11.56c-.73 0-1.27-.17-1.61-.51-.34-.34-.51-.87-.51-1.6V2.48h1.75v6.81c0 .34.07.58.22.72.15.13.37.19.68.19h1.03v1.36h-1.56zm-3.27-5.99V4.2h4.82v1.37h-4.82z"/>
          <path d="M62.54 11.73c-.73 0-1.36-.16-1.9-.47-.54-.32-.95-.77-1.24-1.35-.29-.58-.44-1.25-.44-2.03 0-.77.15-1.44.44-2.01.29-.58.7-1.03 1.23-1.35.53-.32 1.15-.48 1.87-.48.69 0 1.3.16 1.82.47.53.31.94.76 1.22 1.35.28.59.42 1.3.42 2.12v.4h-5.18c.04.64.21 1.13.52 1.46.32.32.74.48 1.26.48.39 0 .71-.09.97-.26.26-.18.44-.44.54-.76l1.79.11c-.2.72-.6 1.28-1.19 1.7-.58.41-1.29.62-2.13.62zm-1.76-4.53h3.38c-.04-.6-.2-1.04-.5-1.32-.3-.29-.69-.44-1.15-.44-.47 0-.85.15-1.16.45-.3.3-.49.74-.56 1.3z"/>
          <path d="M67.05 11.56V4.2h1.59l.07 2.07-.21-.08c.07-.52.22-.93.45-1.24.23-.31.5-.55.83-.69.33-.15.69-.22 1.08-.22.54 0 .99.12 1.35.36.38.24.66.57.85.98.19.41.29.9.29 1.45v4.73h-1.75V7.4c0-.41-.04-.76-.12-1.05-.08-.28-.22-.5-.41-.65-.18-.16-.43-.23-.74-.23-.46 0-.84.17-1.12.5-.27.33-.41.81-.41 1.43v4.16h-1.75z"/>
          <path d="M77.4 11.56c-.73 0-1.27-.17-1.61-.51-.34-.34-.51-.87-.51-1.6V2.48h1.75v6.81c0 .34.07.58.22.72.15.13.37.19.68.19h1.03v1.36H77.4zm-3.27-5.99V4.2h4.82v1.37h-4.82z"/>
          <path d="M29.4 25.18V15.4h4.06c.7 0 1.31.12 1.82.36.51.24.9.58 1.19 1.02.28.44.42.96.42 1.56 0 .45-.1.85-.29 1.2-.19.35-.45.63-.78.84-.33.21-.68.34-1.07.39l-.07-.14c.63 0 1.11.14 1.45.43.35.28.54.72.59 1.31l.25 2.82h-1.8l-.21-2.56c-.03-.39-.15-.67-.37-.86-.22-.18-.59-.27-1.1-.27h-2.32v3.69H29.4zm1.78-5.26h2.17c.54 0 .96-.13 1.26-.39.3-.26.45-.62.45-1.09 0-.48-.15-.84-.46-1.1-.3-.26-.74-.39-1.33-.39h-2.09v2.96z"/>
          <path d="M41.36 25.35c-.73 0-1.36-.16-1.9-.47-.54-.32-.95-.77-1.24-1.35-.29-.58-.44-1.25-.44-2.03 0-.77.15-1.44.44-2.01.29-.58.7-1.04 1.23-1.35.54-.32 1.16-.48 1.87-.48.7 0 1.3.16 1.82.47.53.31.94.76 1.22 1.35.28.59.42 1.3.42 2.12v.4h-5.18c.04.64.21 1.13.52 1.46.32.32.74.48 1.26.48.39 0 .71-.09.97-.26.26-.18.45-.44.55-.76l1.79.11c-.2.72-.6 1.28-1.19 1.7-.58.41-1.29.62-2.13.62zm-1.76-4.53h3.38c-.04-.6-.2-1.04-.5-1.32-.3-.3-.69-.44-1.15-.44-.47 0-.85.15-1.16.45-.3.3-.49.74-.56 1.3z"/>
          <path d="M47.14 25.18l-2.2-7.36h1.79l1.42 5.36 1.46-5.36h1.53l1.48 5.36 1.42-5.36h1.79l-2.2 7.36h-1.8l-1.45-4.93-1.43 4.93h-1.8z"/>
          <path d="M58.55 25.35c-.77 0-1.38-.17-1.84-.52-.47-.36-.7-.86-.7-1.49 0-.63.2-1.13.59-1.49.39-.36.99-.61 1.79-.77l2.42-.48c0-.52-.12-.91-.36-1.17-.24-.27-.59-.4-1.05-.4-.42 0-.75.1-1 .3-.24.19-.4.47-.49.84l-1.78-.08c.15-.78.5-1.38 1.07-1.79.56-.42 1.3-.63 2.2-.63 1.04 0 1.82.27 2.35.8.54.52.81 1.28.81 2.26v2.67c0 .19.03.33.1.4.07.07.18.11.31.11h.23v1.28c-.05.02-.15.03-.27.04-.12.01-.24.01-.37.01-.3 0-.57-.05-.81-.14-.24-.1-.42-.27-.55-.51-.13-.25-.2-.58-.2-1l.15.11c-.07.32-.23.61-.48.87-.24.25-.54.44-.9.58-.36.14-.77.21-1.23.21zm.36-1.28c.39 0 .73-.08 1.01-.23.28-.16.5-.37.66-.65.15-.28.23-.6.23-.98v-.41l-1.89.39c-.39.08-.67.2-.85.37-.17.16-.24.36-.24.62 0 .28.09.5.27.66.19.16.46.24.81.24z"/>
          <path d="M64.06 25.18v-7.36h1.64l.07 2.04-.15-.03c.11-.71.32-1.22.62-1.53.31-.32.73-.48 1.26-.48h.67v1.52h-.68c-.37 0-.68.06-.93.17-.25.11-.43.28-.56.52-.12.23-.18.53-.18.91v4.24h-1.75z"/>
          <path d="M71.42 25.35c-.62 0-1.16-.16-1.61-.47-.45-.31-.8-.76-1.04-1.34-.25-.58-.37-1.26-.37-2.04s.12-1.26.37-1.84c.25-.58.6-1.04 1.05-1.34.46-.31.99-.47 1.6-.47.51 0 .96.1 1.34.32.39.21.69.51.89.89v-3.47h1.75v9.78h-1.67l-.04-1.09c-.2.4-.5.7-.9.92-.4.22-.86.33-1.37.33zm.53-1.43c.37 0 .67-.09.92-.28.25-.18.44-.45.57-.81.14-.37.2-.81.2-1.33 0-.52-.07-.96-.2-1.32-.13-.36-.33-.63-.57-.81-.25-.18-.55-.28-.92-.28-.53 0-.95.22-1.27.65-.31.42-.47 1.01-.47 1.76 0 .74.15 1.33.47 1.76.32.43.74.65 1.27.65z"/>
          <path d="M79.87 25.35c-.72 0-1.33-.11-1.82-.32-.48-.21-.86-.5-1.12-.88-.26-.38-.41-.8-.45-1.28l1.79-.08c.06.39.22.68.48.9.25.21.63.32 1.13.32.41 0 .73-.06.96-.19.24-.14.36-.35.36-.63 0-.17-.04-.3-.12-.41-.08-.11-.24-.2-.46-.29-.23-.08-.57-.17-1.01-.25-.75-.13-1.34-.28-1.77-.47-.43-.19-.73-.43-.92-.72-.17-.28-.26-.64-.26-1.06 0-.69.26-1.24.78-1.67.53-.43 1.3-.65 2.31-.65.66 0 1.21.11 1.65.33.45.21.79.51 1.04.88.25.37.41.79.48 1.27l-1.76.08c-.05-.25-.13-.46-.25-.65-.12-.18-.28-.32-.48-.41-.2-.1-.43-.15-.71-.15-.41 0-.72.08-.93.25-.21.17-.31.39-.31.66 0 .19.05.35.14.48.1.13.26.24.48.32.22.07.51.14.88.21.76.12 1.37.28 1.8.47.45.18.76.42.95.72.19.28.28.63.28 1.03 0 .47-.13.87-.4 1.2-.25.33-.62.59-1.09.76-.46.17-1.01.25-1.64.25z"/>
        </g>
      </g>
      <text x="48" y="232" font-size="18" font-weight="600" fill="white"><tspan fill="white" opacity="0.5">Brand: </tspan>Outpace</text>
      <text x="48" y="258" font-size="18" font-weight="600" fill="white"><tspan fill="white" opacity="0.5">Date: </tspan>${date}</text>
      <text x="${width - 30}" y="270" text-anchor="end" letter-spacing="-3"><tspan font-size="36" font-weight="700" fill="white">+</tspan><tspan font-size="56" font-weight="800" fill="white">${amount}</tspan></text>
      <rect x="30" y="${height - 108}" width="${width - 60}" height="78" fill="black" fill-opacity="0.3" rx="16"/>
      <circle cx="68" cy="${height - 69}" r="33" fill="white" fill-opacity="0.15"/>
      <text x="68" y="${height - 62}" font-size="22" font-weight="700" fill="white" text-anchor="middle">${name[0].toUpperCase()}</text>
      <text x="112" y="${height - 62}" font-size="28" font-weight="700" fill="white">${name}</text>
      <rect x="${width - 102}" y="${height - 104}" width="66" height="66" fill="white" rx="12"/>
      <g transform="translate(${width - 96},${height - 98})"><path d="${qrPath}" fill="#161616"/></g>
    </g>
  </svg>`;
}

interface TransactionShareModalProps {
  open: boolean;
  onClose: () => void;
  amount?: string;
  date?: string;
  username?: string;
}

export function TransactionShareModal({ open, onClose, amount = "$2,862.15", date = "Mar 13 – Mar 20", username = "@vladclips" }: TransactionShareModalProps) {
  const [selectedTheme, setSelectedTheme] = useState(COLOR_THEMES[0]);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);

  const exportToPng = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const svg = buildSvg(selectedTheme, amount, date, username);
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      const scale = 2;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 804 * scale;
        canvas.height = 458 * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject("no ctx"); return; }
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/png", 1.0));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject("img error"); };
      img.src = url;
    });
  };

  const handleCopy = async () => {
    setExporting(true);
    try {
      const dataUrl = await exportToPng();
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* */ }
    setExporting(false);
  };

  const handleDownload = async () => {
    setExporting(true);
    try {
      const dataUrl = await exportToPng();
      const link = document.createElement("a");
      link.download = `transaction-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch { /* */ }
    setExporting(false);
  };

  const handleShareOnX = () => {
    const text = encodeURIComponent(`Just earned ${amount} on @ContentRewards! 💰`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "width=550,height=420");
  };

  // Live SVG string for instant preview
  const previewSvg = buildSvg(selectedTheme, amount, date, username);

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-[520px]">
      <div className="flex items-center justify-center border-b border-foreground/[0.06] px-5 py-3 dark:border-[rgba(224,224,224,0.03)]">
        <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Share your stats</span>
      </div>

      <div className="flex flex-col gap-4 p-5 tracking-[-0.02em]">
        {/* Live preview */}
        <div
          ref={svgRef}
          className="overflow-hidden rounded-xl border border-foreground/[0.06] [&>svg]:h-auto [&>svg]:w-full dark:border-[rgba(224,224,224,0.03)]"
          dangerouslySetInnerHTML={{ __html: previewSvg }}
        />

        {/* Color theme — horizontal scroll strip */}
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-xs font-medium text-page-text-muted">Theme</span>
          <div className="flex items-center gap-1.5">
            {COLOR_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme)}
                className={cn(
                  "relative flex size-7 shrink-0 items-center justify-center rounded-lg transition-all",
                  selectedTheme.id === theme.id
                    ? "ring-2 ring-page-text ring-offset-2 ring-offset-white dark:ring-white dark:ring-offset-[#161616]"
                    : "hover:scale-110"
                )}
                style={{ background: theme.gradient }}
              />
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            disabled={exporting}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground/[0.06] px-3 py-2.5 text-sm font-medium text-page-text transition-colors hover:bg-foreground/[0.10] disabled:opacity-40 dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-white/[0.06]"
          >
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.33 8L6.67 11.33 12.67 5.33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="5.333" y="5.333" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.33"/><path d="M3.333 10.667h-.5A1.5 1.5 0 0 1 1.333 9.167v-6A1.5 1.5 0 0 1 2.833 1.667h6A1.5 1.5 0 0 1 10.333 3.167v.5" stroke="currentColor" strokeWidth="1.33"/></svg>
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            disabled={exporting}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground/[0.06] px-3 py-2.5 text-sm font-medium text-page-text transition-colors hover:bg-foreground/[0.10] disabled:opacity-40 dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-white/[0.06]"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2v8m0 0l-3-3m3 3l3-3M2.667 12.667h10.666" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Save
          </button>
          <button
            onClick={handleShareOnX}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-page-text px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-page-text/90 dark:bg-white dark:text-[#252525] dark:hover:bg-white/90"
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </Modal>
  );
}
