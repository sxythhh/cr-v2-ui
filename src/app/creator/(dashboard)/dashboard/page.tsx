"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Modal, ModalHeader, ModalBody } from "@/components/ui/modal";
import { CreatorHeader } from "@/components/creator-header";
import { CheckCircleIcon } from "@/components/submissions/icons";
import { TrustScoreModal } from "@/components/trust-score-modal";
import { TransactionShareModal } from "@/components/transaction-share-modal";
import { PerksDrawer } from "@/components/perks-drawer";

// ── Inline Icons ────────────────────────────────────────────────────

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className}>
      <path d="M9 1.5C4.86 1.5 1.5 4.36 1.5 7.88C1.5 9.84 2.58 11.58 4.25 12.7L3.5 15.5L6.72 13.98C7.44 14.16 8.2 14.26 9 14.26C13.14 14.26 16.5 11.4 16.5 7.88C16.5 4.36 13.14 1.5 9 1.5Z" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className}>
      <path d="M9 1.5C9.534 1.5 10.051 1.577 10.54 1.72C10.193 2.099 9.941 2.567 9.824 3.086C9.558 3.03 9.282 3 9 3C6.879 3 5.13 4.663 5.024 6.781L4.898 9.316C4.877 9.73 4.77 10.137 4.585 10.508L3.839 12H14.161L13.415 10.508C13.229 10.137 13.123 9.73 13.102 9.316L12.976 6.781C12.975 6.768 12.973 6.754 12.972 6.74C13.509 6.701 14.007 6.521 14.429 6.236C14.45 6.391 14.466 6.548 14.474 6.707L14.601 9.241C14.611 9.448 14.664 9.651 14.757 9.837L15.606 11.536C15.701 11.725 15.75 11.933 15.75 12.144C15.75 12.893 15.143 13.5 14.394 13.5H12.674C12.327 15.212 10.814 16.5 9 16.5C7.186 16.5 5.673 15.212 5.325 13.5H3.606C2.904 13.5 2.327 12.966 2.257 12.282L2.25 12.144L2.259 11.986C2.277 11.83 2.323 11.678 2.394 11.536L3.243 9.837C3.336 9.651 3.389 9.448 3.399 9.241L3.526 6.707C3.672 3.79 6.08 1.5 9 1.5ZM6.88 13.5C7.189 14.374 8.021 15 9 15C9.979 15 10.811 14.374 11.12 13.5H6.88Z" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

function FireStatIcon({ color = "#E57100" }: { color?: string }) {
  return (
    <svg width="20" height="24" viewBox="0 0 17 21" fill="none">
      <path d="M8.51417 0.20807C8.25075 0.00496697 7.90358 -0.0538602 7.58795 0.0511242C7.27232 0.156108 7.02956 0.411161 6.94027 0.731583C6.40268 2.66083 5.30022 3.72289 3.88331 5.08789C3.6924 5.2718 3.49579 5.46121 3.29407 5.65898L3.29335 5.65969C2.66354 6.27845 2.01349 6.97938 1.47951 7.77371C-0.105263 10.1326 -0.494758 12.8046 0.691926 15.4909L0.692385 15.492C2.67042 19.956 7.09823 21.2419 10.797 20.1104C14.5101 18.9744 17.5549 15.3981 16.915 10.244C16.7173 8.63861 16.1746 6.97873 14.8334 5.67122C14.6227 5.46584 14.3322 5.36366 14.0394 5.3919C13.7465 5.42014 13.4809 5.57593 13.3133 5.81778C13.1732 6.02011 12.8541 6.41009 12.4715 6.86098C12.4053 6.05854 12.2383 5.28655 11.9546 4.54124C11.3323 2.9062 10.1855 1.49673 8.51417 0.20807Z" fill={color} />
    </svg>
  );
}

function DollarStatIcon({ color = "#AE4EEE" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM10 3.5C10.5523 3.5 11 3.94772 11 4.5V5.12367C11.804 5.32711 12.5135 5.77457 12.9759 6.41405C13.2995 6.86159 13.199 7.48674 12.7515 7.81035C12.304 8.13396 11.6788 8.03349 11.3552 7.58595C11.1379 7.28549 10.6534 7 10 7H9.72222C8.82744 7 8.5 7.54492 8.5 7.77778V7.8541C8.5 8.05137 8.64913 8.38262 9.15254 8.58398L11.5902 9.55906C12.6572 9.98584 13.5 10.9386 13.5 12.1459C13.5 13.6189 12.323 14.6144 11 14.9091V15.5C11 16.0523 10.5523 16.5 10 16.5C9.44771 16.5 9 16.0523 9 15.5V14.8763C8.19595 14.6729 7.4865 14.2254 7.02411 13.586C6.7005 13.1384 6.80096 12.5133 7.24851 12.1897C7.69605 11.866 8.32119 11.9665 8.6448 12.414C8.86206 12.7145 9.34658 13 10 13H10.1824C11.1298 13 11.5 12.4209 11.5 12.1459C11.5 11.9486 11.3509 11.6174 10.8475 11.416L8.40976 10.4409C7.34283 10.0142 6.5 9.0614 6.5 7.8541V7.77778C6.5 6.31377 7.68936 5.33904 9 5.07331V4.5C9 3.94772 9.44771 3.5 10 3.5Z" fill={color} />
    </svg>
  );
}

function WreathIcon({ color = "#00994D" }: { color?: string }) {
  return (
    <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.15185 0.398214C5.83573 -0.021243 5.24898 -0.124653 4.80851 0.161462C3.64505 0.917211 2.7985 1.87374 2.58347 3.0844C2.49544 3.58001 2.5215 4.07168 2.64012 4.55546C2.40785 4.47621 2.16601 4.40802 1.91633 4.34989C1.40358 4.23053 0.886086 4.52916 0.732878 5.03284C0.329995 6.35734 0.301512 7.63221 0.920415 8.69641C1.07322 8.95916 1.2569 9.19428 1.4673 9.40412C1.21855 9.45133 0.966763 9.51389 0.713027 9.58996C0.206053 9.74194 -0.0947008 10.2626 0.0269667 10.7777C0.345352 12.1256 0.96251 13.2412 2.0308 13.8535C2.40105 14.0657 2.79671 14.201 3.2112 14.2704C3.02946 14.4129 2.85067 14.5708 2.67563 14.7446C2.29037 15.127 2.28061 15.747 2.65364 16.1414C3.5122 17.0492 4.48241 17.6728 5.57176 17.7882C6.42119 17.8783 7.21999 17.6471 7.95403 17.1907C7.86525 17.4664 7.62204 17.8042 7.01732 18.1043C6.52263 18.3499 6.32066 18.95 6.56622 19.4447C6.81177 19.9394 7.41186 20.1413 7.90656 19.8958C9.12843 19.2893 9.85307 18.3421 9.98048 17.2377C10.2188 15.1719 8.35922 13.4348 6.40378 13.2546C6.42689 13.1242 6.42433 12.9872 6.39207 12.8506C6.14777 11.8163 5.72755 10.9188 5.06258 10.2805C5.12043 10.1971 5.16641 10.1035 5.19744 10.0015C5.55499 8.82602 5.61765 7.68963 5.19459 6.7049C6.26357 5.96894 7.03341 5.05043 7.23702 3.90405C7.45219 2.69263 6.98575 1.50472 6.15185 0.398214Z" fill={color} />
      <path fillRule="evenodd" clipRule="evenodd" d="M16.1919 0.161462C15.7514 -0.124653 15.1647 -0.021243 14.8485 0.398214C14.0146 1.50472 13.5482 2.69262 13.7634 3.90405C13.967 5.05043 14.7368 5.96895 15.8058 6.7049C15.3827 7.68963 15.4454 8.82602 15.8029 10.0015C15.834 10.1035 15.88 10.1971 15.9378 10.2805C15.2728 10.9188 14.8526 11.8163 14.6083 12.8506C14.576 12.9872 14.5735 13.1242 14.5966 13.2546C12.6412 13.4348 10.7816 15.1719 11.0199 17.2377C11.1473 18.3421 11.8719 19.2893 13.0938 19.8958C13.5885 20.1413 14.1886 19.9394 14.4342 19.4447C14.6797 18.95 14.4778 18.3499 13.9831 18.1043C13.3783 17.8042 13.1351 17.4664 13.0463 17.1907C13.7804 17.6471 14.5792 17.8783 15.4286 17.7882C16.518 17.6728 17.4882 17.0492 18.3467 16.1414C18.7198 15.747 18.71 15.127 18.3248 14.7446C18.1497 14.5708 17.9709 14.4129 17.7892 14.2704C18.2037 14.201 18.5993 14.0657 18.9696 13.8535C20.0379 13.2412 20.655 12.1256 20.9734 10.7777C21.0951 10.2626 20.7943 9.74194 20.2874 9.58996C20.0336 9.51389 19.7818 9.45133 19.5331 9.40412C19.7435 9.19428 19.9272 8.95916 20.08 8.69641C20.6989 7.63221 20.6704 6.35734 20.2675 5.03284C20.1143 4.52916 19.5968 4.23053 19.0841 4.34989C18.8344 4.40802 18.5925 4.47621 18.3603 4.55546C18.4789 4.07168 18.5049 3.58001 18.4169 3.0844C18.2019 1.87374 17.3553 0.917211 16.1919 0.161462Z" fill={color} />
    </svg>
  );
}

function EyeStatIcon({ color = "#1A67E5" }: { color?: string }) {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.7463 2.56478e-10C14.698 -2.77745e-05 18.5369 2.27233 21.1031 6.58313C21.6226 7.45583 21.6226 8.54406 21.1031 9.41677C18.5369 13.7276 14.6981 16 10.7463 16C6.79463 16 2.95577 13.7277 0.38963 9.41687C-0.129877 8.54417 -0.129876 7.45594 0.389629 6.58323C2.95577 2.27243 6.79462 2.7777e-05 10.7463 2.56478e-10ZM7.24634 8C7.24634 6.067 8.81334 4.5 10.7463 4.5C12.6793 4.5 14.2463 6.067 14.2463 8C14.2463 9.933 12.6793 11.5 10.7463 11.5C8.81334 11.5 7.24634 9.933 7.24634 8Z" fill={color} />
    </svg>
  );
}

