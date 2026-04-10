"use client";
// @ts-nocheck

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScheduledPost, ScheduledPostMediaItem } from '@/types/virality-nexus';
import { Clock, Image as ImageIcon, Video, FileText, Copy, Check, Send, X, Download, Link2, Play } from 'lucide-react';

// Twitter/X icon
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Instagram icon
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const statusStyles = {
  draft: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  scheduled: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  published: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  archived: 'bg-zinc-700/20 text-zinc-500 border-zinc-700/30',
};

const platformStyles = {
  twitter: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  instagram: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
};

const contentTypeIcons = {
  tweet: FileText,
  post: ImageIcon,
  reel: Video,
  story: Clock,
};

interface CalendarPostCardProps {
  post: ScheduledPost;
  onEdit?: () => void;
  compact?: boolean;
}

export function CalendarPostCard({ post, onEdit, compact = false }: CalendarPostCardProps) {
  const [copiedField, setCopiedField] = useState<'title' | 'content' | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<ScheduledPostMediaItem | null>(null);

  const PlatformIcon = post.platform === 'twitter' ? TwitterIcon : InstagramIcon;
  const ContentTypeIcon = contentTypeIcons[post.content_type] || FileText;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleCopy = async (text: string, field: 'title' | 'content', e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.platform === 'twitter') {
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.content)}`;
      window.open(tweetUrl, '_blank');
    } else {
      window.open('https://www.instagram.com/contentrewardss/', '_blank');
    }
  };

  const handleDownload = async (item: ScheduledPostMediaItem) => {
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.filename || `media.${item.type || 'file'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      window.open(item.url, '_blank');
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleCardClick = () => {
    setShowPreview(true);
  };

  // Get all media items (links + uploaded files)
  const allMediaItems = post.media_items || (post.media_url ? [{ url: post.media_url, type: post.media_type || 'image' as const }] : []);
  const uploadedFiles = allMediaItems.filter(item => item.filename || item.url?.includes('supabase.co/storage'));
  const mediaLinks = allMediaItems.filter(item => !item.filename && !item.url?.includes('supabase.co/storage'));

  if (compact) {
    return (
      <button
        onClick={handleCardClick}
        className={`w-full text-left px-2 py-1 rounded text-xs truncate border ${platformStyles[post.platform]} hover:opacity-80 transition-opacity`}
      >
        <span className="flex items-center gap-1">
          <PlatformIcon className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{post.title}</span>
        </span>
      </button>
    );
  }

  return (
    <>
      {/* Card */}
      <div
        onClick={handleCardClick}
        className="w-full text-left p-3 rounded-lg border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-600 transition-all group cursor-pointer"
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${platformStyles[post.platform]}`}>
              <PlatformIcon className="w-3.5 h-3.5" />
            </div>
            <span className={`text-xs px-2 py-0.5 rounded border ${statusStyles[post.status]}`}>
              {post.status}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <Clock className="w-3 h-3" />
            {formatTime(post.scheduled_at)}
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm font-medium text-zinc-100 group-hover:text-orange-300 transition-colors line-clamp-1 mb-1">
          {post.title}
        </h4>

        {/* Description preview */}
        <p className="text-xs text-zinc-400 line-clamp-2 mb-2">
          {post.content || 'No description'}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-700/50">
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <ContentTypeIcon className="w-3 h-3" />
            <span className="capitalize">{post.content_type}</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Post to platform button */}
            <button
              onClick={handleExternalLink}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 transition-colors"
              title={post.platform === 'twitter' ? 'Open Twitter to post' : 'Open Instagram'}
            >
              <Send className="w-4 h-4" />
              <span className="text-xs font-medium">Post</span>
            </button>

            {/* Edit button */}
            <button
              onClick={handleEditClick}
              className="px-2.5 py-1.5 rounded-lg text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Preview Popup */}
      <AnimatePresence>
        {showPreview && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50"
              onClick={() => setShowPreview(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 max-h-[85vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${platformStyles[post.platform]}`}>
                    <PlatformIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100">{post.title}</h3>
                    <p className="text-xs text-zinc-500">{formatTime(post.scheduled_at)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Description/Content */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider">Description</label>
                    <button
                      onClick={(e) => handleCopy(post.content, 'content', e)}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors text-xs"
                    >
                      {copiedField === 'content' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-3 bg-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-200 whitespace-pre-wrap">{post.content || 'No description'}</p>
                  </div>
                </div>

                {/* Media Links */}
                {mediaLinks.length > 0 && (
                  <div>
                    <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Media Links</label>
                    <div className="space-y-2">
                      {mediaLinks.map((item, index) => (
                        <a
                          key={index}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-zinc-800 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-zinc-700 transition-colors text-sm truncate"
                        >
                          <Link2 className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{item.url}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div>
                    <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Uploaded Media</label>
                    <div className="grid grid-cols-2 gap-3">
                      {uploadedFiles.map((item, index) => (
                        <div key={index} className="relative group">
                          <div
                            onClick={() => setPreviewMedia(item)}
                            className="aspect-video bg-zinc-800 rounded-lg overflow-hidden cursor-pointer"
                          >
                            {item.type === 'video' ? (
                              <div className="w-full h-full flex items-center justify-center relative">
                                <video src={item.url} className="w-full h-full object-cover" muted />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                  <Play className="w-8 h-8 text-white" />
                                </div>
                              </div>
                            ) : (
                              <img src={item.url} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <button
                            onClick={() => handleDownload(item)}
                            className="absolute bottom-2 right-2 p-1.5 rounded-md bg-black/70 text-white hover:bg-black/90 transition-colors opacity-0 group-hover:opacity-100"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {post.notes && (
                  <div>
                    <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Notes</label>
                    <div className="p-3 bg-zinc-800 rounded-lg">
                      <p className="text-sm text-zinc-400">{post.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 p-4 border-t border-zinc-800">
                <button
                  onClick={handleExternalLink}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Post to {post.platform === 'twitter' ? 'Twitter' : 'Instagram'}
                </button>
                <button
                  onClick={(e) => {
                    setShowPreview(false);
                    handleEditClick(e);
                  }}
                  className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  Edit Post
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Full Media Preview */}
      <AnimatePresence>
        {previewMedia && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-[60]"
              onClick={() => setPreviewMedia(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-8 z-[60] flex items-center justify-center"
            >
              <button
                onClick={() => setPreviewMedia(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              {previewMedia.type === 'video' ? (
                <video
                  src={previewMedia.url}
                  className="max-w-full max-h-full rounded-lg"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={previewMedia.url}
                  alt="Preview"
                  className="max-w-full max-h-full rounded-lg object-contain"
                />
              )}
              <button
                onClick={() => handleDownload(previewMedia)}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
