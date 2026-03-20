"use client";

import { useEffect, useMemo, useRef } from "react";
import type { CropBox, HandleId } from "@/hooks/media/use-thumbnail-crop";

const HANDLES: { id: HandleId; getPos: (b: CropBox) => { x: number; y: number } }[] = [
  { getPos: (b) => ({ x: b.x, y: b.y }), id: "tl" },
  { getPos: (b) => ({ x: b.x + b.w, y: b.y }), id: "tr" },
  { getPos: (b) => ({ x: b.x, y: b.y + b.h }), id: "bl" },
  { getPos: (b) => ({ x: b.x + b.w, y: b.y + b.h }), id: "br" },
  { getPos: (b) => ({ x: b.x + b.w / 2, y: b.y }), id: "tc" },
  { getPos: (b) => ({ x: b.x + b.w / 2, y: b.y + b.h }), id: "bc" },
];

const HANDLE_CURSORS: Record<HandleId, string> = {
  bc: "ns-resize", bl: "nesw-resize", br: "nwse-resize",
  tc: "ns-resize", tl: "nwse-resize", tr: "nesw-resize",
};

interface ThumbnailCropStateProps {
  imageSrc: string;
  cropBox: CropBox;
  imgDisplay: { x: number; y: number; w: number; h: number };
  initCrop: (natW: number, natH: number) => void;
  onPointerDown: (e: React.PointerEvent, type: "handle" | "move", handle?: HandleId) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
}

export function ThumbnailCropState({ imageSrc, cropBox, imgDisplay, initCrop, onPointerDown, onPointerMove, onPointerUp }: ThumbnailCropStateProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.naturalWidth > 0) initCrop(img.naturalWidth, img.naturalHeight);
  }, [initCrop]);

  const maskStyle = useMemo(() => {
    if (!cropBox.w) return {};
    return {
      clipPath: `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${cropBox.x}px ${cropBox.y}px, ${cropBox.x}px ${cropBox.y + cropBox.h}px, ${cropBox.x + cropBox.w}px ${cropBox.y + cropBox.h}px, ${cropBox.x + cropBox.w}px ${cropBox.y}px, ${cropBox.x}px ${cropBox.y}px)`,
    };
  }, [cropBox]);

  return (
    <div className="relative h-full w-full select-none overflow-hidden" onPointerLeave={onPointerUp} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      <div className="absolute pointer-events-none" style={{ backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imageSrc})`, backgroundPosition: "center", backgroundSize: "cover", filter: "blur(50px)", height: "156%", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "190%" }} />
      <img alt="" className="absolute pointer-events-none" draggable={false} onLoad={(e) => { const el = e.currentTarget; initCrop(el.naturalWidth, el.naturalHeight); }} ref={imgRef} src={imageSrc} style={{ height: imgDisplay.h || "auto", left: imgDisplay.x, top: imgDisplay.y, width: imgDisplay.w || "auto" }} />
      <div className="absolute inset-0 bg-black/60 pointer-events-none" style={maskStyle} />
      {cropBox.w > 0 && (
        <div className="absolute border border-white/80 cursor-move" onPointerDown={(e) => onPointerDown(e, "move")} style={{ height: cropBox.h, left: cropBox.x, top: cropBox.y, width: cropBox.w }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20" />
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20" />
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20" />
            <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20" />
          </div>
        </div>
      )}
      {cropBox.w > 0 && HANDLES.map(({ id, getPos }) => {
        const pos = getPos(cropBox);
        return (
          <div className="absolute z-10" key={id} onPointerDown={(e) => onPointerDown(e, "handle", id)} style={{ backdropFilter: "blur(12px)", background: "white", border: "2px solid #252525", borderRadius: "50%", cursor: HANDLE_CURSORS[id], height: 10, left: pos.x - 5, top: pos.y - 5, width: 10 }} />
        );
      })}
    </div>
  );
}