function HelpIcon({ className }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0ZM5 3.5C4.81134 3.5 4.64632 3.6043 4.56074 3.76076C4.42823 4.00303 4.12441 4.09201 3.88214 3.95949C3.63986 3.82698 3.55089 3.52316 3.6834 3.28089C3.93732 2.81665 4.43132 2.5 5 2.5C5.75738 2.5 6.28345 3.00321 6.43322 3.5945C6.58379 4.18893 6.35504 4.8815 5.67082 5.22361C5.56613 5.27595 5.5 5.38295 5.5 5.5C5.5 5.77614 5.27615 6 5 6C4.72386 6 4.5 5.77614 4.5 5.5C4.5 5.00418 4.78014 4.55092 5.22361 4.32918C5.45098 4.21549 5.50939 4.01987 5.46384 3.84005C5.41749 3.65709 5.26416 3.5 5 3.5ZM5 7.5C5.27614 7.5 5.5 7.27614 5.5 7C5.5 6.72386 5.27614 6.5 5 6.5C4.72386 6.5 4.5 6.72386 4.5 7C4.5 7.27614 4.72386 7.5 5 7.5Z" fill="currentColor" fillOpacity="0.4" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3V13M8 3L4 7M8 3L12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M1 4C1 2.89543 1.89543 2 3 2H9C10.1046 2 11 2.89543 11 4V5.38L13.1056 4.32764C13.2298 4.26559 13.3737 4.26802 13.4959 4.33408C13.618 4.40014 13.6953 4.52116 13.7046 4.65682L14 8.5L13.7046 12.3432C13.6953 12.4788 13.618 12.5999 13.4959 12.6659C13.3737 12.732 13.2298 12.7344 13.1056 12.6724L11 11.62V12C11 13.1046 10.1046 14 9 14H3C1.89543 14 1 13.1046 1 12V4Z" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

function MoneybagIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
      <path d="M0.567487 11.3535C0.19617 10.7936 5.6031e-06 10.1187 0 9.33334C0.300044 7.23302 1.68041 5.67287 3.16866 4.16667H8.90142C10.2937 5.64371 11.6971 7.21336 12 9.33333C12 10.1187 11.8038 10.7936 11.4325 11.3535C11.0638 11.9095 10.5486 12.3127 9.96957 12.6017C8.83122 13.1699 7.37236 13.3333 6 13.3333C4.62764 13.3333 3.16878 13.1699 2.03044 12.6017C1.45144 12.3127 0.936236 11.9095 0.567487 11.3535Z" fill="currentColor" fillOpacity="0.5"/>
      <path d="M8.60073 2.08518C8.88036 1.33948 8.5969 0.472331 7.83294 0.247323C7.2636 0.0796353 6.65171 0 6 0C5.34829 0 4.7364 0.0796353 4.16706 0.247323C3.4031 0.472331 3.11964 1.33948 3.39927 2.08518L3.8015 3.15777L3.77778 3.16667H8.22222L8.1985 3.15777L8.60073 2.08518Z" fill="currentColor" fillOpacity="0.5"/>
    </svg>
  );
}

function VideoPlaylistIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M1.33333 0.666667C1.33333 0.298477 1.63181 0 2 0H11.3333C11.7015 0 12 0.298477 12 0.666667C12 1.03486 11.7015 1.33333 11.3333 1.33333H2C1.63181 1.33333 1.33333 1.03486 1.33333 0.666667ZM0 4C0 2.89543 0.895431 2 2 2H11.3333C12.4379 2 13.3333 2.89543 13.3333 4V10C13.3333 11.1046 12.4379 12 11.3333 12H2C0.895431 12 0 11.1046 0 10V4ZM5.71121 5.0658C5.94218 4.95478 6.21635 4.986 6.41646 5.14609L8.08313 6.47942C8.24127 6.60594 8.33333 6.79748 8.33333 7C8.33333 7.20252 8.24127 7.39406 8.08313 7.52058L6.41646 8.85391C6.21635 9.014 5.94218 9.04522 5.71121 8.9342C5.48023 8.82319 5.33333 8.5896 5.33333 8.33333V5.66667C5.33333 5.4104 5.48023 5.17681 5.71121 5.0658Z" fill="currentColor" fillOpacity="0.5"/>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="11" height="10" viewBox="0 0 11 10" fill="none">
      <path d="M5.93698 0.431091C5.66086 -0.143696 4.84062 -0.143698 4.56449 0.431091L3.3835 2.8895L0.663268 3.24567C0.0326199 3.32825 -0.229974 4.10751 0.239584 4.55027L2.22744 6.42466L1.72856 9.1008C1.61012 9.73617 2.28277 10.2072 2.8385 9.9076L5.25074 8.60713L7.66298 9.9076C8.2187 10.2072 8.89136 9.73617 8.77292 9.1008L8.27404 6.42466L10.2619 4.55027C10.7315 4.10751 10.4689 3.32825 9.83821 3.24567L7.11798 2.8895L5.93698 0.431091Z" fill="#E57100"/>
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
      <path d="M6.3 0C4.367 0 2.8 1.567 2.8 3.5V9.09999C2.8 10.2598 3.7402 11.2 4.9 11.2C6.05979 11.2 6.99999 10.2598 6.99999 9.09999V3.5C6.99999 3.1134 6.68659 2.8 6.3 2.8C5.9134 2.8 5.6 3.1134 5.6 3.5V9.09999C5.6 9.48659 5.2866 9.79999 4.9 9.79999C4.5134 9.79999 4.2 9.48659 4.2 9.09999V3.5C4.2 2.3402 5.1402 1.4 6.3 1.4C7.45979 1.4 8.39999 2.3402 8.39999 3.5V9.09999C8.39999 11.033 6.83299 12.6 4.9 12.6C2.967 12.6 1.4 11.033 1.4 9.09999V6.3C1.4 5.9134 1.0866 5.6 0.699999 5.6C0.3134 5.6 0 5.9134 0 6.3V9.09999C0 11.8062 2.1938 14 4.9 14C7.60619 14 9.79999 11.8062 9.79999 9.09999V3.5C9.79999 1.567 8.23299 0 6.3 0Z" fill="currentColor" fillOpacity="0.5"/>
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5.8 0.8C6.5 0.1 7.5 0.1 8.2 0.8L8.9 1.5L9.9 1.3C10.8 1.1 11.7 1.7 11.9 2.6L12.1 3.6L13 4.1C13.8 4.5 14.1 5.5 13.7 6.3L13.2 7.2L13.7 8.1C14.1 8.9 13.8 9.9 13 10.3L12.1 10.8L11.9 11.8C11.7 12.7 10.8 13.3 9.9 13.1L8.9 12.9L8.2 13.6C7.5 14.3 6.5 14.3 5.8 13.6L5.1 12.9L4.1 13.1C3.2 13.3 2.3 12.7 2.1 11.8L1.9 10.8L1 10.3C0.2 9.9 -0.1 8.9 0.3 8.1L0.8 7.2L0.3 6.3C-0.1 5.5 0.2 4.5 1 4.1L1.9 3.6L2.1 2.6C2.3 1.7 3.2 1.1 4.1 1.3L5.1 1.5L5.8 0.8Z" fill="url(#gold_gradient)" />
      <path d="M5 7L6.5 8.5L9.5 5.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="gold_gradient" x1="7" y1="0" x2="7" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD700" />
          <stop offset="1" stopColor="#F0A500" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function RetainerIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
      <path d="M2.526 0c.279 0 .505.226.505.505v.505h3.031V.505C6.062.226 6.289 0 6.568 0c.279 0 .505.226.505.505v.505h.505c.837 0 1.516.679 1.516 1.516v1.01c0 .28-.226.506-.505.506H1.01v4.041c0 .28.226.506.506.506h2.02c.28 0 .506.226.506.505 0 .28-.226.506-.505.506H1.516C.678 9.599 0 8.92 0 8.083V2.526C0 1.69.679 1.01 1.516 1.01h.505V.505C2.021.226 2.247 0 2.526 0Z" fill="#E57100"/>
      <path d="M7.073 6.252a1.92 1.92 0 0 0-.48.088l.301.302c.16.16.047.431-.178.431H5.557a.505.505 0 0 1-.505-.505V5.41c0-.225.272-.338.431-.179l.357.357a2.323 2.323 0 0 1 1.233-.346c1.067 0 1.967.716 2.246 1.692a.505.505 0 0 1-.346.625.505.505 0 0 1-.625-.347 1.32 1.32 0 0 0-1.275-.96Z" fill="#E57100"/>
      <path d="M5.798 7.944a.505.505 0 0 0-.971.278 2.323 2.323 0 0 0 2.246 1.692c.449 0 .873-.127 1.233-.346l.357.357c.16.159.431.047.431-.179V8.588a.505.505 0 0 0-.505-.505h-1.158c-.225 0-.338.272-.179.431l.302.302a1.92 1.92 0 0 1-.481.088 1.32 1.32 0 0 1-1.275-.96Z" fill="#E57100"/>
    </svg>
  );
}

function CpmIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 11 8" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M5.373 0c1.976 0 3.895 1.136 5.178 3.292.26.436.26.98 0 1.417C9.268 6.864 7.349 8 5.373 8 3.397 8 1.478 6.864.195 4.708a1.36 1.36 0 0 1 0-1.417C1.478 1.136 3.397 0 5.373 0Zm-1.75 4a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0Z" fill="#1A67E5"/>
    </svg>
  );
}

// ── Card wrapper ────────────────────────────────────────────────────

const cardClass =
  "rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]";

// ── Stat card data ──────────────────────────────────────────────────

const stats = [
  {
    value: "4 days",
    label: "Streak",
    hasHelp: true,
    icon: (c: string) => <FireStatIcon color={c} />,
    color: "#E57100",
    colorDark: "#FB923C",
    bg: "rgba(229,113,0,0.08)",
    bgDark: "rgba(251,146,60,0.08)",
  },
  {
    value: "$148.50",
    label: "Earned this week",
    hasHelp: false,
    icon: (c: string) => <DollarStatIcon color={c} />,
    color: "#AE4EEE",
    colorDark: "#C084FC",
    bg: "rgba(174,78,238,0.10)",
    bgDark: "rgba(192,132,252,0.10)",
  },
  {
    value: "92",
    label: "Trust score",
    hasHelp: true,
    icon: (c: string) => <WreathIcon color={c} />,
    color: "#00994D",
    colorDark: "#34D399",
    bg: "rgba(0,153,77,0.08)",
    bgDark: "rgba(52,211,153,0.08)",
  },
  {
    value: "24.5k",
    label: "Views",
    hasHelp: false,
    icon: (c: string) => <EyeStatIcon color={c} />,
    color: "#1A67E5",
    colorDark: "#60A5FA",
    bg: "rgba(26,103,229,0.08)",
    bgDark: "rgba(96,165,250,0.08)",
  },
];

// ── Feed cards data ─────────────────────────────────────────────────

