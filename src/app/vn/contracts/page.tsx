"use client";
// @ts-nocheck

import { useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PenLine, RefreshCw, Plus, X, FileText } from 'lucide-react';
import { PageContainer } from '@/components/vn/layout/page-container';
import { ContractTable } from '@/components/vn/features/contracts/contract-table';
import { ContractModal } from '@/components/vn/features/contracts/contract-modal';
import { ContractDetailModal } from '@/components/vn/features/contracts/contract-detail-modal';
import { ContractFolderSidebar } from '@/components/vn/features/contracts/contract-folder-sidebar';
import { ContractCard } from '@/components/vn/features/contracts/contract-card';
import {
  ContractExplorerToolbar,
  ViewMode,
  SortField,
  SortDirection,
} from '@/components/vn/features/contracts/contract-explorer-toolbar';

// --- Inline types ---
interface Contract {
  id: string;
  title: string;
  description?: string;
  status: string;
  creator?: { name?: string };
  folder_id?: string;
  tags?: string[];
  created_at: string;
  file_url?: string;
}

interface ContractFolder {
  id: string;
  name: string;
}

interface ContractFilters {
  folder_id?: string;
}

// --- MOCK DATA ---
const MOCK_CONTRACTS: Contract[] = [
  { id: 'c1', title: 'Brand Ambassador Agreement', description: 'Standard ambassador contract for Q2 campaigns', status: 'active', creator: { name: 'Alice Johnson' }, folder_id: 'f1', tags: ['ambassador', 'q2'], created_at: '2026-03-15T10:00:00Z' },
  { id: 'c2', title: 'Content License - TikTok', description: 'Licensing agreement for TikTok content repurposing', status: 'draft', creator: { name: 'Bob Smith' }, folder_id: 'f1', tags: ['license', 'tiktok'], created_at: '2026-03-20T14:00:00Z' },
  { id: 'c3', title: 'Sponsorship Deal - Summer Campaign', description: 'Sponsored content deal for summer product launch', status: 'active', creator: { name: 'Grace Kim' }, folder_id: 'f2', tags: ['sponsorship', 'summer'], created_at: '2026-04-01T09:00:00Z' },
  { id: 'c4', title: 'NDA - Product Preview', description: 'Non-disclosure for upcoming product reveal', status: 'signed', creator: { name: 'Eve Martinez' }, folder_id: 'f2', tags: ['nda'], created_at: '2026-04-05T11:00:00Z' },
  { id: 'c5', title: 'Affiliate Partnership Terms', description: 'Revenue share agreement for affiliate program', status: 'active', creator: { name: 'Carol Davis' }, tags: ['affiliate', 'revenue-share'], created_at: '2026-04-08T16:00:00Z' },
];

const MOCK_FOLDERS: ContractFolder[] = [
  { id: 'f1', name: 'Creator Contracts' },
  { id: 'f2', name: 'Campaign Deals' },
];

const MOCK_CREATORS = [
  { id: 'cr1', name: 'Alice Johnson' },
  { id: 'cr2', name: 'Bob Smith' },
  { id: 'cr3', name: 'Grace Kim' },
  { id: 'cr4', name: 'Eve Martinez' },
  { id: 'cr5', name: 'Carol Davis' },
];

