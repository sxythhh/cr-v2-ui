"use client";

import { useCallback, useRef } from "react";
import { IconUpload } from "@tabler/icons-react";

interface ThumbnailUploadStateProps {
  onFileSelect: (file: File) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function ThumbnailUploadState({ onFileSelect }: ThumbnailUploadStateProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (file.size > MAX_FILE_SIZE) return;
      if (!file.type.match(/^image\/(png|jpeg|webp)$/)) return;
      onFileSelect(file);
    },
    [onFileSelect],
  );

  return (
    <div
      className="group flex h-full w-full cursor-pointer items-center justify-center"
      onClick={() => fileRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleFile(e.dataTransfer.files?.[0]); }}
    >
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ""; }} className="hidden" />
      <div className="flex flex-col items-center gap-3">
        <IconUpload size={24} className="text-[rgba(37,37,37,0.3)] dark:text-[rgba(255,255,255,0.3)]" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-medium tracking-[-0.02em] text-page-text group-hover:underline">Upload or drag & drop</span>
          <span className="text-xs tracking-[-0.02em] text-[rgba(37,37,37,0.4)] dark:text-[rgba(255,255,255,0.4)]">PNG, JPEG or WebP. Max 5MB</span>
        </div>
      </div>
    </div>
  );
}