const feedCards: {
  icon: React.ReactNode;
  topRight: React.ReactNode;
  title: string;
  desc: string;
  buttons: { label: string; primary?: boolean }[];
}[] = [
  {
    icon: <MoneybagIcon />,
    topRight: <span className="text-sm font-medium tracking-[-0.28px] text-[#00994D] dark:text-[#34D399]">$2,862</span>,
    title: "Withdraw your earnings",
    desc: "You have $2,862 available. Withdraw it to your account anytime.",
    buttons: [
      { label: "Withdraw", primary: true },
      { label: "Share" },
    ],
  },
  {
    icon: <VideoPlaylistIcon />,
    topRight: (
      <span className="inline-flex items-center gap-1 rounded-full border border-foreground/[0.06] py-1 pl-1.5 pr-2 dark:border-white/[0.06]">
        <StarIcon />
        <span className="text-xs font-medium tracking-[-0.24px] text-page-text">50 XP</span>
      </span>
    ),
    title: "Submit a new clip",
    desc: "Keep the momentum going. Your campaigns are waiting for content.",
    buttons: [{ label: "Submit clip" }],
  },
  {
    icon: <PaperclipIcon />,
    topRight: null,
    title: "Application expiring soon",
    desc: "Your CoD BO7 application closes in 2 days. Don\u2019t miss it.",
    buttons: [{ label: "View application" }],
  },
];

// ── Campaign data ───────────────────────────────────────────────────

const campaigns = [
  {
    brand: "Sound Network",
    brandLogo: "/creator-home/brand-logo-1.png",
    title: "Harry Styles Podcast x Shania Twain Clipping [7434]",
    model: "Retainer",
    modelColor: "#E57100",
    modelIcon: "retainer" as const,
    paidOut: "$3,561",
    pending: "$210",
    pendingHighlight: true,
    submissions: "7/21",
    thumbnail: "/creator-home/campaign-thumb-1.png",
  },
  {
    brand: "Clipping Culture",
    brandLogo: "/creator-home/brand-logo-2.png",
    title: "Call of Duty BO7 Official Clipping Campaign",
    model: "CPM",
    modelColor: "#1A67E5",
    modelIcon: "cpm" as const,
    paidOut: "$114",
    pending: "$0",
    pendingHighlight: false,
    submissions: "2/10",
    thumbnail: "/creator-home/campaign-thumb-2.png",
  },
  {
    brand: "Scene Society",
    brandLogo: "/creator-home/brand-logo-3.png",
    title: "Mumford & Sons | Prizefighter Clipping",
    model: "CPM",
    modelColor: "#1A67E5",
    modelIcon: "cpm" as const,
    paidOut: "$1,240",
    pending: "$58",
    pendingHighlight: true,
    submissions: "5/8",
    thumbnail: "/creator-home/campaign-thumb-3.png",
  },
];

// ── Page Component ──────────────────────────────────────────────────

