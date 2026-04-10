"use client";
// @ts-nocheck

import { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, MoreVertical, Eye, Download, Trash2 } from 'lucide-react';
import { Contract } from '@/types/virality-nexus';
import { getLabelColor } from './contract-label-colors';

interface ContractCardProps {
  contract: Contract;
  index: number;
  onClick: (contract: Contract) => void;
  onDelete: (id: string) => void;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ContractCard({ contract, index, onClick, onDelete }: ContractCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      onClick={() => onClick(contract)}
      className="group relative rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80 cursor-pointer"
    >
      <div className="p-4 space-y-3">
        {/* Top row: icon + menu */}
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-orange-400" />
          </div>

          {/* 3-dot menu */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors lg:opacity-0 lg:group-hover:opacity-100"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-44 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden">
                  <button
                    onClick={() => { onClick(contract); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" /> View Details
                  </button>

                  {contract.file_url && (
                    <a
                      href={contract.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                    >
                      <Download className="w-4 h-4" /> Download PDF
                    </a>
                  )}

                  <button
                    onClick={() => { onDelete(contract.id); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-700 transition-colors border-t border-zinc-700"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-zinc-100 truncate">{contract.title}</h3>

        {/* Description */}
        {contract.description && (
          <p className="text-xs text-zinc-500 line-clamp-2">{contract.description}</p>
        )}

        {/* Labels */}
        {contract.tags && contract.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {contract.tags.map((tag) => {
              const color = getLabelColor(tag);
              return (
                <span
                  key={tag}
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${color.bg} ${color.text} border-current/10`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-zinc-800" />

        {/* Footer: creator + date */}
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span className="truncate">
            {contract.creator?.name || 'No creator'}
          </span>
          <span className="flex-shrink-0">
            {formatDate(contract.created_at)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
