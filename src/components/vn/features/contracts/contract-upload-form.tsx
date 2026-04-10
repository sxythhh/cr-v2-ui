"use client";
// @ts-nocheck

import { useState, useCallback } from 'react';
import { Upload, FileText, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContractUploadFormProps {
  onUpload: (url: string, filename: string) => void;
  currentUrl?: string;
  className?: string;
}

export function ContractUploadForm({ onUpload, currentUrl, className }: ContractUploadFormProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);

  const handleUpload = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File too large. Maximum size is 50MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/contracts/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadedFilename(file.name);
      onUpload(data.url, data.filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  if (currentUrl || uploadedFilename) {
    return (
      <div className={cn('flex items-center gap-3 p-3 bg-zinc-800 border border-zinc-700 rounded-lg', className)}>
        <FileText className="w-5 h-5 text-orange-400 flex-shrink-0" />
        <span className="text-sm text-zinc-200 truncate flex-1">
          {uploadedFilename || 'Contract PDF'}
        </span>
        <button
          onClick={() => {
            setUploadedFilename(null);
            onUpload('', '');
          }}
          className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer',
          dragOver
            ? 'border-orange-500 bg-orange-500/5'
            : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
        )}
      >
        {uploading ? (
          <>
            <RefreshCw className="w-8 h-8 text-orange-400 animate-spin" />
            <p className="text-sm text-zinc-400">Uploading...</p>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 text-zinc-500" />
            <p className="text-sm text-zinc-400">
              Drag & drop a PDF here, or{' '}
              <span className="text-orange-400 hover:text-orange-300">browse</span>
            </p>
            <p className="text-xs text-zinc-600">PDF only, max 50MB</p>
          </>
        )}
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
      </div>
      {error && (
        <p className="text-sm text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
}
