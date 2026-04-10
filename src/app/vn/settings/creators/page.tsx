"use client";
// @ts-nocheck

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, Edit, ChevronDown, Instagram, Trash2, Download, AlertTriangle, RotateCcw, Clock, Plus, Link2 } from 'lucide-react';
import { PageContainer } from '@/components/vn/layout/page-container';
import { Header } from '@/components/vn/layout/header';
import { Card, CardContent } from '@/components/vn/ui/card';
import { Button } from '@/components/vn/ui/button';
import { Badge } from '@/components/vn/ui/badge';
import { Avatar } from '@/components/vn/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/vn/ui/table';

// --- Inline types ---
type CreatorStatus = 'active' | 'paused' | 'inactive';

interface Creator {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  instagram_handle?: string;
  tiktok_handle?: string;
  status: CreatorStatus;
  total_videos: number;
  total_views: number;
  notes?: string;
}

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

const statusOptions: { value: CreatorStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Active', color: 'text-emerald-400' },
  { value: 'paused', label: 'Paused', color: 'text-yellow-400' },
  { value: 'inactive', label: 'Inactive', color: 'text-zinc-400' },
];

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  paused: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  inactive: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  deleting: 'bg-red-500/10 text-red-400 border-red-500/20',
};

interface DeletingCreator {
  id: string;
  deletedAt: Date;
}

// --- MOCK DATA ---
const MOCK_CREATORS: Creator[] = [
  { id: 'cr1', name: 'Alice Johnson', email: 'alice@example.com', avatar_url: undefined, instagram_handle: 'alicej_creates', tiktok_handle: 'alicej', status: 'active', total_videos: 45, total_views: 1250000 },
  { id: 'cr2', name: 'Bob Smith', email: 'bob@example.com', avatar_url: undefined, instagram_handle: 'bobsmith', tiktok_handle: 'bobs_content', status: 'active', total_videos: 32, total_views: 890000 },
  { id: 'cr3', name: 'Grace Kim', email: 'grace@example.com', avatar_url: undefined, instagram_handle: 'gracek', status: 'paused', total_videos: 28, total_views: 650000 },
  { id: 'cr4', name: 'Eve Martinez', email: 'eve@example.com', avatar_url: undefined, tiktok_handle: 'evem_official', status: 'active', total_videos: 56, total_views: 2100000 },
  { id: 'cr5', name: 'Carol Davis', email: 'carol@example.com', avatar_url: undefined, instagram_handle: 'carold', tiktok_handle: 'carol_d', status: 'inactive', total_videos: 12, total_views: 180000 },
];

