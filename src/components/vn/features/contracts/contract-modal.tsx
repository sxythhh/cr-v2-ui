"use client";
// @ts-nocheck

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Plus, RefreshCw } from 'lucide-react';
import { Contract, Creator, ContractFolder, CreateContractInput } from '@/types/virality-nexus';
import { ContractUploadForm } from './contract-upload-form';
import { getLabelColor, SUGGESTED_LABELS } from './contract-label-colors';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: CreateContractInput) => Promise<Contract | null>;
  creators: Creator[];
  folders: ContractFolder[];
  saving: boolean;
  editContract?: Contract | null;
}

export function ContractModal({
  isOpen,
  onClose,
  onSave,
  creators,
  folders,
  saving,
  editContract,
}: ContractModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [folderId, setFolderId] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (editContract) {
      setTitle(editContract.title);
      setDescription(editContract.description || '');
      setCreatorId(editContract.creator_id || '');
      setFolderId(editContract.folder_id || '');
      setFileUrl(editContract.file_url || '');
      setNotes(editContract.notes || '');
      setTags(editContract.tags || []);
      setTagInput('');
    } else {
      setTitle('');
      setDescription('');
      setCreatorId('');
      setFolderId('');
      setFileUrl('');
      setNotes('');
      setTags([]);
      setTagInput('');
    }
  }, [editContract, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    const input: CreateContractInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      creator_id: creatorId || undefined,
      folder_id: folderId || undefined,
      file_url: fileUrl || undefined,
      notes: notes.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    };

    const result = await onSave(input);
    if (result) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-x-4 top-[5vh] bottom-[5vh] sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:w-full sm:max-w-lg sm:max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10 rounded-t-xl">
            <h3 className="text-lg font-semibold text-zinc-100">
              {editContract ? 'Edit Contract' : 'New Contract'}
            </h3>
            <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* PDF Upload */}
            <ContractUploadForm
              onUpload={(url) => setFileUrl(url)}
              currentUrl={fileUrl}
            />

            {/* Divider */}
            <div className="border-t border-zinc-800" />

            {/* Title */}
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Creator Agreement - Q1 2026"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief description of the contract..."
                rows={2}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
              />
            </div>

            {/* Labels */}
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Labels
              </label>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map((tag) => {
                    const color = getLabelColor(tag);
                    return (
                      <span
                        key={tag}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color.bg} ${color.text}`}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => setTags(tags.filter((t) => t !== tag))}
                          className="hover:opacity-70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a label..."
                  className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = tagInput.trim();
                      if (val && !tags.includes(val)) {
                        setTags([...tags, val]);
                        setTagInput('');
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = tagInput.trim();
                    if (val && !tags.includes(val)) {
                      setTags([...tags, val]);
                      setTagInput('');
                    }
                  }}
                  className="p-2 text-zinc-400 hover:text-orange-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_LABELS.filter((s) => !tags.includes(s)).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setTags([...tags, suggestion])}
                    className="px-2 py-0.5 rounded-full text-xs text-zinc-500 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Creator & Folder */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">
                  Creator
                </label>
                <select
                  value={creatorId}
                  onChange={e => setCreatorId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                >
                  <option value="">None</option>
                  {creators.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">
                  Folder
                </label>
                <select
                  value={folderId}
                  onChange={e => setFolderId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                >
                  <option value="">None</option>
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Optional notes..."
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
                {editContract ? 'Save Changes' : 'Create Contract'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}
