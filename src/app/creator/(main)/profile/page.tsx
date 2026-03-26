import { AvatarProfile } from "@/components/creator-mobile/avatar-profile";
import { ActiveWalletCard } from "@/components/creator-mobile/active-wallet-card";
import { ReviewBanner } from "@/components/creator-mobile/review-banner";
import { StatsGrid } from "@/components/creator-mobile/stats-grid";

export default function ProfilePage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Profile Header */}
      <div className="flex flex-col items-center px-[34px] pb-[68px] pt-[34px]" style={{ background: "#FF5600" }}>
        <AvatarProfile username="alithebaker" videoCount={12} level="rising" />
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col gap-[2px] px-[18px] pt-[232px]" style={{ background: "#F7F7F6", borderRadius: "32px 32px 0 0", marginTop: -32 }}>
        <div className="absolute -top-[34px] left-[18px] right-[18px]">
          <ActiveWalletCard />
        </div>
        <ReviewBanner />
        <StatsGrid />
      </div>
    </div>
  );
}
