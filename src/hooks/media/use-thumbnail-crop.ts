"use client";

import { useCallback, useRef, useState } from "react";

export type HandleId = "tl" | "tr" | "bl" | "br" | "tc" | "bc";

export type CropBox = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const MIN_W = 60;
const ASPECT = 3 / 2;
const MIN_H = MIN_W / ASPECT;

type DragState = {
  type: "handle" | "move";
  handle?: HandleId;
  startX: number;
  startY: number;
  startBox: CropBox;
};

export function useThumbnailCrop(containerW: number, containerH: number) {
  const [cropBox, setCropBox] = useState<CropBox>({ h: 0, w: 0, x: 0, y: 0 });
  const [imgDisplay, setImgDisplay] = useState({ h: 0, w: 0, x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState({ h: 0, w: 0 });
  const dragRef = useRef<DragState | null>(null);

  const initCrop = useCallback(
    (natW: number, natH: number) => {
      setNaturalSize({ h: natH, w: natW });
      const scale = Math.min(containerW / natW, containerH / natH);
      const dispW = natW * scale;
      const dispH = natH * scale;
      const dispX = (containerW - dispW) / 2;
      const dispY = (containerH - dispH) / 2;
      setImgDisplay({ h: dispH, w: dispW, x: dispX, y: dispY });

      let cropW: number;
      let cropH: number;
      if (dispW / dispH > ASPECT) {
        cropH = dispH * 0.85;
        cropW = cropH * ASPECT;
      } else {
        cropW = dispW * 0.85;
        cropH = cropW / ASPECT;
      }
      setCropBox({
        h: cropH, w: cropW,
        x: dispX + (dispW - cropW) / 2,
        y: dispY + (dispH - cropH) / 2,
      });
    },
    [containerW, containerH],
  );

  const clampBox = useCallback(
    (box: CropBox): CropBox => {
      let { x, y, w, h } = box;
      h = w / ASPECT;
      if (w < MIN_W) { w = MIN_W; h = MIN_H; }
      if (w > imgDisplay.w) { w = imgDisplay.w; h = w / ASPECT; }
      if (h > imgDisplay.h) { h = imgDisplay.h; w = h * ASPECT; }
      x = Math.max(imgDisplay.x, Math.min(x, imgDisplay.x + imgDisplay.w - w));
      y = Math.max(imgDisplay.y, Math.min(y, imgDisplay.y + imgDisplay.h - h));
      return { h, w, x, y };
    },
    [imgDisplay],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent, type: "handle" | "move", handle?: HandleId) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragRef.current = { handle, startBox: { ...cropBox }, startX: e.clientX, startY: e.clientY, type };
    },
    [cropBox],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      const sb = drag.startBox;

      if (drag.type === "move") {
        setCropBox(clampBox({ h: sb.h, w: sb.w, x: sb.x + dx, y: sb.y + dy }));
        return;
      }

      let newW: number;
      let newX = sb.x;
      let newY = sb.y;

      switch (drag.handle) {
        case "br": { const dMain = Math.abs(dx) > Math.abs(dy) ? dx : dy * ASPECT; newW = sb.w + dMain; break; }
        case "bl": { const dMain = Math.abs(dx) > Math.abs(dy) ? -dx : dy * ASPECT; newW = sb.w + dMain; newX = sb.x + sb.w - newW; break; }
        case "tr": { const dMain = Math.abs(dx) > Math.abs(dy) ? dx : -dy * ASPECT; newW = sb.w + dMain; const newH = newW / ASPECT; newY = sb.y + sb.h - newH; break; }
        case "tl": { const dMain = Math.abs(dx) > Math.abs(dy) ? -dx : -dy * ASPECT; newW = sb.w + dMain; const newH = newW / ASPECT; newX = sb.x + sb.w - newW; newY = sb.y + sb.h - newH; break; }
        case "tc": { const newH = sb.h - dy; newW = newH * ASPECT; newX = sb.x + (sb.w - newW) / 2; newY = sb.y + sb.h - newH; break; }
        case "bc": { const newH = sb.h + dy; newW = newH * ASPECT; newX = sb.x + (sb.w - newW) / 2; break; }
        default: return;
      }

      setCropBox(clampBox({ h: newW / ASPECT, w: newW, x: newX, y: newY }));
    },
    [clampBox],
  );

  const onPointerUp = useCallback(() => { dragRef.current = null; }, []);

  const exportCrop = useCallback(
    (imageSrc: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (!naturalSize.w || !imgDisplay.w) { reject(new Error("Image not loaded")); return; }
        const img = new Image();
        img.onload = () => {
          const scaleX = naturalSize.w / imgDisplay.w;
          const scaleY = naturalSize.h / imgDisplay.h;
          const sx = (cropBox.x - imgDisplay.x) * scaleX;
          const sy = (cropBox.y - imgDisplay.y) * scaleY;
          const sw = cropBox.w * scaleX;
          const sh = cropBox.h * scaleY;
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(sw * 2);
          canvas.height = Math.round(sh * 2);
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, Math.round(sx), Math.round(sy), Math.round(sw), Math.round(sh), 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.92));
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = imageSrc;
      });
    },
    [cropBox, imgDisplay, naturalSize],
  );

  return { cropBox, exportCrop, imgDisplay, initCrop, onPointerDown, onPointerMove, onPointerUp };
}
