"use client";

import { useCallback, useRef, useState } from "react";
import { IconCrop, IconInfoCircle, IconTrash, IconUpload } from "@tabler/icons-react";
import Image from "next/image";
import { ThumbnailCropModal } from "./thumbnail-modal/ThumbnailCropModal";

interface ThumbnailUploadProps {
  fileName: string;
  thumbnailPreview: string | null;
  onCropComplete: (preview: string, file: File) => void;
  onDelete?: () => void;
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

  return (
    <div className="flex flex-col gap-2">
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileSelected} className="hidden" />

      {thumbnailPreview ? (
        <div className="relative overflow-hidden rounded-[14px] h-64">
          <Image src={thumbnailPreview} alt="Thumbnail preview" fill className="object-cover" unoptimized />
          <div className="absolute right-3 top-3 flex items-center gap-2">
            <button type="button" onClick={handleReplace} className="flex items-center justify-center size-8 rounded-full bg-black/40 backdrop-blur-[8px] transition-opacity hover:opacity-80">
              <IconUpload size={14} className="text-white" />
            </button>
            <button type="button" onClick={() => { setModalInitialFile(lastFile); setModalOpen(true); }} className="flex items-center justify-center size-8 rounded-full bg-black/40 backdrop-blur-[8px] transition-opacity hover:opacity-80">
              <IconCrop size={14} className="text-white" />
            </button>
            <button type="button" onClick={onDelete} className="flex items-center justify-center size-8 rounded-full bg-black/40 backdrop-blur-[8px] transition-opacity hover:opacity-80">
              <IconTrash size={14} className="text-white" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className="group flex h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed border-[rgba(37,37,37,0.12)] dark:border-[rgba(255,255,255,0.12)] bg-[rgba(37,37,37,0.02)] dark:bg-[rgba(255,255,255,0.02)] transition-colors hover:bg-[rgba(37,37,37,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)]"
        >
          <IconUpload size={24} className="text-[rgba(37,37,37,0.3)] dark:text-[rgba(255,255,255,0.3)]" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium tracking-[-0.02em] text-page-text group-hover:underline">Upload or drag & drop</span>
            <span className="text-xs tracking-[-0.02em] text-[rgba(37,37,37,0.4)] dark:text-[rgba(255,255,255,0.4)]">PNG, JPEG or WebP. Max 5MB</span>
          </div>
        </div>
      )}

      <div className="flex items-start gap-1">
        <IconInfoCircle size={12} className="mt-px shrink-0 text-[rgba(37,37,37,0.4)] dark:text-[rgba(255,255,255,0.4)]" />
        <span className="text-[10px] tracking-[-0.02em] text-[rgba(37,37,37,0.4)] dark:text-[rgba(255,255,255,0.4)]">
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
