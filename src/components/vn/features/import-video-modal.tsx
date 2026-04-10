"use client";
// @ts-nocheck

import { useState } from 'react';
import { motion } from 'motion/react';
import { Link2, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/vn/ui/button';
import { Select } from '@/components/vn/ui/select';
import { Video } from '@/types/virality-nexus';

// Mock creators data (replaced hook)
const mockCreators = [
  { id: '1', name: 'Creator One' },
  { id: '2', name: 'Creator Two' },
  { id: '3', name: 'Creator Three' },
];

interface ImportVideoModalProps {
  creatorId?: string; // If provided, don't show creator selector
  onClose: () => void;
  onSuccess: (videos: Video[]) => void;
}

export function ImportVideoModal({ creatorId, onClose, onSuccess }: ImportVideoModalProps) {
  const creators = mockCreators;
  const loadingCreators = false;
  const [urlsText, setUrlsText] = useState('');
  const [selectedCreatorId, setSelectedCreatorId] = useState(creatorId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  const showCreatorSelector = !creatorId;

  const creatorOptions = creators.map(creator => ({
    value: creator.id,
    label: creator.name,
  }));

  const urlCount = urlsText
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const targetCreatorId = creatorId || selectedCreatorId;

    if (!targetCreatorId) {
      setError('Please select a creator');
      return;
    }

    const urls = urlsText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urls.length === 0) {
      setError('Please enter at least one video URL');
      return;
    }

    // Validate URL format
    const invalidUrls = urls.filter(url => {
      try {
        new URL(url);
        return false;
      } catch {
        return true;
      }
    });

    if (invalidUrls.length > 0) {
      setError(`Invalid URL format: ${invalidUrls[0]}`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls, creatorId: targetCreatorId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0] || 'Failed to import videos');
      }

      if (data.videos.length === 0 && data.errors?.length > 0) {
        throw new Error(data.errors[0]);
      }

      setImportedCount(data.videos.length);
      setSuccess(true);
      onSuccess(data.videos);

      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import videos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={loading ? undefined : onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full mx-4 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-orange-500/10">
              <Link2 className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-100">Import Videos</h3>
              <p className="text-sm text-zinc-400">Paste Instagram or TikTok URLs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Creator Selector (if not provided) */}
          {showCreatorSelector && (
            <Select
              label="Creator"
              placeholder="Select a creator..."
              options={creatorOptions}
              value={selectedCreatorId}
              onChange={(e) => setSelectedCreatorId(e.target.value)}
              disabled={loadingCreators || loading}
            />
          )}

          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Video URLs
            </label>
            <textarea
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 min-h-[140px] resize-none font-mono text-sm"
              placeholder={`Paste video URLs here (one per line):\n\nhttps://www.instagram.com/reel/ABC123...\nhttps://www.tiktok.com/@user/video/123456...`}
              value={urlsText}
              onChange={(e) => setUrlsText(e.target.value)}
              disabled={loading}
            />
            <div className="flex justify-between mt-2">
              <p className="text-xs text-zinc-500">
                Supports Instagram Reels and TikTok videos
              </p>
              <p className="text-xs text-zinc-400">
                {urlCount} URL{urlCount !== 1 ? 's' : ''} entered
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
              <div>
                <p className="text-sm font-medium text-zinc-100">
                  Scraping videos...
                </p>
                <p className="text-xs text-zinc-500">
                  This may take 10-30 seconds
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-start gap-3 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-300">
                Successfully imported {importedCount} video{importedCount !== 1 ? 's' : ''}!
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || urlCount === 0 || (showCreatorSelector && !selectedCreatorId)}
              className="flex-1"
            >
              {loading ? 'Importing...' : `Import ${urlCount > 0 ? urlCount : ''} Video${urlCount !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
