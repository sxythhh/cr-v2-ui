"use client";

import { useCallback, useId, useRef, useState } from "react";
import { IconCrop, IconInfoCircle, IconUpload } from "@tabler/icons-react";
import { ThumbnailCropModal } from "./thumbnail-modal/ThumbnailCropModal";

interface ThumbnailUploadProps {
  fileName: string;
  thumbnailPreview: string | null;
  onCropComplete: (preview: string, file: File) => void;
  onDelete?: () => void;
}

/** File icon with corner flap — uses useId for unique SVG IDs */
function FileIcon({ preview, ext }: { preview?: string | null; ext: string }) {
  const uid = useId();
  const clipId = `fc-${uid}`;
  const maskId = `fm-${uid}`;
  const gradId = `fg-${uid}`;
  const flapId = `ff-${uid}`;
  const extUpper = ext.toUpperCase();
  const pillW = Math.max(extUpper.length * 7 + 12, 28);

  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="shrink-0">
      <defs>
        <clipPath id={clipId}>
          <path d="M27 0C30.15 0 31.73 0 32.93 0.613C33.99 1.153 34.85 2.013 35.39 3.071C36 4.275 36 5.85 36 9V27C36 27.42 36 27.812 35.997 28.179L28.809 35.733C28.712 35.83 28.664 35.878 28.608 35.912C28.558 35.943 28.504 35.966 28.447 35.98C28.383 35.995 28.315 35.996 28.179 35.997C27.812 35.999 27.42 36 27 36H9C5.85 36 4.275 36 3.071 35.387C2.013 34.847 1.153 33.987 0.613 32.929C0 31.726 0 30.15 0 27V9C0 5.85 0 4.275 0.613 3.071C1.153 2.013 2.013 1.153 3.071 0.613C4.275 0 5.85 0 9 0H27Z" />
        </clipPath>
        <mask id={maskId} fill="white">
          <path d="M27 0C30.15 0 31.73 0 32.93 0.613C33.99 1.153 34.85 2.013 35.39 3.071C36 4.275 36 5.85 36 9V27C36 27.42 36 27.812 35.997 28.179C35.996 28.315 35.995 28.383 35.98 28.447C35.966 28.504 35.943 28.558 35.912 28.608C35.878 28.664 35.83 28.712 35.733 28.809L28.809 35.733C28.712 35.83 28.664 35.878 28.608 35.912C28.558 35.943 28.504 35.966 28.447 35.98C28.383 35.995 28.315 35.996 28.179 35.997C27.812 35.999 27.42 36 27 36H9C5.85 36 4.275 36 3.071 35.387C2.013 34.847 1.153 33.987 0.613 32.929C0 31.726 0 30.15 0 27V9C0 5.85 0 4.275 0.613 3.071C1.153 2.013 2.013 1.153 3.071 0.613C4.275 0 5.85 0 9 0H27Z" />
        </mask>
        <linearGradient id={gradId} x1="18" y1="0" x2="18" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0.8" stopColor="#252525" stopOpacity="0" />
          <stop offset="1" stopColor="#252525" />
        </linearGradient>
        <linearGradient id={flapId} x1="30.59" y1="30.31" x2="31.99" y2="31.82" gradientUnits="userSpaceOnUse">
          <stop offset="0.65" stopColor="white" />
          <stop offset="1" stopColor="#F2F2F2" />
        </linearGradient>
      </defs>

      {/* Background — image or solid fill */}
      {preview ? (
        <image href={preview} x="0" y="0" width="36" height="36" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clipId})`} />
      ) : (
        <path d="M27 0C30.15 0 31.73 0 32.93 0.613C33.99 1.153 34.85 2.013 35.39 3.071C36 4.275 36 5.85 36 9V27C36 27.42 36 27.812 35.997 28.179C35.996 28.315 35.995 28.383 35.98 28.447C35.966 28.504 35.943 28.558 35.912 28.608C35.878 28.664 35.83 28.712 35.733 28.809L28.809 35.733C28.712 35.83 28.664 35.878 28.608 35.912C28.558 35.943 28.504 35.966 28.447 35.98C28.383 35.995 28.315 35.996 28.179 35.997C27.812 35.999 27.42 36 27 36H9C5.85 36 4.275 36 3.071 35.387C2.013 34.847 1.153 33.987 0.613 32.929C0 31.726 0 30.15 0 27V9C0 5.85 0 4.275 0.613 3.071C1.153 2.013 2.013 1.153 3.071 0.613C4.275 0 5.85 0 9 0H27Z" fill="var(--card-bg, #F5F5F5)" />
      )}

      {/* Bottom gradient overlay */}
      <path d="M27 0C30.15 0 31.73 0 32.93 0.613C33.99 1.153 34.85 2.013 35.39 3.071C36 4.275 36 5.85 36 9V27C36 27.42 36 27.812 35.997 28.179C35.996 28.315 35.995 28.383 35.98 28.447C35.966 28.504 35.943 28.558 35.912 28.608C35.878 28.664 35.83 28.712 35.733 28.809L28.809 35.733C28.712 35.83 28.664 35.878 28.608 35.912C28.558 35.943 28.504 35.966 28.447 35.98C28.383 35.995 28.315 35.996 28.179 35.997C27.812 35.999 27.42 36 27 36H9C5.85 36 4.275 36 3.071 35.387C2.013 34.847 1.153 33.987 0.613 32.929C0 31.726 0 30.15 0 27V9C0 5.85 0 4.275 0.613 3.071C1.153 2.013 2.013 1.153 3.071 0.613C4.275 0 5.85 0 9 0H27Z" fill={`url(#${gradId})`} fillOpacity="0.1" />

      {/* Border stroke */}
      <path d="M27 0C30.15 0 31.73 0 32.93 0.613C33.99 1.153 34.85 2.013 35.39 3.071C36 4.275 36 5.85 36 9V27C36 27.42 36 27.812 35.997 28.179C35.996 28.315 35.995 28.383 35.98 28.447C35.966 28.504 35.943 28.558 35.912 28.608C35.878 28.664 35.83 28.712 35.733 28.809L28.809 35.733C28.712 35.83 28.664 35.878 28.608 35.912C28.558 35.943 28.504 35.966 28.447 35.98C28.383 35.995 28.315 35.996 28.179 35.997C27.812 35.999 27.42 36 27 36H9C5.85 36 4.275 36 3.071 35.387C2.013 34.847 1.153 33.987 0.613 32.929C0 31.726 0 30.15 0 27V9C0 5.85 0 4.275 0.613 3.071C1.153 2.013 2.013 1.153 3.071 0.613C4.275 0 5.85 0 9 0H27Z" fill="none" stroke="var(--foreground, #252525)" strokeOpacity="0.06" strokeWidth="1" mask={`url(#${maskId})`} />

      {/* Extension badge pill */}
      <rect x="4" y="10" width={pillW} height="16" rx="8" fill="var(--card-bg, white)" stroke="var(--foreground, #252525)" strokeOpacity="0.06" strokeWidth="1" />
      <text x={4 + pillW / 2} y="21.5" textAnchor="middle" fill="var(--foreground, #252525)" fillOpacity="0.7" fontSize="8" fontWeight="600" fontFamily="Inter, system-ui, sans-serif">{extUpper}</text>

      {/* Corner flap */}
      <path d="M28.29 30.486C28.319 29.286 29.285 28.319 30.486 28.29L35.285 28.175C35.412 28.172 35.478 28.326 35.388 28.415L28.415 35.388C28.325 35.478 28.172 35.412 28.175 35.285L28.29 30.486Z" fill={`url(#${flapId})`} />
    </svg>
  );
}

function getFileExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1) : "img";
}

export function ThumbnailUpload({ fileName, thumbnailPreview, onCropComplete, onDelete }: ThumbnailUploadProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const [modalInitialFile, setModalInitialFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = useCallback(
    (preview: string, file: File) => {
      setLastFile(file);
      onCropComplete(preview, file);
    },
    [onCropComplete],
  );

  const handleReplace = useCallback(() => { fileRef.current?.click(); }, []);

  const handleFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.size > 5 * 1024 * 1024 || !file.type.match(/^image\/(png|jpeg|webp)$/)) return;
    setLastFile(file);
    setModalInitialFile(file);
    setModalOpen(true);
    e.target.value = "";
  }, []);

  const ext = getFileExtension(fileName);

  return (
    <div className="flex flex-col gap-2">
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileSelected} className="hidden" />

      {thumbnailPreview ? (
        <div className="flex flex-col gap-3">
          {/* Image preview */}
          <div className="relative overflow-hidden rounded-[14px] h-64">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="absolute inset-0 size-full object-cover"
              draggable={false}
            />
            <div className="absolute right-3 top-3 flex items-center gap-2">
              <button type="button" onClick={handleReplace} className="flex size-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-[8px] text-white transition-opacity hover:opacity-80">
                <IconUpload size={16} />
              </button>
              <button type="button" onClick={() => { setModalInitialFile(lastFile); setModalOpen(true); }} className="flex size-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-[8px] text-white transition-opacity hover:opacity-80">
                <IconCrop size={16} />
              </button>
              <button type="button" onClick={onDelete} className="flex size-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-[8px] text-white transition-opacity hover:opacity-80">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3.91702 12.7554L4.58221 12.711L3.91702 12.7554ZM12.083 12.7554L11.4178 12.711L12.083 12.7554ZM2 4.66667H14V3.33333H2V4.66667ZM6 7.33333V10.6667H7.33333V7.33333H6ZM8.66667 7.33333V10.6667H10V7.33333H8.66667ZM3.99852 3.95565L3.25183 12.7997L4.58221 12.711L3.33333 4L3.99852 3.95565ZM5.2474 14.6667H10.7526V13.3333H5.2474V14.6667ZM12.7482 12.7997L12.0015 3.95565L12.6667 4L11.4178 12.711L12.7482 12.7997ZM3.33333 4.66667H12.6667V3.33333H3.33333V4.66667ZM10.7526 14.6667C11.8055 14.6667 12.6781 13.8503 12.7482 12.7997L11.4178 12.711C11.3944 13.0612 11.1036 13.3333 10.7526 13.3333V14.6667ZM3.25183 12.7997C3.32187 13.8503 4.19448 14.6667 5.2474 14.6667V13.3333C4.89643 13.3333 4.60556 13.0612 4.58221 12.711L3.25183 12.7997ZM9.93704 4.16617C9.71499 3.30342 8.93102 2.66667 8.00001 2.66667V1.33333C9.55413 1.33333 10.8583 2.39628 11.2283 3.83383L9.93704 4.16617ZM8.00001 2.66667C7.06901 2.66667 6.28504 3.30342 6.06298 4.16617L4.77173 3.83383C5.14173 2.39628 6.4459 1.33333 8.00001 1.33333V2.66667Z" fill="white"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className="group flex h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed border-foreground/[0.12] bg-foreground/[0.02] transition-colors hover:bg-foreground/[0.04]"
        >
          <IconUpload size={24} className="text-foreground/30" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium tracking-[-0.02em] text-page-text group-hover:underline">Upload or drag & drop</span>
            <span className="text-xs tracking-[-0.02em] text-foreground/40">PNG, JPEG or WebP. Max 5MB</span>
          </div>
        </div>
      )}

      <div className="flex items-start gap-1">
        <span title="Thumbnail guidelines"><IconInfoCircle size={12} className="mt-px shrink-0 text-foreground/40" /></span>
        <span className="text-[10px] tracking-[-0.02em] text-foreground/40">
          Ratio 2:3 — shown on the Discovery page. The subject/face should be positioned in the center.
        </span>
      </div>

      <ThumbnailCropModal
        open={modalOpen}
        onOpenChange={(open) => { if (!open) setModalInitialFile(null); setModalOpen(open); }}
        onSave={handleSave}
        initialFile={modalInitialFile}
      />
    </div>
  );
}
