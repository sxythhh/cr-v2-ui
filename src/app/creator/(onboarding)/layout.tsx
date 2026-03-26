import { MobileShell } from "@/components/creator-mobile/mobile-shell";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileShell bg="white">{children}</MobileShell>;
}
