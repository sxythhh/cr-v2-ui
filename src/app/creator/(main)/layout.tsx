import { MobileShell } from "@/components/creator-mobile/mobile-shell";
import { MainTabBar } from "@/components/creator-mobile/main-tab-bar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileShell bg="#F7F7F6">
      <div className="flex flex-1 flex-col pb-[80px]">
        {children}
      </div>
      <MainTabBar />
    </MobileShell>
  );
}
