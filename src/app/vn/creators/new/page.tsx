"use client";
// @ts-nocheck

import { PageContainer } from '@/components/vn/layout/page-container';
import { Header } from '@/components/vn/layout/header';
import { CreatorForm } from '@/components/vn/features/creator-form';

export default function NewCreatorPage() {
  return (
    <PageContainer>
      <Header
        title="Add Creator"
        description="Add a new UGC creator to your roster"
      />
      <div className="max-w-2xl mx-auto">
        <CreatorForm />
      </div>
    </PageContainer>
  );
}
