"use client";
// @ts-nocheck

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Image as ImageIcon, Video, FileText, AlertCircle, AlertTriangle, Trash2, Upload, Download, Loader2, Link2, Plus, Play, Pencil } from 'lucide-react';
import {
  ScheduledPost,
  CreateScheduledPostInput,
  UpdateScheduledPostInput,
  ScheduledPostPlatform,
  ScheduledPostContentType,
  ScheduledPostStatus,
  ScheduledPostMediaItem,
  CRSocialAccount,
} from '@/types/virality-nexus';

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

const CHARACTER_LIMITS = {
  twitter: 280,
  instagram: 2200,
};

const contentTypesByPlatform: Record<ScheduledPostPlatform, ScheduledPostContentType[]> = {
  twitter: ['tweet'],
  instagram: ['post', 'reel', 'story'],
};

// Detect media type from URL
function detectMediaType(url: string): 'image' | 'video' | 'gif' | 'link' {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('.gif') || lowerUrl.includes('giphy') || lowerUrl.includes('tenor')) {
    return 'gif';
  } else if (lowerUrl.includes('.mp4') || lowerUrl.includes('.mov') || lowerUrl.includes('.webm') || lowerUrl.includes('video') || lowerUrl.includes('youtube') || lowerUrl.includes('vimeo')) {
    return 'video';
  } else if (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg') || lowerUrl.includes('.png') || lowerUrl.includes('.webp') || lowerUrl.includes('image')) {
    return 'image';
  }
  return 'link';
}

// Get icon for media type
function MediaTypeIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case 'video':
      return <Video className={className} />;
    case 'gif':
      return <Play className={className} />;
    case 'image':
      return <ImageIcon className={className} />;
    default:
      return <Link2 className={className} />;
  }
}

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateScheduledPostInput | UpdateScheduledPostInput) => Promise<void>;
  onDelete?: () => Promise<void>;
  post?: ScheduledPost | null;
  accounts?: CRSocialAccount[];
  initialDate?: Date;
  saving?: boolean;
  deleting?: boolean;
}

