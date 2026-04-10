"use client";
// @ts-nocheck

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Download,
  Calendar,
  MessageSquare,
  FileText,
  Folder,
  User,
  RefreshCw,
  Trash2,
  Pencil,
} from 'lucide-react';
import { Contract } from '@/types/virality-nexus';
import { getLabelColor } from './contract-label-colors';

interface ContractDetailModalProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (contract: Contract) => void;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ContractDetailModal({
  contract,
  isOpen,
  onClose,
  onDelete,
  onEdit,
}: ContractDetailModalProps) {
  const [fullContract, setFullContract] = useState<Contract | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    if (contract && isOpen) {
      // Use the passed contract directly (mock - no API call)
      setFullContract(contract);
      setLoadingDetail(false);
    } else {
      setFullContract(null);
    }
  }, [contract, isOpen]);

  if (!isOpen || !contract) return null;

  const c = fullContract || contract;

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
        className="fixed inset-x-4 top-[5vh] bottom-[5vh] sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:w-full sm:max-w-2xl sm:max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between p-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10 rounded-t-xl">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-orange-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-zinc-100 truncate">{c.title}</h3>
                {c.creator && (
                  <span className="text-sm text-zinc-400">{c.creator.name}</span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors flex-shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>

          {loadingDetail ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 text-orange-400 animate-spin" />
            </div>
          ) : (
            <>
              <div className="p-4 space-y-4">
                {/* Description */}
                {c.description && (
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Description</p>
                    <p className="text-sm text-zinc-300">{c.description}</p>
                  </div>
                )}

                {/* Labels */}
                {c.tags && c.tags.length > 0 && (
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Labels</p>
                    <div className="flex flex-wrap gap-1.5">
                      {c.tags.map((tag) => {
                        const color = getLabelColor(tag);
                        return (
                          <span
                            key={tag}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color.bg} ${color.text}`}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {c.creator && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-zinc-500" />
                      <div>
                        <p className="text-xs text-zinc-500">Creator</p>
                        <p className="text-sm text-zinc-300">{c.creator.name}</p>
                      </div>
                    </div>
                  )}
                  {c.folder && (
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4 text-zinc-500" />
                      <div>
                        <p className="text-xs text-zinc-500">Folder</p>
                        <p className="text-sm text-zinc-300">{c.folder.name}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    <div>
                      <p className="text-xs text-zinc-500">Added</p>
                      <p className="text-sm text-zinc-300">{formatDate(c.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {c.notes && (
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-zinc-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-zinc-500">Notes</p>
                      <p className="text-sm text-zinc-300">{c.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex flex-wrap items-center justify-between p-4 border-t border-zinc-800 bg-zinc-800/30 gap-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { onEdit(c); onClose(); }}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  {c.file_url && (
                    <a
                      href={c.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 text-sm text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  )}
                </div>
                <button
                  onClick={() => { onDelete(c.id); onClose(); }}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
