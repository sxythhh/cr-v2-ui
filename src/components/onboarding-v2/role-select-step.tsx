"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type Role = "brand" | "agency";

interface RoleSelectStepProps {
  value: Role | "";
  onChange: (role: Role) => void;
}

function BrandIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M14.2497 3H9.74967L9.4456 7.25699C9.33973 8.73922 10.5137 10 11.9997 10C13.4857 10 14.6596 8.73922 14.5537 7.25699L14.2497 3Z" fill="currentColor"/><path d="M21.3677 5.57574C21.1566 4.09779 19.8908 3 18.3979 3H16.2498L16.5826 7.66044C16.6768 8.97866 17.7737 10 19.0953 10C20.6282 10 21.8058 8.64227 21.589 7.12472L21.3677 5.57574Z" fill="currentColor"/><path d="M2.63184 5.57574C2.84298 4.09779 4.10874 3 5.60169 3H7.7498L7.41691 7.66044C7.32275 8.97866 6.22586 10 4.90428 10C3.37132 10 2.19376 8.64227 2.41056 7.12472L2.63184 5.57574Z" fill="currentColor"/><path d="M2.99976 11.5814V18C2.99976 19.6569 4.3429 21 5.99976 21H9C9.55228 21 10 20.5523 10 20V17.5C10 16.3954 10.8954 15.5 12 15.5C13.1046 15.5 14 16.3954 14 17.5L13.9999 20C13.9999 20.5523 14.4476 21 14.9999 21H17.9998C19.6566 21 20.9998 19.6569 20.9998 18V11.5813C20.4234 11.8494 19.779 12 19.0952 12C17.6685 12 16.3879 11.3366 15.5573 10.293C14.7241 11.3306 13.4447 12 11.9996 12C10.5545 12 9.2751 11.3306 8.44196 10.2931C7.61134 11.3367 6.33072 12 4.90417 12C4.2204 12 3.57604 11.8495 2.99976 11.5814Z" fill="currentColor"/>
    </svg>
  );
}

function AgencyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12.632 3.44236C14.7331 2.25172 17.4486 1.74366 21.0712 2.00242C21.5674 2.03786 21.962 2.43252 21.9975 2.92863C22.2562 6.55133 21.7482 9.26676 20.5575 11.3679C19.4692 13.2885 17.868 14.5939 16 15.6066V17.08C16 17.9558 15.6173 18.7878 14.9524 19.3578L12.1508 21.7591C11.8984 21.9755 11.5551 22.0522 11.2346 21.964C10.9142 21.8758 10.6586 21.6342 10.5524 21.3193L10.55 21.3124L10.5405 21.2848C10.5318 21.2597 10.5184 21.2215 10.5005 21.1715C10.4647 21.0714 10.411 20.9246 10.341 20.7423C10.2007 20.3768 9.99621 19.8722 9.74049 19.317C9.21438 18.1749 8.52476 16.9389 7.79289 16.207C7.06103 15.4751 5.82502 14.7855 4.68287 14.2594C4.1277 14.0037 3.6231 13.7992 3.25763 13.6589C3.07525 13.5889 2.92843 13.5351 2.82839 13.4993C2.77839 13.4814 2.74015 13.468 2.71506 13.4593L2.68749 13.4498L2.68145 13.4478C2.36656 13.3416 2.12406 13.0857 2.03586 12.7653C1.94765 12.4448 2.02443 12.1015 2.24074 11.8491L4.6421 9.04751C5.21205 8.38257 6.0441 7.99988 6.91987 7.99988H8.39325C9.40598 6.13185 10.7113 4.53072 12.632 3.44236ZM15.5 10.4999C16.6046 10.4999 17.5 9.60445 17.5 8.49988C17.5 7.39531 16.6046 6.49988 15.5 6.49988C14.3954 6.49988 13.5 7.39531 13.5 8.49988C13.5 9.60445 14.3954 10.4999 15.5 10.4999Z" fill="currentColor"/><path d="M5.20711 16.7928C5.59763 17.1833 5.59763 17.8165 5.20711 18.207L2.70711 20.707C2.31658 21.0975 1.68342 21.0975 1.29289 20.707C0.902369 20.3165 0.902369 19.6833 1.29289 19.2928L3.79289 16.7928C4.18342 16.4023 4.81658 16.4023 5.20711 16.7928Z" fill="currentColor"/><path d="M7.20711 20.207C7.59763 19.8165 7.59763 19.1833 7.20711 18.7928C6.81658 18.4023 6.18342 18.4023 5.79289 18.7928L4.29289 20.2928C3.90237 20.6833 3.90237 21.3165 4.29289 21.707C4.68342 22.0975 5.31658 22.0975 5.70711 21.707L7.20711 20.207Z" fill="currentColor"/>
    </svg>
  );
}

const ROLES: { id: Role; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: "brand",
    label: "Brand",
    description: "I represent a single brand and manage my own campaigns.",
    icon: <BrandIcon className="size-6" />,
  },
  {
    id: "agency",
    label: "Agency",
    description: "I manage campaigns for multiple brand clients.",
    icon: <AgencyIcon className="size-6" />,
  },
];

export function RoleSelectStep({ value, onChange }: RoleSelectStepProps) {
  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-bold leading-[28px] tracking-[-0.02em] text-page-text">
          Are you a brand or an agency?
        </h2>
        <p className="text-[13px] leading-[20px] text-page-text-muted">
          This helps us tailor your experience.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {ROLES.map((role, i) => (
          <motion.button
            key={role.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onChange(role.id)}
            className={cn(
              "flex cursor-pointer items-start gap-4 rounded-2xl border p-5 text-left transition-colors",
              value === role.id
                ? "border-border bg-[#FF6207]/[0.04]"
                : "border-border bg-card-bg hover:bg-foreground/[0.02]",
            )}
          >
            <span className={cn(
              "mt-0.5 shrink-0 transition-colors",
              value === role.id ? "text-[#FF6207]" : "text-page-text-muted",
            )}>
              {role.icon}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-semibold text-page-text">{role.label}</span>
              <span className="text-[13px] font-medium leading-[18px] text-page-text-muted">{role.description}</span>
            </div>

            {/* Radio indicator */}
            <div className="ml-auto mt-1 shrink-0">
              <div className={cn(
                "flex size-5 items-center justify-center rounded-full border-2 transition-all",
                value === role.id
                  ? "border-[#FF6207] bg-[#FF6207]"
                  : "border-foreground/20",
              )}>
                {value === role.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="size-2 rounded-full bg-white"
                  />
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
