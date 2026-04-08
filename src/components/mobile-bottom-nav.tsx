"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, type SVGProps } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { haptic } from "@/lib/haptics";

// ── Tab bar icons — exact copies from sidebar/icons/ ───────────────

function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="19" viewBox="0 0 18 19" fill="currentColor" {...props}>
      <path d="M10.6996 0.527874C9.67583 -0.175959 8.32417 -0.175957 7.30041 0.527875L1.30041 4.65287C0.48635 5.21254 0 6.13711 0 7.125V15.0729C0 16.7298 1.34315 18.0729 3 18.0729H5.5C6.05228 18.0729 6.5 17.6252 6.5 17.0729V13.5729C6.5 12.1922 7.61929 11.0729 9 11.0729C10.3807 11.0729 11.5 12.1922 11.5 13.5729V17.0729C11.5 17.6252 11.9477 18.0729 12.5 18.0729H15C16.6569 18.0729 18 16.7298 18 15.0729V7.125C18 6.13711 17.5136 5.21254 16.6996 4.65287L10.6996 0.527874Z" />
    </svg>
  );
}

function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M9 0C5.10603 0 1.89608 3.05346 1.70162 6.94257L1.5222 10.5309C1.5153 10.6691 1.48977 10.8044 1.41788 10.9282L0.190983 13.382C0.0653873 13.6332 0 13.9102 0 14.191C0 15.1901 0.809925 16 1.80902 16H4.10003C4.56329 18.2822 6.58108 20 9 20C11.4189 20 13.4367 18.2822 13.9 16H16.191C17.1901 16 18 15.1901 18 14.191C18 13.9102 17.9346 13.6332 17.809 13.382L16.5821 10.9282C16.5203 10.8044 16.4847 10.6691 16.4778 10.5309L16.2984 6.94258C16.1039 3.05347 12.894 0 9 0ZM9 18C7.69381 18 6.58254 17.1653 6.17071 16H11.8293C11.4175 17.1653 10.3062 18 9 18Z" />
    </svg>
  );
}

function MegaphoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="19" viewBox="0 0 20 19" fill="currentColor" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M13.0902 0.143424C15.0251 -0.472339 17 0.971661 17 3.00214V4.39284C18.725 4.83689 20 6.40299 20 8.26683C20 10.1307 18.725 11.6968 17 12.1408V13.5315C17 15.562 15.0251 17.006 13.0902 16.3902L11.6393 15.9285C11.009 17.3072 9.61761 18.2669 8 18.2669C5.79086 18.2669 4 16.476 4 14.2669V13.4879L2.08814 12.8779C0.844349 12.481 0 11.3254 0 10.0199V6.51377C0 5.2082 0.844349 4.05253 2.08814 3.6557L4.57581 2.8612C4.62227 2.83009 4.67069 2.80163 4.72073 2.77697L13.0902 0.143424ZM6 14.1338V14.2669C6 15.3714 6.89543 16.2669 8 16.2669C8.72001 16.2669 9.35284 15.8859 9.70521 15.3129L6 14.1338ZM18 8.26683C18 9.00711 17.5979 9.6534 17 9.99926V6.53441C17.5979 6.88027 18 7.52655 18 8.26683ZM4.0022 5.14436V11.3893L2.69606 10.9726C2.28146 10.8403 2 10.4551 2 10.0199V6.51377C2 6.07858 2.28146 5.69335 2.69606 5.56107L4.0022 5.14436Z" />
    </svg>
  );
}

function SubmissionsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="currentColor" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M2 1C2 0.447715 2.44772 0 3 0H17C17.5523 0 18 0.447715 18 1C18 1.55228 17.5523 2 17 2H3C2.44772 2 2 1.55228 2 1ZM0 6C0 4.34315 1.34315 3 3 3H17C18.6569 3 20 4.34315 20 6V15C20 16.6569 18.6569 18 17 18H3C1.34315 18 0 16.6569 0 15V6ZM8.56681 7.5987C8.91328 7.43218 9.32452 7.479 9.62469 7.71913L12.1247 9.71913C12.3619 9.9089 12.5 10.1962 12.5 10.5C12.5 10.8038 12.3619 11.0911 12.1247 11.2809L9.62469 13.2809C9.32452 13.521 8.91328 13.5678 8.56681 13.4013C8.22034 13.2348 8 12.8844 8 12.5V8.5C8 8.11559 8.22034 7.76522 8.56681 7.5987Z" />
    </svg>
  );
}

function MoreDotsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="4" viewBox="0 0 20 4" fill="currentColor" {...props}>
      <circle cx="2" cy="2" r="2" />
      <circle cx="10" cy="2" r="2" />
      <circle cx="18" cy="2" r="2" />
    </svg>
  );
}

// ── "More" popup icons — from sidebar/icons/ & app-sidebar-nav ─────

function PieChartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 14 14" fill="currentColor" {...props}>
      <path d="M13.1444 8.21619C13.2679 7.70895 13.3333 7.17899 13.3333 6.63375C13.3333 3.17685 10.7022 0.334483 7.33333 5.10075e-09V6.1623L13.1444 8.21619Z" />
      <path d="M12.7001 9.47332L6.44451 7.26231C6.17811 7.16815 6 6.9163 6 6.63375V0C2.63112 0.334483 0 3.17685 0 6.63375C0 10.3156 2.98477 13.3004 6.66667 13.3004C9.333 13.3004 11.6337 11.7351 12.7001 9.47332Z" />
    </svg>
  );
}

function CreatorsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 15 12" fill="currentColor" {...props}>
      <path d="M1.80664 2.66667C1.80664 1.19391 3.00055 0 4.47331 0C5.94607 0 7.13997 1.19391 7.13997 2.66667C7.13997 4.13943 5.94607 5.33333 4.47331 5.33333C3.00055 5.33333 1.80664 4.13943 1.80664 2.66667Z" />
      <path d="M7.80664 2.66667C7.80664 1.19391 9.00055 0 10.4733 0C11.9461 0 13.14 1.19391 13.14 2.66667C13.14 4.13943 11.9461 5.33333 10.4733 5.33333C9.00055 5.33333 7.80664 4.13943 7.80664 2.66667Z" />
      <path d="M4.47313 6C6.38699 6 8.20239 7.32044 8.87806 9.74236C9.23135 11.0087 8.15128 12 7.0425 12H1.90376C0.794992 12 -0.285082 11.0087 0.0682094 9.74235C0.74388 7.32043 2.55928 6 4.47313 6Z" />
      <path d="M10.1629 9.38406C9.83767 8.21837 9.27857 7.23238 8.5599 6.46807C9.15691 6.15907 9.80933 6 10.4736 6C12.3875 6 14.2029 7.32044 14.8785 9.74236C15.2318 11.0087 14.1518 12 13.043 12H9.69378C10.2058 11.3033 10.4396 10.3761 10.1629 9.38406Z" />
    </svg>
  );
}

function PayoutsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 14" fill="currentColor" {...props}>
      <path d="M0.567487 11.3535C0.19617 10.7936 5.6031e-06 10.1187 0 9.33334C0.300044 7.23302 1.68041 5.67287 3.16866 4.16667H8.90142C10.2937 5.64371 11.6971 7.21336 12 9.33333C12 10.1187 11.8038 10.7936 11.4325 11.3535C11.0638 11.9095 10.5486 12.3127 9.96957 12.6017C8.83122 13.1699 7.37236 13.3333 6 13.3333C4.62764 13.3333 3.16878 13.1699 2.03044 12.6017C1.45144 12.3127 0.936236 11.9095 0.567487 11.3535Z" />
      <path d="M8.60073 2.08518C8.88036 1.33948 8.5969 0.472331 7.83294 0.247323C7.2636 0.0796353 6.65171 0 6 0C5.34829 0 4.7364 0.0796353 4.16706 0.247323C3.4031 0.472331 3.11964 1.33948 3.39927 2.08518L3.8015 3.15777L3.77778 3.16667H8.22222L8.1985 3.15777L8.60073 2.08518Z" />
    </svg>
  );
}

function FinanceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 14 11" fill="currentColor" {...props}>
      <path d="M2 0C0.895431 0 0 0.895431 0 2V3.33333H13.3333V1.99983C13.3333 0.895158 12.4378 0 11.3333 0H2Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M0 8.66667V4.66667H13.3333V8.66667C13.3333 9.77124 12.4379 10.6667 11.3333 10.6667H2C0.89543 10.6667 0 9.77124 0 8.66667ZM3.33333 6C2.96514 6 2.66667 6.29848 2.66667 6.66667C2.66667 7.03486 2.96514 7.33333 3.33333 7.33333H5.33333C5.70152 7.33333 6 7.03486 6 6.66667C6 6.29848 5.70152 6 5.33333 6H3.33333Z" />
    </svg>
  );
}

function HelpCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 14 14" fill="currentColor" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M6.66667 0C2.98477 0 0 2.98477 0 6.66667C0 10.3486 2.98477 13.3333 6.66667 13.3333C10.3486 13.3333 13.3333 10.3486 13.3333 6.66667C13.3333 2.98477 10.3486 0 6.66667 0ZM6.66667 4.66667C6.41512 4.66667 6.19509 4.80573 6.08099 5.01434C5.9043 5.33737 5.49921 5.45601 5.17618 5.27933C4.85315 5.10264 4.73452 4.69755 4.9112 4.37452C5.24976 3.75554 5.90843 3.33333 6.66667 3.33333C7.6765 3.33333 8.37793 4.00428 8.57763 4.79267C8.77839 5.58524 8.47339 6.50866 7.5611 6.96481C7.42151 7.0346 7.33334 7.17727 7.33334 7.33333C7.33334 7.70152 7.03486 8 6.66667 8C6.29848 8 6.00001 7.70152 6.00001 7.33333C6.00001 6.67224 6.37352 6.06789 6.96481 5.77224C7.26798 5.62066 7.34585 5.35982 7.28512 5.12006C7.22333 4.87612 7.01888 4.66667 6.66667 4.66667ZM6.66667 10C7.03486 10 7.33333 9.70152 7.33333 9.33333C7.33333 8.96514 7.03486 8.66667 6.66667 8.66667C6.29848 8.66667 6 8.96514 6 9.33333C6 9.70152 6.29848 10 6.66667 10Z" />
    </svg>
  );
}

function GearIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="1.8 1.8 20.4 20.4" fill="currentColor" {...props}>
      <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
    </svg>
  );
}

function RobotIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 14" fill="currentColor" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M6 0C6.36819 0 6.66667 0.298477 6.66667 0.666667V1.33333H9.33333C10.4379 1.33333 11.3333 2.22876 11.3333 3.33333V6.66667C11.3333 7.259 11.0758 7.79119 10.6667 8.1574V9.05719L11.8047 10.1953C12.0651 10.4556 12.0651 10.8777 11.8047 11.1381C11.5444 11.3984 11.1223 11.3984 10.8619 11.1381L10.454 10.7302C9.86034 12.6251 8.09073 14 6 14C3.90927 14 2.13966 12.6251 1.54598 10.7302L1.13807 11.1381C0.877722 11.3984 0.455612 11.3984 0.195262 11.1381C-0.0650874 10.8777 -0.0650874 10.4556 0.195262 10.1953L1.33333 9.05719V8.1574C0.924167 7.79119 0.666667 7.259 0.666667 6.66667V3.33333C0.666667 2.22876 1.5621 1.33333 2.66667 1.33333H5.33333V0.666667C5.33333 0.298477 5.63181 0 6 0ZM2.66667 2.66667C2.29848 2.66667 2 2.96514 2 3.33333V6.66667C2 7.03486 2.29848 7.33333 2.66667 7.33333H9.33333C9.70152 7.33333 10 7.03486 10 6.66667V3.33333C10 2.96514 9.70152 2.66667 9.33333 2.66667H2.66667ZM4 4C4.36819 4 4.66667 4.29848 4.66667 4.66667V5.33333C4.66667 5.70152 4.36819 6 4 6C3.63181 6 3.33333 5.70152 3.33333 5.33333V4.66667C3.33333 4.29848 3.63181 4 4 4ZM8 4C8.36819 4 8.66667 4.29848 8.66667 4.66667V5.33333C8.66667 5.70152 8.36819 6 8 6C7.63181 6 7.33333 5.70152 7.33333 5.33333V4.66667C7.33333 4.29848 7.63181 4 8 4Z" />
    </svg>
  );
}

function LogoutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M9 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── Creator-specific icons ─────────────────────────────────────────