export default function ContractsPage() {
  const [filters, setFilters] = useState<ContractFilters>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [detailContract, setDetailContract] = useState<Contract | null>(null);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);

  // Explorer state
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  // Mock data - no hooks
  const contracts = MOCK_CONTRACTS;
  const folders = MOCK_FOLDERS;
  const loading = false;
  const error: string | null = null;
  const createContract = async (_input: any) => {};
  const updateContract = async (_input: any) => {};
  const deleteContract = async (_id: string) => {};
  const createFolder = async (_name: string) => {};
  const deleteFolder = async (_id: string) => {};
  const creating = false;
  const updating = false;
  const creators = MOCK_CREATORS;

  // Compute folder contract counts
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    contracts.forEach(c => {
      if (c.folder_id) {
        counts[c.folder_id] = (counts[c.folder_id] || 0) + 1;
      }
    });
    return counts;
  }, [contracts]);

  // Aggregate all labels with counts
  const allLabels = useMemo(() => {
    const labelMap: Record<string, number> = {};
    contracts.forEach(c => {
      if (c.tags) {
        c.tags.forEach(tag => {
          labelMap[tag] = (labelMap[tag] || 0) + 1;
        });
      }
    });
    return labelMap;
  }, [contracts]);

  // Client-side filtering and sorting
  const displayContracts = useMemo(() => {
    let result = [...contracts];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.creator?.name?.toLowerCase().includes(q) ||
        c.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Label filter
    if (selectedLabel) {
      result = result.filter(c => c.tags?.includes(selectedLabel));
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'date':
        default:
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [contracts, searchQuery, selectedLabel, sortBy, sortDirection]);

  const handleFolderSelect = useCallback((folderId: string | undefined) => {
    setFilters(prev => ({ ...prev, folder_id: folderId }));
  }, []);

  const handleDelete = async (id: string) => {
    setDetailContract(null);
  };

  const handleSortChange = useCallback((field: SortField, direction: SortDirection) => {
    setSortBy(field);
    setSortDirection(direction);
  }, []);

  const handleEdit = useCallback((contract: Contract) => {
    setEditingContract(contract);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(async (input: any) => {
    // no-op
  }, [editingContract]);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setEditingContract(null);
  }, []);

  const sidebarContent = (
    <ContractFolderSidebar
      folders={folders}
      selectedFolderId={filters.folder_id}
      onSelectFolder={(folderId) => {
        handleFolderSelect(folderId);
        setMobileSidebarOpen(false);
      }}
      onCreateFolder={createFolder}
      onDeleteFolder={deleteFolder}
      contractCounts={folderCounts}
      labels={allLabels}
      selectedLabel={selectedLabel}
      onSelectLabel={(label) => {
        setSelectedLabel(label);
        setMobileSidebarOpen(false);
      }}
    />
  );

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <PenLine className="w-7 h-7 text-orange-400" />
            Contracts
          </h1>
          <p className="text-zinc-400 mt-1 hidden sm:block">
            Upload, organize, and manage your contracts
          </p>
        </div>
        <button
          onClick={() => { setEditingContract(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Contract</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Main layout: Sidebar + Content */}
      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          {sidebarContent}
        </div>

        {/* Main area */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Toolbar */}
          <ContractExplorerToolbar
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            search={searchQuery}
            onSearchChange={setSearchQuery}
            totalCount={displayContracts.length}
            onMobileSidebarToggle={() => setMobileSidebarOpen(true)}
          />

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-orange-400 animate-spin" />
            </div>
          ) : displayContracts.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 sm:p-12 text-center">
              <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-400 font-medium">No contracts found</p>
              <p className="text-zinc-500 text-sm mt-1">
                {contracts.length > 0
                  ? 'Try adjusting your filters'
                  : 'Upload your first contract to get started'}
              </p>
              {contracts.length === 0 && (
                <button
                  onClick={() => { setEditingContract(null); setModalOpen(true); }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  New Contract
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {displayContracts.map((contract, idx) => (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  index={idx}
                  onClick={setDetailContract}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <ContractTable
              contracts={displayContracts}
              onView={setDetailContract}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Mobile Sidebar Sheet */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-zinc-950 border-r border-zinc-800 z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-zinc-100">Filters</h2>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {sidebarContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create / Edit Modal */}
      <ContractModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        creators={creators}
        folders={folders}
        saving={creating || updating}
        editContract={editingContract}
      />

      {/* Detail Modal */}
      <ContractDetailModal
        contract={detailContract}
        isOpen={!!detailContract}
        onClose={() => setDetailContract(null)}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </PageContainer>
  );
}
