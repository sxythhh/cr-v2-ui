export function VerifiedBadge({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <img
      src="/icons/CRCheckmark.svg"
      alt="Verified"
      width={size}
      height={size}
      className={className || "shrink-0"}
      style={{ display: "inline-block" }}
    />
  );
}