export function PostFormModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  post,
  accounts = [],
  initialDate,
  saving = false,
  deleting = false,
}: PostFormModalProps) {
  const isEditing = !!post;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState<ScheduledPostPlatform>('twitter');
  const [accountId, setAccountId] = useState<string>('');
  const [contentType, setContentType] = useState<ScheduledPostContentType>('tweet');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [status, setStatus] = useState<ScheduledPostStatus>('draft');
  const [mediaLinks, setMediaLinks] = useState<ScheduledPostMediaItem[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<ScheduledPostMediaItem[]>([]);
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [newlyUploadedFiles, setNewlyUploadedFiles] = useState<string[]>([]);

  // Preview popup state
  const [previewMedia, setPreviewMedia] = useState<ScheduledPostMediaItem | null>(null);

  // Editing notes state
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);

  // Shake effect state
  const [isShaking, setIsShaking] = useState(false);

  // Delete file confirmation state
  const [fileToDelete, setFileToDelete] = useState<{ index: number; file: ScheduledPostMediaItem } | null>(null);

  // Reset form when modal opens/closes or post changes
  useEffect(() => {
    if (isOpen) {
      if (post) {
        setTitle(post.title);
        setDescription(post.description || '');
        setContent(post.content);
        setPlatform(post.platform);
        setAccountId(post.account_id || '');
        setContentType(post.content_type);
        const scheduled = new Date(post.scheduled_at);
        setScheduledDate(scheduled.toISOString().split('T')[0]);
        setScheduledTime(scheduled.toTimeString().slice(0, 5));
        setStatus(post.status);
        if (post.media_items && post.media_items.length > 0) {
          const links = post.media_items.filter(item => !item.filename);
          const files = post.media_items.filter(item => item.filename);
          setMediaLinks(links);
          setUploadedFiles(files);
        } else if (post.media_url) {
          if (post.media_url.includes('supabase.co/storage')) {
            setUploadedFiles([{ url: post.media_url, type: post.media_type || 'image' }]);
            setMediaLinks([]);
          } else {
            setMediaLinks([{ url: post.media_url, type: post.media_type || 'image' }]);
            setUploadedFiles([]);
          }
        } else {
          setMediaLinks([]);
          setUploadedFiles([]);
        }
        setNotes(post.notes || '');
        setTags(post.tags?.join(', ') || '');
      } else {
        setTitle('');
        setDescription('');
        setContent('');
        setPlatform('twitter');
        setAccountId('');
        setContentType('tweet');
        const today = new Date();
        const defaultDate = initialDate || today;
        const year = defaultDate.getFullYear();
        const month = String(defaultDate.getMonth() + 1).padStart(2, '0');
        const day = String(defaultDate.getDate()).padStart(2, '0');
        setScheduledDate(`${year}-${month}-${day}`);
        setScheduledTime('12:00');
        setStatus('draft');
        setMediaLinks([]);
        setUploadedFiles([]);
        setNotes('');
        setTags('');
      }
      setNewMediaUrl('');
      setShowDeleteConfirm(false);
      setUploadError(null);
      setPreviewMedia(null);
      setEditingNoteIndex(null);
      setDeletingFile(null);
      setNewlyUploadedFiles([]);
      setIsShaking(false);
    }
  }, [isOpen, post, initialDate]);

  useEffect(() => {
    const validTypes = contentTypesByPlatform[platform];
    if (!validTypes.includes(contentType)) {
      setContentType(validTypes[0]);
    }
  }, [platform, contentType]);

  useEffect(() => {
    const platformAccounts = accounts.filter((a) => a.platform === platform);
    if (platformAccounts.length === 1) {
      setAccountId(platformAccounts[0].id);
    } else if (!accountId || !platformAccounts.find((a) => a.id === accountId)) {
      setAccountId('');
    }
  }, [platform, accounts, accountId]);

  const handleAddMediaUrl = () => {
    if (newMediaUrl.trim()) {
      const type = detectMediaType(newMediaUrl);
      setMediaLinks([...mediaLinks, { url: newMediaUrl.trim(), type }]);
      setNewMediaUrl('');
    }
  };

  const handleRemoveLink = (index: number) => {
    setMediaLinks(mediaLinks.filter((_, i) => i !== index));
  };

  const handleDeleteUploadedFileClick = (index: number) => {
    const file = uploadedFiles[index];
    setFileToDelete({ index, file });
  };

  const handleConfirmDeleteFile = async () => {
    if (!fileToDelete) return;

    const { index, file } = fileToDelete;
    const newUploadedFiles = uploadedFiles.filter((_, i) => i !== index);

    setDeletingFile(file.filename || 'file');
    setFileToDelete(null);

    try {
      if (file.filename) {
        await fetch(`/api/content-calendar/upload?filename=${encodeURIComponent(file.filename)}`, {
          method: 'DELETE',
        });
      }
      setUploadedFiles(newUploadedFiles);
    } catch (err) {
      console.error('Failed to delete file:', err);
      setUploadError('Failed to delete file');
    } finally {
      setDeletingFile(null);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/content-calendar/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload file');
      }

      const data = await response.json();
      setUploadedFiles([...uploadedFiles, {
        url: data.url,
        type: data.mediaType,
        filename: data.filename
      }]);
      setNewlyUploadedFiles(prev => [...prev, data.filename]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
    }
  }, [uploadedFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    const parsedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const allMediaItems = [...mediaLinks, ...uploadedFiles];

    const data: CreateScheduledPostInput | UpdateScheduledPostInput = {
      ...(isEditing && { id: post!.id }),
      title,
      description: description || undefined,
      content,
      platform,
      account_id: accountId || undefined,
      content_type: contentType,
      scheduled_at: scheduledAt,
      status,
      media_url: allMediaItems[0]?.url || undefined,
      media_type: allMediaItems[0]?.type === 'link' ? 'image' : allMediaItems[0]?.type || undefined,
      media_items: allMediaItems,
      notes: notes || undefined,
      tags: parsedTags.length > 0 ? parsedTags : undefined,
    };

    await onSave(data);
    setNewlyUploadedFiles([]);
  };

  const handleDelete = async () => {
    if (onDelete) {
      for (const file of uploadedFiles) {
        if (file.filename) {
          try {
            await fetch(`/api/content-calendar/upload?filename=${encodeURIComponent(file.filename)}`, {
              method: 'DELETE',
            });
          } catch (err) {
            console.error('Failed to delete file:', file.filename);
          }
        }
      }
      await onDelete();
    }
  };

  const handleCancel = async () => {
    for (const filename of newlyUploadedFiles) {
      try {
        await fetch(`/api/content-calendar/upload?filename=${encodeURIComponent(filename)}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Failed to cleanup file:', filename);
      }
    }
    setNewlyUploadedFiles([]);
    onClose();
  };

  const handleBackdropClick = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const characterLimit = CHARACTER_LIMITS[platform];
  const characterCount = content.length;
  const isOverLimit = characterCount > characterLimit;

  const filteredAccounts = accounts.filter((a) => a.platform === platform);

  const getFilename = (url: string): string => {
    try {
      const pathname = new URL(url).pathname;
      return pathname.split('/').pop() || url.slice(0, 30) + '...';
    } catch {
      return url.slice(0, 30) + '...';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: isShaking ? [0, -10, 10, -10, 10, 0] : 0
            }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              x: { duration: 0.4, ease: "easeInOut" }
            }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-auto md:w-full md:max-w-2xl max-h-[90vh] overflow-hidden rounded-xl"
          >
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
                <h2 className="text-lg font-semibold text-zinc-100">
                  {isEditing ? 'Edit Scheduled Post' : 'Create Scheduled Post'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="p-1 text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-xs text-zinc-500 mb-1 uppercase tracking-wider">
                    Status
                  </label>
                  <div className="flex gap-2">
                    {(['draft', 'scheduled', 'published', 'archived'] as ScheduledPostStatus[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s)}
                        className={`px-3 py-1.5 rounded-lg border text-sm transition-colors capitalize ${
                          status === s
                            ? s === 'draft'
                              ? 'bg-zinc-500/20 border-zinc-500 text-zinc-300'
                              : s === 'scheduled'
                              ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                              : s === 'published'
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                              : 'bg-zinc-700/20 border-zinc-600 text-zinc-500'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs text-zinc-500 mb-1 uppercase tracking-wider">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Post title for internal reference"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                  />
                </div>

                {/* Platform & Content Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1 uppercase tracking-wider">
                      Platform
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPlatform('twitter')}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                          platform === 'twitter'
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        <TwitterIcon className="w-4 h-4" />
                        Twitter
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlatform('instagram')}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                          platform === 'instagram'
                            ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        <InstagramIcon className="w-4 h-4" />
                        Instagram
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-500 mb-1 uppercase tracking-wider">
                      Content Type
                    </label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value as ScheduledPostContentType)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                    >
                      {contentTypesByPlatform[platform].map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Account Selection */}
                {filteredAccounts.length > 0 && (
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1 uppercase tracking-wider">
                      Account
                    </label>
                    <select
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                    >
                      <option value="">Select account...</option>
                      {filteredAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          @{account.username} {account.display_name ? `(${account.display_name})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider">
                      Description
                    </label>
                    <span
                      className={`text-xs ${
                        isOverLimit ? 'text-red-400' : characterCount > characterLimit * 0.9 ? 'text-orange-400' : 'text-zinc-500'
                      }`}
                    >
                      {characterCount}/{characterLimit}
                    </span>
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={4}
                    placeholder="Daniel Bitton Is Watching"
                    className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none ${
                      isOverLimit ? 'border-red-500' : 'border-zinc-700 focus:border-orange-500'
                    }`}
                  />
                  {isOverLimit && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Content exceeds character limit
                    </p>
                  )}
                </div>

                {/* Media Links Section */}
                <div>
                  <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-wider">
                    Media Links
                  </label>

                  {mediaLinks.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {mediaLinks.map((item, index) => (
                        <div
                          key={index}
                          className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 text-sm text-blue-400 hover:text-blue-300 hover:underline truncate"
                              title={item.url}
                            >
                              {item.url}
                            </a>

                            <button
                              type="button"
                              onClick={() => setEditingNoteIndex(editingNoteIndex === index ? null : index)}
                              className={`p-1.5 rounded transition-colors ${
                                editingNoteIndex === index
                                  ? 'bg-orange-500/20 text-orange-400'
                                  : 'hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300'
                              }`}
                              title="Add/Edit notes"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveLink(index)}
                              className="p-1.5 rounded hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
                              title="Remove"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {editingNoteIndex === index && (
                            <div className="mt-2 pt-2 border-t border-zinc-700">
                              <input
                                type="text"
                                value={item.notes || ''}
                                onChange={(e) => {
                                  const updated = [...mediaLinks];
                                  updated[index] = { ...updated[index], notes: e.target.value };
                                  setMediaLinks(updated);
                                }}
                                placeholder="Add notes about this link..."
                                className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-600 rounded text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                                autoFocus
                              />
                            </div>
                          )}

                          {item.notes && editingNoteIndex !== index && (
                            <div className="mt-2 pt-2 border-t border-zinc-700">
                              <p className="text-xs text-zinc-400">{item.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="url"
                        value={newMediaUrl}
                        onChange={(e) => setNewMediaUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddMediaUrl();
                          }
                        }}
                        placeholder="Paste media URL and press Enter or click +"
                        className="w-full pl-10 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddMediaUrl}
                      disabled={!newMediaUrl.trim()}
                      className="px-3 py-2 rounded-lg bg-orange-500/20 border border-orange-500/50 text-orange-400 hover:bg-orange-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Add media link"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Uploaded Files Section */}
                <div>
                  <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-wider">
                    Uploaded Files
                  </label>

                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`relative rounded-lg border-2 border-dashed transition-colors ${
                      isDragging
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploading}
                    />
                    <div className="flex flex-col items-center justify-center py-5 px-4">
                      {uploading ? (
                        <>
                          <Loader2 className="w-6 h-6 text-orange-400 animate-spin mb-2" />
                          <p className="text-sm text-zinc-400">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-zinc-500 mb-2" />
                          <p className="text-sm text-zinc-300 font-medium">
                            Drag & drop or click to upload
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            JPG, PNG, GIF, MP4, MOV - Max 8GB
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {uploadError && (
                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {uploadError}
                    </p>
                  )}

                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="relative group rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700 aspect-square"
                        >
                          {file.type === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                              <video
                                src={file.url}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                                onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                                onMouseOut={(e) => {
                                  const video = e.target as HTMLVideoElement;
                                  video.pause();
                                  video.currentTime = 0;
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                                  <Play className="w-5 h-5 text-white" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={file.url}
                              alt={file.filename || 'Uploaded file'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23333" width="100" height="100"/><text fill="%23666" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="12">Error</text></svg>';
                              }}
                            />
                          )}

                          <button
                            type="button"
                            onClick={() => setPreviewMedia(file)}
                            className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center"
                          >
                            <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteUploadedFileClick(index)}
                            disabled={!!deletingFile}
                            className="absolute top-1 right-1 p-1.5 rounded-md bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                            title="Delete file"
                          >
                            {deletingFile === (file.filename || 'file') ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white uppercase">
                            {file.type}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Schedule Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1 uppercase tracking-wider">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1 uppercase tracking-wider">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Time
                    </label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs text-zinc-500 mb-1 uppercase tracking-wider">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Any additional notes..."
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                  {isEditing && onDelete ? (
                    <div>
                      {showDeleteConfirm ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-red-400">Delete this post?</span>
                          <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            {deleting ? 'Deleting...' : 'Yes, Delete'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-3 py-1.5 bg-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(true)}
                          className="flex items-center gap-2 px-3 py-1.5 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  ) : (
                    <div />
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving || isOverLimit}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Media Preview Popup */}
          <AnimatePresence>
            {previewMedia && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 z-[60]"
                  onClick={() => setPreviewMedia(null)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed inset-8 md:inset-16 z-[60] flex items-center justify-center"
                >
                  <div className="relative max-w-full max-h-full">
                    <button
                      onClick={() => setPreviewMedia(null)}
                      className="absolute -top-10 right-0 p-2 text-white/70 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    {previewMedia.type === 'video' ? (
                      <video
                        src={previewMedia.url}
                        className="max-w-full max-h-[80vh] rounded-lg"
                        controls
                        autoPlay
                      />
                    ) : (
                      <img
                        src={previewMedia.url}
                        alt="Preview"
                        className="max-w-full max-h-[80vh] rounded-lg object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%23333" width="400" height="300"/><text fill="%23666" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="16">Unable to preview this URL</text></svg>';
                        }}
                      />
                    )}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4">
                      <button
                        onClick={() => handleDownload(previewMedia)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <a
                        href={previewMedia.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors text-sm"
                      >
                        <Link2 className="w-4 h-4" />
                        Open Original
                      </a>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Delete File Confirmation Popup */}
          <AnimatePresence>
            {fileToDelete && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 z-[70]"
                  onClick={() => setFileToDelete(null)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-[70] p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-red-500/10">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-100">Delete File</h3>
                      <p className="text-sm text-zinc-400">This action cannot be undone</p>
                    </div>
                  </div>

                  {fileToDelete.file.url && (
                    <div className="mb-4 p-3 bg-zinc-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        {fileToDelete.file.type === 'video' ? (
                          <div className="w-16 h-16 bg-zinc-700 rounded flex items-center justify-center">
                            <Video className="w-6 h-6 text-zinc-400" />
                          </div>
                        ) : (
                          <img
                            src={fileToDelete.file.url}
                            alt=""
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-zinc-300 truncate">
                            {fileToDelete.file.filename || 'Media file'}
                          </p>
                          <p className="text-xs text-zinc-500 uppercase">{fileToDelete.file.type}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-zinc-300 mb-6">
                    Are you sure you want to delete this file? It will be permanently removed from storage.
                  </p>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFileToDelete(null)}
                      className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDeleteFile}
                      disabled={!!deletingFile}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {deletingFile ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