function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 14 14" fill="currentColor" {...props}>
      <path d="M5.4 0.600001C5.4 0.268631 5.13137 0.000001 4.8 0.000001C4.46863 0.000001 4.2 0.268631 4.2 0.600001V2.43432L2.97573 1.21005C2.74142 0.975737 2.35858 0.975737 2.12426 1.21005C1.88995 1.44436 1.88995 1.82721 2.12426 2.06152L3.34853 3.28579L1.2 3.28579C0.868629 3.28579 0.6 3.55442 0.6 3.88579C0.6 4.21716 0.86863 4.48579 1.2 4.48579H3.34853L2.12426 5.71007C1.88995 5.94438 1.88995 6.32722 2.12426 6.56153C2.35858 6.79585 2.74142 6.79585 2.97574 6.56153L4.2 5.33727V7.17158C4.2 7.50295 4.46863 7.77158 4.8 7.77158C5.13137 7.77158 5.4 7.50295 5.4 7.17158V5.33727L6.62426 6.56153C6.85858 6.79585 7.24142 6.79585 7.47574 6.56153C7.71005 6.32722 7.71005 5.94438 7.47574 5.71006L6.25147 4.48579H8.4C8.73137 4.48579 9 4.21716 9 3.88579C9 3.55442 8.73137 3.28579 8.4 3.28579H6.25147L7.47574 2.06152C7.71005 1.82721 7.71005 1.44436 7.47574 1.21005C7.24142 0.975737 6.85858 0.975737 6.62426 1.21005L5.4 2.43432V0.600001Z" />
      <path d="M10.8 6.6C10.8 6.26863 10.5314 6 10.2 6C9.86863 6 9.6 6.26863 9.6 6.6V7.83432L8.97574 7.21005C8.74142 6.97574 8.35858 6.97574 8.12426 7.21005C7.88995 7.44437 7.88995 7.82721 8.12426 8.06152L8.74853 8.68579H7.2C6.86863 8.68579 6.6 8.95442 6.6 9.28579C6.6 9.61716 6.86863 9.88579 7.2 9.88579H8.74853L8.12426 10.5101C7.88995 10.7444 7.88995 11.1272 8.12426 11.3615C8.35858 11.5959 8.74142 11.5959 8.97574 11.3615L9.6 10.7373V12.5716C9.6 12.9029 9.86863 13.1716 10.2 13.1716C10.5314 13.1716 10.8 12.9029 10.8 12.5716V10.7373L11.4243 11.3615C11.6586 11.5959 12.0414 11.5959 12.2757 11.3615C12.5101 11.1272 12.5101 10.7444 12.2757 10.5101L11.6515 9.88579H13.2C13.5314 9.88579 13.8 9.61716 13.8 9.28579C13.8 8.95442 13.5314 8.68579 13.2 8.68579H11.6515L12.2757 8.06152C12.5101 7.82721 12.5101 7.44437 12.2757 7.21005C12.0414 6.97574 11.6586 6.97574 11.4243 7.21005L10.8 7.83432V6.6Z" />
    </svg>
  );
}

function CompassIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 14 14" fill="currentColor" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM9.73482 4.26518C10.0382 4.56855 10.098 5.03461 9.8736 5.40073L8.41667 7.77778L10.7936 6.32085C11.1597 6.09643 11.6258 6.15626 11.9292 6.45962C12.3066 6.83697 12.2261 7.46234 11.7663 7.73409L7.31536 10.3664C7.0959 10.4962 6.84224 10.548 6.59367 10.5129C6.26002 10.4658 5.97558 10.2534 5.82807 9.95397L3.23368 4.69413C3.01784 4.25714 3.30003 3.7381 3.78037 3.67029C4.03289 3.63359 4.28913 3.68826 4.50592 3.8245L6.22222 4.90278L5.10519 3.22741C4.8334 2.76766 5.16302 2.19344 5.69321 2.11961C5.94197 2.08498 6.19478 2.13783 6.41139 2.26908L9.73482 4.26518Z" />
    </svg>
  );
}

function TrophyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 14 14" fill="currentColor" {...props}>
      <path d="M4.33333 0C3.96514 0 3.66667 0.298477 3.66667 0.666667V1.33333H2C1.63181 1.33333 1.33333 1.63181 1.33333 2V4C1.33333 5.10457 2.22876 6 3.33333 6H3.52669C4.08503 7.18889 5.22222 8.00445 6.33333 8.33815V10H5C4.63181 10 4.33333 10.2985 4.33333 10.6667V12.6667C4.33333 13.0349 4.63181 13.3333 5 13.3333H9C9.36819 13.3333 9.66667 13.0349 9.66667 12.6667V10.6667C9.66667 10.2985 9.36819 10 9 10H7.66667V8.33815C8.77778 8.00445 9.91497 7.18889 10.4733 6H10.6667C11.7712 6 12.6667 5.10457 12.6667 4V2C12.6667 1.63181 12.3682 1.33333 12 1.33333H10.3333V0.666667C10.3333 0.298477 10.0349 0 9.66667 0H4.33333ZM3.33333 2.66667H3.66667V4.36853C3.66667 4.37874 3.66675 4.38894 3.66691 4.39913C3.54624 4.33753 3.44102 4.24976 3.35875 4.14235C3.23353 3.97864 3.12754 3.72818 3.07131 3.34133C3.04262 3.1436 2.93481 2.97015 2.77638 2.85709C2.72036 2.81716 2.66667 2.76135 2.66667 2.66667V2.66667C2.66667 2.29848 2.96514 2 3.33333 2V2.66667ZM10.3333 2.66667V2H10.6667C11.0349 2 11.3333 2.29848 11.3333 2.66667C11.3333 2.76135 11.2796 2.81716 11.2236 2.85709C11.0652 2.97015 10.9574 3.1436 10.9287 3.34133C10.8725 3.72818 10.7665 3.97864 10.6413 4.14235C10.559 4.24976 10.4538 4.33753 10.3331 4.39913C10.3332 4.38894 10.3333 4.37874 10.3333 4.36853V2.66667Z" />
    </svg>
  );
}

function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 15 12" fill="currentColor" {...props}>
      <path d="M1.80664 2.66667C1.80664 1.19391 3.00055 0 4.47331 0C5.94607 0 7.13997 1.19391 7.13997 2.66667C7.13997 4.13943 5.94607 5.33333 4.47331 5.33333C3.00055 5.33333 1.80664 4.13943 1.80664 2.66667Z" />
      <path d="M7.80664 2.66667C7.80664 1.19391 9.00055 0 10.4733 0C11.9461 0 13.14 1.19391 13.14 2.66667C13.14 4.13943 11.9461 5.33333 10.4733 5.33333C9.00055 5.33333 7.80664 4.13943 7.80664 2.66667Z" />
      <path d="M4.47313 6C6.38699 6 8.20239 7.32044 8.87806 9.74236C9.23135 11.0087 8.15128 12 7.0425 12H1.90376C0.794992 12 -0.285082 11.0087 0.0682094 9.74235C0.74388 7.32043 2.55928 6 4.47313 6Z" />
      <path d="M10.1629 9.38406C9.83767 8.21837 9.27857 7.23238 8.5599 6.46807C9.15691 6.15907 9.80933 6 10.4736 6C12.3875 6 14.2029 7.32044 14.8785 9.74236C15.2318 11.0087 14.1518 12 13.043 12H9.69378C10.2058 11.3033 10.4396 10.3761 10.1629 9.38406Z" />
    </svg>
  );
}

// ── Data ────────────────────────────────────────────────────────────

const BRAND_PRIMARY_TABS = [
  { href: "/", icon: HomeIcon, exact: true },
  { href: "/notifications", icon: BellIcon },
  { href: "/campaigns", icon: MegaphoneIcon },
  { href: "/submissions", icon: SubmissionsIcon },
];

const BRAND_MORE_ITEMS = [
  [
    { href: "/analytics", icon: PieChartIcon, label: "Insights" },
    { href: "/creators", icon: CreatorsIcon, label: "Creators" },
    { href: "/payouts", icon: PayoutsIcon, label: "Payouts" },
    { href: "/finances", icon: FinanceIcon, label: "Finances" },
  ],
  [
    { href: "/help", icon: HelpCircleIcon, label: "Help" },
    { href: "/settings", icon: GearIcon, label: "Settings" },
    { href: "#logout", icon: LogoutIcon, label: "Logout", isLogout: true },
  ],
] as const;

const CREATOR_PRIMARY_TABS = [
  { href: "/creator/dashboard", icon: HomeIcon, exact: true },
  { href: "/creator/for-you", icon: SparkleIcon },
  { href: "/creator/discover", icon: CompassIcon },
  { href: "/creator/submissions", icon: SubmissionsIcon },
];

