"use client";
// @ts-nocheck

import { useState } from 'react';
import {
  FolderOpen,
  Folder,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  X,
  Tag,
} from 'lucide-react';
import { ContractFolder, CreateContractFolderInput } from '@/types/virality-nexus';
import { cn } from '@/lib/utils';
import { getLabelColor } from './contract-label-colors';

interface ContractFolderSidebarProps {
  folders: ContractFolder[];
  selectedFolderId: string | undefined;
  onSelectFolder: (folderId: string | undefined) => void;
  onCreateFolder: (input: CreateContractFolderInput) => Promise<ContractFolder | null>;
  onDeleteFolder: (id: string) => Promise<boolean>;
  contractCounts: Record<string, number>;
  labels: Record<string, number>;
  selectedLabel: string | null;
  onSelectLabel: (label: string | null) => void;
}

const FOLDER_COLORS = [
  { value: 'zinc', label: 'Gray', dot: 'bg-zinc-400' },
  { value: 'orange', label: 'Orange', dot: 'bg-orange-400' },
  { value: 'emerald', label: 'Green', dot: 'bg-emerald-400' },
  { value: 'blue', label: 'Blue', dot: 'bg-blue-400' },
  { value: 'purple', label: 'Purple', dot: 'bg-purple-400' },
  { value: 'red', label: 'Red', dot: 'bg-red-400' },
  { value: 'yellow', label: 'Yellow', dot: 'bg-yellow-400' },
];

function getColorDot(color: string | null) {
  const found = FOLDER_COLORS.find(c => c.value === color);
  return found?.dot || 'bg-zinc-400';
}

export function ContractFolderSidebar({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
  contractCounts,
  labels,
  selectedLabel,
  onSelectLabel,
}: ContractFolderSidebarProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('zinc');
  const [isFoldersOpen, setIsFoldersOpen] = useState(true);
  const [isLabelsOpen, setIsLabelsOpen] = useState(true);
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const result = await onCreateFolder({
      name: newName.trim(),
      color: newColor,
    });
    if (result) {
      setNewName('');
      setNewColor('zinc');
      setShowCreateForm(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this folder? Contracts inside will be unassigned.')) {
      await onDeleteFolder(id);
      if (selectedFolderId === id) {
        onSelectFolder(undefined);
      }
    }
  };

  const handleAddLabel = () => {
    if (newLabelName.trim()) {
      onSelectLabel(newLabelName.trim());
      setNewLabelName('');
      setShowLabelInput(false);
    }
  };

  const totalCount = Object.values(contractCounts).reduce((a, b) => a + b, 0);
  const labelEntries = Object.entries(labels).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-3">
      {/* Folders Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <button
          onClick={() => setIsFoldersOpen(!isFoldersOpen)}
          className="w-full flex items-center justify-between p-3 hover:bg-zinc-800/50 transition-colors"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">Folders</span>
          {isFoldersOpen ? (
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          )}
        </button>

        {isFoldersOpen && (
          <div className="px-2 pb-2">
            {/* All contracts */}
            <button
              onClick={() => onSelectFolder(undefined)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                !selectedFolderId
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
              )}
            >
              <FolderOpen className="w-4 h-4" />
              <span className="flex-1 text-left">All Contracts</span>
              <span className="text-xs text-zinc-500">{totalCount}</span>
            </button>

            {/* Folder list */}
            {folders.map(folder => (
              <div key={folder.id} className="flex items-center gap-0.5">
                <button
                  onClick={() => onSelectFolder(folder.id)}
                  className={cn(
                    'flex-1 min-w-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                    selectedFolderId === folder.id
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
                  )}
                >
                  <span className={cn('w-2 h-2 rounded-full flex-shrink-0', getColorDot(folder.color))} />
                  <Folder className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left truncate">{folder.name}</span>
                  <span className="text-xs text-zinc-500 flex-shrink-0">
                    {contractCounts[folder.id] || 0}
                  </span>
                </button>
                <button
                  onClick={(e) => handleDelete(folder.id, e)}
                  className="p-1.5 rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/20 transition-colors flex-shrink-0"
                  title="Delete folder"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Create folder form */}
            {showCreateForm ? (
              <div className="mt-2 p-2 bg-zinc-800 rounded-lg space-y-2">
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Folder name"
                  className="w-full px-2 py-1.5 bg-zinc-700 border border-zinc-600 rounded text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleCreate();
                    if (e.key === 'Escape') setShowCreateForm(false);
                  }}
                />
                <div className="flex gap-1">
                  {FOLDER_COLORS.map(c => (
                    <button
                      key={c.value}
                      onClick={() => setNewColor(c.value)}
                      className={cn(
                        'w-5 h-5 rounded-full transition-transform',
                        c.dot,
                        newColor === c.value ? 'scale-125 ring-2 ring-white/30' : 'opacity-50 hover:opacity-100'
                      )}
                    />
                  ))}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={handleCreate}
                    className="flex-1 px-2 py-1 text-xs font-medium bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-2 py-1 text-xs text-zinc-400 hover:text-zinc-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-sm text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Folder
              </button>
            )}
          </div>
        )}
      </div>

      {/* Labels Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <button
          onClick={() => setIsLabelsOpen(!isLabelsOpen)}
          className="w-full flex items-center justify-between p-3 hover:bg-zinc-800/50 transition-colors"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">Labels</span>
          {isLabelsOpen ? (
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          )}
        </button>

        {isLabelsOpen && (
          <div className="px-2 pb-2">
            {/* All Labels */}
            <button
              onClick={() => onSelectLabel(null)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                selectedLabel === null
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
              )}
            >
              <Tag className="w-4 h-4" />
              <span className="flex-1 text-left">All Labels</span>
            </button>

            {/* Label list */}
            {labelEntries.map(([label, count]) => {
              const color = getLabelColor(label);
              return (
                <button
                  key={label}
                  onClick={() => onSelectLabel(label)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                    selectedLabel === label
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
                  )}
                >
                  <span className={cn('w-2 h-2 rounded-full', color.dot)} />
                  <span className="flex-1 text-left truncate">{label}</span>
                  <span className="text-xs text-zinc-500">{count}</span>
                </button>
              );
            })}

            {/* New label input */}
            {showLabelInput ? (
              <div className="mt-1 flex gap-1">
                <input
                  type="text"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  placeholder="Label name"
                  className="flex-1 px-2 py-1.5 bg-zinc-700 border border-zinc-600 rounded text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddLabel();
                    if (e.key === 'Escape') setShowLabelInput(false);
                  }}
                />
                <button
                  onClick={() => setShowLabelInput(false)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLabelInput(true)}
                className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-sm text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Label
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
