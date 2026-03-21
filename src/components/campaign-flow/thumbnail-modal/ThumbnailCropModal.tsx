"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { IconTrash, IconX } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useThumbnailCrop } from "@/hooks/media/use-thumbnail-crop";
import { cn } from "@/lib/utils";
import { useCfPortalContainer } from "../CampaignFlowContext";
import { ThumbnailCropState } from "./ThumbnailCropState";
import { ThumbnailUploadState } from "./ThumbnailUploadState";

type ModalState = "upload" | "crop" | "preview";

interface ThumbnailCropModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (preview: string, file: File) => void;
  initialFile?: File | null;
}

export function ThumbnailCropModal({ open, onOpenChange, onSave, initialFile }: ThumbnailCropModalProps) {
  const portalContainer = useCfPortalContainer();
  const [state, setState] = useState<ModalState>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ h: 500, w: 736 });
  const containerRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const crop = useThumbnailCrop(containerSize.w, containerSize.h);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setContainerSize({ h: Math.round(height), w: Math.round(width) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedFile) { setImageSrc(null); return; }
    const url = URL.createObjectURL(selectedFile);
    setImageSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  useEffect(() => {
    if (open && initialFile) { setSelectedFile(initialFile); setState("crop"); }
  }, [open, initialFile]);

  const handleOpenChange = useCallback((next: boolean) => {
    if (!next) {
      if (state === "preview" && croppedPreview && selectedFile) onSave(croppedPreview, selectedFile);
      setState("upload"); setSelectedFile(null); setImageSrc(null); setCroppedPreview(null);
    }
    onOpenChange(next);
  }, [onOpenChange, state, croppedPreview, selectedFile, onSave]);

  const handleFileSelect = useCallback((file: File) => { setSelectedFile(file); setState("crop"); }, []);

  const handleSave = useCallback(async () => {
    if (!imageSrc || !selectedFile) return;
    try {
      const preview = await crop.exportCrop(imageSrc);
      setCroppedPreview(preview);
      onSave(preview, selectedFile);
      handleOpenChange(false);
    } catch { /* Export failed */ }
  }, [imageSrc, selectedFile, crop, onSave, handleOpenChange]);

  const handleDelete = useCallback(() => { setState("upload"); setSelectedFile(null); setImageSrc(null); setCroppedPreview(null); }, []);
  const handleReplace = useCallback(() => { fileRef.current?.click(); }, []);
  const handleReplaceFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.size > 5 * 1024 * 1024 || !file.type.match(/^image\/(png|jpeg|webp)$/)) return;
    setSelectedFile(file); setCroppedPreview(null); setState("crop"); e.target.value = "";
  }, []);

  const secondaryBtn = "flex items-center justify-center rounded-full h-9 px-4 text-sm font-medium tracking-[-0.02em] text-page-text-subtle bg-[rgba(37,37,37,0.06)] dark:bg-[rgba(255,255,255,0.06)] transition-colors hover:bg-[rgba(37,37,37,0.1)] dark:hover:bg-[rgba(255,255,255,0.1)] active:scale-[0.98]";

  return (
    <DialogPrimitive.Root disablePointerDismissal onOpenChange={handleOpenChange} open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-[10000] bg-black/90 data-[open]:animate-in data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[open]:fade-in-0" />
        <DialogPrimitive.Popup className="fixed z-[10000] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 focus:outline-none data-[open]:animate-in data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[open]:fade-in-0 data-[ending-style]:zoom-out-95 data-[open]:zoom-in-95">
          <DialogPrimitive.Title className="sr-only">Edit thumbnail</DialogPrimitive.Title>

          <input accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleReplaceFile} ref={fileRef} type="file" />

          <DialogPrimitive.Close render={<button className="absolute left-[calc(100%+24px)] top-[5px] flex items-center justify-center size-8 rounded-full bg-[rgba(37,37,37,0.12)] dark:bg-[rgba(255,255,255,0.12)] transition-colors hover:bg-[rgba(37,37,37,0.2)] dark:hover:bg-[rgba(255,255,255,0.2)]" type="button" />}>
            <IconX className="text-page-text-muted" size={14} strokeWidth={1.5} />
          </DialogPrimitive.Close>

          <div className="relative flex flex-col rounded-3xl overflow-hidden w-[800px] max-w-[calc(100vw-80px)] h-[673px] max-h-[calc(100vh-80px)] bg-card-bg border border-border">
            <div className="flex items-center justify-center px-6 h-[41px] shrink-0 bg-[rgba(37,37,37,0.04)] dark:bg-[rgba(255,255,255,0.04)]">
              <span className="text-sm font-medium tracking-[-0.02em] text-page-text-muted">Edit thumbnail</span>
            </div>

            <div className="flex-1 min-h-0 p-8">
              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[rgba(37,37,37,0.04)] dark:bg-[rgba(255,255,255,0.04)]" ref={containerRef}>
                {state === "upload" ? (
                  <ThumbnailUploadState onFileSelect={handleFileSelect} />
                ) : state === "crop" && imageSrc ? (
                  <ThumbnailCropState cropBox={crop.cropBox} imageSrc={imageSrc} imgDisplay={crop.imgDisplay} initCrop={crop.initCrop} onPointerDown={crop.onPointerDown} onPointerMove={crop.onPointerMove} onPointerUp={crop.onPointerUp} />
                ) : state === "preview" && croppedPreview ? (
                  <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
                    <div className="absolute pointer-events-none" style={{ backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${croppedPreview})`, backgroundPosition: "center", backgroundSize: "cover", filter: "blur(50px)", height: "156%", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "190%" }} />
                    <div className="relative z-[2]">
                      <img src={croppedPreview} alt="Preview" className="max-h-[400px] rounded-2xl shadow-lg" />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className={cn("flex items-center px-6 h-[68px] shrink-0", state === "preview" ? "justify-between" : "justify-end")}>
              {state === "preview" && (
                <div className="flex items-center gap-2">
                  <button className="flex items-center justify-center size-9 rounded-full transition-colors hover:opacity-80 active:scale-[0.98] bg-rose-500/[0.16] border border-rose-500/[0.15]" onClick={handleDelete} type="button"><IconTrash className="text-rose-500" size={16} /></button>
                  <button className={secondaryBtn} onClick={handleReplace} type="button">Replace</button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <DialogPrimitive.Close render={<button className={secondaryBtn} type="button" />}>Cancel</DialogPrimitive.Close>
                <button className="flex items-center justify-center rounded-full h-9 px-4 text-sm font-medium tracking-[-0.02em] transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed bg-[#252525] dark:bg-white text-white dark:text-[#151515]" disabled={state === "upload"} onClick={state === "preview" ? () => handleOpenChange(false) : handleSave} type="button">Save</button>
              </div>
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