const CREATOR_MORE_ITEMS = [
  [
    { href: "/creator/rewards", icon: TrophyIcon, label: "Rewards" },
    { href: "/creator/analytics", icon: PieChartIcon, label: "Insights" },
    { href: "/creator/community", icon: UsersIcon, label: "Community" },
    { href: "/creator/help", icon: HelpCircleIcon, label: "Help" },
  ],
  [
    { href: "/creator/settings", icon: GearIcon, label: "Settings" },
    { href: "/creator/ai-assistant", icon: RobotIcon, label: "AI Assistant", isAi: true },
    { href: "#logout", icon: LogoutIcon, label: "Logout", isLogout: true },
  ],
] as const;

// ── Component ──────────────────────────────────────────────────────

export function MobileBottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const isCreator = pathname === "/creator" || pathname.startsWith("/creator/");
  const PRIMARY_TABS = isCreator ? CREATOR_PRIMARY_TABS : BRAND_PRIMARY_TABS;
  const MORE_ITEMS = isCreator ? CREATOR_MORE_ITEMS : BRAND_MORE_ITEMS;

  // Close on outside click
  useEffect(() => {
    if (!moreOpen) return;
    function handler(e: MouseEvent) {
      if (
        popupRef.current && !popupRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [moreOpen]);

  // Close on navigation
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const isMoreActive = MORE_ITEMS.flat().some((item) =>
    "isLogout" in item ? false : pathname.startsWith(item.href),
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-foreground/[0.06] bg-page-bg md:hidden">
      <div className="relative flex items-stretch justify-around px-2 pb-[max(8px,env(safe-area-inset-bottom))]">
        {/* Primary tabs */}
        {PRIMARY_TABS.map(({ href, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => haptic("light")}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-3"
            >
              <Icon
                className={cn(
                  "transition-colors",
                  isActive ? "text-foreground" : "text-foreground/50",
                )}
              />
            </Link>
          );
        })}

        {/* More button */}
        <button
          ref={btnRef}
          type="button"
          onClick={() => { haptic("medium"); setMoreOpen((v) => !v); }}
          className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 py-3"
        >
          <MoreDotsIcon
            className={cn(
              "transition-colors",
              moreOpen || isMoreActive ? "text-foreground" : "text-foreground/50",
            )}
          />
        </button>

        {/* More popup */}
        <AnimatePresence>
          {moreOpen && (
            <motion.div
              ref={popupRef}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className="absolute bottom-[calc(100%+12px)] right-2 z-50 flex w-[304px] flex-col gap-2 rounded-[20px] border border-foreground/[0.06] bg-white p-3 shadow-[0_4px_12px_rgba(0,0,0,0.12)] dark:bg-card-bg"
            >
              {MORE_ITEMS.map((row, ri) => (
                <div key={ri} className="flex items-center gap-2">
                  {row.map((item) => {
                    const Icon = item.icon;
                    const isLogout = "isLogout" in item && item.isLogout;
                    const isAi = "isAi" in item && item.isAi;
                    const isActive = !isLogout && !isAi && pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={(e) => {
                          haptic("light");
                          if (isLogout) e.preventDefault();
                          setMoreOpen(false);
                        }}
                        className="flex w-16 flex-col items-center gap-1"
                      >
                        <div
                          className={cn(
                            "flex h-14 w-16 items-center justify-center rounded-2xl transition-colors",
                            isLogout
                              ? "bg-[rgba(255,51,85,0.08)]"
                              : isAi
                                ? "bg-[rgba(229,113,0,0.08)]"
                                : isActive
                                  ? "bg-foreground/[0.08]"
                                  : "bg-foreground/[0.04]",
                          )}
                        >
                          <Icon
                            className={cn(
                              "size-6",
                              isLogout
                                ? "text-[#FF3355]"
                                : isAi
                                  ? "text-[#FF6207]"
                                  : isActive
                                    ? "text-foreground"
                                    : "text-foreground/50",
                            )}
                          />
                        </div>
                        <span
                          className={cn(
                            "font-inter text-[10px] font-medium tracking-[-0.02em]",
                            isLogout
                              ? "text-[#FF3355]"
                              : isActive
                                ? "text-foreground"
                                : "text-foreground/50",
                          )}
                        >
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