// Delete confirmation modal
function DeleteModal({
  creator,
  onClose,
  onConfirm,
  onDownloadCSV,
}: {
  creator: Creator;
  onClose: () => void;
  onConfirm: () => void;
  onDownloadCSV: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-red-500/10">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">Delete Creator</h3>
            <p className="text-sm text-zinc-400">This action cannot be undone</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-zinc-300 mb-4">
            Are you sure you want to delete <span className="font-semibold text-zinc-100">{creator.name}</span>?
            This will permanently delete:
          </p>
          <ul className="text-sm text-zinc-400 space-y-1 ml-4">
            <li>- All profile information</li>
            <li>- All associated videos ({creator.total_videos} videos)</li>
            <li>- All analytics and metrics data</li>
          </ul>
        </div>

        <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
          <p className="text-sm text-zinc-300 mb-3">
            <span className="text-amber-400 font-medium">Important:</span> You can download a CSV backup of this creator&apos;s data before deleting.
            After deletion, you can restore the account for <span className="text-zinc-100 font-medium">3 days</span>.
          </p>
          <Button variant="secondary" size="sm" onClick={onDownloadCSV} className="w-full">
            <Download className="w-4 h-4" />
            Download CSV Backup
          </Button>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="ghost"
            onClick={onConfirm}
            className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
            Delete Creator
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function CreatorManagementPage() {
  const creators = MOCK_CREATORS;
  const loading = false;
  const updating = false;
  const isAdmin = true;

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [localStatuses, setLocalStatuses] = useState<Record<string, CreatorStatus>>({});
  const [deleteModal, setDeleteModal] = useState<Creator | null>(null);
  const [deletingCreators, setDeletingCreators] = useState<DeletingCreator[]>([]);

  const handleStatusChange = async (creatorId: string, newStatus: CreatorStatus) => {
    setLocalStatuses(prev => ({ ...prev, [creatorId]: newStatus }));
    setOpenDropdownId(null);
  };

  const getCreatorStatus = (creatorId: string, originalStatus: CreatorStatus): CreatorStatus => {
    return localStatuses[creatorId] ?? originalStatus;
  };

  const isDeleting = (creatorId: string) => {
    return deletingCreators.some(d => d.id === creatorId);
  };

  const getDaysRemaining = (deletedAt: Date) => {
    const now = new Date();
    const diff = 3 * 24 * 60 * 60 * 1000 - (now.getTime() - deletedAt.getTime());
    const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
    return Math.max(0, days);
  };

  const handleDownloadCSV = (creator: Creator) => {
    const rows: string[][] = [];
    rows.push(['Creator Information']);
    rows.push(['Name', creator.name]);
    rows.push(['Email', creator.email || '']);
    rows.push(['Instagram', creator.instagram_handle ? `https://instagram.com/${creator.instagram_handle}` : '']);
    rows.push(['TikTok', creator.tiktok_handle ? `https://tiktok.com/@${creator.tiktok_handle}` : '']);
    rows.push(['Status', creator.status]);
    rows.push(['Total Videos', creator.total_videos.toString()]);
    rows.push(['Total Views', creator.total_views.toString()]);
    rows.push(['Notes', creator.notes || '']);

    const csvContent = rows
      .map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${creator.name.replace(/\s+/g, '_')}_full_backup.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteCreator = async () => {
    if (deleteModal) {
      setDeletingCreators(prev => [...prev, { id: deleteModal.id, deletedAt: new Date() }]);
      setDeleteModal(null);
    }
  };

  const handleRestoreCreator = (creatorId: string) => {
    setDeletingCreators(prev => prev.filter(d => d.id !== creatorId));
  };

  const handlePermanentDelete = async (creatorId: string) => {
    setDeletingCreators(prev => prev.filter(d => d.id !== creatorId));
  };

  return (
    <PageContainer>
      {/* Back Button */}
      <Link
        href="/vn/settings"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Settings
      </Link>

      <Header
        title="Creator Management"
        description="Edit creator profiles and manage their status"
        action={
          <Button>
            <Plus className="w-4 h-4" />
            Add Creator
          </Button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="p-0">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Handles</TableHead>
                  <TableHead>Videos</TableHead>
                  <TableHead>Total Views</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creators.map((creator) => {
                  const currentStatus = getCreatorStatus(creator.id, creator.status);
                  const creatorIsDeleting = isDeleting(creator.id);
                  const deletingInfo = deletingCreators.find(d => d.id === creator.id);
                  const daysRemaining = deletingInfo ? getDaysRemaining(deletingInfo.deletedAt) : 0;

                  return (
                    <TableRow
                      key={creator.id}
                      className={creatorIsDeleting ? 'opacity-50 bg-red-500/5' : ''}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={creator.avatar_url}
                            name={creator.name}
                            size="md"
                          />
                          <div>
                            <p className={`font-medium ${creatorIsDeleting ? 'text-zinc-500' : 'text-zinc-100'}`}>
                              {creator.name}
                            </p>
                            <p className="text-sm text-zinc-500">{creator.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          {creator.instagram_handle && (
                            <a
                              href={`https://instagram.com/${creator.instagram_handle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-1 ${creatorIsDeleting ? 'text-zinc-600 pointer-events-none' : 'text-zinc-400 hover:text-pink-400'} transition-colors`}
                            >
                              <Instagram className="w-3 h-3" />
                              @{creator.instagram_handle}
                            </a>
                          )}
                          {creator.tiktok_handle && (
                            <a
                              href={`https://tiktok.com/@${creator.tiktok_handle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-1 ${creatorIsDeleting ? 'text-zinc-600 pointer-events-none' : 'text-zinc-400 hover:text-cyan-400'} transition-colors`}
                            >
                              <TikTokIcon className="w-3 h-3" />
                              @{creator.tiktok_handle}
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className={creatorIsDeleting ? 'text-zinc-600' : 'text-zinc-300'}>
                        {creator.total_videos}
                      </TableCell>
                      <TableCell className={creatorIsDeleting ? 'text-zinc-600' : 'text-zinc-300'}>
                        {formatNumber(creator.total_views)}
                      </TableCell>
                      <TableCell>
                        {creatorIsDeleting ? (
                          <div className="flex items-center gap-2">
                            <Badge className={statusColors.deleting}>
                              Deleting
                            </Badge>
                            <span className="text-xs text-red-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {daysRemaining}d left
                            </span>
                          </div>
                        ) : (
                          <Badge className={statusColors[currentStatus]}>
                            {currentStatus}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {creatorIsDeleting ? (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRestoreCreator(creator.id)}
                              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Restore
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadCSV(creator)}
                              className="text-zinc-400 hover:text-zinc-300"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                              Edit
                            </Button>

                            {/* Status Dropdown */}
                            <div className="relative">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setOpenDropdownId(openDropdownId === creator.id ? null : creator.id)}
                                disabled={updating}
                              >
                                Status
                                <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${openDropdownId === creator.id ? 'rotate-180' : ''}`} />
                              </Button>
                              {openDropdownId === creator.id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setOpenDropdownId(null)}
                                  />
                                  <div className="absolute bottom-full right-0 mb-1 w-32 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 py-1">
                                    {statusOptions.map((option) => (
                                      <button
                                        key={option.value}
                                        onClick={() => handleStatusChange(creator.id, option.value)}
                                        className={`w-full px-3 py-2 text-left text-sm hover:bg-zinc-700 transition-colors flex items-center gap-2 ${
                                          currentStatus === option.value
                                            ? `${option.color} bg-zinc-700/50`
                                            : 'text-zinc-300'
                                        }`}
                                      >
                                        <span className={`w-2 h-2 rounded-full ${
                                          option.value === 'active' ? 'bg-emerald-400' :
                                          option.value === 'paused' ? 'bg-yellow-400' : 'bg-zinc-400'
                                        }`} />
                                        {option.label}
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Delete Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteModal(creator)}
                              className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* UTM Links Section */}
      <div className="mt-6 p-4 bg-zinc-800/30 rounded-lg border border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Link2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300">UTM Tracking Links</p>
              <p className="text-xs text-zinc-500">Assign tracking links to creators for campaign attribution</p>
            </div>
          </div>
          <span className="text-sm text-orange-400 font-medium">
            Manage UTM Links
          </span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <DeleteModal
          creator={deleteModal}
          onClose={() => setDeleteModal(null)}
          onConfirm={handleDeleteCreator}
          onDownloadCSV={() => handleDownloadCSV(deleteModal)}
        />
      )}
    </PageContainer>
  );
}
