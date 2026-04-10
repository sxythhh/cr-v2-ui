"use client";
// @ts-nocheck

import { motion } from 'motion/react';
import { Eye, MoreVertical, Download, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Contract } from '@/types/virality-nexus';
import { getLabelColor } from './contract-label-colors';

interface ContractTableProps {
  contracts: Contract[];
  onView: (contract: Contract) => void;
  onDelete: (id: string) => void;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ContractTable({
  contracts,
  onView,
  onDelete,
}: ContractTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (contracts.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
        <p className="text-zinc-500">No contracts found</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-800/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Labels
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Creator
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract, idx) => (
              <motion.tr
                key={contract.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors cursor-pointer"
                onClick={() => onView(contract)}
              >
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-zinc-100">{contract.title}</div>
                  {contract.description && (
                    <div className="text-xs text-zinc-500 truncate max-w-[250px]">
                      {contract.description}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {contract.tags && contract.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {contract.tags.slice(0, 2).map((tag) => {
                        const color = getLabelColor(tag);
                        return (
                          <span
                            key={tag}
                            className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${color.bg} ${color.text}`}
                          >
                            {tag}
                          </span>
                        );
                      })}
                      {contract.tags.length > 2 && (
                        <span className="text-[10px] text-zinc-500">
                          +{contract.tags.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-500">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {contract.creator ? (
                    <span className="text-sm text-zinc-300">{contract.creator.name}</span>
                  ) : (
                    <span className="text-sm text-zinc-500">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-zinc-400">
                  {formatDate(contract.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setOpenMenuId(openMenuId === contract.id ? null : contract.id)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 rounded transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openMenuId === contract.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 w-44 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden">
                          <button
                            onClick={() => { onView(contract); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" /> View Details
                          </button>

                          {contract.file_url && (
                            <a
                              href={contract.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setOpenMenuId(null)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                            >
                              <Download className="w-4 h-4" /> Download PDF
                            </a>
                          )}

                          <button
                            onClick={() => { onDelete(contract.id); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-700 transition-colors border-t border-zinc-700"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
