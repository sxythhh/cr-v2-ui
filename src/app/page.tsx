"use client";

import { useState, useCallback, useRef, useEffect, type SVGProps } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { StarsLogo } from "@/components/sidebar/icons/stars-logo";
import { useInteractiveDemo, PLATFORM_DEMO } from "@/components/interactive-demo";
import { WorkspaceAvatar } from "@/components/sidebar/workspace-avatar";
import { cn } from "@/lib/utils";
import { NewCampaignButton } from "@/components/sidebar/new-campaign-dropdown";
import { UserDropdown } from "@/components/sidebar/user-dropdown";
import { RichButton } from "@/components/rich-button";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { Modal } from "@/components/ui/modal";
import { AnalyticsPocMobileCarousel } from "@/components/analytics-poc/AnalyticsPocMobileCarousel";
import { CreatorDetailsPopup, type CreatorDetailsData } from "@/components/creators/CreatorDetailsPopup";
// ── Icons ──────────────────────────────────────────────────────────

function OnboardingPersonIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" className={className}>
      <path d="M6.76107 0C4.69 0 3.01107 1.67893 3.01107 3.75C3.01107 5.82107 4.69 7.5 6.76107 7.5C8.83214 7.5 10.5111 5.82107 10.5111 3.75C10.5111 1.67893 8.83214 0 6.76107 0Z" fill="currentColor" fillOpacity="0.7" />
      <path d="M6.7623 8.33333C3.56905 8.33333 1.12512 10.2469 0.132775 12.93C-0.150917 13.6971 0.0433127 14.4532 0.494278 14.9906C0.933755 15.5144 1.61217 15.8333 2.343 15.8333H11.1816C11.9124 15.8333 12.5909 15.5144 13.0303 14.9906C13.4813 14.4532 13.6755 13.6971 13.3918 12.93C12.3995 10.2469 9.95555 8.33333 6.7623 8.33333Z" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

function OnboardingLinkIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="15" viewBox="0 0 18 15" fill="none" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M4.00634 4.55372C5.63353 2.92654 8.27172 2.92654 9.8989 4.55372L10.1849 4.83967C10.8651 5.5199 11.2617 6.37902 11.3728 7.2657C11.43 7.72237 11.1062 8.13895 10.6495 8.19615C10.1928 8.25336 9.77626 7.92954 9.71905 7.47287C9.6524 6.94077 9.41548 6.42732 9.00635 6.01819L8.72039 5.73223C7.74408 4.75592 6.16117 4.75592 5.18486 5.73223L2.3989 8.51819C1.42259 9.4945 1.42259 11.0774 2.3989 12.0537L2.68486 12.3397C3.66117 13.316 5.24408 13.316 6.22039 12.3397L6.36334 12.1967C6.68876 11.8713 7.2164 11.8712 7.54185 12.1967C7.8673 12.5221 7.86732 13.0497 7.54189 13.3752L7.39892 13.5182C5.77174 15.1453 3.13353 15.1454 1.50634 13.5182L1.22039 13.2322C-0.406795 11.605 -0.406798 8.96686 1.22039 7.33968L4.00634 4.55372Z" fill="currentColor" fillOpacity="0.7" />
      <path fillRule="evenodd" clipRule="evenodd" d="M9.83963 1.22039C11.4668 -0.406797 14.105 -0.406795 15.7322 1.22039L16.0181 1.50634C17.6453 3.13353 17.6453 5.77171 16.0181 7.3989L13.2322 10.1849C11.605 11.812 8.96681 11.812 7.33963 10.1849L7.05367 9.8989C6.37345 9.21867 5.97681 8.35955 5.86574 7.47287C5.80853 7.0162 6.13236 6.59962 6.58902 6.54241C7.04569 6.48521 7.46227 6.80903 7.51948 7.2657C7.58613 7.7978 7.82305 8.31125 8.23219 8.72039L8.51814 9.00634C9.49445 9.98265 11.0774 9.98265 12.0537 9.00634L14.8396 6.22039C15.8159 5.24408 15.8159 3.66117 14.8396 2.68485L14.5537 2.3989C13.5774 1.42262 11.9945 1.42259 11.0182 2.39882L10.8753 2.54179C10.5499 2.86727 10.0223 2.86734 9.69677 2.54195C9.37129 2.21655 9.37122 1.68892 9.69662 1.36344L9.83963 1.22039Z" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

function OnboardingMegaphoneIcon({ className }: { className?: string }) {
  return (
    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M10.9085 0.11952C12.5209 -0.393616 14.1667 0.809717 14.1667 2.50179V3.6607C15.6044 4.03074 16.6667 5.33582 16.6667 6.88902C16.6667 8.44222 15.6044 9.7473 14.1667 10.1173V11.2762C14.1667 12.9683 12.5209 14.1716 10.9085 13.6585L9.69942 13.2737C9.17404 14.4226 8.01467 15.2224 6.66667 15.2224C4.82572 15.2224 3.33333 13.73 3.33333 11.889V11.2399L1.74012 10.7316C0.703624 10.4009 0 9.43787 0 8.3499V5.42814C0 4.34017 0.703626 3.37711 1.74012 3.04642L3.81318 2.38501C3.85189 2.36674 3.89224 2.35136 3.93394 2.33915L10.9085 0.11952ZM5 11.7782V11.889C5 12.8095 5.74619 13.5557 6.66667 13.5557C7.26668 13.5557 7.79403 13.2383 8.08768 12.7608L5 11.7782ZM15 6.88902C15 7.50592 14.6648 8.04454 14.1667 8.33272V5.44532C14.6648 5.7335 15 6.27212 15 6.88902ZM3.33516 4.28696V9.49107L2.24671 9.1438C1.90121 9.03357 1.66667 8.71255 1.66667 8.3499V5.42814C1.66667 5.06548 1.90121 4.74446 2.24671 4.63423L3.33516 4.28696Z" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

function OnboardingStarIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" className={className}>
      <path d="M9.89545 0.718521C9.43523 -0.239505 8.06809 -0.239508 7.60786 0.71852L5.63944 4.81606L1.1055 5.40972C0.0543692 5.54735 -0.383309 6.84619 0.399327 7.58416L3.71258 10.7083L2.88108 15.1687C2.68366 16.2277 3.80481 17.0128 4.73106 16.5135L8.75166 14.3459L12.7723 16.5135C13.6985 17.0128 14.8197 16.2277 14.6222 15.1687L13.7907 10.7083L17.104 7.58416C17.8866 6.84619 17.4489 5.54735 16.3978 5.40972L11.8639 4.81606L9.89545 0.718521Z" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

function MobileNotificationIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12.7123 2 13.4014 2.10318 14.0537 2.29395C13.5902 2.79837 13.255 3.42248 13.0986 4.11426C12.7439 4.03951 12.3764 4 12 4C9.17193 4 6.84068 6.21751 6.69922 9.04199L6.53027 12.4209C6.50263 12.9738 6.36084 13.5156 6.11328 14.0107L5.11816 16H18.8818L17.8867 14.0107C17.6392 13.5156 17.4974 12.9738 17.4697 12.4209L17.3008 9.04199C17.2999 9.0237 17.297 9.00555 17.2959 8.9873C18.0124 8.93489 18.6761 8.69484 19.2383 8.31445C19.2664 8.52114 19.2882 8.73037 19.2988 8.94238L19.4678 12.3213C19.4816 12.5977 19.552 12.8686 19.6758 13.1162L20.8086 15.3818C20.9342 15.633 21 15.9106 21 16.1914C20.9998 17.1902 20.1902 17.9998 19.1914 18H16.8994C16.4361 20.2822 14.4189 22 12 22C9.58108 22 7.5639 20.2822 7.10059 18H4.80859C3.87216 17.9998 3.10243 17.288 3.00977 16.376L3 16.1914L3.01172 15.9814C3.03599 15.7733 3.0972 15.5703 3.19141 15.3818L4.32422 13.1162C4.448 12.8687 4.5184 12.5977 4.53223 12.3213L4.70117 8.94238C4.89571 5.05335 8.10608 2 12 2ZM9.17383 18C9.58594 19.1647 10.6941 20 12 20C13.3059 20 14.4141 19.1647 14.8262 18H9.17383Z" fill="#7B7B7B" />
      <circle cx="17" cy="5" r="3" fill="#EF4444" />
    </svg>
  );
}

function MobileSearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17 17L13.05 13.05M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.33333 0C3.73096 0 0 3.73096 0 8.33333C0 12.9357 3.73096 16.6667 8.33333 16.6667C12.9357 16.6667 16.6667 12.9357 16.6667 8.33333C16.6667 3.73096 12.9357 0 8.33333 0ZM11.3171 6.64577C11.5356 6.37862 11.4963 5.98486 11.2291 5.76628C10.962 5.5477 10.5682 5.58707 10.3496 5.85423L7.03693 9.90305L5.85861 8.72472C5.61453 8.48065 5.2188 8.48065 4.97472 8.72472C4.73065 8.9688 4.73065 9.36453 4.97472 9.60861L6.64139 11.2753C6.76625 11.4001 6.93811 11.4664 7.11447 11.4576C7.29083 11.4488 7.45524 11.3658 7.56706 11.2291L11.3171 6.64577Z" fill="currentColor"/>
    </svg>
  );
}

function PersonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6.76107 0C4.69 0 3.01107 1.67893 3.01107 3.75C3.01107 5.82107 4.69 7.5 6.76107 7.5C8.83214 7.5 10.5111 5.82107 10.5111 3.75C10.5111 1.67893 8.83214 0 6.76107 0Z" fill="currentColor"/>
      <path d="M6.7623 8.33333C3.56905 8.33333 1.12512 10.2469 0.132775 12.93C-0.150917 13.6971 0.0433127 14.4532 0.494278 14.9906C0.933755 15.5144 1.61217 15.8333 2.343 15.8333H11.1816C11.9124 15.8333 12.5909 15.5144 13.0303 14.9906C13.4813 14.4532 13.6755 13.6971 13.3918 12.93C12.3995 10.2469 9.95555 8.33333 6.7623 8.33333Z" fill="currentColor"/>
    </svg>
  );
}

function ChainLinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M4.00634 4.55372C5.63353 2.92654 8.27172 2.92654 9.8989 4.55372L10.1849 4.83967C10.8651 5.5199 11.2617 6.37902 11.3728 7.2657C11.43 7.72237 11.1062 8.13895 10.6495 8.19615C10.1928 8.25336 9.77626 7.92954 9.71905 7.47287C9.6524 6.94077 9.41548 6.42732 9.00635 6.01819L8.72039 5.73223C7.74408 4.75592 6.16117 4.75592 5.18486 5.73223L2.3989 8.51819C1.42259 9.4945 1.42259 11.0774 2.3989 12.0537L2.68486 12.3397C3.66117 13.316 5.24408 13.316 6.22039 12.3397L6.36334 12.1967C6.68876 11.8713 7.2164 11.8712 7.54185 12.1967C7.8673 12.5221 7.86732 13.0497 7.54189 13.3752L7.39892 13.5182C5.77174 15.1453 3.13353 15.1454 1.50634 13.5182L1.22039 13.2322C-0.406795 11.605 -0.406798 8.96686 1.22039 7.33968L4.00634 4.55372Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M9.83963 1.22039C11.4668 -0.406797 14.105 -0.406795 15.7322 1.22039L16.0181 1.50634C17.6453 3.13353 17.6453 5.77171 16.0181 7.3989L13.2322 10.1849C11.605 11.812 8.96681 11.812 7.33963 10.1849L7.05367 9.8989C6.37345 9.21867 5.97681 8.35955 5.86574 7.47287C5.80853 7.0162 6.13236 6.59962 6.58902 6.54241C7.04569 6.48521 7.46227 6.80903 7.51948 7.2657C7.58613 7.7978 7.82305 8.31125 8.23219 8.72039L8.51814 9.00634C9.49445 9.98265 11.0774 9.98265 12.0537 9.00634L14.8396 6.22039C15.8159 5.24408 15.8159 3.66117 14.8396 2.68485L14.5537 2.3989C13.5774 1.42262 11.9945 1.42259 11.0182 2.39882C11.0182 2.39885 11.0182 2.3988 11.0182 2.39882L10.8753 2.54179C10.5499 2.86727 10.0223 2.86734 9.69677 2.54195C9.37129 2.21655 9.37122 1.68892 9.69662 1.36344L9.83963 1.22039Z" fill="currentColor"/>
    </svg>
  );
}

function MegaphoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M10.9085 0.11952C12.5209 -0.393616 14.1667 0.809717 14.1667 2.50179V3.6607C15.6044 4.03074 16.6667 5.33582 16.6667 6.88902C16.6667 8.44222 15.6044 9.7473 14.1667 10.1173V11.2762C14.1667 12.9683 12.5209 14.1716 10.9085 13.6585L9.69942 13.2737C9.17404 14.4226 8.01467 15.2224 6.66667 15.2224C4.82572 15.2224 3.33333 13.73 3.33333 11.889V11.2399L1.74012 10.7316C0.703624 10.4009 0 9.43787 0 8.3499V5.42814C0 4.34017 0.703626 3.37711 1.74012 3.04642L3.81318 2.38501C3.85189 2.36674 3.89224 2.35136 3.93394 2.33915L10.9085 0.11952ZM5 11.7782V11.889C5 12.8095 5.74619 13.5557 6.66667 13.5557C7.26668 13.5557 7.79403 13.2383 8.08768 12.7608L5 11.7782ZM15 6.88902C15 7.50592 14.6648 8.04454 14.1667 8.33272V5.44532C14.6648 5.7335 15 6.27212 15 6.88902ZM3.33516 4.28696V9.49107L2.24671 9.1438C1.90121 9.03357 1.66667 8.71255 1.66667 8.3499V5.42814C1.66667 5.06548 1.90121 4.74446 2.24671 4.63423L3.33516 4.28696Z" fill="currentColor"/>
    </svg>
  );
}

function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M9.89545 0.718521C9.43523 -0.239505 8.06809 -0.239508 7.60786 0.71852L5.63944 4.81606L1.1055 5.40972C0.0543692 5.54735 -0.383309 6.84619 0.399327 7.58416L3.71258 10.7083L2.88108 15.1687C2.68366 16.2277 3.80481 17.0128 4.73106 16.5135L8.75166 14.3459L12.7723 16.5135C13.6985 17.0128 14.8197 16.2277 14.6222 15.1687L13.7907 10.7083L17.104 7.58416C17.8866 6.84619 17.4489 5.54735 16.3978 5.40972L11.8639 4.81606L9.89545 0.718521Z" fill="currentColor"/>
    </svg>
  );
}

function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8 1.333L9.79 6.21 14.667 8 9.79 9.79 8 14.667 6.21 9.79 1.333 8 6.21 6.21 8 1.333z" fill="currentColor"/>
    </svg>
  );
}

function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10.276 2.668L5.724 8l4.552 5.332" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5.724 2.668L10.276 8l-4.552 5.332" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7.33329 0.666016L11.3333 4.666L7.33329 8.66602M10.6666 4.666H0.666626" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8 2.667v10.666M2.667 8h10.666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function HistoryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2 3.333V6h2.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M2.34 10A6 6 0 1 0 2 8" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" fill="none"/>
      <path d="M8 5.333V8l2 1.333" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function VideoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M1 0.5C1 0.223858 1.22386 0 1.5 0H8.5C8.77614 0 9 0.223858 9 0.5C9 0.776142 8.77614 1 8.5 1H1.5C1.22386 1 1 0.776142 1 0.5ZM0 3C0 2.17157 0.671573 1.5 1.5 1.5H8.5C9.32843 1.5 10 2.17157 10 3V7.5C10 8.32843 9.32843 9 8.5 9H1.5C0.671573 9 0 8.32843 0 7.5V3ZM4.28341 3.79935C4.45664 3.71609 4.66226 3.7395 4.81235 3.85957L6.06235 4.85957C6.18095 4.95445 6.25 5.09811 6.25 5.25C6.25 5.40189 6.18095 5.54555 6.06235 5.64043L4.81235 6.64043C4.66226 6.7605 4.45664 6.78391 4.28341 6.70065C4.11017 6.61739 4 6.4422 4 6.25V4.25C4 4.0578 4.11017 3.88261 4.28341 3.79935Z" fill="currentColor"/>
    </svg>
  );
}

function UserAddIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4.17578 0C2.93314 0 1.92578 1.00736 1.92578 2.25C1.92578 3.49264 2.93314 4.5 4.17578 4.5C5.41842 4.5 6.42578 3.49264 6.42578 2.25C6.42578 1.00736 5.41842 0 4.17578 0Z" fill="currentColor"/>
      <path d="M7.17578 6C7.45192 6 7.67578 6.22386 7.67578 6.5V7.5H8.67578C8.95192 7.5 9.17578 7.72386 9.17578 8C9.17578 8.27614 8.95192 8.5 8.67578 8.5H7.67578V9.5C7.67578 9.77614 7.45192 10 7.17578 10C6.89964 10 6.67578 9.77614 6.67578 9.5V8.5H5.67578C5.39964 8.5 5.17578 8.27614 5.17578 8C5.17578 7.72386 5.39964 7.5 5.67578 7.5H6.67578V6.5C6.67578 6.22386 6.89964 6 7.17578 6Z" fill="currentColor"/>
      <path d="M0.0242348 8.34822C0.452672 6.44183 2.02669 5 4.17629 5C4.89216 5 5.5442 5.15991 6.11134 5.44363C5.84241 5.71473 5.67627 6.08796 5.67627 6.5C4.84784 6.5 4.17627 7.17157 4.17627 8C4.17627 8.82843 4.84784 9.5 5.67627 9.5H0.9755C0.407924 9.5 -0.120653 8.99292 0.0242348 8.34822Z" fill="currentColor"/>
    </svg>
  );
}

function ThumbUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5.55904 0.0118772C5.34084 -0.0410324 5.1252 0.0880534 5.03864 0.295224C4.5 2.23792 3 3.26542 3 4.62287V7.85053C3 8.42375 3.33181 8.98816 3.9178 9.20155C5.24322 9.68419 6.11676 9.7824 7.47978 9.66428C8.5252 9.57368 9.31106 8.77216 9.52885 7.8042L9.95122 5.92697C10.2326 4.67657 9.28167 3.48795 8 3.48795L6.5 3.48792C6.73464 2.08008 7.30751 0.435851 5.55904 0.0118772Z" fill="currentColor"/>
      <path d="M0 4.48792C0 4.0737 0.335787 3.73792 0.75 3.73792H1.75C2.16421 3.73792 2.5 4.0737 2.5 4.48792V8.48792C2.5 8.90213 2.16421 9.23792 1.75 9.23792H0.75C0.335787 9.23792 0 8.90213 0 8.48792V4.48792Z" fill="currentColor"/>
    </svg>
  );
}

function DollarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5C10 7.76142 7.76142 10 5 10C2.23858 10 0 7.76142 0 5ZM5 1.75C5.27614 1.75 5.5 1.97386 5.5 2.25V2.56183C5.90202 2.66355 6.25675 2.88729 6.48795 3.20702C6.64975 3.4308 6.59952 3.74337 6.37575 3.90517C6.15198 4.06698 5.83941 4.01675 5.6776 3.79298C5.56897 3.64274 5.32671 3.5 5 3.5H4.86111C4.41372 3.5 4.25 3.77246 4.25 3.88889V3.92705C4.25 4.02568 4.32456 4.19131 4.57627 4.29199L5.79512 4.77953C6.32859 4.99292 6.75 5.4693 6.75 6.07295C6.75 6.80947 6.1615 7.3072 5.5 7.45453V7.75C5.5 8.02614 5.27614 8.25 5 8.25C4.72386 8.25 4.5 8.02614 4.5 7.75V7.43817C4.09798 7.33645 3.74325 7.11271 3.51205 6.79298C3.35025 6.56921 3.40048 6.25663 3.62425 6.09483C3.84802 5.93302 4.1606 5.98325 4.3224 6.20703C4.43103 6.35726 4.67329 6.5 5 6.5H5.09119C5.56492 6.5 5.75 6.21045 5.75 6.07295C5.75 5.97432 5.67544 5.80869 5.42373 5.70801L4.20488 5.22047C3.67141 5.00708 3.25 4.5307 3.25 3.92705V3.88889C3.25 3.15689 3.84468 2.66952 4.5 2.53666V2.25C4.5 1.97386 4.72386 1.75 5 1.75Z" fill="currentColor"/>
    </svg>
  );
}

function MegaphoneSmallIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.19674 0.0478081C7.8417 -0.157446 8.5 0.323887 8.5 1.00072V2.37989C9.36261 2.60191 10 3.38496 10 4.31688C10 5.2488 9.36261 6.03185 8.5 6.25388V7.63305C8.5 8.30988 7.8417 8.79122 7.19674 8.58596L5.81965 8.14771C5.50442 8.83703 4.8088 9.31688 4 9.31688C2.89543 9.31688 2 8.42145 2 7.31688V6.92743L0.696048 6.51141C0.28145 6.37913 0 5.99391 0 5.55872V3.07505C0 2.63986 0.28145 2.25464 0.696048 2.12236L2.28791 1.61448C2.31115 1.60351 2.33537 1.59428 2.3604 1.58695L7.19674 0.0478081ZM3 7.25037V7.31688C3 7.86917 3.44772 8.31688 4 8.31688C4.36001 8.31688 4.67642 8.12645 4.85261 7.83995L3 7.25037ZM9 4.31688C9 4.68702 8.7989 5.0102 8.5 5.1831V3.45067C8.7989 3.62357 9 3.94674 9 4.31688ZM2.0011 2.75565V5.87812L1 5.55872V3.07505L2.0011 2.75565Z" fill="currentColor"/>
    </svg>
  );
}

function CrownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7.88806 0.296867C7.76441 0.111401 7.55626 0 7.33336 0C7.11045 0 6.9023 0.111401 6.77866 0.296867L4.43844 3.80719L0.964832 2.07038C0.73623 1.95608 0.462404 1.98254 0.259911 2.13849C0.0574187 2.29443 -0.0380915 2.55242 0.014036 2.80264L1.45958 9.74124C1.6528 10.6687 2.47019 11.3333 3.41754 11.3333H11.2492C12.1965 11.3333 13.0139 10.6687 13.2071 9.74124L14.6527 2.80264C14.7048 2.55242 14.6093 2.29443 14.4068 2.13849C14.2043 1.98254 13.9305 1.95608 13.7019 2.07038L10.2283 3.80719L7.88806 0.296867Z" fill="currentColor"/>
    </svg>
  );
}

function RobotIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2C10.895 2 10 2.895 10 4H8C6.895 4 6 4.895 6 6V10C6 13.314 8.686 16 12 16C15.314 16 18 13.314 18 10V6C18 4.895 17.105 4 16 4H14C14 2.895 13.105 2 12 2ZM9.5 8C10.328 8 11 8.672 11 9.5C11 10.328 10.328 11 9.5 11C8.672 11 8 10.328 8 9.5C8 8.672 8.672 8 9.5 8ZM14.5 8C15.328 8 16 8.672 16 9.5C16 10.328 15.328 11 14.5 11C13.672 11 13 10.328 13 9.5C13 8.672 13.672 8 14.5 8ZM6 17C4.343 17 3 18.343 3 20V22H21V20C21 18.343 19.657 17 18 17H6Z" fill="url(#robotGrad)"/>
      <defs>
        <linearGradient id="robotGrad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF3FD5"/>
          <stop offset="1" stopColor="#FF9025"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Onboarding Steps ───────────────────────────────────────────────

const STEPS = [
  {
    key: "account",
    title: "Create agency account",
    description: "You're all set!",
    completed: true,
    icon: null,
  },
  {
    key: "profile",
    title: "Complete your agency profile",
    description: "Add logo, description, team members and portfolio",
    completed: false,
    icon: OnboardingPersonIcon,
    action: "Complete profile",
  },
  {
    key: "brand",
    title: "Add your first brand client",
    description: "Connect a brand to start managing their campaigns",
    completed: false,
    icon: OnboardingLinkIcon,
    action: "Add clients",
  },
  {
    key: "campaign",
    title: "Launch first campaign",
    description: "Create a CPM, retainer, or per-video campaign for your brand",
    completed: false,
    icon: OnboardingMegaphoneIcon,
    action: "Launch campaign",
  },
  {
    key: "recruit",
    title: "Recruit creators",
    description: "Upload content and start earning",
    completed: false,
    icon: OnboardingStarIcon,
    action: "Recruit",
  },
];

// ── Dashboard Data ─────────────────────────────────────────────────

const CAMPAIGNS = [
  { id: 1, name: "Call of Duty BO7 Clipping", meta: "CPM · 121k views · 31 creators", pct: 45, color: "#34D399" },
  { id: 2, name: "Caffeine AI Exclusive", meta: "CPM · 121k views · 31 creators", pct: 78, color: "#FB923C" },
  { id: 3, name: "G Fuel Summer Promo", meta: "CPM · 121k views · 31 creators", pct: 94, color: "#FB7185" },
  { id: 4, name: "Apex Legends Season 20", meta: "CPM · 121k views · 31 creators", pct: 78, color: "#FB923C" },
  { id: 1, name: "Fortnite Festival Clips", meta: "CPM · 121k views · 31 creators", pct: 45, color: "#34D399" },
];

function AttentionVideoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M1.6 0.8C1.6 0.358 1.958 0 2.4 0H13.6C14.042 0 14.4 0.358 14.4 0.8C14.4 1.242 14.042 1.6 13.6 1.6H2.4C1.958 1.6 1.6 1.242 1.6 0.8ZM0 4.8C0 3.474 1.074 2.4 2.4 2.4H13.6C14.926 2.4 16 3.474 16 4.8V12C16 13.326 14.926 14.4 13.6 14.4H2.4C1.074 14.4 0 13.326 0 12V4.8ZM6.853 6.079C7.131 5.946 7.46 5.983 7.7 6.175L9.7 7.775C9.89 7.927 10 8.158 10 8.4C10 8.642 9.89 8.873 9.7 9.025L7.7 10.625C7.46 10.817 7.131 10.854 6.853 10.721C6.576 10.588 6.4 10.307 6.4 10V6.8C6.4 6.493 6.576 6.212 6.853 6.079Z" fill="#FF9025"/>
    </svg>
  );
}

function AttentionUserAddIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6.68 0C4.69 0 3.08 1.61 3.08 3.6C3.08 5.59 4.69 7.2 6.68 7.2C8.67 7.2 10.28 5.59 10.28 3.6C10.28 1.61 8.67 0 6.68 0Z" fill="#AE4EEE"/>
      <path d="M11.48 9.6C11.92 9.6 12.28 9.96 12.28 10.4V12H13.88C14.32 12 14.68 12.36 14.68 12.8C14.68 13.24 14.32 13.6 13.88 13.6H12.28V15.2C12.28 15.64 11.92 16 11.48 16C11.04 16 10.68 15.64 10.68 15.2V13.6H9.08C8.64 13.6 8.28 13.24 8.28 12.8C8.28 12.36 8.64 12 9.08 12H10.68V10.4C10.68 9.96 11.04 9.6 11.48 9.6Z" fill="#AE4EEE"/>
      <path d="M0.04 13.36C0.72 10.31 3.24 8 6.68 8C7.83 8 8.87 8.26 9.78 8.71C9.35 9.14 9.08 9.74 9.08 10.4C7.76 10.4 6.68 11.47 6.68 12.8C6.68 14.13 7.76 15.2 9.08 15.2H1.56C0.65 15.2 -0.19 14.39 0.04 13.36Z" fill="#AE4EEE"/>
    </svg>
  );
}

function AttentionContractIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
      <path d="M2 0C0.895431 0 0 0.89543 0 2V11.3333C0 12.4379 0.895431 13.3333 2 13.3333H7.44714C7.37344 13.1248 7.33333 12.9004 7.33333 12.6667C6.22876 12.6667 5.33333 11.7712 5.33333 10.6667C5.33333 9.5621 6.22876 8.66667 7.33333 8.66667C7.33333 7.5621 8.22876 6.66667 9.33333 6.66667C9.84557 6.66667 10.3128 6.85924 10.6667 7.17593V2C10.6667 0.895431 9.77124 0 8.66667 0H2Z" fill="#00B259"/>
      <path d="M10 8.66667C10 8.29848 9.70152 8 9.33333 8C8.96514 8 8.66667 8.29848 8.66667 8.66667V10H7.33333C6.96514 10 6.66667 10.2985 6.66667 10.6667C6.66667 11.0349 6.96514 11.3333 7.33333 11.3333H8.66667V12.6667C8.66667 13.0349 8.96514 13.3333 9.33333 13.3333C9.70152 13.3333 10 13.0349 10 12.6667V11.3333H11.3333C11.7015 11.3333 12 11.0349 12 10.6667C12 10.2985 11.7015 10 11.3333 10H10V8.66667Z" fill="#00B259"/>
    </svg>
  );
}

function AttentionWarningIcon() {
  return (
    <svg width="14" height="13" viewBox="0 0 14 13" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M4.95407 0.992259C5.72583 -0.330751 7.63743 -0.330754 8.40919 0.992257L13.0878 9.01275C13.8656 10.3461 12.9038 12.0205 11.3602 12.0205H2.00301C0.459432 12.0205 -0.502312 10.3461 0.275454 9.01275L4.95407 0.992259ZM6.68229 4.02051C7.05048 4.02051 7.34896 4.31898 7.34896 4.68717V6.68717C7.34896 7.05536 7.05048 7.35384 6.68229 7.35384C6.3141 7.35384 6.01562 7.05536 6.01562 6.68717V4.68717C6.01562 4.31898 6.3141 4.02051 6.68229 4.02051ZM5.84896 8.68717C5.84896 8.22694 6.22205 7.85384 6.68229 7.85384C7.14253 7.85384 7.51562 8.22694 7.51562 8.68717C7.51562 9.14741 7.14253 9.52051 6.68229 9.52051C6.22205 9.52051 5.84896 9.14741 5.84896 8.68717Z" fill="#EE4E51"/>
    </svg>
  );
}

const ATTENTION_ITEMS = [
  { icon: AttentionVideoIcon, iconBg: "rgba(255,144,37,0.06)", title: "24 submissions", subtitle: "Awaiting review", href: "/submissions" },
  { icon: AttentionUserAddIcon, iconBg: "rgba(174,78,238,0.06)", title: "2 applications", subtitle: "Awaiting review", href: "/applications" },
  { icon: AttentionContractIcon, iconBg: "rgba(0,178,89,0.04)", title: "1 contract pending", subtitle: "Awaiting review", href: "/contracts" },
  { icon: AttentionWarningIcon, iconBg: "rgba(238,78,81,0.06)", title: "2 budget warnings", subtitle: "G Fuel critical, Caffeine AI low", href: "/finances" },
];

const ACTIVITY_ITEMS = [
  { icon: UserAddIcon, title: "New clipper", subtitle: "Clip_Nova_23 joined", time: "2h ago" },
  { icon: ThumbUpIcon, title: "Clips approved", subtitle: "3 clips from NightOwlEdits", time: "4h ago" },
  { icon: DollarIcon, title: "Earnings credited", subtitle: "+ $42.50 from approved clips", time: "4h ago" },
  { icon: MegaphoneSmallIcon, title: "Campaign joined", subtitle: "Referral joined 'Spring Clips 2026'", time: "8h ago" },
  { icon: UserAddIcon, title: "New clipper", subtitle: "edit_wizard_99 joined", time: "1d ago" },
];

const TOP_CREATORS = [
  { name: "ClipMaster_Jay", earned: "$4,280" },
  { name: "NightOwlEdits", earned: "$4,280" },
  { name: "Clip_Nova_23", earned: "$4,280" },
];

const ACTIVE_CAMPAIGNS_DATA = [
  { name: "Call of Duty BO7 Clipping", subtitle: "CPM · 121k views · 31 creators", progress: 45, progressColor: "#34D399", slug: "call-of-duty-bo7" },
  { name: "Caffeine AI Launch", subtitle: "CPM · 89k views · 18 creators", progress: 78, progressColor: "#FB923C", slug: "caffeine-ai-launch" },
  { name: "G Fuel Summer Push", subtitle: "CPM · 204k views · 52 creators", progress: 94, progressColor: "#FB7185", slug: "g-fuel-summer-push" },
];

// ── Sparkline ──────────────────────────────────────────────────────

let sparklineIdCounter = 0;
function MiniSparkline({ color = "#34D399" }: { color?: string }) {
  const [gradId] = useState(() => `spark-grad-${++sparklineIdCounter}`);
  return (
    <svg width="75" height="21" viewBox="0 0 75 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <defs>
        <linearGradient id={gradId} x1="37.037" y1="0" x2="37.037" y2="20.3704" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} stopOpacity="0.2"/>
          <stop offset="1" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d="M0.823045 19.7398L0 20.3704L74.0741 16.5286L73.251 13.7963L73.251 13.7962C72.4279 11.0639 70.7819 5.59932 69.1358 2.72906C67.4897 -0.141227 65.8436 -0.417165 64.1975 0.40033C62.5514 1.21783 60.9053 3.12875 59.2593 4.81876C57.6132 6.50877 55.9671 7.97785 54.321 7.99406C52.6749 8.01028 51.0288 6.57362 49.3827 6.5874C47.7366 6.60119 46.0905 8.06542 44.4444 9.54757L44.3656 9.61859C42.7458 11.0774 41.126 12.5361 39.5062 12.9249C37.8601 13.32 36.214 12.61 34.5679 12.7767C32.9218 12.9435 31.2757 13.9868 29.6296 12.4432C27.9835 10.8995 26.3375 6.76874 24.6914 5.1633C23.0453 3.55785 21.3992 4.47771 19.7531 4.50747C18.107 4.53724 16.4609 3.67691 14.8148 2.68805C13.1687 1.69919 11.5226 0.581794 9.87654 2.87689C8.23045 5.17199 6.58436 10.8796 4.93827 14.3639C3.29218 17.8482 1.64609 19.1093 0.823045 19.7398Z" fill={`url(#${gradId})`}/>
      <path d="M0.274902 20.0888L1.09795 19.4813C1.92099 18.8738 3.56708 17.6588 5.21317 14.3019C6.85926 10.9449 8.50535 5.44586 10.1514 3.23464C11.7975 1.02342 13.4436 2.09998 15.0897 3.05271C16.7358 4.00543 18.3819 4.83431 20.028 4.80564C21.6741 4.77696 23.3202 3.89072 24.9663 5.43749C26.6123 6.98426 28.2584 10.964 29.9045 12.4513C31.5506 13.9386 33.1967 12.9333 34.8428 12.7727C36.4889 12.6121 38.135 13.2961 39.7811 12.9154C41.4272 12.5348 43.0733 11.0895 44.7193 9.66154C46.3654 8.23355 48.0115 6.82283 49.6576 6.80955C51.3037 6.79627 52.9498 8.18043 54.5959 8.1648C56.242 8.14918 57.8881 6.73379 59.5342 5.10555C61.1802 3.4773 62.8263 1.63621 64.4724 0.848591C66.1185 0.0609715 67.7646 0.326825 69.4107 3.09222C71.0568 5.85761 72.7029 11.1225 73.5259 13.755L74.349 16.3875" stroke={color} strokeWidth="0.925926"/>
    </svg>
  );
}

// ── Progress bar ───────────────────────────────────────────────────

function BudgetBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-1 w-20 rounded-full bg-foreground/10">
        <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-inter text-xs tracking-[-0.02em]" style={{ color }}>{pct}%</span>
    </div>
  );
}

// ── Onboarding Step Row ────────────────────────────────────────────

function OnboardingStepRow({
  step,
  isComplete,
  onToggle,
  isFirst,
  isLast,
  prevComplete,
  nextComplete,
}: {
  step: typeof STEPS[number];
  isComplete: boolean;
  onToggle: () => void;
  isFirst: boolean;
  isLast: boolean;
  prevComplete: boolean;
  nextComplete: boolean;
}) {
  return (
    <div className="relative flex w-full gap-3">
      {/* Vertical connector line + icon column */}
      <div className="relative flex w-10 shrink-0 flex-col items-center">
        {/* Top connector */}
        {!isFirst && (
          <div
            className="absolute left-1/2 top-0 h-[calc(50%-20px)] w-px -translate-x-1/2 transition-colors duration-500"
            style={{
              background: prevComplete && isComplete ? "#00B36E" : "rgba(0,0,0,0.03)",
            }}
          />
        )}
        {/* Bottom connector */}
        {!isLast && (
          <div
            className="absolute bottom-0 left-1/2 h-[calc(50%-20px)] w-px -translate-x-1/2 transition-colors duration-500"
            style={{
              background: isComplete && nextComplete ? "#00B36E" : "rgba(0,0,0,0.03)",
            }}
          />
        )}
        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center self-center py-3">
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="done"
                className="flex size-10 items-center justify-center rounded-full bg-[#00B36E] shadow-[0px_0px_0px_2px_var(--card-bg)]"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25, mass: 0.8 }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 600, damping: 20, delay: 0.1 }}
                >
                  <CheckCircleIcon className="size-[17px] text-white" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="pending"
                className="flex size-10 items-center justify-center rounded-full border border-page-border bg-card-bg shadow-[0px_0px_0px_2px_var(--card-bg)]"
                initial={false}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {step.icon && <step.icon className="text-page-text-subtle" />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center gap-3 py-3">
        <motion.div
          className="flex flex-1 flex-col justify-center gap-1"
          animate={{
            opacity: isComplete ? 0.45 : 1,
          }}
          transition={{ duration: 0.4 }}
        >
          <span className="relative w-fit text-sm font-medium tracking-[-0.02em] text-page-text">
            {step.title}
            {/* Strikethrough line animation */}
            <motion.span
              className="absolute left-0 top-1/2 h-px origin-left bg-page-text/40"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isComplete ? 1 : 0 }}
              style={{ width: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: isComplete ? 0.15 : 0 }}
            />
          </span>
          <span className="text-sm leading-[150%] tracking-[-0.02em] text-page-text-subtle">{step.description}</span>
        </motion.div>
        {step.action && (
          <AnimatePresence>
            {!isComplete && (
              <motion.button
                onClick={onToggle}
                className="cursor-pointer whitespace-nowrap rounded-full bg-[rgba(37,37,37,0.06)] px-4 py-2 text-sm font-medium tracking-[-0.02em] text-page-text transition-colors duration-150 hover:bg-[rgba(37,37,37,0.12)] active:bg-[rgba(37,37,37,0.16)] dark:bg-[rgba(255,255,255,0.06)] dark:hover:bg-[rgba(255,255,255,0.12)] dark:active:bg-[rgba(255,255,255,0.16)]"
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              >
                {step.action}
              </motion.button>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ── Floating Onboarding Checklist ──────────────────────────────────

function FloatingChecklist({
  completed,
  onToggle,
}: {
  completed: Record<string, boolean>;
  onToggle: (key: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const completedCount = STEPS.filter((s) => s.completed || completed[s.key]).length;
  const progress = completedCount / STEPS.length;

  return (
    <motion.div
      className="fixed bottom-5 right-5 z-50 w-[calc(100%-40px)] max-w-[340px] overflow-hidden rounded-2xl border border-page-border bg-card-bg shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:w-[340px]"
      initial={{ y: 80, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.3 }}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full cursor-pointer items-center gap-3 border-b border-page-border/50 px-4 py-3"
      >
        <div
          className="flex size-8 items-center justify-center rounded-full"
          style={{
            background: "#FF9025",
            boxShadow: "inset 0px 0.5px 2px rgba(0,0,0,0.12)",
          }}
        >
          <StarsLogo className="size-4 text-white" />
        </div>
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="text-sm font-medium tracking-[-0.02em] text-page-text">
            Setup checklist
          </span>
          {/* Progress bar */}
          <div className="h-1 w-full overflow-hidden rounded-full bg-foreground/[0.06]">
            <motion.div
              className="h-full rounded-full bg-[#00B36E]"
              initial={false}
              animate={{ width: `${progress * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>
        <span className="text-xs font-medium tracking-[-0.02em] text-page-text-muted">
          {completedCount}/{STEPS.length}
        </span>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="text-page-text-muted" />
          </svg>
        </motion.div>
      </button>

      {/* Expandable items */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="overflow-hidden"
          >
            <div className="px-2 py-2">
              {STEPS.map((step) => {
                const isComplete = step.completed || completed[step.key];
                return (
                  <button
                    key={step.key}
                    disabled={isComplete || step.completed}
                    onClick={() => !isComplete && step.action && onToggle(step.key)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors",
                      !isComplete && step.action && "cursor-pointer hover:bg-foreground/[0.04]",
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {isComplete ? (
                        <motion.div
                          key="done"
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          className="flex size-5 items-center justify-center rounded-full bg-[#00B36E]"
                        >
                          <CheckCircleIcon className="size-3 text-white" />
                        </motion.div>
                      ) : (
                        <div className="size-5 rounded-full border border-page-border" />
                      )}
                    </AnimatePresence>
                    <span
                      className={cn(
                        "flex-1 text-sm tracking-[-0.02em]",
                        isComplete ? "text-page-text-muted line-through" : "text-page-text",
                      )}
                    >
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Onboarding View ────────────────────────────────────────────────

function OnboardingView({
  completed,
  onToggle,
  onSkip,
}: {
  completed: Record<string, boolean>;
  onToggle: (key: string) => void;
  onSkip: () => void;
}) {
  return (
    <div className="relative flex flex-1 flex-col items-start gap-0 self-stretch overflow-hidden bg-page-bg">
      {/* Radial gradient background — covers entire view */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 blur-[80px] dark:blur-[120px]"
          style={{
            background: [
              "radial-gradient(31.76% 50.52% at 64.86% 100.52%, rgba(255, 63, 213, 0.24) 0%, rgba(255, 63, 213, 0) 100%)",
              "radial-gradient(31.58% 54.43% at 32.86% 102.32%, rgba(255, 144, 37, 0.24) 0%, rgba(255, 144, 37, 0) 100%)",
            ].join(", "),
          }}
        />
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]" style={{ mixBlendMode: "overlay" }} aria-hidden>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-10 flex h-14 w-full shrink-0 items-center justify-between border-b border-foreground/[0.06] bg-page-bg px-5">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Home</span>
        <button type="button" onClick={onSkip} className="cursor-pointer font-inter text-sm font-medium tracking-[-0.02em] text-foreground/50 transition-colors hover:text-foreground/70">
          Skip onboarding
        </button>
      </div>

      <div className="relative flex flex-col items-start gap-2 self-stretch p-4 pb-8 sm:px-8 sm:py-4 sm:pb-8">

      <div className="relative z-[1] flex flex-col items-center self-stretch rounded-[20px] px-0 py-2 sm:py-4">
        <div className="flex w-full max-w-[720px] flex-col items-center">
          {/* Header */}
          <motion.div
            className="flex w-full max-w-[720px] flex-col items-center gap-4 pb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center drop-shadow-[0_-1px_3px_rgba(0,0,0,0.06)]">
              <motion.div
                className="-mr-2 flex size-14 items-center justify-center rounded-full border border-[rgba(37,37,37,0.1)]"
                style={{
                  background: [
                    "radial-gradient(60.93% 50% at 51.43% 0%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.005) 100%)",
                    "radial-gradient(31.76% 50.52% at 64.86% 100.52%, rgba(255,63,213,0.32) 0%, rgba(255,63,213,0) 100%)",
                    "radial-gradient(31.58% 54.43% at 32.86% 102.32%, rgba(255,144,37,0.32) 0%, rgba(255,144,37,0) 100%)",
                    "#FF9025",
                  ].join(", "),
                  boxShadow: "inset 0px 0.5px 2px rgba(0,0,0,0.12), inset 0px 0.972px 0px rgba(255,255,255,0.36)",
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.1 }}
              >
                <StarsLogo className="size-7 text-white" />
              </motion.div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0, x: -8 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.2 }}
              >
                <WorkspaceAvatar />
              </motion.div>
            </div>
            <div className="flex flex-col items-center gap-1.5 px-5">
              <h1 className="text-center text-lg font-medium tracking-[-0.02em] text-page-text sm:text-xl">
                Manage brands, creators and campaigns
              </h1>
              <p className="max-w-[457px] text-center text-sm leading-[150%] tracking-[-0.02em] text-page-text-subtle sm:text-base">
                Your agency dashboard lets you run multiple brand campaigns from one place. Add your first brand client to get started.
              </p>
            </div>
          </motion.div>

          {/* Checklist card */}
          <motion.div
            className="flex w-full max-w-[720px] flex-col rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none sm:p-6"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            {STEPS.map((step, i) => {
              const isComplete = step.completed || completed[step.key];
              const prevComplete = i === 0 || STEPS[i - 1].completed || completed[STEPS[i - 1].key];
              const nextComplete = i < STEPS.length - 1 && (STEPS[i + 1].completed || completed[STEPS[i + 1].key]);
              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.06 }}
                >
                  <OnboardingStepRow
                    step={step}
                    isComplete={isComplete}
                    onToggle={() => onToggle(step.key)}
                    isFirst={i === 0}
                    isLast={i === STEPS.length - 1}
                    prevComplete={prevComplete}
                    nextComplete={nextComplete}
                  />
                </motion.div>
              );
            })}

            {/* Explore product tour */}
            <ExploreProductButton />
          </motion.div>

        </div>
      </div>
      </div>
    </div>
  );
}

function ExploreProductButton() {
  const { start: startDemo } = useInteractiveDemo();

  return (
    <motion.button
      onClick={() => startDemo(PLATFORM_DEMO)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      className="mt-4 flex h-[38px] w-full cursor-pointer items-center justify-center gap-[6px] rounded-xl font-inter text-[14px] font-medium leading-[22px] tracking-[-0.16px] text-white transition-transform active:scale-[0.98]"
      style={{
        background: "#FF7A00",
        border: "1px solid #CC6200",
        boxShadow: "0px 1px 1px rgba(0,0,0,0.1), 0px 2px 3px rgba(0,0,0,0.08), 1px 4px 8px rgba(0,0,0,0.12), inset 0px -2px 1px rgba(0,0,0,0.2), inset 0px 1px 0px rgba(255,255,255,0.25)",
      }}
    >
      Explore product
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
        <path d="M8 3.33V12.67" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12.67 8L8 12.67L3.33 8" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>
  );
}

// ── Transaction History ────────────────────────────────────────────

const TRANSACTIONS = [
  { date: "Feb 18", description: "Deposit via Stripe", amount: "+$1,500.00", color: "text-[#34D399]" },
  { date: "Jan 31", description: "Payout batch #1247 (12 creators)", amount: "-$834.20", color: "text-[#FF3355] dark:text-[#FB7185] dark:text-[#FB7185]" },
  { date: "Feb 18", description: "Deposit via Stripe", amount: "+$1,500.00", color: "text-[#34D399]" },
  { date: "Jan 31", description: "Payout batch #1247 (12 creators)", amount: "-$834.20", color: "text-[#FF3355] dark:text-[#FB7185] dark:text-[#FB7185]" },
  { date: "Feb 18", description: "Deposit via Stripe", amount: "+$1,500.00", color: "text-[#34D399]" },
  { date: "Jan 31", description: "Payout batch #1247 (12 creators)", amount: "-$834.20", color: "text-[#FF3355] dark:text-[#FB7185] dark:text-[#FB7185]" },
  { date: "Feb 18", description: "Deposit via Stripe", amount: "+$1,500.00", color: "text-[#34D399]" },
  { date: "Jan 31", description: "Payout batch #1247 (12 creators)", amount: "-$834.20", color: "text-[#FF3355] dark:text-[#FB7185] dark:text-[#FB7185]" },
];

function TransactionHistoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} size="md" showClose={false}>
      <div className="relative flex max-h-[70vh] flex-col items-center overflow-y-auto px-5 pb-0 pt-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex size-6 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.03] text-foreground/30 transition-colors hover:bg-foreground/[0.06]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4.667 4.667L11.333 11.333M11.333 4.667L4.667 11.333" stroke="currentColor" strokeWidth="1.52381" strokeLinecap="round" />
          </svg>
        </button>
        {/* Hero */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex size-14 items-center justify-center rounded-full bg-foreground/[0.03] shadow-[0_0_0_2px_#fff] dark:shadow-none">
            <div className="pointer-events-none absolute inset-0 rounded-full dark:hidden" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(37,37,37,0) 0%, rgba(37,37,37,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} /><div className="pointer-events-none absolute inset-0 rounded-full hidden dark:block" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(224,224,224,0) 0%, rgba(224,224,224,0.2) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 5V9H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.51172 15C4.74723 18.4956 8.08094 21 11.9996 21C16.9702 21 20.9996 16.9706 20.9996 12C20.9996 7.02944 16.9702 3 11.9996 3C8.27045 3 5.07102 5.26806 3.70551 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="font-inter text-lg font-medium tracking-[-0.02em] text-page-text">Transaction History</span>
            <span className="max-w-[300px] text-center font-inter text-sm leading-[150%] tracking-[-0.02em] text-foreground/70">
              An overview of your past transactions; incoming and outgoing.
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 w-full overflow-hidden rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-foreground/[0.03] dark:shadow-none">
          {/* Header */}
          <div className="flex items-center border-b border-foreground/[0.06] px-1">
            <div className="w-[61px] px-3 py-3">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">Date</span>
            </div>
            <div className="flex-1 px-3 py-3">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">Description</span>
            </div>
            <div className="w-24 px-3 py-3 text-right">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">Transaction</span>
            </div>
          </div>

          {/* Rows */}
          {TRANSACTIONS.map((tx, i) => (
            <div key={i} className="flex items-center border-b border-foreground/[0.03] px-1 last:border-b-0">
              <div className="w-[61px] px-3 py-4">
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">{tx.date}</span>
              </div>
              <div className="flex-1 px-3 py-4">
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text">{tx.description}</span>
              </div>
              <div className="w-24 px-3 py-4 text-right">
                <span className={cn("font-inter text-xs tabular-nums tracking-[-0.02em]", tx.color)}>{tx.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-5 pb-5 pt-3">
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-foreground/[0.03] dark:hover:bg-foreground/[0.06]"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

function HistoryButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-foreground/[0.06] font-inter text-xs font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[#222222] dark:hover:bg-[#2a2a2a]"
      >
        <HistoryIcon className="size-3" />
        History
      </button>
      <TransactionHistoryModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

// ── Top Up Campaign ───────────────────────────────────────────────

const QUICK_AMOUNTS = ["$1,000", "$5,000", "$10,000", "$25,000", "$50,000"];
const CURRENT_BALANCE = 14200;

function DollarSignIcon() {
  return (
    <svg width="8" height="13" viewBox="0 0 8 13" fill="currentColor">
      <path d="M3.40554 12.7273V0H4.22088V12.7273H3.40554ZM5.95597 3.94744C5.90294 3.4768 5.68419 3.11222 5.29972 2.85369C4.91525 2.59186 4.43134 2.46094 3.84801 2.46094C3.4304 2.46094 3.06913 2.52723 2.7642 2.6598C2.45928 2.78906 2.2223 2.96804 2.05327 3.19673C1.88755 3.42211 1.80469 3.67898 1.80469 3.96733C1.80469 4.20928 1.86103 4.41809 1.97372 4.59375C2.08973 4.76941 2.24053 4.9169 2.42614 5.03622C2.61506 5.15223 2.81723 5.25 3.03267 5.32955C3.24811 5.40578 3.45526 5.46875 3.65412 5.51847L4.64844 5.77699C4.97325 5.85653 5.30634 5.96425 5.64773 6.10014C5.98911 6.23603 6.30563 6.41501 6.5973 6.63707C6.88897 6.85914 7.12429 7.13423 7.30327 7.46236C7.48556 7.79048 7.5767 8.18324 7.5767 8.64063C7.5767 9.21733 7.42756 9.7294 7.12926 10.1768C6.83428 10.6243 6.40507 10.9773 5.84162 11.2358C5.28149 11.4943 4.60369 11.6236 3.80824 11.6236C3.04593 11.6236 2.38636 11.5026 1.82955 11.2607C1.27273 11.0187 0.836884 10.6757 0.522017 10.2315C0.20715 9.78409 0.0331439 9.25379 0 8.64063H1.54119C1.57102 9.00852 1.69034 9.31511 1.89915 9.56037C2.11127 9.80232 2.38139 9.98295 2.70952 10.1023C3.04096 10.2183 3.40388 10.2763 3.7983 10.2763C4.23248 10.2763 4.61861 10.2083 4.95668 10.0724C5.29806 9.93324 5.56652 9.741 5.76207 9.49574C5.95762 9.24716 6.0554 8.95715 6.0554 8.62571C6.0554 8.3241 5.96922 8.07718 5.79688 7.88494C5.62784 7.69271 5.39749 7.53362 5.10582 7.40767C4.81747 7.28172 4.491 7.17069 4.12642 7.07457L2.9233 6.74645C2.10795 6.52438 1.46165 6.19792 0.984375 5.76705C0.510417 5.33617 0.273438 4.7661 0.273438 4.05682C0.273438 3.47017 0.432528 2.9581 0.75071 2.5206C1.06889 2.0831 1.49976 1.74337 2.04332 1.50142C2.58688 1.25616 3.20005 1.13352 3.88281 1.13352C4.57221 1.13352 5.1804 1.2545 5.70739 1.49645C6.23769 1.7384 6.6553 2.0715 6.96023 2.49574C7.26515 2.91667 7.42424 3.40057 7.4375 3.94744H5.95597Z" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M1.41311 4.14034C1.38182 4.27178 1.36428 4.40469 1.35339 4.53795C1.33299 4.78765 1.333 5.09081 1.33301 5.44222V10.5603C1.333 10.9117 1.33299 11.215 1.35339 11.4647C1.37492 11.7282 1.42247 11.9904 1.551 12.2426C1.74274 12.6189 2.04871 12.9249 2.42503 13.1166C2.67728 13.2452 2.93943 13.2927 3.20299 13.3143C3.45268 13.3347 3.75582 13.3346 4.1072 13.3346H11.892C12.2434 13.3346 12.5467 13.3347 12.7964 13.3143C13.0599 13.2927 13.3221 13.2452 13.5743 13.1166C13.9506 12.9249 14.2566 12.6189 14.4484 12.2426C14.5769 11.9904 14.6244 11.7282 14.646 11.4647C14.6664 11.2149 14.6664 10.9118 14.6663 10.5603V5.44226C14.6664 5.09083 14.6664 4.78766 14.646 4.53795C14.6351 4.40468 14.6175 4.27178 14.5862 4.14033L9.26615 8.49314C8.52942 9.09592 7.46993 9.09592 6.7332 8.49314L1.41311 4.14034Z" fill="currentColor" fillOpacity="0.5"/>
      <path d="M13.8267 3.03901C13.7468 2.9821 13.6625 2.93089 13.5743 2.88596C13.3221 2.75743 13.0599 2.70988 12.7964 2.68835C12.5467 2.66795 12.2435 2.66796 11.8921 2.66797H4.10731C3.7559 2.66796 3.4527 2.66795 3.20299 2.68835C2.93943 2.70988 2.67728 2.75743 2.42503 2.88596C2.33684 2.93089 2.25252 2.9821 2.17263 3.03901L7.57752 7.46119C7.82309 7.66212 8.17626 7.66212 8.42183 7.46119L13.8267 3.03901Z" fill="currentColor" fillOpacity="0.5"/>
    </svg>
  );
}

function TopUpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);

  const numericAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0;
  const newBalance = CURRENT_BALANCE + numericAmount;

  const handleDeposit = () => {
    if (numericAmount > 0) setSuccess(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setAmount("");
      setSuccess(false);
    }, 200);
  };

  const handleQuickAmount = (val: string) => {
    setAmount(val.replace("$", ""));
  };

  return (
    <Modal open={open} onClose={handleClose} size="md" showClose={!success}>
      {!success ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-center border-b border-foreground/[0.06] px-5 py-3 dark:border-[rgba(224,224,224,0.03)]">
            <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Top up campaign</span>
          </div>

          {/* Subtitle */}
          <div className="flex items-center justify-center px-5 pt-5">
            <span className="font-inter text-sm font-medium tracking-[-0.02em] text-foreground/70">
              Easily set up an agreement with a creator.
            </span>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4 px-5 pb-5 pt-4">
            {/* Amount card */}
            <div className="flex flex-col gap-3 rounded-2xl border border-foreground/[0.06] bg-card-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-card-inner-border dark:bg-card-inner-bg dark:shadow-none">
              <span className="font-inter text-xs tracking-[-0.02em] text-foreground/70">
                Current balance: ${CURRENT_BALANCE.toLocaleString()}
              </span>

              {/* Input */}
              <div className="flex h-10 items-center gap-1.5 rounded-[14px] border border-foreground/[0.06] bg-white px-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-transparent dark:bg-foreground/[0.03] dark:shadow-none">
                <DollarSignIcon />
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text placeholder:text-foreground/40 focus:outline-none"
                />
              </div>

              {/* Quick amounts */}
              <div className="flex flex-wrap gap-2">
                {QUICK_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAmount(val)}
                    className={cn(
                      "flex h-8 cursor-pointer items-center justify-center rounded-full border px-3 font-inter text-xs font-medium tracking-[-0.02em] transition-colors",
                      amount === val
                        ? "border-foreground bg-foreground/[0.04] text-page-text"
                        : "border-foreground/[0.12] bg-white text-page-text shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-foreground/[0.2] dark:border-foreground/[0.08] dark:bg-foreground/[0.03] dark:shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary card — only show when an amount is entered */}
            {numericAmount > 0 && (
              <div className="overflow-hidden rounded-2xl border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-foreground/[0.03] dark:bg-foreground/[0.03] dark:shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between border-b border-foreground/[0.03] px-4 py-3">
                  <span className="font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">Deposit amount</span>
                  <span className="font-inter text-xs font-medium tabular-nums tracking-[-0.02em] text-[#34D399]">
                    +${numericAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">New balance after deposit</span>
                  <span className="font-inter text-xs font-medium tabular-nums tracking-[-0.02em] text-page-text">
                    ${newBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-5 pb-5">
            <button
              type="button"
              onClick={handleClose}
              className="flex h-10 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] px-4 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeposit}
              className={cn(
                "flex h-10 cursor-pointer items-center justify-center rounded-full px-4 font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors dark:text-[#111111]",
                numericAmount > 0
                  ? "bg-foreground hover:bg-foreground/90 dark:bg-white dark:hover:bg-white/90"
                  : "bg-foreground/60 cursor-not-allowed dark:bg-white/60",
              )}
              disabled={numericAmount <= 0}
            >
              Deposit funds
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Success header */}
          <div className="flex items-center justify-center border-b border-foreground/[0.06] px-5 py-3 dark:border-[rgba(224,224,224,0.03)]">
            <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Top up campaign</span>
          </div>

          {/* Success content with green gradient */}
          <div className="flex flex-col items-center gap-4 px-5 pb-5 pt-[60px]" style={{ background: "radial-gradient(50% 53.47% at 50% 0%, rgba(0, 153, 77, 0.24) 0%, rgba(0, 153, 77, 0) 100%)" }}>
            {/* Green checkmark */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative flex size-14 items-center justify-center rounded-full bg-[#34D399] shadow-[0_0_0_2px_#fff,inset_0_0.5px_2px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.36)] dark:shadow-[inset_0_0.5px_2px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.36)]">
                <div className="pointer-events-none absolute inset-0 rounded-full dark:hidden" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(37,37,37,0) 0%, rgba(37,37,37,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} /><div className="pointer-events-none absolute inset-0 rounded-full hidden dark:block" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(224,224,224,0) 0%, rgba(224,224,224,0.2) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M14 2.333A11.667 11.667 0 1 0 14 25.667 11.667 11.667 0 0 0 14 2.333zm4.185 9.017a.833.833 0 0 0-1.203-1.153l-4.635 5.668-1.65-1.65a.833.833 0 0 0-1.178 1.178l2.333 2.334a.833.833 0 0 0 1.191.025l5.142-6.402z" fill="#FFFFFF" />
                </svg>
              </div>
              <span className="font-inter text-xl font-medium tracking-[-0.02em] text-[#34D399]">Top up successful</span>
            </div>

            {/* View receipt link */}
            <div className="flex items-center gap-1">
              <span className="font-inter text-sm font-medium tracking-[-0.02em] text-foreground/50">View receipt</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/50" />
              </svg>
            </div>

            {/* Summary card */}
            <div className="w-full overflow-hidden rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none">
              <div className="flex items-center justify-between border-b border-foreground/[0.03] px-4 py-3">
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">Deposit amount</span>
                <span className="font-inter text-xs font-medium tabular-nums tracking-[-0.02em] text-[#34D399]">
                  +${numericAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">New balance after deposit</span>
                <span className="font-inter text-xs font-medium tabular-nums tracking-[-0.02em] text-page-text">
                  ${newBalance.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Email confirmation */}
            <div className="flex items-center gap-1.5">
              <EnvelopeIcon />
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">
                Receipt sent to vlad@outpacestudios.com
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 pb-5">
            <button
              type="button"
              onClick={handleClose}
              className="flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-foreground font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:bg-foreground/90"
            >
              Close
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

function TopUpButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-fit cursor-pointer items-center rounded-full bg-foreground/[0.06] px-3 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
      >
        Top up
      </button>
      <TopUpModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function DepositButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#252525] px-3 font-inter text-xs font-medium tracking-[-0.02em] text-white transition-colors hover:bg-[#252525]/90 dark:bg-white dark:text-[#111111] dark:hover:bg-white/90"
      >
        <PlusIcon className="size-3" />
        Deposit
      </button>
      <TopUpModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

// ── KPI Card Components (shared between mobile carousel & desktop grid) ──

const kpiCard = "flex w-full flex-col justify-between rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-none";

function KpiCardBalance({ className }: { className?: string }) {
  return (
    <div className={cn(kpiCard, "gap-4", className)}>
      <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Balance</span>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="flex-1 font-inter text-xl font-medium tracking-[-0.02em] text-page-text">$14,200</span>
          <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">$2,880 unallocated</span>
        </div>
        <div className="flex gap-2">
          <DepositButton />
          <HistoryButton />
        </div>
      </div>
    </div>
  );
}

function KpiCardActive({ className }: { className?: string }) {
  return (
    <Link href="/campaigns" className={cn(kpiCard, className)}>
      <div className="flex items-start justify-between">
        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Active</span>
        <MiniSparkline />
      </div>
      <div className="flex flex-col gap-3">
        <span className="font-inter text-xl font-medium tracking-[-0.02em] text-page-text">24</span>
        <div className="flex flex-wrap gap-1">
          <span className="w-fit whitespace-nowrap rounded-full bg-[rgba(96,165,250,0.08)] px-2 py-1 font-inter text-xs font-medium tracking-[-0.02em] text-[#60A5FA]">3 CPM</span>
          <span className="w-fit whitespace-nowrap rounded-full bg-[rgba(251,146,60,0.08)] px-2 py-1 font-inter text-xs font-medium tracking-[-0.02em] text-[#FB923C]">2 Retainer</span>
        </div>
      </div>
    </Link>
  );
}

function KpiCardViews({ className }: { className?: string }) {
  return (
    <div className={cn(kpiCard, className)}>
      <div className="flex items-start justify-between">
        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Views</span>
        <MiniSparkline />
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-inter text-xl font-medium tracking-[-0.02em] text-page-text">10</span>
        <span className="w-fit rounded-full bg-[rgba(52,211,153,0.08)] px-2 py-1 font-inter text-xs font-medium tracking-[-0.02em] text-[#34D399]">+31% this week</span>
      </div>
    </div>
  );
}

function KpiCardAvgCpm({ className }: { className?: string }) {
  return (
    <div className={cn(kpiCard, className)}>
      <div className="flex items-start justify-between">
        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Avg CPM</span>
        <MiniSparkline />
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-inter text-xl font-medium tracking-[-0.02em] text-page-text">$0.67</span>
        <span className="w-fit rounded-full bg-[rgba(52,211,153,0.08)] px-2 py-1 font-inter text-xs font-medium tracking-[-0.02em] text-[#34D399]">-$0.05 (better)</span>
      </div>
    </div>
  );
}

function KpiCardPaidOut({ className }: { className?: string }) {
  return (
    <Link href="/payouts" className={cn(kpiCard, className)}>
      <div className="flex items-start justify-between">
        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Paid Out</span>
        <MiniSparkline />
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-inter text-xl font-medium tracking-[-0.02em] text-page-text">$18.4k</span>
        <span className="w-fit rounded-full bg-[rgba(52,211,153,0.08)] px-2 py-1 font-inter text-xs font-medium tracking-[-0.02em] text-[#34D399]">-$0.05 (better)</span>
      </div>
    </Link>
  );
}

// ── Dashboard View ─────────────────────────────────────────────────

const MOCK_CREATOR_DETAILS: CreatorDetailsData = {
  name: "ClipMaster_Jay",
  joinedDate: "Oct '26",
  lastActive: "2d ago",
  videoCount: 42,
  platforms: ["tiktok", "instagram"],
  category: "Gaming",
  followers: "373K",
  rating: "Legendary",
  ratingStars: 6,
  totalEarned: "$2,415.80",
  engagementScore: 85,
  engagementRate: "4.2%",
  sentiment: "78%",
  approvedVideos: 37,
  approvalRate: "88%",
  connectedAccounts: [
    { platform: "tiktok", handle: "@xkaizen", followers: "245K followers" },
    { platform: "youtube", handle: "@xKaizenGaming", followers: "128K followers" },
  ],
  matchScore: 92,
  scoreBreakdown: { niche: 88, audience: 91, pastPerformance: 96 },
  campaigns: [{ name: "Gambling Summer Push", cpm: "$0.84 CPM" }],
  performanceData: {
    datasets: {
      daily: Array.from({ length: 30 }, (_, i) => ({ index: i, label: `Day ${i + 1}`, views: Math.floor(Math.random() * 80000 + 20000), engagement: 0, likes: Math.floor(Math.random() * 5000 + 1000), comments: Math.floor(Math.random() * 800 + 200), shares: Math.floor(Math.random() * 400 + 100) })),
      cumulative: Array.from({ length: 30 }, (_, i) => ({ index: i, label: `Day ${i + 1}`, views: (i + 1) * 35000, engagement: 0, likes: (i + 1) * 2500, comments: (i + 1) * 500, shares: (i + 1) * 250 })),
    },
    series: [
      { key: "views" as const, label: "Views", color: "#60A5FA", axis: "left" as const },
      { key: "likes" as const, label: "Likes", color: "#F9A8D4", axis: "left" as const },
      { key: "comments" as const, label: "Comments", color: "#FB923C", axis: "left" as const },
      { key: "shares" as const, label: "Shares", color: "#55B685", axis: "left" as const },
    ],
    xTicks: Array.from({ length: 10 }, (_, i) => ({ label: `Jan ${5 + i * 3}`, index: i * 3 })),
    yLabels: ["0", "25K", "50K", "75K", "100K"],
    rightYLabels: [],
  },
  performanceStats: { views: "1.2M", likes: "48K", comments: "3.2K", shares: "1.1K" },
  submissions: [
    { title: "This fitness hack changed my life", platform: "tiktok", earned: "$24,815.67", views: "680,4K", engRate: "4.8%", cpm: "$0.84" },
    { title: "This fitness hack changed my life", platform: "tiktok", earned: "$24,815.67", views: "680,4K", engRate: "4.8%", cpm: "$0.84" },
    { title: "This fitness hack changed my life", platform: "tiktok", earned: "$24,815.67", views: "680,4K", engRate: "4.8%", cpm: "$0.84" },
  ],
  demographics: {
    ageGroups: [
      { label: "13 - 17", percentage: 12, color: "rgba(192, 132, 252, 0.1)" },
      { label: "18 - 24", percentage: 45, color: "rgba(52, 211, 153, 0.08)" },
      { label: "24 - 34", percentage: 28, color: "rgba(251, 113, 133, 0.1)" },
      { label: "35+", percentage: 15, color: "rgba(96, 165, 250, 0.08)" },
    ],
    countries: [
      { code: "US", label: "USA", percentage: 48, color: "rgba(192, 132, 252, 0.1)" },
      { code: "GB", label: "UK", percentage: 14, color: "rgba(52, 211, 153, 0.08)" },
      { code: "CA", label: "CA", percentage: 9, color: "rgba(6, 182, 212, 0.1)" },
      { code: "DE", label: "DE", percentage: 6, color: "rgba(251, 113, 133, 0.1)" },
      { code: "AU", label: "AU", percentage: 5, color: "rgba(251, 146, 60, 0.1)" },
      { code: "OTHER", label: "Other", percentage: 18, color: "rgba(96, 165, 250, 0.08)" },
    ],
    genderSplit: [
      { label: "Male", percentage: 62, color: "rgba(96, 165, 250, 0.1)" },
      { label: "Female", percentage: 34, color: "rgba(249, 168, 212, 0.1)" },
    ],
    interests: [
      { icon: "Gaming", label: "Gaming", percentage: 72 },
      { icon: "Tech", label: "Tech", percentage: 45 },
      { icon: "Entertainment", label: "Entertainment", percentage: 38 },
      { icon: "Sports", label: "Sports", percentage: 22 },
      { icon: "Music", label: "Music", percentage: 18 },
    ],
  },
};

function DashboardView() {
  const [creatorPopupOpen, setCreatorPopupOpen] = useState(false);
  const activityContainerRef = useRef<HTMLDivElement>(null);
  const activityHover = useProximityHover(activityContainerRef);
  const activityActiveRect = activityHover.activeIndex !== null ? activityHover.itemRects[activityHover.activeIndex] : null;

  useEffect(() => { activityHover.measureItems(); }, [activityHover.measureItems]);

  return (
    <div className="flex flex-col gap-4 px-4 pb-6 pt-4 sm:px-5">
      {/* AI Insights Card */}
      <div className="flex flex-col gap-6 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <SparkleIcon className="size-4 shrink-0 text-page-text-muted" />
            <span className="font-inter text-sm tracking-[-0.02em] text-page-text-muted">AI Insights</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button type="button" className="flex size-4 cursor-pointer items-center justify-center">
              <ChevronLeftIcon className="size-4 text-page-text-muted" />
            </button>
            <span className="font-inter text-sm tracking-[-0.02em] text-page-text">1/3</span>
            <button type="button" className="flex size-4 cursor-pointer items-center justify-center">
              <ChevronRightIcon className="size-4 text-page-text-muted" />
            </button>
          </div>
        </div>
        {/* Body */}
        <div className="flex flex-col gap-3">
          <span className="font-inter text-sm leading-[140%] tracking-[-0.02em] text-page-text-muted">
            You&apos;ve spent <span className="font-semibold text-[#FF9025]">78%</span> of your budget in the <span className="font-semibold text-page-text">Caffeine AI</span> campaign, with <span className="font-semibold text-page-text">4 days left.</span>
          </span>
          <TopUpButton />
        </div>
      </div>

      {/* KPI Cards — Mobile carousel */}
      <HomeKpiCarousel />

      {/* KPI Cards — Desktop grid */}
      <div className="hidden gap-2 md:grid md:grid-cols-2 xl:flex xl:flex-nowrap">
        <KpiCardBalance className="md:col-span-2 xl:w-[320px] xl:shrink-0" />
        <KpiCardActive className="xl:min-w-0 xl:flex-1" />
        <KpiCardViews className="xl:min-w-0 xl:flex-1" />
        <KpiCardAvgCpm className="xl:min-w-0 xl:flex-1" />
        <KpiCardPaidOut className="xl:min-w-0 xl:flex-1" />
      </div>

      {/* Bottom Row: Active Campaigns + Needs Attention + Recent Activity */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {/* Active Campaigns */}
        <div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg py-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none">
          <div className="flex items-center justify-between px-4">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Active campaigns</span>
            <Link href="/campaigns" className="group flex cursor-pointer items-center gap-1.5">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted transition-colors duration-150 group-hover:text-page-text">View all</span>
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none" className="shrink-0 text-page-text-muted transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-page-text"><path d="M5.5 0.5L8.5 3.49999L5.5 6.5M8 3.49999H0.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>
          <div className="flex flex-col gap-2 px-4">
            {ACTIVE_CAMPAIGNS_DATA.map((campaign, i) => (
              <Link
                key={i}
                href={`/campaigns/${campaign.slug}`}
                className="flex flex-col gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] p-3 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-foreground/[0.02] dark:border-[rgba(224,224,224,0.03)] dark:bg-foreground/[0.03] dark:shadow-none dark:hover:bg-foreground/[0.06] sm:px-4 sm:py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 shrink-0 overflow-hidden rounded-[10px] bg-foreground/10" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{campaign.name}</span>
                    <span className="truncate font-inter text-xs tracking-[-0.02em] text-page-text-muted">{campaign.subtitle}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="shrink-0 font-inter text-xs tracking-[-0.02em] text-page-text">{campaign.progress}%</span>
                  <div className="h-1 flex-1 rounded-full bg-foreground/10">
                    <div className="h-1 rounded-full" style={{ width: `${campaign.progress}%`, background: campaign.progressColor }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none">
          <div className="flex items-center">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Needs attention</span>
          </div>
          <div className="flex flex-col gap-2">
            {ATTENTION_ITEMS.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="group flex items-center gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white py-3 pl-3 pr-3 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-foreground/[0.02] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-inner-bg dark:shadow-none dark:hover:border-[#303030] dark:hover:bg-[#282828]"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full backdrop-blur-[12px]" style={{ background: item.iconBg }}>
                  <item.icon />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="font-inter text-xs font-medium leading-[1.2] tracking-[-0.02em] text-page-text">{item.title}</span>
                  <span className="truncate font-inter text-xs leading-[1.2] tracking-[-0.02em] text-foreground/50">{item.subtitle}</span>
                </div>
                <ChevronRightIcon className="size-4 shrink-0 text-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity — hidden on mobile */}
        <div className="hidden min-w-0 flex-col gap-4 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none sm:flex sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Recent activity</span>
            <Link href="/notifications" className="group flex cursor-pointer items-center gap-1.5">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted transition-colors duration-150 group-hover:text-page-text">View all</span>
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none" className="shrink-0 text-page-text-muted transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-page-text"><path d="M5.5 0.5L8.5 3.49999L5.5 6.5M8 3.49999H0.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>
          <div
            ref={activityContainerRef}
            className="relative flex flex-col"
            onMouseEnter={activityHover.handlers.onMouseEnter}
            onMouseMove={activityHover.handlers.onMouseMove}
            onMouseLeave={activityHover.handlers.onMouseLeave}
          >
            <AnimatePresence>
              {activityActiveRect && (
                <motion.div
                  key={activityHover.sessionRef.current}
                  className="pointer-events-none absolute rounded-xl bg-foreground/[0.04]"
                  initial={{ opacity: 0, ...activityActiveRect }}
                  animate={{ opacity: 1, ...activityActiveRect }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
                />
              )}
            </AnimatePresence>
            {ACTIVITY_ITEMS.map((item, i) => (
              <div
                key={i}
                ref={(el) => activityHover.registerItem(i, el)}
                className="relative z-[1] flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
                  <item.icon className="size-4 text-page-text-muted" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="truncate font-inter text-xs font-medium tracking-[-0.02em] text-page-text">{item.title}</span>
                  <span className="truncate font-inter text-xs tracking-[-0.02em] text-page-text-muted">{item.subtitle}</span>
                </div>
                <span className="shrink-0 font-inter text-xs tracking-[-0.02em] text-page-text-muted">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Top Creators + Pending Drafts */}
      <div className="flex flex-col gap-2 sm:flex-row">
        {/* Top creators */}
        <div className="flex flex-1 flex-col justify-between gap-4 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none">
          <div className="flex flex-col gap-2">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Top creators</span>
              <Link href="/creators" className="group flex cursor-pointer items-center gap-1.5">
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted transition-colors duration-150 group-hover:text-page-text">View all</span>
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none" className="shrink-0 text-page-text-muted transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-page-text"><path d="M5.5 0.5L8.5 3.49999L5.5 6.5M8 3.49999H0.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </div>

            {/* Podium */}
            <div className="hidden items-end justify-center gap-2 sm:flex">
              {/* 2nd place */}
              <button type="button" onClick={() => setCreatorPopupOpen(true)} className="flex h-[160px] w-full cursor-pointer flex-col items-center justify-between rounded-2xl border border-[rgba(37,37,37,0.06)] bg-[rgba(131,159,185,0.04)] p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-[rgba(131,159,185,0.08)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(131,159,185,0.06)] dark:shadow-none dark:hover:bg-[rgba(131,159,185,0.10)] lg:h-[197px]">
                <div className="flex size-[26px] items-center justify-center rounded-full bg-[#839FB9] font-inter text-[16px] font-medium text-white">2</div>
                <div className="flex flex-col items-center gap-2">
                  <div className="size-8 rounded-full bg-foreground/[0.08]" />
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">ClipMaster_Jay</span>
                    <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">$4,280</span>
                  </div>
                </div>
              </button>
              {/* 1st place */}
              <button type="button" onClick={() => setCreatorPopupOpen(true)} className="flex h-[200px] w-full cursor-pointer flex-col items-center justify-between rounded-2xl border border-[rgba(37,37,37,0.06)] bg-[rgba(251,146,60,0.04)] p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-[rgba(251,146,60,0.08)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(251,146,60,0.06)] dark:shadow-none dark:hover:bg-[rgba(251,146,60,0.10)] lg:h-[260px]">
                <div className="flex h-6 items-center gap-2 rounded-full bg-[#FB923C] px-2">
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M5.91604 0.22265C5.82331 0.0835506 5.66719 0 5.50002 0C5.33284 0 5.17672 0.0835506 5.08399 0.22265L3.32883 2.85539L0.723624 1.55279C0.552173 1.46706 0.346803 1.4869 0.194933 1.60386C0.043064 1.72083 -0.0285686 1.91432 0.010527 2.10198L1.09468 7.30593C1.2396 8.00151 1.85264 8.5 2.56315 8.5H8.43688C9.14739 8.5 9.76044 8.00151 9.90535 7.30593L10.9895 2.10198C11.0286 1.91432 10.957 1.72083 10.8051 1.60386C10.6532 1.4869 10.4479 1.46706 10.2764 1.55279L7.6712 2.85539L5.91604 0.22265Z" fill="white" /></svg>
                  <span className="font-inter text-[16px] font-medium text-white">1</span>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="size-10 rounded-full bg-foreground/[0.08]" />
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">ClipMaster_Jay</span>
                    <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">$4,280</span>
                  </div>
                </div>
              </button>
              {/* 3rd place */}
              <button type="button" onClick={() => setCreatorPopupOpen(true)} className="flex h-[130px] w-full cursor-pointer flex-col items-center justify-between rounded-2xl border border-[rgba(37,37,37,0.06)] bg-[rgba(158,82,0,0.04)] p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-[rgba(158,82,0,0.08)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(158,82,0,0.06)] dark:shadow-none dark:hover:bg-[rgba(158,82,0,0.10)] lg:h-[160px]">
                <div className="flex size-[27px] items-center justify-center rounded-full bg-[#9E5200] font-inter text-[16px] font-medium text-white">3</div>
                <div className="flex flex-col items-center gap-2">
                  <div className="size-8 rounded-full bg-foreground/[0.08]" />
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">ClipMaster_Jay</span>
                    <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">$4,280</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Mobile: card list with colored backgrounds */}
            <div className="flex flex-col gap-2 sm:hidden">
              {TOP_CREATORS.map((c, i) => {
                const bgClasses = [
                  "bg-[rgba(229,113,0,0.04)] dark:bg-[rgba(229,113,0,0.06)]",
                  "bg-[rgba(131,159,185,0.04)] dark:bg-[rgba(131,159,185,0.06)]",
                  "bg-[rgba(158,82,0,0.04)] dark:bg-[rgba(158,82,0,0.06)]",
                ];
                const badges = ["#E57100", "#839FB9", "#9E5200"];
                const badge = badges[i] ?? badges[2];
                return (
                  <div
                    key={c.name}
                    className={cn("flex items-center justify-between rounded-2xl border border-[rgba(37,37,37,0.06)] p-4 dark:border-[rgba(224,224,224,0.03)]", bgClasses[i] ?? bgClasses[2])}
                  >
                    {/* Rank badge */}
                    <div className="flex items-center gap-2 rounded-full px-2 py-0" style={{ background: badge }}>
                      {i === 0 && (
                        <svg width="12" height="9" viewBox="0 0 11 9" fill="none"><path d="M5.91604 0.22265C5.82331 0.0835506 5.66719 0 5.50002 0C5.33284 0 5.17672 0.0835506 5.08399 0.22265L3.32883 2.85539L0.723624 1.55279C0.552173 1.46706 0.346803 1.4869 0.194933 1.60386C0.043064 1.72083 -0.0285686 1.91432 0.010527 2.10198L1.09468 7.30593C1.2396 8.00151 1.85264 8.5 2.56315 8.5H8.43688C9.14739 8.5 9.76044 8.00151 9.90535 7.30593L10.9895 2.10198C11.0286 1.91432 10.957 1.72083 10.8051 1.60386C10.6532 1.4869 10.4479 1.46706 10.2764 1.55279L7.6712 2.85539L5.91604 0.22265Z" fill="white" /></svg>
                      )}
                      <span className="font-inter text-base font-medium tracking-[-0.02em] text-white">{i + 1}</span>
                    </div>
                    {/* Creator info */}
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-foreground/[0.08]" />
                      <div className="flex flex-col gap-1.5">
                        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{c.name}</span>
                        <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">{c.earned}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Pending Drafts */}
        <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none">
          <div className="flex items-center justify-between">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Pending drafts</span>
            <Link href="/submissions" className="group flex cursor-pointer items-center gap-1.5">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted transition-colors duration-150 group-hover:text-page-text">View all</span>
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none" className="shrink-0 text-page-text-muted transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-page-text"><path d="M5.5 0.5L8.5 3.49999L5.5 6.5M8 3.49999H0.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { name: "Lila Bennett", desc: "NFL UGC · Revision 2 uploaded", badge: "R2", badgeColor: "#FB923C" },
              { name: "Marcus Cole", desc: "Caffeine Exclusive - New draft", badge: "New", badgeColor: "#60A5FA" },
            ].map((draft) => (
              <div key={draft.name} className="flex items-center gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-foreground/[0.02] dark:border-[rgba(224,224,224,0.03)] dark:bg-foreground/[0.03] dark:shadow-none dark:hover:bg-foreground/[0.06]">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M3 0C3.36819 0 3.66667 0.298477 3.66667 0.666667H5C5 0.298477 5.29848 0 5.66667 0C6.03486 0 6.33333 0.298477 6.33333 0.666667H7.66667C7.66667 0.298477 7.96514 0 8.33333 0C8.70152 0 9 0.298477 9 0.666667H9.33333C10.4379 0.666667 11.3333 1.5621 11.3333 2.66667V11.3333C11.3333 12.4379 10.4379 13.3333 9.33333 13.3333H2C0.895431 13.3333 0 12.4379 0 11.3333V2.66667C0 1.5621 0.895431 0.666667 2 0.666667H2.33333C2.33333 0.298477 2.63181 0 3 0ZM3 5.66667C3 5.29848 3.29848 5 3.66667 5H7.66667C8.03486 5 8.33333 5.29848 8.33333 5.66667C8.33333 6.03486 8.03486 6.33333 7.66667 6.33333H3.66667C3.29848 6.33333 3 6.03486 3 5.66667ZM3 8.33333C3 7.96514 3.29848 7.66667 3.66667 7.66667H6.33333C6.70152 7.66667 7 7.96514 7 8.33333C7 8.70152 6.70152 9 6.33333 9H3.66667C3.29848 9 3 8.70152 3 8.33333Z" fill="currentColor" fillOpacity="0.5"/>
                  </svg>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="truncate font-inter text-xs font-medium tracking-[-0.02em] text-page-text">{draft.name}</span>
                  <span className="truncate font-inter text-xs tracking-[-0.02em] text-page-text-muted">{draft.desc}</span>
                </div>
                <span className="shrink-0 font-inter text-xs font-medium tracking-[-0.02em]" style={{ color: draft.badgeColor }}>{draft.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Creator Details Popup */}
      <CreatorDetailsPopup
        open={creatorPopupOpen}
        onClose={() => setCreatorPopupOpen(false)}
        creator={MOCK_CREATOR_DETAILS}
      />
    </div>
  );
}

// ease-out-quint
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

// ── Page ───────────────────────────────────────────────────────────

// ── Empty State (no campaigns yet) ────────────────────────────────

function EmptyHomeState({ onNewCampaign }: { onNewCampaign: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-page-bg px-4 sm:px-5">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Home</span>
        <button
          onClick={onNewCampaign}
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground px-4 pl-3 font-inter text-[14px] font-medium tracking-[-0.02em] text-white transition-opacity hover:opacity-90 dark:text-[#111111]"
        >
          <PlusIcon className="size-4" />
          New Campaign
        </button>
      </div>

      {/* Empty content */}
      <div className="flex flex-1 flex-col items-center px-5 pt-[80px] sm:pt-[160px]">
        <div className="flex flex-col items-center gap-4">
          {/* Icon circle */}
          <div className="relative flex size-14 items-center justify-center rounded-full bg-white shadow-[0_0_0_2px_#FFFFFF] dark:bg-card-bg dark:shadow-none">
            <div className="pointer-events-none absolute inset-0 rounded-full dark:hidden" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(37,37,37,0) 0%, rgba(37,37,37,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} /><div className="pointer-events-none absolute inset-0 rounded-full hidden dark:block" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(224,224,224,0) 0%, rgba(224,224,224,0.2) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
            <MegaphoneIcon className="size-6 text-page-text" width={24} height={24} />
          </div>

          {/* Text */}
          <div className="flex flex-col items-center gap-2">
            <h2 className="font-inter text-[18px] font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
              It&apos;s quiet in here (for now)
            </h2>
            <p className="max-w-[360px] text-center font-inter text-[14px] leading-[1.5] tracking-[-0.02em] text-[rgba(37,37,37,0.7)] dark:text-white/50">
              Launch a campaign and this dashboard will light up with views, CPM, creator payouts, drafts, and anything that needs your attention.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={onNewCampaign}
            className="mt-2 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground px-4 pl-3 font-inter text-[14px] font-medium tracking-[-0.02em] text-white transition-opacity hover:opacity-90 dark:text-[#111111]"
          >
            <PlusIcon className="size-4" />
            New Campaign
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Home KPI Carousel (mobile) ────────────────────────────────────

function HomeKpiCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cards = [
    <KpiCardBalance key="balance" />,
    <KpiCardActive key="active" />,
    <KpiCardViews key="views" />,
    <KpiCardAvgCpm key="cpm" />,
    <KpiCardPaidOut key="paid" />,
  ];

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !el.children[0]) return;
    const childWidth = (el.children[0] as HTMLElement).offsetWidth;
    if (childWidth === 0) return;
    const index = Math.round(el.scrollLeft / (childWidth + 8));
    setActiveIndex(Math.min(index, cards.length - 1));
  }, [cards.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="-mx-4 flex flex-col items-center gap-2 md:hidden sm:-mx-5">
      <div
        ref={scrollRef}
        className="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto pl-4 scrollbar-hide sm:pl-5 [scroll-padding-inline:16px]"
      >
        {cards.map((card, i) => (
          <div key={i} className={cn(
            "w-[calc(100vw-56px)] max-w-80 shrink-0 [&>*]:h-full",
            "snap-start snap-always",
            i === cards.length - 1 && "mr-4 sm:mr-5",
          )}>
            {card}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1">
        {cards.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              const child = scrollRef.current?.children[i] as HTMLElement | undefined;
              child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }}
            className={cn(
              "size-1.5 cursor-pointer rounded-full transition-colors",
              i === activeIndex ? "bg-[#252525] dark:bg-[#E0E0E0]" : "bg-[rgba(37,37,37,0.1)] dark:bg-[rgba(224,224,224,0.1)]",
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ── Floating Onboarding Checklist ──────────────────────────────────

function FloatingProgressRing({ completed, total }: { completed: number; total: number }) {
  const size = 36;
  const stroke = 1.8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? completed / total : 0;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="relative size-9 shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90">
        {/* Track */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(52,211,153,0.2)" strokeWidth={stroke} />
        {/* Progress */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#34D399" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} style={{ transition: "stroke-dashoffset 0.5s ease" }} />
      </svg>
      {/* Person icon */}
      <svg width="16" height="16" viewBox="0 0 11 13" fill="none" className="absolute left-[10px] top-[10px]">
        <path d="M5.40885 0C3.752 0 2.40885 1.34315 2.40885 3C2.40885 4.65685 3.752 6 5.40885 6C7.06571 6 8.40885 4.65685 8.40885 3C8.40885 1.34315 7.06571 0 5.40885 0Z" fill="#E0E0E0" fillOpacity="0.7" />
        <path d="M5.40984 6.66667C2.85524 6.66667 0.900095 8.19748 0.10622 10.344C-0.120734 10.9577 0.0346501 11.5625 0.395422 11.9925C0.747004 12.4115 1.28974 12.6667 1.8744 12.6667H8.94528C9.52995 12.6667 10.0727 12.4115 10.4243 11.9925C10.785 11.5625 10.9404 10.9577 10.7135 10.344C9.91959 8.19748 7.96444 6.66667 5.40984 6.66667Z" fill="#E0E0E0" fillOpacity="0.7" />
      </svg>
    </div>
  );
}

function FloatingOnboardingChecklist({
  completed,
  onToggle,
  onResume,
}: {
  completed: Record<string, boolean>;
  onToggle: (key: string) => void;
  onResume: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const completedCount = STEPS.filter((s) => s.completed || completed[s.key]).length;
  const nextStep = STEPS.find((s) => !s.completed && !completed[s.key]);

  return (
    <motion.div
      className="fixed bottom-5 right-5 z-50 flex flex-col overflow-hidden rounded-2xl border border-[rgba(224,224,224,0.03)] bg-[#252525] shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      style={{ width: 360, maxWidth: "calc(100vw - 40px)" }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Collapsed bar */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex cursor-pointer items-center gap-3 px-4 py-4"
      >
        <FloatingProgressRing completed={completedCount} total={STEPS.length} />
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5 overflow-hidden">
          <div className="flex w-full min-w-0 items-center gap-1">
            <span className="shrink-0 font-inter text-[12px] leading-none tracking-[-0.02em] text-[rgba(224,224,224,0.5)]">
              {completedCount}/{STEPS.length}
            </span>
            <span className="min-w-0 truncate font-inter text-[12px] font-medium leading-none tracking-[-0.02em] text-[#E0E0E0]">
              {nextStep ? nextStep.title : "Setup complete!"}
            </span>
          </div>
          {nextStep?.description && (
            <span className="w-full truncate font-inter text-[12px] leading-none tracking-[-0.02em] text-[rgba(224,224,224,0.5)]">
              {nextStep.description}
            </span>
          )}
        </div>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="shrink-0 text-white/40"
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>

      {/* Expanded steps list */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-0.5 border-t border-white/[0.06] px-3 py-2">
              {STEPS.map((step) => {
                const isComplete = step.completed || completed[step.key];
                return (
                  <button
                    key={step.key}
                    type="button"
                    onClick={() => {
                      if (!isComplete && !step.completed) onToggle(step.key);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                      isComplete
                        ? ""
                        : "cursor-pointer hover:bg-white/[0.04]",
                    )}
                    disabled={isComplete}
                  >
                    {/* Check circle */}
                    <div className="flex size-5 shrink-0 items-center justify-center">
                      {isComplete ? (
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <circle cx="9" cy="9" r="9" fill="#34D399" />
                          <path d="M5.5 9.5L7.5 11.5L12.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <div className="size-[18px] rounded-full border-[1.5px] border-[rgba(52,211,153,0.2)]" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className={cn(
                        "truncate text-[13px] font-medium leading-tight tracking-[-0.01em]",
                        isComplete ? "text-white/50 line-through" : "text-white",
                      )}>
                        {step.title}
                      </span>
                      {!isComplete && step.description && (
                        <span className="truncate text-[11px] leading-tight text-white/40">
                          {step.description}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
              <button
                type="button"
                onClick={onResume}
                className="cursor-pointer text-[12px] font-medium tracking-[-0.01em] text-white/40 transition-colors hover:text-white/60"
              >
                Back to setup
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────

export default function Home() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [skipped, setSkipped] = useState(false);

  const onToggle = useCallback((key: string) => {
    setCompleted((prev) => ({ ...prev, [key]: true }));
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const allDone = STEPS.every((s) => s.completed || completed[s.key]);
  const showOnboarding = !allDone && !skipped;
  const showFloatingChecklist = skipped && !allDone;

  return (
    <div className="flex flex-1 flex-col bg-page-bg">
      <AnimatePresence mode="wait">
        {showOnboarding ? (
          <motion.div
            key="onboarding"
            className="flex flex-1 flex-col"
            style={{ willChange: "transform, opacity" }}
            exit={{
              opacity: 0,
              x: -30,
              transition: { duration: 0.2, ease: EASE_OUT },
            }}
          >
            <OnboardingView
              completed={completed}
              onToggle={onToggle}
              onSkip={() => setSkipped(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            style={{ willChange: "transform, opacity" }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
          >
            <motion.div
              className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-page-bg px-4 sm:px-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.08, ease: EASE_OUT }}
            >
              <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Home</span>
              <div className="flex items-center gap-2">
                <NewCampaignButton />
                <div className="hidden sm:block"><UserDropdown variant="header" /></div>
              </div>
            </motion.div>
            <DashboardView />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating checklist for skipped users — portaled to body to escape contain:layout */}
      {mounted && createPortal(
        <AnimatePresence>
          {showFloatingChecklist && (
            <FloatingOnboardingChecklist
              completed={completed}
              onToggle={onToggle}
              onResume={() => setSkipped(false)}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}