export default function CreatorForYouPage() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  const [feedPage, setFeedPage] = useState(0);
  const [trustScoreOpen, setTrustScoreOpen] = useState(false);
  const [streakOpen, setStreakOpen] = useState(false);
  const [perksOpen, setPerksOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col font-inter tracking-[-0.02em]">
      {/* ── Header ─────────────────────────────────────────────── */}
      <CreatorHeader title="Dashboard" />

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 pb-8 pt-6 sm:px-5">
        {/* Balance + Stat cards wrapper */}
        <div className="relative flex flex-col items-center gap-4 rounded-t-2xl pt-4">
          {/* Gradient bg + border overlay */}
          <div
            className="pointer-events-none absolute inset-0 rounded-t-2xl"
            style={{ background: isDark ? "linear-gradient(180deg, rgba(224,224,224,0.03) 15.35%, transparent 61.39%)" : "linear-gradient(180deg, var(--card-bg) 15.35%, transparent 61.39%)" }}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-t-2xl"
            style={{
              background: isDark ? "linear-gradient(180deg, rgba(224,224,224,0.03) 15.35%, transparent 61.39%)" : "linear-gradient(180deg, var(--page-border) 15.35%, transparent 61.39%)",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              padding: "1px",
            }}
          />
          {/* Your balance */}
          <div className="relative flex w-full flex-col gap-3 px-4">
            <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Your balance</span>
            <div className="flex items-center gap-4">
              <div className="flex flex-1 items-center gap-3">
                <span className="text-2xl font-medium tracking-[-0.02em] text-page-text">$2,862.15</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-foreground/[0.06] bg-white py-1 pl-1.5 pr-2 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                  <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM4.5 5.20711V2.5H5.5V4.79289L6.95711 6.25L6.25 6.95711L4.5 5.20711Z" fill={isDark ? "#FB923C" : "#E57100"}/></svg>
                  <span className="text-xs font-medium tracking-[-0.02em] text-page-text">$326.15 pending</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-full bg-foreground/[0.06] px-3 py-2 text-xs font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-white/[0.06]">
                  Withdraw
                </button>
                <button onClick={() => setActivityOpen(true)} className="flex size-8 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-white/[0.06]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.333 2.667v4h4" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.34 10A5.667 5.667 0 1 0 3.28 4.613L1.333 6.667" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 4.667V8l2.333 1.333" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="relative hidden w-full sm:grid sm:grid-cols-2 sm:gap-2 md:grid-cols-4">
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                stat={stat}
                isDark={isDark}
                onClick={
                  stat.label === "Trust score"
                    ? () => setTrustScoreOpen(true)
                    : stat.label === "Streak"
                      ? () => setStreakOpen(true)
                      : undefined
                }
              />
            ))}
          </div>
        </div>
        <StatCardCarousel stats={stats} isDark={isDark} onTrustScore={() => setTrustScoreOpen(true)} onStreak={() => setStreakOpen(true)} />

        {/* ── Feed card ────────────────────────────────────────── */}
        <div className={cn(cardClass, "flex flex-col gap-4 p-4")}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-page-text">Feed</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFeedPage(Math.max(0, feedPage - 1))}
                className="flex size-6 items-center justify-center rounded-full border border-foreground/[0.06] text-page-text-muted transition-colors hover:bg-foreground/[0.04] dark:border-[rgba(224,224,224,0.06)] dark:hover:bg-white/[0.04]"
              >
                <ChevronLeftIcon />
              </button>
              <span className="text-xs tabular-nums text-page-text-muted">
                {feedPage + 1}/3
              </span>
              <button
                onClick={() => setFeedPage(Math.min(2, feedPage + 1))}
                className="flex size-6 items-center justify-center rounded-full border border-foreground/[0.06] text-page-text-muted transition-colors hover:bg-foreground/[0.04] dark:border-[rgba(224,224,224,0.06)] dark:hover:bg-white/[0.04]"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>

          {/* Feed cards: row on desktop, single card on mobile */}
          <div className="hidden gap-2 sm:flex">
            {feedCards.map((card) => (
              <div
                key={card.title}
                className="flex flex-1 flex-col justify-center gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg p-3 px-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-none sm:h-[172px]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/[0.06] text-page-text shadow-[0_0_0_2px_#fff] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-none">
                    {card.icon}
                  </div>
                  {card.topRight}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <h3 className="text-sm font-medium tracking-[-0.28px] text-page-text">
                    {card.title}
                  </h3>
                  <p className="text-xs leading-[18px] tracking-[-0.24px] text-page-text-subtle">
                    {card.desc}
                  </p>
                </div>
                <div className="flex gap-2">
                  {card.buttons.map((btn) => (
                    <button
                      key={btn.label}
                      onClick={btn.label === "Share" ? () => setShareOpen(true) : undefined}
                      className={cn(
                        "flex-1 rounded-full px-3 py-2 text-xs font-medium tracking-[-0.24px] transition-colors",
                        btn.primary
                          ? "bg-page-text text-white hover:bg-page-text/90 dark:bg-white dark:text-page-bg dark:hover:bg-white/90"
                          : "bg-foreground/[0.06] text-page-text hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
                      )}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Mobile: single card at a time */}
          {(() => {
            const card = feedCards[feedPage];
            if (!card) return null;
            return (
              <div className="flex flex-col justify-center gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg p-3 px-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-none sm:hidden">
                <div className="flex items-center justify-between">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/[0.06] text-page-text shadow-[0_0_0_2px_#fff] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-none">
                    {card.icon}
                  </div>
                  {card.topRight}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <h3 className="text-sm font-medium tracking-[-0.28px] text-page-text">{card.title}</h3>
                  <p className="text-xs leading-[18px] tracking-[-0.24px] text-page-text-subtle">{card.desc}</p>
                </div>
                <div className="flex gap-2">
                  {card.buttons.map((btn) => (
                    <button
                      key={btn.label}
                      onClick={btn.label === "Share" ? () => setShareOpen(true) : undefined}
                      className={cn(
                        "flex-1 rounded-full px-3 py-2 text-xs font-medium tracking-[-0.24px] transition-colors",
                        btn.primary
                          ? "bg-page-text text-white hover:bg-page-text/90 dark:bg-white dark:text-page-bg dark:hover:bg-white/90"
                          : "bg-foreground/[0.06] text-page-text hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
                      )}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* ── Streak + Tier row ─────────────────────────────── */}
        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Your streak */}
          <div className={cn(cardClass, "flex flex-1 flex-col gap-4 p-4")}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-page-text">Your streak</span>
              <span className="cursor-pointer text-xs font-medium text-page-text-muted transition-colors hover:text-page-text">Learn more</span>
            </div>
            <div className="flex flex-1 flex-col justify-end gap-4">
              <div className="flex flex-col gap-2 pb-1">
                <span className="text-5xl font-medium tracking-[-0.02em] text-page-text" style={{ lineHeight: "48px" }}>4<span className="text-[#B0B0B0] dark:text-[#575757]">d</span></span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-page-text-muted">Next reward</span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-foreground/[0.06] bg-white px-2 py-[6px] dark:border-white/[0.06] dark:bg-card-bg">
                    <svg width="11" height="10" viewBox="0 0 11 10" fill="none"><path d="M5.937.431C5.66-.144 4.84-.144 4.564.431L3.384 2.89.663 3.246C.033 3.328-.23 4.108.24 4.55L2.227 6.425 1.729 9.1c-.119.636.554 1.107 1.11.807L5.25 8.607l2.413 1.3c.555.3 1.228-.17 1.11-.807L8.274 6.425l1.988-1.875c.47-.443.207-1.222-.394-1.305L7.118 2.89 5.937.431Z" fill="#E57100"/></svg>
                    <span className="text-xs font-medium text-page-text">100 XP</span>
                  </span>
                  <span className="text-xs text-page-text-muted">in 3 days.</span>
                </div>
              </div>
              {/* Day tracker */}
              <div className="flex items-center gap-2">
                {[
                  { day: "Mon", active: false, current: false, future: false },
                  { day: "Tue", active: true, current: false, future: false },
                  { day: "Wed", active: true, current: false, future: false },
                  { day: "Thu", active: true, current: false, future: false },
                  { day: "Fri", active: false, current: true, future: false },
                  { day: "Sat", active: false, current: false, future: true },
                  { day: "Sun", active: false, current: false, future: true },
                ].map((d) => (
                  <div key={d.day} onClick={() => setStreakOpen(true)} className="flex flex-1 cursor-pointer flex-col items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition-transform hover:scale-110"
                      style={{
                        border: d.current
                          ? `1px solid ${isDark ? "#FB923C" : "#E57100"}`
                          : d.future
                            ? `1px dashed ${isDark ? "rgba(224,224,224,0.08)" : "rgba(37,37,37,0.12)"}`
                            : `1px solid ${isDark ? "rgba(224,224,224,0.03)" : "rgba(37,37,37,0.06)"}`,
                        boxShadow: !d.future ? "0 1px 2px 0 rgba(0,0,0,0.03)" : undefined,
                        background: isDark ? "rgba(224,224,224,0.03)" : undefined,
                      }}
                    >
                      <svg width="12" height="14" viewBox="0 0 12 14" fill="none"><path d="M5.815.142C5.635.003 5.398-.037 5.182.035 4.967.107 4.801.281 4.74.5 4.373 1.817 3.62 2.543 2.652 3.475c-.13.126-.265.255-.402.39l-.001.001C1.82 4.288 1.375 4.767 1.01 5.31c-1.082 1.61-1.348 3.435-.508 5.27l.001.001C1.824 13.63 4.848 14.508 7.374 13.735c2.536-.776 4.616-3.218 4.178-6.739C11.418 5.9 11.047 4.766 10.131 3.873c-.144-.14-.342-.21-.542-.191-.2.02-.382.126-.497.291-.096.138-.314.405-.575.713-.046-.548-.16-1.075-.354-1.585C7.74 1.985 6.957 1.022 5.815.142Z" fill={d.active || d.current ? (isDark ? "#FB923C" : "#E57100") : (isDark ? "rgba(224,224,224,0.20)" : "rgba(37,37,37,0.20)")}/></svg>
                    </div>
                    <span
                      className="text-xs text-center tracking-[-0.02em]"
                      style={{
                        color: d.active || d.current ? (isDark ? "#FB923C" : "#E57100") : (isDark ? "rgba(224,224,224,0.50)" : "rgba(37,37,37,0.50)"),
                        fontWeight: d.active || d.current ? 500 : 400,
                      }}
                    >
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Your tier */}
          <div className={cn(cardClass, "flex flex-1 flex-col gap-4 p-4")}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-page-text">Your tier</span>
              <button onClick={() => setPerksOpen(true)} className="cursor-pointer text-xs font-medium text-page-text-muted transition-colors hover:text-page-text">View perks</button>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-3">
              {/* Current vs next tier */}
              <div className="flex gap-2">
                {/* Current tier */}
                <div className="flex flex-1 flex-col gap-3">
                  <div className="relative h-10 w-10">
                    <svg width="43" height="43" viewBox="0 0 43 43" fill="none" className="absolute -left-[1.5px] -top-[1.5px]">
                      <defs>
                        <linearGradient id="tierStarGrad" x1="21.5" y1="-1.15" x2="21.5" y2="46.1" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FF8B1A"/><stop offset="1" stopColor="#E57100"/>
                        </linearGradient>
                      </defs>
                      <path d="M18.56 1.95C19.59.87 20.1.33 20.69.13 21.22-.04 21.78-.04 22.31.13c.6.2 1.11.74 2.13 1.82l6.26 6.6c.19.2.29.31.39.4.1.08.2.15.3.22.12.07.25.13.5.25l8.22 3.92c1.34.64 2.01.96 2.39 1.46.33.44.5.98.5 1.54-.01.63-.36 1.28-1.07 2.59l-4.34 8c-.13.25-.2.37-.25.5-.05.11-.09.23-.12.35-.03.14-.05.28-.08.55l-1.19 9.03c-.19 1.47-.29 2.21-.66 2.72-.32.45-.78.78-1.3.95-.6.19-1.33.05-2.79-.22l-8.95-1.66c-.28-.05-.41-.08-.55-.09-.12-.01-.25-.01-.37 0-.14.01-.28.04-.55.09l-8.95 1.66c-1.46.27-2.19.41-2.79.22-.53-.17-.99-.5-1.31-.95-.36-.51-.46-1.25-.66-2.72L5.87 28.33c-.04-.28-.05-.42-.09-.55-.03-.12-.07-.24-.12-.35-.05-.13-.12-.25-.25-.5l-4.34-8C.36 17.62.01 16.97 0 16.34c-.01-.55.17-1.09.5-1.54.37-.5 1.04-.82 2.39-1.46l8.22-3.92c.25-.12.38-.18.5-.25.1-.07.21-.14.3-.22.1-.09.2-.19.4-.4l6.26-6.6Z" fill="url(#tierStarGrad)" stroke={isDark ? "rgba(224,224,224,0.03)" : "rgba(37,37,37,0.06)"}/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-[33px] w-[33px] items-center justify-center rounded-full" style={{ border: `1px solid ${isDark ? "rgba(224,224,224,0.03)" : "rgba(37,37,37,0.06)"}` }}>
                        <svg width="18" height="16" viewBox="0 0 21 18" fill="none">
                          <path d="M13.49.11c.32-.16.7-.14 1 .05.31.19.49.52.49.88v1.88l.01.02 4.32-2.48c.41-.24.86.27.57.65l-3.41 4.45 1.46 2.55c.32.57.5 1.21.5 1.86v.63c0 1.73-1.4 3.12-3.12 3.12-.48 0-.96-.11-1.4-.33l-1.75-.88c.14.76.24 1.68.24 2.76 0 .57-.46 1.03-1.03 1.03-.57 0-1.04-.46-1.04-1.03 0-1.41-.2-2.5-.4-3.23-.09-.34-.18-.6-.25-.78-.59-.37-1.07-.89-1.38-1.51-.39-.81-.5-1.73-.28-2.6l.19-.74c.14-.55.7-.89 1.25-.75.55.14.89.7.75 1.25l-.19.74c-.1.39-.05.81.13 1.18.17.33.43.6.76.76l3.91 1.96c.15.07.31.11.47.11.58 0 1.06-.47 1.06-1.06v-.63c0-.29-.08-.58-.22-.84l-3.09-5.4c-.09-.16-.14-.33-.14-.51v-.48l-1.09.54c-.19.09-.4.13-.61.1-2.59-.37-4.61.71-6.04 2.52-1.45 1.84-2.25 4.41-2.25 6.79 0 .57-.46 1.03-1.03 1.03-.57 0-1.04-.46-1.04-1.03 0-2.79.92-5.82 2.7-8.07C5.3 2.38 7.9.91 11.19 1.26l2.3-1.15Z" fill={isDark ? "rgba(224,224,224,0.80)" : "rgba(37,37,37,0.80)"}/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-page-text">Recruit</span>
                    <span className="text-xs font-medium text-page-text">8% platform fee</span>
                  </div>
                </div>
                {/* Next tier */}
                <div className="flex flex-1 flex-col items-end gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ border: `1px dashed ${isDark ? "rgba(224,224,224,0.08)" : "rgba(37,37,37,0.12)"}`, background: isDark ? "rgba(224,224,224,0.03)" : undefined }}>
                    <svg width="14" height="17" viewBox="0 0 14 17" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M6.8 0C4.453 0 2.55 1.903 2.55 4.25V5.95C1.142 5.95 0 7.092 0 8.5V14.45C0 15.858 1.142 17 2.55 17H11.05C12.458 17 13.6 15.858 13.6 14.45V8.5C13.6 7.092 12.458 5.95 11.05 5.95V4.25C11.05 1.903 9.147 0 6.8 0ZM9.35 5.95V4.25C9.35 2.842 8.208 1.7 6.8 1.7 5.392 1.7 4.25 2.842 4.25 4.25V5.95H9.35ZM6.8 9.35C7.269 9.35 7.65 9.73 7.65 10.2V12.75C7.65 13.219 7.269 13.6 6.8 13.6 6.331 13.6 5.95 13.219 5.95 12.75V10.2C5.95 9.73 6.331 9.35 6.8 9.35Z" fill={isDark ? "rgba(224,224,224,0.20)" : "rgba(37,37,37,0.20)"}/></svg>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-medium text-page-text-muted">Next: Operator</span>
                    <span className="text-xs font-medium text-page-text-muted">7% platform fee</span>
                  </div>
                </div>
              </div>

              {/* Progress bars */}
              <div className="flex items-center gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg p-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-none">
                {/* XP progress */}
                <div className="flex flex-1 flex-col gap-2.5">
                  <span className="inline-flex items-center gap-1 self-start rounded-full border border-foreground/[0.06] bg-white px-2 py-[6px] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                    <svg width="11" height="10" viewBox="0 0 11 10" fill="none"><path d="M5.937.431C5.66-.144 4.84-.144 4.564.431L3.384 2.89.663 3.246C.033 3.328-.23 4.108.24 4.55L2.227 6.425 1.729 9.1c-.119.636.554 1.107 1.11.807L5.25 8.607l2.413 1.3c.555.3 1.228-.17 1.11-.807L8.274 6.425l1.988-1.875c.47-.443.207-1.222-.394-1.305L7.118 2.89 5.937.431Z" fill="#E57100"/></svg>
                    <span className="text-xs font-medium text-page-text">320/500 XP</span>
                  </span>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(229,113,0,0.08)] dark:bg-[rgba(251,146,60,0.08)]">
                    <div className="h-full rounded-full" style={{ width: "64%", background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207" }} />
                  </div>
                </div>
                {/* Divider */}
                <div className="h-full w-px self-stretch bg-foreground/[0.06] dark:bg-[rgba(224,224,224,0.03)]" />
                {/* Badges progress */}
                <div className="flex flex-1 flex-col gap-2.5">
                  <span className="inline-flex items-center gap-1 self-start rounded-full border border-foreground/[0.06] bg-white px-2 py-[6px] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                    <svg width="8" height="11" viewBox="0 0 8 11" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M0 4C0 1.791 1.791 0 4 0s4 1.791 4 4c0 1.263-.586 2.39-1.5 3.123V10.018c0 .65-.685 1.073-1.266.783L4 10.183l-1.234.617C2.185 11.091 1.5 10.668 1.5 10.018V7.123C.586 6.39 0 5.263 0 4Zm2.5 3.71v2.105l1.109-.554a.75.75 0 0 1 .782 0L5.5 9.815V7.71A4.48 4.48 0 0 1 4 8a4.48 4.48 0 0 1-1.5-.29Z" fill="#ED1285"/></svg>
                    <span className="text-xs font-medium text-page-text">3/5 badges</span>
                  </span>
                  <div className="flex h-2 w-full gap-1 overflow-hidden rounded-full">
                    <div className="flex-1 rounded-full bg-[#ED1285]" />
                    <div className="flex-1 rounded-full bg-[#ED1285]" />
                    <div className="flex-1 rounded-full bg-[#ED1285]" />
                    <div className="flex-1 rounded-full bg-[rgba(237,18,133,0.10)]" />
                    <div className="flex-1 rounded-full bg-[rgba(237,18,133,0.10)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Active campaigns card ────────────────────────────── */}
        <div className={cn(cardClass, "flex flex-col gap-4 p-4")}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-page-text">
              Active campaigns
            </h2>
            <button className="text-xs font-medium tracking-[-0.24px] text-page-text-subtle transition-colors hover:text-page-text">
              Browse more
            </button>
          </div>

          {/* Desktop: stacked rows */}
          <div className="hidden flex-col gap-2 sm:flex">
            {campaigns.map((campaign) => (
              <CampaignRow key={campaign.title} campaign={campaign} onSubmit={() => setSubmitOpen(true)} />
            ))}
          </div>

          {/* Mobile: carousel with dots */}
          <CampaignCarousel campaigns={campaigns} onSubmit={() => setSubmitOpen(true)} />
        </div>
      </div>

      {/* ── Trust Score Modal ──────────────────────────────────── */}
      <TrustScoreModal open={trustScoreOpen} onClose={() => setTrustScoreOpen(false)} />

      {/* ── Streak Modal ──────────────────────────────────────── */}
      <StreakModal open={streakOpen} onClose={() => setStreakOpen(false)} />

      {/* ── Recent Activity Modal ─────────────────────────────── */}
      <RecentActivityModal open={activityOpen} onClose={() => setActivityOpen(false)} isDark={isDark} />
      <TransactionShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
      <PerksDrawer open={perksOpen} onClose={() => setPerksOpen(false)} />

      {/* ── Submit Clip Modal ─────────────────────────────────── */}
      <SubmitClipModal open={submitOpen} onClose={() => setSubmitOpen(false)} />
    </div>
  );
}

// ── Stat Card component ─────────────────────────────────────────────

function StatCardCarousel({ stats, isDark, onTrustScore, onStreak }: {
  stats: typeof import("./page").default extends never ? never : any[];
  isDark: boolean;
  onTrustScore: () => void;
  onStreak: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !el.children[0]) return;
    const childWidth = (el.children[0] as HTMLElement).offsetWidth;
    if (childWidth === 0) return;
    const index = Math.round(el.scrollLeft / (childWidth + 8));
    setActiveIndex(Math.min(index, stats.length - 1));
  }, [stats.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="-mx-4 flex flex-col items-center gap-2 sm:hidden">
      <div
        ref={scrollRef}
        className="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto pl-4 scrollbar-hide [scroll-padding-inline:16px]"
      >
        {stats.map((stat: any, i: number) => (
          <div
            key={stat.label}
            className={cn(
              "w-[calc(50%-4px)] shrink-0 snap-start snap-always",
              i === stats.length - 1 && "mr-4",
            )}
          >
            <StatCard
              stat={stat}
              isDark={isDark}
              onClick={
                stat.label === "Trust score" ? onTrustScore
                  : stat.label === "Streak" ? onStreak
                  : undefined
              }
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1">
        {stats.map((_: any, i: number) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              const child = scrollRef.current?.children[i] as HTMLElement | undefined;
              child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
            }}
            className={cn(
              "size-1.5 cursor-pointer rounded-full transition-colors",
              i === activeIndex ? "bg-page-text" : "bg-foreground/10 dark:bg-white/10",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function StatCard({
  stat,
  onClick,
  isDark,
}: {
  stat: {
    value: string;
    label: string;
    hasHelp: boolean;
    icon: (color: string) => React.ReactNode;
    color: string;
    colorDark: string;
    bg: string;
    bgDark: string;
  };
  onClick?: () => void;
  isDark: boolean;
}) {
  return (
    <div
      className={cn(cardClass, "flex h-[61px] items-center gap-3 overflow-hidden pr-3", onClick && "cursor-pointer transition-colors hover:bg-foreground/[0.02] dark:hover:bg-white/[0.04]")}
      onClick={onClick}
    >
      <div className="relative h-[61px] w-[60px] shrink-0 overflow-hidden">
        <svg className="absolute inset-0" width="60" height="61" viewBox="0 0 60 61" fill="none">
          <path d="M-4 0H29.5C46.3447 0 60 13.6553 60 30.5C60 47.3447 46.3447 61 29.5 61H-4V0Z" fill={isDark ? stat.bgDark : stat.bg} />
        </svg>
        <div className="relative flex h-full w-full items-center justify-center">
          {stat.icon(isDark ? stat.colorDark : stat.color)}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <span className="text-sm font-medium tracking-[-0.28px] text-page-text">{stat.value}</span>
        <span className="flex items-center gap-1 text-xs tracking-[-0.24px] text-page-text-muted">
          {stat.label}
          {stat.hasHelp && <HelpIcon className="shrink-0" />}
        </span>
      </div>
    </div>
  );
}

// ── Campaign Row component ──────────────────────────────────────────

function CampaignCarousel({ campaigns, onSubmit }: { campaigns: typeof import("./page").default extends never ? never : any[]; onSubmit: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !el.children[0]) return;
    const childWidth = (el.children[0] as HTMLElement).offsetWidth;
    if (childWidth === 0) return;
    const index = Math.round(el.scrollLeft / (childWidth + 8));
    setActiveIndex(Math.min(index, campaigns.length - 1));
  }, [campaigns.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const campaign = campaigns[activeIndex];

  return (
    <div className="flex flex-col items-center gap-2 sm:hidden">
      <div
        ref={scrollRef}
        className="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto scrollbar-hide"
      >
        {campaigns.map((c: any, i: number) => (
          <div key={c.title} className="w-full shrink-0 snap-start snap-always">
            <CampaignRow campaign={c} onSubmit={onSubmit} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1">
        {campaigns.map((_: any, i: number) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              const child = scrollRef.current?.children[i] as HTMLElement | undefined;
              child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
            }}
            className={cn(
              "size-1.5 cursor-pointer rounded-full transition-colors",
              i === activeIndex ? "bg-page-text" : "bg-foreground/10 dark:bg-white/10",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function CampaignRow({
  campaign,
  onSubmit,
}: {
  campaign: {
    brand: string;
    brandLogo: string;
    title: string;
    model: string;
    modelColor: string;
    modelIcon: "retainer" | "cpm";
    paidOut: string;
    pending: string;
    pendingHighlight: boolean;
    submissions: string;
    thumbnail: string;
  };
  onSubmit: () => void;
}) {
  return (
    <div
      className={cn(
        cardClass,
        "flex cursor-pointer flex-col overflow-hidden transition-colors hover:bg-foreground/[0.02] dark:hover:bg-white/[0.02] sm:h-[102px] sm:flex-row sm:items-center"
      )}
    >
      {/* Thumbnail */}
      <div className="p-1 pb-0 sm:w-[167px] sm:shrink-0 sm:self-stretch sm:pb-1 sm:pr-0">
        <div
          className="h-[100px] w-full rounded-xl bg-cover bg-center sm:h-full sm:w-[163px]"
          style={{ backgroundImage: `url(${campaign.thumbnail})` }}
        />
      </div>

      {/* Content + Submit */}
      <div className="flex flex-1 items-center gap-4 p-3 sm:py-3 sm:pl-4 sm:pr-4">
        <div className="flex flex-1 flex-col gap-3">
          {/* Brand row + Title */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <img
                src={campaign.brandLogo}
                alt={campaign.brand}
                className="size-4 shrink-0 rounded-full border border-foreground/[0.06] object-cover"
              />
              <span className="text-xs font-medium tracking-[-0.24px] text-page-text">
                {campaign.brand}
              </span>
              <VerifiedBadge />
            </div>
            <h3 className="min-w-0 truncate text-sm font-medium tracking-[-0.28px] text-page-text">
              {campaign.title}
            </h3>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-white px-2 py-1 text-xs font-medium tracking-[-0.24px] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]"
              style={{ color: campaign.modelColor }}
            >
              {campaign.modelIcon === "retainer" ? <RetainerIcon /> : <CpmIcon />}
              {campaign.model}
            </span>
            <div className="flex items-center gap-1.5 text-xs tracking-[-0.24px]">
              <span className="text-page-text-subtle">Paid out</span>
              <span className="font-medium text-page-text">{campaign.paidOut}</span>
              <span className="text-foreground/20 dark:text-white/20">&middot;</span>
              <span className="text-page-text-subtle">Pending</span>
              <span className={cn("font-medium", campaign.pendingHighlight ? "text-[#E57100] dark:text-[#FB923C]" : "text-foreground/40 dark:text-white/40")}>
                {campaign.pending}
              </span>
              <span className="text-foreground/20 dark:text-white/20">&middot;</span>
              <span className="text-page-text-subtle">Submissions</span>
              <span className="font-medium text-page-text">{campaign.submissions}</span>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="hidden w-16 shrink-0 self-stretch sm:flex sm:flex-col sm:items-end sm:justify-center">
          <button onClick={(e) => { e.stopPropagation(); onSubmit(); }} className="w-full rounded-full bg-foreground/[0.06] px-3 py-2 text-xs font-medium tracking-[-0.24px] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-[rgba(224,224,224,0.06)]">
            Submit
          </button>
        </div>
      </div>

      {/* Mobile submit */}
      <div className="px-3 pb-3 sm:hidden">
        <button onClick={(e) => { e.stopPropagation(); onSubmit(); }} className="rounded-full bg-foreground/[0.06] px-3 py-2 text-xs font-medium tracking-[-0.24px] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-[rgba(224,224,224,0.06)]">
          Submit
        </button>
      </div>
    </div>
  );
}

// ── Trust Score Modal ──────────────────────────────────────────────

// trustPerks and scoreHistory moved to @/components/trust-score-modal

// TrustScoreModal now imported from @/components/trust-score-modal

// ── Streak Modal ───────────────────────────────────────────────────

function getWeekDays(weekOffset: number) {
  // "Today" is anchored to March 27 (Thu) for demo; offset shifts by 7 days
  const anchor = new Date(2026, 2, 27); // March 27 2026
  const today = new Date(anchor);
  // Start of anchor's week (Monday)
  const anchorDay = (today.getDay() + 6) % 7; // 0=Mon
  const anchorMonday = new Date(today);
  anchorMonday.setDate(today.getDate() - anchorDay);
  // Shift by weekOffset
  const monday = new Date(anchorMonday);
  monday.setDate(anchorMonday.getDate() + weekOffset * 7);

  const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
  // Fake streak: active days are consecutive days before today starting from March 24
  const streakStart = new Date(2026, 2, 24);
  // XP milestones on specific streak days (3rd and 7th day of any week)
  return DAY_LABELS.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const isCurrent = d.getTime() === anchor.getTime();
    const isFuture = d > anchor;
    const isActive = !isFuture && d >= streakStart && d <= anchor;
    const dayOfWeek = i; // 0=Mon … 6=Sun
    const xp = dayOfWeek === 2 ? "50 XP" : dayOfWeek === 6 ? "100 XP" : undefined;
    return { date: d.getDate(), label, active: isActive, current: isCurrent, future: isFuture, xp };
  });
}

function formatWeekRange(weekOffset: number) {
  const anchor = new Date(2026, 2, 27);
  const anchorDay = (anchor.getDay() + 6) % 7;
  const anchorMonday = new Date(anchor);
  anchorMonday.setDate(anchor.getDate() - anchorDay);
  const monday = new Date(anchorMonday);
  monday.setDate(anchorMonday.getDate() + weekOffset * 7);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  if (monday.getMonth() === sunday.getMonth()) {
    return `${months[monday.getMonth()]} ${monday.getDate()} - ${sunday.getDate()}`;
  }
  return `${months[monday.getMonth()]} ${monday.getDate()} - ${months[sunday.getMonth()]} ${sunday.getDate()}`;
}

function StreakModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekDays = getWeekDays(weekOffset);
  const isCurrent = weekOffset === 0;
  const streakCount = weekDays.filter((d) => d.active).length;
  const isBroken = streakCount === 0;

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-[600px]">
      <div className="flex items-center justify-center border-b border-foreground/[0.06] px-5 py-3 dark:border-[rgba(224,224,224,0.03)]">
        <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Streak</span>
      </div>

      <div className="relative flex flex-col items-center gap-4 overflow-hidden px-5 py-5">
        {/* Orange glow ellipse */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-[642px] w-[636px] -translate-x-1/2 -translate-y-[55%]" style={{ background: "linear-gradient(180deg, rgba(251,146,60,0.04) 83.18%, rgba(251,146,60,0) 100%)" }} />

        {/* Decorative particle circles */}
        {!isBroken && (
          <div className="pointer-events-none absolute left-1/2 top-5 z-[1] h-[145px] w-[171px] -translate-x-1/2">
            {/* Large ring — opacity 0.3 blur 2px */}
            <svg className="absolute left-[59.5px] top-0 opacity-30" style={{ filter: "blur(2px)" }} width="100" height="145" viewBox="0 0 100 145" fill="none">
              {[[46.1,83.12],[39.61,1.3],[88.96,142.21],[97.4,118.83],[67.53,29.22],[31.17,41.56],[0,53.25],[21.43,67.53],[0.65,15.58],[30.52,0],[74.03,26.62]].map(([x,y],i) => <circle key={i} cx={x+1.3} cy={y+1.3} r={1.3} fill="#FB923C"/>)}
            </svg>
            {/* Medium right — opacity 0.3 blur 0.5px */}
            <svg className="absolute left-[96px] top-[2.1px] opacity-30" style={{ filter: "blur(0.5px)" }} width="75" height="109" viewBox="0 0 75 109" fill="none">
              {[[34.58,62.34],[29.71,0.97],[66.72,106.66],[73.05,89.12],[50.65,21.92],[23.38,31.17],[0,39.94],[16.07,50.65],[0.49,11.69],[22.89,0],[55.52,19.97]].map(([x,y],i) => <circle key={i} cx={x+0.975} cy={y+0.975} r={0.975} fill="#FB923C"/>)}
            </svg>
            {/* Medium left (rotated 180) — opacity 0.3 blur 0.5px */}
            <svg className="absolute left-0 top-[2.1px] opacity-30" style={{ filter: "blur(0.5px)", transform: "rotate(180deg)" }} width="75" height="109" viewBox="0 0 75 109" fill="none">
              {[[38.47,44.32],[43.34,105.68],[6.33,0],[0,17.53],[22.4,84.74],[49.68,75.49],[73.05,66.72],[56.98,56.01],[72.56,94.97],[50.16,106.66],[17.53,86.69]].map(([x,y],i) => <circle key={i} cx={x+0.975} cy={y+0.975} r={0.975} fill="#FB923C"/>)}
            </svg>
          </div>
        )}

        {/* Big fire icon */}
        <div className="relative z-10 flex size-20 items-center justify-center" style={{ filter: "drop-shadow(0px 2px 4px rgba(37,37,37,0.12))" }}>
          {isBroken ? (
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <g filter="url(#bf_inactive)">
                <path d="M40.0464 5.69357C39.1683 5.01656 38.0111 4.82047 36.959 5.17041C35.9069 5.52036 35.0977 6.37054 34.8001 7.43861C33.0081 13.8694 29.3333 17.4096 24.6102 21.9596C23.9739 22.5727 23.3185 23.204 22.6461 23.8633L22.6437 23.8656C20.5443 25.9282 18.3775 28.2646 16.5975 30.9124C11.315 38.7754 10.0167 47.6819 13.9723 56.6364L13.9738 56.6398C20.5673 71.52 35.3266 75.8064 47.6558 72.0345C60.033 68.2479 70.1822 56.327 68.0491 39.1467C67.39 33.7954 65.5813 28.2624 61.1104 23.9041C60.4081 23.2195 59.44 22.8789 58.4637 22.973C57.4875 23.0671 56.6022 23.5864 56.0437 24.3926C55.5764 25.067 54.5127 26.367 53.2375 27.8699C53.0169 25.1951 52.4602 22.6218 51.5146 20.1375C49.4401 14.6873 45.6177 9.98911 40.0464 5.69357Z" fill="url(#bp_inactive_lin)" fillOpacity="0.2"/>
                <path d="M40.0464 5.69357C39.1683 5.01656 38.0111 4.82047 36.959 5.17041C35.9069 5.52036 35.0977 6.37054 34.8001 7.43861C33.0081 13.8694 29.3333 17.4096 24.6102 21.9596C23.9739 22.5727 23.3185 23.204 22.6461 23.8633L22.6437 23.8656C20.5443 25.9282 18.3775 28.2646 16.5975 30.9124C11.315 38.7754 10.0167 47.6819 13.9723 56.6364L13.9738 56.6398C20.5673 71.52 35.3266 75.8064 47.6558 72.0345C60.033 68.2479 70.1822 56.327 68.0491 39.1467C67.39 33.7954 65.5813 28.2624 61.1104 23.9041C60.4081 23.2195 59.44 22.8789 58.4637 22.973C57.4875 23.0671 56.6022 23.5864 56.0437 24.3926C55.5764 25.067 54.5127 26.367 53.2375 27.8699C53.0169 25.1951 52.4602 22.6218 51.5146 20.1375C49.4401 14.6873 45.6177 9.98911 40.0464 5.69357Z" fill="url(#bp_inactive_rad)"/>
                <path d="M36.8797 4.93359C38.0106 4.55743 39.2552 4.76748 40.1991 5.49512C45.7966 9.81093 49.653 14.5449 51.7479 20.0488C52.6315 22.3704 53.1778 24.7677 53.4305 27.25C54.5321 25.9429 55.4259 24.8445 55.8377 24.25C56.4381 23.3835 57.39 22.8259 58.4393 22.7246C59.4887 22.6234 60.53 22.9888 61.285 23.7246C65.8109 28.1365 67.6345 33.732 68.2977 39.1162C70.4468 56.4265 60.2127 68.4542 47.7293 72.2734C35.2978 76.0766 20.3971 71.7539 13.745 56.7412L13.744 56.7373C9.74994 47.6958 11.0655 38.6986 16.3905 30.7725C18.184 28.1046 20.3643 25.7549 22.4686 23.6875L22.4715 23.6846C23.1447 23.0246 23.8002 22.3921 24.4364 21.7793C29.1625 17.2263 32.7879 13.7285 34.5594 7.37109C34.8794 6.22327 35.7491 5.30984 36.8797 4.93359Z" stroke="url(#bp_inactive_s1)" strokeWidth="0.5"/>
                <path d="M36.8797 4.93359C38.0106 4.55743 39.2552 4.76748 40.1991 5.49512C45.7966 9.81093 49.653 14.5449 51.7479 20.0488C52.6315 22.3704 53.1778 24.7677 53.4305 27.25C54.5321 25.9429 55.4259 24.8445 55.8377 24.25C56.4381 23.3835 57.39 22.8259 58.4393 22.7246C59.4887 22.6234 60.53 22.9888 61.285 23.7246C65.8109 28.1365 67.6345 33.732 68.2977 39.1162C70.4468 56.4265 60.2127 68.4542 47.7293 72.2734C35.2978 76.0766 20.3971 71.7539 13.745 56.7412L13.744 56.7373C9.74994 47.6958 11.0655 38.6986 16.3905 30.7725C18.184 28.1046 20.3643 25.7549 22.4686 23.6875L22.4715 23.6846C23.1447 23.0246 23.8002 22.3921 24.4364 21.7793C29.1625 17.2263 32.7879 13.7285 34.5594 7.37109C34.8794 6.22327 35.7491 5.30984 36.8797 4.93359Z" stroke="url(#bp_inactive_s2)" strokeWidth="0.5"/>
              </g>
              <defs>
                <filter id="bf_inactive" x="11.1657" y="4.5" width="57.6684" height="70.327" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="1"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"/><feBlend mode="plus-lighter" in2="shape" result="effect1"/></filter>
                <linearGradient id="bp_inactive_lin" x1="39.9999" y1="5" x2="39.9999" y2="73.3278" gradientUnits="userSpaceOnUse"><stop stopColor="#252525"/><stop offset="1" stopColor="#252525" stopOpacity="0.2"/></linearGradient>
                <radialGradient id="bp_inactive_rad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(39.9999 5.8541) rotate(180) scale(28.334 43.9587)"><stop stopColor="#252525" stopOpacity="0.2"/><stop offset="1" stopColor="#252525" stopOpacity="0"/></radialGradient>
                <radialGradient id="bp_inactive_s1" cx="0" cy="0" r="1" gradientTransform="matrix(-2.26672 -37.1879 -17.8956 21.0792 30.2854 74.9146)" gradientUnits="userSpaceOnUse"><stop stopColor="#252525"/><stop offset="1" stopColor="#252525" stopOpacity="0"/></radialGradient>
                <radialGradient id="bp_inactive_s2" cx="0" cy="0" r="1" gradientTransform="matrix(2.10398 -34.5179 17.9954 21.1967 48.4192 73.6818)" gradientUnits="userSpaceOnUse"><stop stopColor="#252525"/><stop offset="1" stopColor="#252525" stopOpacity="0"/></radialGradient>
              </defs>
            </svg>
          ) : (
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <path d="M37.164 5.6c1.027-.343 2.159-.152 3.018.51 5.088 3.924 8.594 8.228 10.498 13.231.804 2.111 1.3 4.291 1.53 6.547 1-.188 1.813-2.187 2.187-2.727.546-.789 1.412-1.295 2.366-1.387.954-.091 1.9.242 2.587.91 4.115 4.011 5.773 9.098 6.375 13.993 1.954 15.736-7.35 26.671-18.698 30.143-11.302 3.458-24.848-.473-30.895-14.12l-.001-.004c-3.631-8.219-2.435-16.399 2.405-23.604 1.631-2.426 3.613-4.562 5.525-6.441l.003-.003c.612-.6 1.208-1.175 1.786-1.733 4.296-4.139 7.593-7.318 9.203-13.098.29-1.044 1.082-1.874 2.11-2.217Z" fill="#FB923C"/>
              <path d="M37.164 5.6c1.027-.343 2.159-.152 3.018.51 5.088 3.924 8.594 8.228 10.498 13.231.804 2.111 1.3 4.291 1.53 6.547 1-.188 1.813-2.187 2.187-2.727.546-.789 1.412-1.295 2.366-1.387.954-.091 1.9.242 2.587.91 4.115 4.011 5.773 9.098 6.375 13.993 1.954 15.736-7.35 26.671-18.698 30.143-11.302 3.458-24.848-.473-30.895-14.12l-.001-.004c-3.631-8.219-2.435-16.399 2.405-23.604 1.631-2.426 3.613-4.562 5.525-6.441l.003-.003c.612-.6 1.208-1.175 1.786-1.733 4.296-4.139 7.593-7.318 9.203-13.098.29-1.044 1.082-1.874 2.11-2.217Z" fill="url(#streak-fire-overlay)" style={{ mixBlendMode: "screen" }}/>
              <defs>
                <radialGradient id="streak-fire-overlay" cx="50%" cy="1.25%" r="64.33%" gradientUnits="objectBoundingBox"><stop stopColor="#F59E0B"/><stop offset="1" stopColor="rgba(245,158,11,0)"/></radialGradient>
              </defs>
            </svg>
          )}
        </div>

        {/* Streak count + description */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <span className={cn("text-5xl font-medium tracking-[-0.02em]", isBroken ? "text-foreground/50" : "text-[#E57100] dark:text-[#FB923C]")}>{streakCount} days</span>
          <div className="flex items-center gap-1">
            <span className={cn("text-sm", isBroken ? "text-foreground/50" : "text-page-text-subtle dark:text-[rgba(224,224,224,0.5)]")}>Submit a video every day to earn extra</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-foreground/[0.06] bg-white px-2 py-1 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
              <svg width="12" height="10" viewBox="0 0 11 10" fill="none"><path d="M5.937.431C5.66-.144 4.84-.144 4.564.431L3.384 2.89.663 3.246C.033 3.328-.23 4.108.24 4.55L2.227 6.425 1.729 9.1c-.119.636.554 1.107 1.11.807L5.25 8.607l2.413 1.3c.555.3 1.228-.17 1.11-.807L8.274 6.425l1.988-1.875c.47-.443.207-1.222-.394-1.305L7.118 2.89 5.937.431Z" fill={isBroken ? "rgba(224,224,224,0.2)" : "#FB923C"}/></svg>
              <span className="text-xs font-medium text-page-text">XP</span>
            </span>
          </div>
        </div>

        {/* Weekly calendar card */}
        <div className="relative z-10 flex w-full flex-col gap-4 rounded-2xl border border-foreground/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          {/* Week navigation */}
          <div className="flex items-center justify-between">
            <button onClick={() => setWeekOffset((o) => o - 1)} className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 9L4.5 6l3-3" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{formatWeekRange(weekOffset)}</span>
              {isCurrent && (
                <div className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-[#E57100] dark:bg-[#FB923C]" />
                  <span className="text-sm font-medium text-[#E57100] dark:text-[#FB923C]">Current</span>
                </div>
              )}
            </div>
            <button onClick={() => setWeekOffset((o) => o + 1)} className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          <div className="h-px w-full bg-foreground/[0.06] dark:bg-[rgba(224,224,224,0.03)]" />

          {/* Day labels */}
          <div className="flex justify-between">
            {weekDays.map((d, i) => (
              <div key={i} className="flex flex-1 items-center justify-center">
                <span className="text-xs font-medium text-foreground/40 dark:text-[rgba(224,224,224,0.4)]">{d.label}</span>
              </div>
            ))}
          </div>

          {/* Day circles */}
          <div className="flex justify-between gap-4">
            {weekDays.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex size-[52px] items-center justify-center rounded-full",
                    d.current
                      ? "border border-[#E57100] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[#FB923C] dark:bg-[rgba(224,224,224,0.03)]"
                      : d.future
                        ? "border border-dashed border-foreground/[0.12] bg-white dark:border-[rgba(224,224,224,0.08)] dark:bg-[rgba(224,224,224,0.03)]"
                        : "border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]"
                  )}
                >
                  <span className={cn(
                    "text-base font-medium",
                    d.current
                      ? "text-page-text dark:text-[#E0E0E0]"
                      : d.active
                        ? "text-[#E57100] dark:text-[#FB923C]"
                        : "text-page-text-subtle dark:text-[rgba(224,224,224,0.5)]"
                  )}>
                    {d.date}
                  </span>
                </div>
                {/* Fire icon */}
                <div className="flex items-center justify-center">
                  <svg width="14" height="14" viewBox="-0.5 -0.5 12.5 15" fill="none">
                    <path d="M5.815.142C5.635.003 5.398-.037 5.182.035 4.967.107 4.801.281 4.74.5 4.373 1.817 3.62 2.543 2.652 3.475c-.13.126-.265.255-.402.39C1.82 4.288 1.375 4.767 1.01 5.31c-1.082 1.61-1.348 3.435-.508 5.27C1.824 13.63 4.848 14.508 7.374 13.735c2.536-.776 4.616-3.218 4.178-6.739C11.418 5.9 11.047 4.766 10.131 3.873c-.144-.14-.342-.21-.542-.191-.2.02-.382.126-.497.291-.096.138-.314.405-.575.713-.046-.548-.16-1.075-.354-1.585C7.74 1.985 6.957 1.022 5.815.142Z" fill={d.active || d.current ? (isBroken ? "rgba(37,37,37,0.2)" : "#E57100") : "rgba(37,37,37,0.2)"} className="dark:hidden" />
                    <path d="M5.815.142C5.635.003 5.398-.037 5.182.035 4.967.107 4.801.281 4.74.5 4.373 1.817 3.62 2.543 2.652 3.475c-.13.126-.265.255-.402.39C1.82 4.288 1.375 4.767 1.01 5.31c-1.082 1.61-1.348 3.435-.508 5.27C1.824 13.63 4.848 14.508 7.374 13.735c2.536-.776 4.616-3.218 4.178-6.739C11.418 5.9 11.047 4.766 10.131 3.873c-.144-.14-.342-.21-.542-.191-.2.02-.382.126-.497.291-.096.138-.314.405-.575.713-.046-.548-.16-1.075-.354-1.585C7.74 1.985 6.957 1.022 5.815.142Z" fill={d.active || d.current ? "#FB923C" : "rgba(224,224,224,0.2)"} className="hidden dark:block" />
                  </svg>
                </div>
                {/* XP badge */}
                {d.xp && (
                  <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-foreground/[0.06] bg-white py-1 pl-1.5 pr-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                    <svg className="shrink-0" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6.437 1.431C6.16.856 5.34.856 5.064 1.431L3.884 3.89 1.163 4.246C.533 4.328.27 5.108.74 5.55L2.727 7.425 2.229 10.1c-.119.636.554 1.107 1.11.807L5.75 9.607l2.413 1.3c.555.3 1.228-.17 1.11-.807L8.774 7.425l1.988-1.875c.47-.443.207-1.222-.394-1.305L7.618 3.89 6.437 1.431Z" fill={isBroken ? "rgba(37,37,37,0.2)" : "#E57100"} className="dark:hidden"/><path d="M6.437 1.431C6.16.856 5.34.856 5.064 1.431L3.884 3.89 1.163 4.246C.533 4.328.27 5.108.74 5.55L2.727 7.425 2.229 10.1c-.119.636.554 1.107 1.11.807L5.75 9.607l2.413 1.3c.555.3 1.228-.17 1.11-.807L8.774 7.425l1.988-1.875c.47-.443.207-1.222-.394-1.305L7.618 3.89 6.437 1.431Z" fill={isBroken ? "rgba(224,224,224,0.2)" : "#FB923C"} className="hidden dark:block"/></svg>
                    <span className="text-xs font-medium leading-none tracking-[-0.02em] text-page-text">{d.xp}</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        <button
          onClick={onClose}
          className="flex h-10 w-full items-center justify-center rounded-full bg-foreground/[0.06] text-sm font-medium text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-[rgba(224,224,224,0.06)]"
        >
          Got it
        </button>
      </div>
    </Modal>
  );
}

// ── Recent Activity Modal ────────────────────────────────────────

const ACTIVITY_ROWS = Array.from({ length: 8 }, () => ({
  amount: "$20,000",
  status: "Withdrawn",
  sentTo: "Chase Bank",
  initiated: "Fri 13 Mar 2026, 1:21pm",
}));

function RecentActivityModal({ open, onClose, isDark }: { open: boolean; onClose: () => void; isDark: boolean }) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-[800px]" showClose={false}>
      <div className="relative flex items-center justify-center border-b border-foreground/[0.06] px-5 py-3 dark:border-[rgba(224,224,224,0.03)]">
        <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Recent activity</span>
        <button onClick={onClose} className="absolute right-4 top-3 flex size-4 items-center justify-center text-foreground/50">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M.762.762l9.333 9.333M10.095.762L.762 10.095" stroke="currentColor" strokeWidth="1.524" strokeLinecap="round"/></svg>
        </button>
      </div>

      <div className="flex flex-col p-4 sm:p-5">
        {/* Mobile list layout */}
        <div className="flex flex-col md:hidden">
          {/* Header row */}
          <div className="flex items-center border-b border-foreground/[0.06] pb-3 dark:border-[rgba(224,224,224,0.03)]">
            <span className="flex-1 text-xs font-medium tracking-[-0.02em] text-foreground/50">Amount</span>
            <span className="text-xs font-medium tracking-[-0.02em] text-foreground/50">Status</span>
          </div>
          {/* Rows */}
          {ACTIVITY_ROWS.map((row, i) => (
            <div key={i} className="flex items-center border-b border-foreground/[0.03] py-3 dark:border-[rgba(224,224,224,0.01)]">
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-xs font-medium tracking-[-0.02em] text-page-text">{row.amount}</span>
                <span className="text-xs font-medium tracking-[-0.02em] text-foreground/50">{row.initiated}</span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(0,153,77,0.08)] py-1.5 pl-1.5 pr-2 dark:bg-[rgba(52,211,153,0.08)]">
                <CheckCircleIcon color={isDark ? "#34D399" : "#00994D"} size={12} />
                <span className="text-xs font-medium text-[#00994D] dark:text-[#34D399]">{row.status}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden flex-col md:flex">
          <div className="flex items-center border-b border-foreground/[0.06] px-1">
            <div className="flex w-[128px] items-center p-3"><span className="text-xs font-medium tracking-[-0.02em] text-foreground/50">Amount</span></div>
            <div className="flex w-[96px] items-center py-3 pr-3"><span className="text-xs font-medium tracking-[-0.02em] text-foreground/50">Status</span></div>
            <div className="flex w-[128px] items-center p-3"><span className="text-xs font-medium tracking-[-0.02em] text-foreground/50">Sent to</span></div>
            <div className="flex items-center p-3"><span className="whitespace-nowrap text-xs font-medium tracking-[-0.02em] text-foreground/50">Initiated at</span></div>
            <div className="flex flex-1 items-center justify-end py-3 pr-5"><span className="text-xs font-medium leading-[120%] tracking-[-0.02em] text-foreground/50">Receipt</span></div>
          </div>
          {ACTIVITY_ROWS.map((row, i) => (
            <div key={i} className="flex items-center border-b border-foreground/[0.03] px-1 last:border-b-0">
              <div className="flex w-[128px] items-center p-3"><span className="text-xs font-medium tracking-[-0.02em] text-page-text">{row.amount}</span></div>
              <div className="flex w-[96px] items-center py-3 pr-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(0,153,77,0.08)] py-2 pl-1.5 pr-2 dark:bg-[rgba(52,211,153,0.08)]">
                  <CheckCircleIcon color={isDark ? "#34D399" : "#00994D"} size={12} />
                  <span className="text-xs font-medium tracking-[-0.02em] text-[#00994D] dark:text-[#34D399]">{row.status}</span>
                </span>
              </div>
              <div className="flex w-[128px] items-center p-3"><span className="text-xs font-medium tracking-[-0.02em] text-page-text">{row.sentTo}</span></div>
              <div className="flex items-center p-3"><span className="whitespace-nowrap text-xs font-medium leading-[120%] tracking-[-0.02em] text-foreground/50">{row.initiated}</span></div>
              <div className="flex flex-1 items-center justify-end py-3 pr-5">
                <button className="group flex items-center gap-1.5 text-xs font-medium leading-[120%] tracking-[-0.02em] text-foreground/50 transition-colors duration-150 hover:text-page-text">
                  Download
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" className="transition-all duration-200 ease-out group-hover:translate-x-0.5"><path d="M7.334.667l4 4-4 4M10.667 4.667H.667" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        <button
          onClick={onClose}
          className="flex h-10 w-full items-center justify-center rounded-full bg-foreground/[0.06] text-sm font-medium text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-white/[0.06]"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

// ── Submit Clip Modal ────────────────────────────────────────────

const submitCampaigns = [
  { name: "Flooz Clipping Campaign", detail: "CPM · $2.50 per 1K views" },
  { name: "Cantina - All formats", detail: "Retainer · $500/month" },
  { name: "Cantina - All formats", detail: "Per post · $100/video" },
];

function SubmitClipModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<"select" | "pick">("select");
  const [tab, setTab] = useState<"feed" | "link">("feed");

  const handleClose = () => { onClose(); setStep("select"); };

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <ModalHeader>Submit clip</ModalHeader>
      <ModalBody>
        {step === "select" ? (
          <div className="flex flex-col gap-3 p-5 tracking-[-0.02em]">
            <div className="flex items-center gap-1.5 pb-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 3l4.5 3.5L1 10V3Z" fill="rgba(37,37,37,0.5)"/><path d="M6.5 3l4.5 3.5L6.5 10V3Z" fill="rgba(37,37,37,0.5)"/></svg>
              <span className="text-xs font-medium tracking-[-0.02em] text-page-text-subtle">Select a campaign you want to submit to</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {submitCampaigns.map((c, i) => (
                <button key={i} onClick={() => setStep("pick")} className={cn(cardClass, "group flex items-center gap-3 px-3 py-3 transition-colors hover:bg-foreground/[0.02]")}>
                  <div className="size-9 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                  <div className="flex flex-1 flex-col gap-1.5 text-left">
                    <span className="text-xs font-medium tracking-[-0.02em] text-page-text">{c.name}</span>
                    <span className="text-xs tracking-[-0.02em] text-page-text-subtle">{c.detail}</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-foreground/50 transition-transform duration-200 ease-out group-hover:translate-x-0.5"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM4.625 3.125C4.41789 3.125 4.25 3.29289 4.25 3.5C4.25 3.70711 4.07711 3.875 3.875 3.875C3.66789 3.875 3.5 3.70711 3.5 3.5C3.5 2.87868 4.00368 2.375 4.625 2.375H5.15C5.82132 2.375 6.375 2.92868 6.375 3.6C6.375 4.05195 6.12524 4.46458 5.73047 4.67695L5.375 4.86829V5.125C5.375 5.33211 5.20711 5.5 5 5.5C4.79289 5.5 4.625 5.33211 4.625 5.125V4.625C4.625 4.48886 4.69886 4.36263 4.81797 4.29805L5.37523 4.00017C5.54755 3.90714 5.625 3.76005 5.625 3.6C5.625 3.34315 5.40685 3.125 5.15 3.125H4.625ZM5 6.875C5.20711 6.875 5.375 6.70711 5.375 6.5C5.375 6.29289 5.20711 6.125 5 6.125C4.79289 6.125 4.625 6.29289 4.625 6.5C4.625 6.70711 4.79289 6.875 5 6.875Z" fill="currentColor" fillOpacity="0.4"/></svg>
              <span className="text-xs font-medium tracking-[-0.02em] text-page-text-subtle">Don&apos;t see your campaign? <a href="/creator/discover" className="text-page-text hover:underline">Browse campaigns</a></span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6 p-5 tracking-[-0.02em]">
              <div className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 3l4.5 3.5L1 10V3Z" fill="rgba(37,37,37,0.5)"/><path d="M6.5 3l4.5 3.5L6.5 10V3Z" fill="rgba(37,37,37,0.5)"/></svg>
                <span className="text-xs font-medium tracking-[-0.02em] text-page-text-subtle">Submit a clip to Cantina - All formats · <button onClick={() => setStep("select")} className="underline">Change</button></span>
              </div>

              {/* Tab switcher */}
              <div className="flex rounded-xl bg-foreground/[0.06] p-0.5">
                <button onClick={() => setTab("feed")} className={cn("flex-1 rounded-[10px] px-4 py-2 text-sm font-medium transition-colors", tab === "feed" ? "bg-white text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)]" : "text-page-text-muted")}>From feed</button>
                <button onClick={() => setTab("link")} className={cn("flex-1 rounded-[10px] px-4 py-2 text-sm font-medium transition-colors", tab === "link" ? "bg-white text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)]" : "text-page-text-muted")}>Link</button>
              </div>

              {tab === "feed" ? (
                <div className={cn(cardClass, "flex flex-col gap-4 p-4")}>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-1 items-center gap-1.5 rounded-xl bg-foreground/[0.04] px-3 py-2.5">
                      <svg width="16" height="16" viewBox="0 0 15 17" fill="none"><path d="M14.528 6.845c-1.483 0-2.856-.472-3.977-1.272v5.821c0 2.912-2.362 5.273-5.276 5.273a5.26 5.26 0 0 1-2.937-.892A5.273 5.273 0 0 1 0 11.394c0-2.912 2.362-5.273 5.276-5.273.242 0 .484.017.724.05v2.916a2.425 2.425 0 0 0-.733-.113 2.413 2.413 0 0 0-2.413 2.413 2.42 2.42 0 0 0 1.327 2.154c.327.165.696.257 1.086.257 1.33 0 2.409-1.075 2.413-2.404V0h2.871v.367c.01.11.025.219.044.328a4.416 4.416 0 0 0 1.822 2.694c.633.395 1.365.604 2.112.603v2.853Z" fill="currentColor"/></svg>
                      <span className="text-sm text-page-text">@vladclips</span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="rgba(37,37,37,0.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="flex flex-1 items-center gap-1.5 rounded-xl bg-foreground/[0.04] px-3 py-2.5">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="rgba(37,37,37,0.5)" strokeWidth="1.5" fill="none"/><path d="M11 11l3 3" stroke="rgba(37,37,37,0.5)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      <span className="text-sm text-page-text-muted">Search by caption...</span>
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {[1, 2, 3].map((v) => (
                      <div key={v} className={cn(cardClass, "flex w-[140px] shrink-0 flex-col gap-3 p-1 pb-3 sm:w-[179px]")}>
                        <div className="h-[220px] w-full rounded-xl bg-cover bg-center sm:h-[280px]" style={{ backgroundImage: `linear-gradient(180deg, transparent 68%, rgba(0,0,0,0.4) 100%), url(/creator-home/campaign-thumb-${v}.png)` }} />
                        <div className="flex flex-col gap-1.5 px-2">
                          <span className="text-xs font-medium text-page-text">Cantina review clip</span>
                          <span className="text-xs text-page-text-subtle">2h ago · 12.4K views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={cn(cardClass, "flex flex-col gap-4 p-4")}>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-page-text-subtle">Video URLs (one per line)</span>
                    <div className="relative rounded-[14px] bg-foreground/[0.04]">
                      <textarea className="w-full resize-none bg-transparent px-3.5 py-3 text-sm text-page-text-muted outline-none" rows={5} placeholder="https://www.tiktok.com/@username/video..." />
                      <span className="absolute bottom-3.5 right-3.5 text-xs text-page-text-subtle">0/300</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Links 0", "Valid 0", "Invalid 0", "TikTok 0", "YouTube 0", "Instagram 0", "X 0"].map((s) => (
                      <span key={s} className="flex items-center gap-1 rounded-full border border-foreground/[0.06] px-2 py-1 text-xs font-medium text-page-text">
                        {s.split(" ")[0]} <span className="text-page-text">{s.split(" ")[1]}</span>
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 pt-2">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M6 11a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-.375-6.875a.375.375 0 0 0-.375.375.125.125 0 0 1-.25 0 .625.625 0 0 1 .625-.625h.525a.975.975 0 0 1 .6 1.725l-.355.298v.227a.125.125 0 0 1-.25 0v-.5a.25.25 0 0 1 .068-.182l.558-.472a.725.725 0 0 0-.446-1.096h-.525ZM6 7.875a.375.375 0 1 0 0-.75.375.375 0 0 0 0 .75Z" fill="rgba(37,37,37,0.5)"/></svg>
                    <span className="text-xs font-medium text-page-text-subtle">Paste up to 50 URLs</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 bg-white px-5 pb-5 dark:bg-card-bg">
              <button onClick={handleClose} className="rounded-full bg-foreground/[0.06] px-4 py-2.5 text-sm font-medium text-page-text">Cancel</button>
              <button className="rounded-full bg-page-text px-4 py-2.5 text-sm font-medium text-white opacity-40">Submit for review</button>
            </div>
          </>
        )}
      </ModalBody>
    </Modal>
  );
}
