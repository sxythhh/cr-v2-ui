import { PageShell } from "@/components/page-shell";
import { ScopeTabs } from "@/components/scope/scope-tabs";
import { ScopeLinkButton } from "@/components/scope/scope-button";
import { Icon } from "@/components/scope/icon";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageShell
      title="Scope"
      actions={
        <>
          <ScopeLinkButton variant="ghost" size="sm" href="/tools/onboarding">
            <Icon name="sparkles" size={13} />
            New workspace
          </ScopeLinkButton>
          <ScopeLinkButton variant="icon" size="sm" href="/tools/alerts" aria-label="Alerts">
            <Icon name="bell" size={14} />
          </ScopeLinkButton>
        </>
      }
    >
      <ScopeTabs />
      <div className="pt-5">{children}</div>
    </PageShell>
  );
}
