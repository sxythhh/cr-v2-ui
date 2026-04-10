/* Filled circle status icons — used throughout the app for payment/task states */

interface StatusIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export function CheckCircleIcon({ size = 20, color = "#34D399", className }: StatusIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0ZM13.774 8.13327C14.1237 7.70582 14.0607 7.0758 13.6332 6.72607C13.2058 6.37635 12.5758 6.43935 12.226 6.86679L8.42576 11.5116L7.20711 10.2929C6.81658 9.9024 6.18342 9.9024 5.79289 10.2929C5.40237 10.6834 5.40237 11.3166 5.79289 11.7071L7.79289 13.7071C7.99267 13.9069 8.26764 14.0129 8.54981 13.9988C8.83199 13.9847 9.09505 13.8519 9.27396 13.6333L13.774 8.13327Z"
        fill={color}
      />
    </svg>
  );
}

export function ClockCircleIcon({ size = 20, color = "#FB923C", className }: StatusIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM11 6C11 5.44772 10.5523 5 10 5C9.44771 5 9 5.44772 9 6V10C9 10.2652 9.10536 10.5196 9.29289 10.7071L11.7929 13.2071C12.1834 13.5976 12.8166 13.5976 13.2071 13.2071C13.5976 12.8166 13.5976 12.1834 13.2071 11.7929L11 9.58579V6Z"
        fill={color}
      />
    </svg>
  );
}

export function XCircleIcon({ size = 20, color = "#FB7185", className }: StatusIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM7.70711 6.29289C7.31658 5.90237 6.68342 5.90237 6.29289 6.29289C5.90237 6.68342 5.90237 7.31658 6.29289 7.70711L8.58579 10L6.29289 12.2929C5.90237 12.6834 5.90237 13.3166 6.29289 13.7071C6.68342 14.0976 7.31658 14.0976 7.70711 13.7071L10 11.4142L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L11.4142 10L13.7071 7.70711C14.0976 7.31658 14.0976 6.68342 13.7071 6.29289C13.3166 5.90237 12.6834 5.90237 12.2929 6.29289L10 8.58579L7.70711 6.29289Z"
        fill={color}
      />
    </svg>
  );
}

/* Map from icon type to component — used by status filter dropdown */
export type StatusIconType = "check" | "clock" | "x" | "warning" | "eye" | "refresh" | "circle";

export function StatusIcon({ type, size = 12, color }: { type: StatusIconType; size?: number; color?: string }) {
  switch (type) {
    case "check":
      return <CheckCircleIcon size={size} color={color ?? "#34D399"} />;
    case "clock":
      return <ClockCircleIcon size={size} color={color ?? "#FB923C"} />;
    case "x":
    case "warning":
      return <XCircleIcon size={size} color={color ?? "#FB7185"} />;
    case "eye":
      return <CheckCircleIcon size={size} color={color ?? "#38BDF8"} />;
    case "refresh":
      return <XCircleIcon size={size} color={color ?? "#A1A1AA"} />;
    case "circle":
      return <ClockCircleIcon size={size} color={color ?? "#A1A1AA"} />;
  }
}
