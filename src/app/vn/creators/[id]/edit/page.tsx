"use client";
// @ts-nocheck

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageContainer } from '@/components/vn/layout/page-container';
import { Header } from '@/components/vn/layout/header';
import { CreatorForm } from '@/components/vn/features/creator-form';
import { Skeleton } from '@/components/vn/ui/skeleton';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockCreator = {
  id: 'c1',
  name: 'Emma Johnson',
  email: 'emma@example.com',
  status: 'active',
  tiktok_handle: 'emmaj',
  instagram_handle: 'emma.johnson',
  avatar_url: null,
  total_views: 3_200_000,
  total_videos: 89,
  cpm_rate: 5.0,
  retainer_amount: 500,
  cpm_cap: null,
  contract_start_date: '2025-06-01',
  engagement_rate: 5.2,
  avg_views_tiktok: 45000,
  avg_views_instagram: 32000,
  notes: 'Top performer, consistent posting schedule.',
  created_at: '2025-06-01T00:00:00Z',
  archived_at: null,
  benched_until: null,
};
// ── End Mock Data ──────────────────────────────────────────────────────

interface EditCreatorPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCreatorPage({ params }: EditCreatorPageProps) {
  const { id } = use(params);

  // Use mock data instead of hook
  const creator = mockCreator;
  const loading = false;

  if (loading) {
    return (
      <PageContainer>
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="max-w-2xl">
          <Skeleton className="h-96 w-full" />
        </div>
      </PageContainer>
    );
  }

  if (!creator) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-zinc-400 mb-4">Creator not found</p>
          <Link
            href="/vn/creators"
            className="inline-flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Creators
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Link
        href="/vn/creators"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Creator Management
      </Link>

      <div className="max-w-2xl mx-auto">
        <Header
          title="Edit Creator"
          description={`Update ${creator.name}'s profile information`}
        />

        <CreatorForm creator={creator} />
      </div>
    </PageContainer>
  );
}
