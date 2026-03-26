import { DiscoverHeader } from "@/components/creator-mobile/discover/discover-header";
import { CampaignListRow } from "@/components/creator-mobile/discover/campaign-list-row";

const listRows = [
  { iconColor: "#FFBF00", title: "Post your lifts or funny feed screenshots", avatarCount: 64, price: "$3", views: "1k", budget: "$756", socialColors: ["#9D9890", "#D6D4D2", "#D6D4D2"] },
  { iconColor: "#FA4617", title: "Post your lifts and funny feed screenshots", avatarCount: 64, price: "$3", views: "1k", budget: "$756", socialColors: ["#D6D4D2", "#24231F", "#FF0000"] },
  { iconColor: "#87BB26", title: "Post your lifts or funny feed screenshots", avatarCount: 64, price: "$3", views: "1k", budget: "$756", socialColors: ["#9D9890", "#24231F", "#FF0000"] },
  { iconColor: "#635DFE", title: "Post your lifts and funny feed screenshots", avatarCount: 64, price: "$3", views: "1k", budget: "$756", socialColors: ["#D6D4D2", "#D6D4D2", "#FF0000"] },
  { iconColor: "#FFBF00", title: "Post your lifts or funny feed screenshots", avatarCount: 64, price: "$3", views: "1k", budget: "$756", socialColors: ["#9D9890", "#D6D4D2", "#D6D4D2"] },
  { iconColor: "#FA4617", title: "Post your lifts and funny feed screenshots", avatarCount: 64, price: "$3", views: "1k", budget: "$756", socialColors: ["#9D9890", "#D6D4D2", "#D6D4D2"] },
];

export default function DiscoverPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <DiscoverHeader activeTab="list" />
      <div className="flex flex-1 flex-col gap-[34px] p-[34px]">
        {listRows.map((row, i) => (
          <CampaignListRow key={i} {...row} />
        ))}
      </div>
    </div>
  );
}
