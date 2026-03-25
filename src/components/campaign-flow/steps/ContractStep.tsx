"use client";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-foreground/[0.06] bg-card-bg shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.03)]">
      {children}
    </div>
  );
}

export function ContractStep() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Contract preview</span>
        <span className="font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-muted">
          Auto-generated from your campaign details. Toggle edit mode to customize.
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] pl-3 pr-4 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M14 8.667A6 6 0 0 1 2.34 10M2 7.333A6 6 0 0 1 13.66 6M14 2.667v3.333h-3.333M2 13.333V10h3.333" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Regenerate
        </button>
        <button
          type="button"
          className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] pl-3 pr-4 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.333 13.333l-3.333.667.667-3.333L11.333 2Z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Edit
        </button>
      </div>

      {/* Contract document preview */}
      <Card>
        <div className="flex flex-col gap-6 p-8">
          {/* Document header */}
          <div className="flex flex-col items-center gap-2 border-b border-foreground/[0.06] pb-6">
            <span className="font-inter text-lg font-semibold tracking-[-0.02em] text-page-text">Creator Agreement</span>
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Content Rewards Platform</span>
          </div>

          {/* Parties */}
          <div className="flex flex-col gap-3">
            <span className="font-inter text-sm font-semibold tracking-[-0.02em] text-page-text">1. Parties</span>
            <p className="font-inter text-sm leading-[170%] tracking-[-0.02em] text-page-text-muted">
              This Creator Agreement (&ldquo;Agreement&rdquo;) is entered into between the brand (&ldquo;Company&rdquo;) and the creator (&ldquo;Creator&rdquo;) who accepts the campaign terms through the Content Rewards platform.
            </p>
          </div>

          {/* Scope */}
          <div className="flex flex-col gap-3">
            <span className="font-inter text-sm font-semibold tracking-[-0.02em] text-page-text">2. Scope of Work</span>
            <p className="font-inter text-sm leading-[170%] tracking-[-0.02em] text-page-text-muted">
              Creator agrees to produce and publish original content in accordance with the campaign requirements, including but not limited to: platform-specific content, brand guidelines adherence, and submission deadlines.
            </p>
          </div>

          {/* Compensation */}
          <div className="flex flex-col gap-3">
            <span className="font-inter text-sm font-semibold tracking-[-0.02em] text-page-text">3. Compensation</span>
            <p className="font-inter text-sm leading-[170%] tracking-[-0.02em] text-page-text-muted">
              Creator will be compensated based on the payment model selected for this campaign. Payments are processed according to the platform&apos;s standard payout schedule, subject to content approval and view verification.
            </p>
          </div>

          {/* Term */}
          <div className="flex flex-col gap-3">
            <span className="font-inter text-sm font-semibold tracking-[-0.02em] text-page-text">4. Term &amp; Termination</span>
            <p className="font-inter text-sm leading-[170%] tracking-[-0.02em] text-page-text-muted">
              This Agreement is effective upon acceptance and remains in force for the duration specified in the campaign settings. Either party may terminate with 7 days written notice. Outstanding payments for approved content will be honored.
            </p>
          </div>

          {/* IP */}
          <div className="flex flex-col gap-3">
            <span className="font-inter text-sm font-semibold tracking-[-0.02em] text-page-text">5. Intellectual Property</span>
            <p className="font-inter text-sm leading-[170%] tracking-[-0.02em] text-page-text-muted">
              Creator retains ownership of all original content. Company is granted a non-exclusive, worldwide license to use, reproduce, and distribute the content across its marketing channels for the duration of the campaign plus 12 months.
            </p>
          </div>

          {/* Confidentiality */}
          <div className="flex flex-col gap-3">
            <span className="font-inter text-sm font-semibold tracking-[-0.02em] text-page-text">6. Confidentiality</span>
            <p className="font-inter text-sm leading-[170%] tracking-[-0.02em] text-page-text-muted">
              Both parties agree to keep confidential any proprietary information shared during the course of this engagement, including campaign strategies, unreleased products, and performance data.
            </p>
          </div>

          {/* Signatures placeholder */}
          <div className="mt-4 flex gap-8 border-t border-foreground/[0.06] pt-6">
            <div className="flex flex-1 flex-col gap-6">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Company signature</span>
              <div className="h-px w-full bg-foreground/[0.12]" />
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Date</span>
            </div>
            <div className="flex flex-1 flex-col gap-6">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Creator signature</span>
              <div className="h-px w-full bg-foreground/[0.12]" />
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Date</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
