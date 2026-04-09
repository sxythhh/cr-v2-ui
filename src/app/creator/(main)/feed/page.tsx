"use client";

import { useState, useRef, useCallback } from "react";
import { VerifiedBadge } from "@/components/verified-badge";

/* ─── Inline SVG Icons ─── */

function ClockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM5.5 3C5.5 2.72386 5.27614 2.5 5 2.5C4.72386 2.5 4.5 2.72386 4.5 3V5C4.5 5.13261 4.55268 5.25979 4.64645 5.35355L5.89645 6.60355C6.09171 6.79882 6.40829 6.79882 6.60355 6.60355C6.79882 6.40829 6.79882 6.09171 6.60355 5.89645L5.5 4.79289V3Z" fill="#E57100"/>
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M1.4 2.79952V2.1C1.4 1.7134 1.0866 1.4 0.699999 1.4C0.3134 1.4 0 1.7134 0 2.1L0 4.9C0 5.2866 0.3134 5.6 0.699999 5.6H3.5C3.8866 5.6 4.2 5.2866 4.2 4.9C4.2 4.5134 3.8866 4.2 3.5 4.2H2.14898C3.11776 2.52528 4.9281 1.4 6.99997 1.4C10.0928 1.4 12.6 3.9072 12.6 6.99999C12.6 10.0928 10.0928 12.6 6.99997 12.6C4.56279 12.6 2.48754 11.0427 1.71845 8.86672C1.58961 8.50222 1.18969 8.31117 0.825187 8.44001C0.460686 8.56884 0.269639 8.96876 0.398471 9.33327C1.35909 12.0511 3.95104 14 6.99997 14C10.866 14 14 10.866 14 6.99999C14 3.134 10.866 0 6.99997 0C4.70934 0 2.67667 1.10015 1.4 2.79952ZM6.99999 3.5C7.38659 3.5 7.69999 3.8134 7.69999 4.2V6.71005L9.59497 8.60502C9.86833 8.87839 9.86833 9.3216 9.59497 9.59497C9.3216 9.86833 8.87839 9.86833 8.60502 9.59497L6.50502 7.49497C6.37375 7.36369 6.3 7.18565 6.3 6.99999V4.2C6.3 3.8134 6.6134 3.5 6.99999 3.5Z" fill="currentColor"/>
    </svg>
  );
}

function FireIcon({ color = "#E57100", size = 17 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 21 / 17)} viewBox="0 0 17 21" fill="none">
      <path d="M8.51396 0.208065C8.25054 0.00496685 7.90338-0.0538589 7.58776 0.0511229C7.27214 0.156105 7.02938 0.41115 6.9401 0.731564C6.40252 2.66076 5.30009 3.72279 3.88321 5.08776C3.69231 5.27166 3.4957 5.46107 3.29399 5.65884L3.29327 5.65955C2.66347 6.2783 2.01344 6.97921 1.47947 7.77351C-0.10526 10.1324-0.494745 12.8042 0.691908 15.4905L0.692368 15.4916C2.67036 19.9555 7.09805 21.2414 10.7967 20.1098C14.5098 18.9739 17.5545 15.3977 16.9146 10.2438C16.7168 8.63839 16.1742 6.97856 14.833 5.67108C14.6223 5.4657 14.3319 5.36353 14.039 5.39177C13.7461 5.42001 13.4806 5.57579 13.313 5.81764C13.1728 6.01995 12.8537 6.40993 12.4712 6.86081C12.405 6.05839 12.238 5.28642 11.9543 4.54113C11.332 2.90612 10.1853 1.49669 8.51396 0.208065Z" fill={color}/>
    </svg>
  );
}

function FireIconSmall({ color = "#E57100" }: { color?: string }) {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
      <path d="M5.81502 0.142108C5.6351 0.00339235 5.39799-0.0367855 5.18242 0.0349168C4.96686 0.106619 4.80105 0.280815 4.74007 0.499657C4.37291 1.8173 3.61995 2.54266 2.65223 3.47493C2.52184 3.60054 2.38755 3.7299 2.24979 3.86498L2.2493 3.86546C1.81915 4.28806 1.37517 4.76679 1.01047 5.30929C-0.0718926 6.92039-0.33791 8.74527 0.472572 10.58L0.472886 10.5807C1.82385 13.6296 4.84796 14.5078 7.37413 13.735C9.91015 12.9591 11.9897 10.5166 11.5526 6.99647C11.4176 5.9 11.047 4.76634 10.1309 3.87334C9.98701 3.73306 9.78864 3.66328 9.58861 3.68257C9.38858 3.70185 9.2072 3.80825 9.09276 3.97344C8.99702 4.11162 8.77908 4.37797 8.51779 4.68592C8.4726 4.13787 8.35853 3.61061 8.16478 3.10158C7.73974 1.98488 6.95653 1.02224 5.81502 0.142108Z" fill={color}/>
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM10 3.5C10.5523 3.5 11 3.94772 11 4.5V5.12367C11.804 5.32711 12.5135 5.77457 12.9759 6.41405C13.2995 6.86159 13.199 7.48674 12.7515 7.81035C12.304 8.13396 11.6788 8.03349 11.3552 7.58595C11.1379 7.28549 10.6534 7 10 7H9.72222C8.82744 7 8.5 7.54492 8.5 7.77778V7.8541C8.5 8.05137 8.64913 8.38262 9.15254 8.58398L11.5902 9.55906C12.6572 9.98584 13.5 10.9386 13.5 12.1459C13.5 13.6189 12.323 14.6144 11 14.9091V15.5C11 16.0523 10.5523 16.5 10 16.5C9.44771 16.5 9 16.0523 9 15.5V14.8763C8.19595 14.6729 7.4865 14.2254 7.02411 13.586C6.7005 13.1384 6.80096 12.5133 7.24851 12.1897C7.69605 11.866 8.32119 11.9665 8.6448 12.414C8.86206 12.7145 9.34658 13 10 13H10.1824C11.1298 13 11.5 12.4209 11.5 12.1459C11.5 11.9486 11.3509 11.6174 10.8475 11.416L8.40976 10.4409C7.34283 10.0142 6.5 9.0614 6.5 7.8541V7.77778C6.5 6.31377 7.68936 5.33904 9 5.07331V4.5C9 3.94772 9.44771 3.5 10 3.5Z" fill="#AE4EEE"/>
    </svg>
  );
}

function WreathIcon() {
  return (
    <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.15174 0.398207C5.83563-0.0212427 5.24889-0.124651 4.80842 0.161459C3.64498 0.917195 2.79845 1.87371 2.58342 3.08435C2.4954 3.57995 2.52145 4.07161 2.64008 4.55538C2.4078 4.47613 2.16597 4.40794 1.9163 4.34982C1.40355 4.23045 0.886071 4.52908 0.732865 5.03275C0.32999 6.35723 0.301507 7.63207 0.920399 8.69626C1.0732 8.95901 1.25688 9.19412 1.46728 9.40395C1.21853 9.45116 0.966746 9.51372 0.713014 9.58979C0.20605 9.74177-0.0946992 10.2625 0.0269662 10.7775C0.345346 12.1254 0.962493 13.241 2.03076 13.8533C2.40101 14.0655 2.79666 14.2007 3.21115 14.2701C3.02941 14.4126 2.85062 14.5706 2.67558 14.7443C2.29033 15.1268 2.28057 15.7468 2.65359 16.1411C3.51214 17.0489 4.48234 17.6725 5.57167 17.7879C6.42108 17.878 7.21986 17.6468 7.9539 17.1904C7.86511 17.4661 7.62191 17.8039 7.0172 18.104C6.52252 18.3496 6.32055 18.9497 6.5661 19.4443C6.81165 19.939 7.41173 20.141 7.90642 19.8954C9.12827 19.2889 9.85289 18.3418 9.98031 17.2374C10.2186 15.1717 8.35907 13.4346 6.40367 13.2543C6.42678 13.1239 6.42422 12.987 6.39196 12.8504C6.14766 11.8161 5.72745 10.9186 5.06249 10.2804C5.12034 10.1969 5.16632 10.1033 5.19734 10.0013C5.55489 8.82587 5.61755 7.6895 5.1945 6.70478C6.26346 5.96884 7.03329 5.05034 7.23689 3.90399C7.45206 2.69258 6.98563 1.50469 6.15174 0.398207Z" fill="#00994D"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M16.1916 0.161459C15.7511-0.124651 15.1644-0.0212427 14.8483 0.398207C14.0144 1.50469 13.548 2.69258 13.7631 3.90399C13.9667 5.05034 14.7366 5.96884 15.8055 6.70478C15.3825 7.6895 15.4451 8.82587 15.8027 10.0013C15.8337 10.1033 15.8797 10.1969 15.9375 10.2804C15.2726 10.9186 14.8524 11.8161 14.6081 12.8504C14.5758 12.987 14.5732 13.1239 14.5963 13.2543C12.6409 13.4346 10.7814 15.1717 11.0197 17.2374C11.1471 18.3418 11.8717 19.2889 13.0936 19.8954C13.5883 20.141 14.1884 19.939 14.4339 19.4443C14.6795 18.9497 14.4775 18.3496 13.9828 18.104C13.3781 17.8039 13.1349 17.4661 13.0461 17.1904C13.7802 17.6468 14.5789 17.878 15.4284 17.7879C16.5177 17.6725 17.4879 17.0489 18.3464 16.1411C18.7194 15.7468 18.7097 15.1268 18.3244 14.7443C18.1494 14.5706 17.9706 14.4126 17.7889 14.2701C18.2034 14.2007 18.599 14.0655 18.9693 13.8533C20.0375 13.241 20.6547 12.1254 20.973 10.7775C21.0947 10.2625 20.794 9.74177 20.287 9.58979C20.0333 9.51372 19.7815 9.45116 19.5327 9.40395C19.7431 9.19412 19.9268 8.95901 20.0796 8.69626C20.6985 7.63207 20.67 6.35723 20.2672 5.03275C20.1139 4.52908 19.5965 4.23045 19.0837 4.34982C18.834 4.40794 18.5922 4.47613 18.3599 4.55538C18.4786 4.07161 18.5046 3.57995 18.4166 3.08435C18.2016 1.87371 17.355 0.917195 16.1916 0.161459Z" fill="#00994D"/>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.7463 0C14.698-0.00003 18.5369 2.27233 21.1031 6.58313C21.6226 7.45583 21.6226 8.54406 21.1031 9.41677C18.5369 13.7276 14.6981 16 10.7463 16C6.79463 16 2.95577 13.7277 0.38963 9.41687C-0.129877 8.54417-0.129876 7.45594 0.389629 6.58323C2.95577 2.27243 6.79462 0.00003 10.7463 0ZM7.24634 8C7.24634 6.067 8.81334 4.5 10.7463 4.5C12.6793 4.5 14.2463 6.067 14.2463 8C14.2463 9.933 12.6793 11.5 10.7463 11.5C8.81334 11.5 7.24634 9.933 7.24634 8Z" fill="#1A67E5"/>
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0ZM5 3.5C4.81134 3.5 4.64632 3.6043 4.56074 3.76076C4.42823 4.00303 4.12441 4.09201 3.88214 3.95949C3.63986 3.82698 3.55089 3.52316 3.6834 3.28089C3.93732 2.81665 4.43132 2.5 5 2.5C5.75738 2.5 6.28345 3.00321 6.43322 3.5945C6.58379 4.18893 6.35504 4.8815 5.67082 5.22361C5.56613 5.27595 5.5 5.38295 5.5 5.5C5.5 5.77614 5.27615 6 5 6C4.72386 6 4.5 5.77614 4.5 5.5C4.5 5.00418 4.78014 4.55092 5.22361 4.32918C5.45098 4.21549 5.50939 4.01987 5.46384 3.84005C5.41749 3.65709 5.26416 3.5 5 3.5ZM5 7.5C5.27614 7.5 5.5 7.27614 5.5 7C5.5 6.72386 5.27614 6.5 5 6.5C4.72386 6.5 4.5 6.72386 4.5 7C4.5 7.27614 4.72386 7.5 5 7.5Z" fill="currentColor" fillOpacity="0.4"/>
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="5" height="10" viewBox="0 0 5 10" fill="none">
      <path d="M4.3991 8.6122L0.747481 4.96059C0.551942 4.76505 0.551941 4.44802 0.74748 4.25248L4.3991 0.600857" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="5" height="10" viewBox="0 0 5 10" fill="none">
      <path d="M0.600826 0.600857L4.25244 4.25247C4.44798 4.448 4.44798 4.76504 4.25244 4.96058L0.600826 8.6122" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MoneybagIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
      <path d="M0.567487 11.3535C0.19617 10.7936 0 10.1187 0 9.33334C0.300044 7.23302 1.68041 5.67287 3.16866 4.16667H8.90142C10.2937 5.64371 11.6971 7.21336 12 9.33333C12 10.1187 11.8038 10.7936 11.4325 11.3535C11.0638 11.9095 10.5486 12.3127 9.96957 12.6017C8.83122 13.1699 7.37236 13.3333 6 13.3333C4.62764 13.3333 3.16878 13.1699 2.03044 12.6017C1.45144 12.3127 0.936236 11.9095 0.567487 11.3535Z" fill="currentColor" fillOpacity="0.5"/>
      <path d="M8.60073 2.08518C8.88036 1.33948 8.5969 0.472331 7.83294 0.247323C7.2636 0.0796353 6.65171 0 6 0C5.34829 0 4.7364 0.0796353 4.16706 0.247323C3.4031 0.472331 3.11964 1.33948 3.39927 2.08518L3.8015 3.15777L3.77778 3.16667H8.22222L8.1985 3.15777L8.60073 2.08518Z" fill="currentColor" fillOpacity="0.5"/>
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M1.33333 0.666667C1.33333 0.298477 1.63181 0 2 0H11.3333C11.7015 0 12 0.298477 12 0.666667C12 1.03486 11.7015 1.33333 11.3333 1.33333H2C1.63181 1.33333 1.33333 1.03486 1.33333 0.666667ZM0 4C0 2.89543 0.895431 2 2 2H11.3333C12.4379 2 13.3333 2.89543 13.3333 4V10C13.3333 11.1046 12.4379 12 11.3333 12H2C0.895431 12 0 11.1046 0 10V4ZM5.71121 5.0658C5.94218 4.95478 6.21635 4.986 6.41646 5.14609L8.08313 6.47942C8.24127 6.60594 8.33333 6.79748 8.33333 7C8.33333 7.20252 8.24127 7.39406 8.08313 7.52058L6.41646 8.85391C6.21635 9.014 5.94218 9.04522 5.71121 8.9342C5.48023 8.82319 5.33333 8.5896 5.33333 8.33333V5.66667C5.33333 5.4104 5.48023 5.17681 5.71121 5.0658Z" fill="currentColor" fillOpacity="0.5"/>
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

function StarIcon() {
  return (
    <svg width="11" height="10" viewBox="0 0 11 10" fill="none">
      <path d="M5.93698 0.431091C5.66086-0.143696 4.84062-0.143698 4.56449 0.431091L3.3835 2.8895L0.663268 3.24567C0.0326199 3.32825-0.229974 4.10751 0.239584 4.55027L2.22744 6.42466L1.72856 9.1008C1.61012 9.73617 2.28277 10.2072 2.8385 9.9076L5.25074 8.60713L7.66298 9.9076C8.2187 10.2072 8.89136 9.73617 8.77292 9.1008L8.27404 6.42466L10.2619 4.55027C10.7315 4.10751 10.4689 3.32825 9.83821 3.24567L7.11798 2.8895L5.93698 0.431091Z" fill="#E57100"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="17" viewBox="0 0 14 17" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.79999 0C4.45279 0 2.55 1.90279 2.55 4.25V5.94999C1.14167 5.94999 0 7.09167 0 8.49999V14.45C0 15.8583 1.14167 17 2.55 17H11.05C12.4583 17 13.6 15.8583 13.6 14.45V8.49999C13.6 7.09167 12.4583 5.94999 11.05 5.94999V4.25C11.05 1.90279 9.1472 0 6.79999 0ZM9.34999 5.94999V4.25C9.34999 2.84167 8.20832 1.7 6.79999 1.7C5.39167 1.7 4.25 2.84167 4.25 4.25V5.94999H9.34999ZM6.79999 9.34999C7.26943 9.34999 7.64999 9.73055 7.64999 10.2V12.75C7.64999 13.2194 7.26943 13.6 6.79999 13.6C6.33055 13.6 5.94999 13.2194 5.94999 12.75V10.2C5.94999 9.73055 6.33055 9.34999 6.79999 9.34999Z" fill="currentColor" fillOpacity="0.2"/>
    </svg>
  );
}

function CalendarRepeatIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2.52602 0C2.80504 0 3.03123 0.226188 3.03123 0.505205V1.01041H6.06246V0.505205C6.06246 0.226188 6.28865 0 6.56766 0C6.84668 0 7.07287 0.226188 7.07287 0.505205V1.01041H7.57807C8.41513 1.01041 9.09369 1.68897 9.09369 2.52602V3.53643C9.09369 3.81545 8.8675 4.04164 8.58848 4.04164H1.01041V8.08328C1.01041 8.3623 1.2366 8.58848 1.51561 8.58848H3.53643C3.81545 8.58848 4.04164 8.81467 4.04164 9.09369C4.04164 9.37271 3.81545 9.59889 3.53643 9.59889H1.51561C0.678564 9.59889 0 8.92033 0 8.08328V2.52602C0 1.68897 0.678564 1.01041 1.51561 1.01041H2.02082V0.505205C2.02082 0.226188 2.24701 0 2.52602 0Z" fill="#E57100"/>
      <path d="M7.07287 6.25191C6.90477 6.25191 6.74246 6.28304 6.59241 6.33981L6.89425 6.64166C7.05338 6.80079 6.94068 7.07288 6.71564 7.07288H5.55725C5.27824 7.07288 5.05205 6.84669 5.05205 6.56767V5.40929C5.05205 5.18425 5.32414 5.07154 5.48327 5.23067L5.84018 5.58758C6.20063 5.36809 6.62459 5.2415 7.07287 5.2415C8.14048 5.2415 9.03964 5.95709 9.31935 6.93378C9.39617 7.20201 9.241 7.48173 8.97276 7.55855C8.70453 7.63537 8.42481 7.4802 8.34799 7.21196C8.18911 6.65717 7.67766 6.25191 7.07287 6.25191Z" fill="#E57100"/>
      <path d="M5.79776 7.94419C5.72094 7.67595 5.44122 7.52078 5.17298 7.5976C4.90475 7.67442 4.74958 7.95414 4.8264 8.22237C5.10611 9.19906 6.00527 9.91465 7.07287 9.91465C7.52126 9.91465 7.94526 9.78796 8.30557 9.56857L8.66248 9.92548C8.82161 10.0846 9.0937 9.97191 9.0937 9.74687V8.58848C9.0937 8.30947 8.86751 8.08328 8.58849 8.08328H7.43011C7.20507 8.08328 7.09236 8.35537 7.25149 8.5145L7.55334 8.81635C7.40325 8.87314 7.24094 8.90424 7.07287 8.90424C6.46808 8.90424 5.95664 8.49898 5.79776 7.94419Z" fill="#E57100"/>
    </svg>
  );
}

function EyeIconSmall() {
  return (
    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M5.37317 0C7.34902 0 9.26845 1.13616 10.5515 3.29156C10.8113 3.72792 10.8113 4.27203 10.5515 4.70838C9.26846 6.86379 7.34903 8 5.37317 8C3.39732 8 1.47789 6.86384 0.194815 4.70844C-0.0649384 4.27208-0.0649381 3.72797 0.194815 3.29162C1.47788 1.13622 3.39731 0 5.37317 0ZM3.62317 4C3.62317 3.0335 4.40667 2.25 5.37317 2.25C6.33967 2.25 7.12317 3.0335 7.12317 4C7.12317 4.9665 6.33967 5.75 5.37317 5.75C4.40667 5.75 3.62317 4.9665 3.62317 4Z" fill="#1A67E5"/>
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg width="8" height="11" viewBox="0 0 8 11" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 4C0 1.79086 1.79086 0 4 0C6.20914 0 8 1.79086 8 4C8 5.26319 7.41446 6.38962 6.5 7.12268V10.0177C6.5 10.6681 5.81548 11.0912 5.23369 10.8003L4 10.1834L2.76631 10.8003C2.18452 11.0912 1.5 10.6681 1.5 10.0177V7.12268C0.585537 6.38962 0 5.26319 0 4ZM2.5 7.70924V9.8154L3.60869 9.26105C3.85502 9.13789 4.14498 9.13789 4.39131 9.26105L5.5 9.8154V7.70924C5.03678 7.89675 4.53045 8 4 8C3.46955 8 2.96322 7.89675 2.5 7.70924Z" fill="#ED1285"/>
    </svg>
  );
}

/* ─── Shared Card Style ─── */
const cardStyle = "rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]";
const sectionHeader = "flex w-full items-center justify-between";
const headerTitle = "text-sm font-medium tracking-[-0.02em] text-[#252525]";
const headerLink = "text-xs font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.50)]";
const mutedText = "text-xs tracking-[-0.02em] text-[rgba(37,37,37,0.70)]";
const subtleText = "text-xs tracking-[-0.02em] text-[rgba(37,37,37,0.50)]";

/* ─── Pill / Badge ─── */
function XpBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2 py-[6px]">
      <StarIcon />
      <span className="text-xs font-medium tracking-[-0.02em] text-[#252525]">{text}</span>
    </span>
  );
}

function NavItem({ children, variant = "ghost" }: { children: React.ReactNode; variant?: "ghost" | "dark" }) {
  return (
    <button
      className={`flex h-8 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-medium tracking-[-0.02em] ${
        variant === "dark" ? "bg-[#252525] text-white" : "bg-[rgba(37,37,37,0.06)] text-[#252525]"
      }`}
    >
      {children}
    </button>
  );
}

/* ─── Stat Card Icon Container ─── */
function StatIconContainer({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="w-[60px] shrink-0 self-stretch overflow-hidden rounded-2xl">
      <div
        className="flex h-full w-[64px] items-center justify-center"
        style={{ background: color, borderRadius: "0 999px 999px 0" }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─── Icon Badge (36px circle with border) ─── */
function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white shadow-[0_0_0_2px_white]">
      {children}
    </div>
  );
}

/* ─── Streak Day ─── */
function StreakDay({ day, active, current, future }: { day: string; active: boolean; current: boolean; future: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-3">
      <div className="flex h-9 w-9 flex-col items-center">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden"
          style={{
            border: current ? "1px solid #E57100" : future ? "1px solid rgba(37,37,37,0.12)" : "1px solid rgba(37,37,37,0.06)",
            boxShadow: !future ? "0 1px 2px 0 rgba(0,0,0,0.03)" : undefined,
          }}
        >
          <FireIconSmall color={active || current ? "#E57100" : "rgba(37,37,37,0.20)"} />
        </div>
      </div>
      <span
        className="text-xs tracking-[-0.02em] text-center"
        style={{
          color: active || current ? "#E57100" : future ? "rgba(37,37,37,0.50)" : "rgba(37,37,37,0.50)",
          fontWeight: active || current ? 500 : 400,
        }}
      >
        {day}
      </span>
    </div>
  );
}

/* ─── Action Card (Feed section) ─── */
function ActionCard({
  icon,
  badge,
  title,
  description,
  actions,
}: {
  icon: React.ReactNode;
  badge?: React.ReactNode;
  title: string;
  description: string;
  actions: React.ReactNode;
}) {
  return (
    <div className={`flex flex-1 flex-col justify-center gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] p-3 px-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]`}>
      <div className="flex items-center justify-between">
        <IconBadge>{icon}</IconBadge>
        {badge}
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium tracking-[-0.02em] text-[#252525]">{title}</span>
        <span className="text-xs leading-[18px] tracking-[-0.02em] text-[rgba(37,37,37,0.50)]">{description}</span>
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
}

/* ─── Campaign Row ─── */
function CampaignRow({
  thumb,
  brandLogo,
  brandName,
  campaignName,
  typeBadge,
  stats,
}: {
  thumb: string;
  brandLogo: string;
  brandName: string;
  campaignName: string;
  typeBadge: React.ReactNode;
  stats: React.ReactNode;
}) {
  return (
    <div className={`flex h-[102px] items-center overflow-hidden rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]`}>
      {/* Thumbnail */}
      <div className="flex h-full w-[167px] shrink-0 flex-col p-1 pl-1 pr-0">
        <img src={thumb} alt="" className="h-full w-[163px] rounded-xl object-cover" />
      </div>
      {/* Content + Submit */}
      <div className="flex flex-1 items-center gap-4 p-3 px-4">
        <div className="flex flex-1 flex-col gap-3">
          {/* Brand + name */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <img src={brandLogo} alt="" className="h-4 w-4 rounded-full border border-[rgba(37,37,37,0.06)]" />
              <span className="text-xs font-medium tracking-[-0.02em] text-[#252525]">{brandName}</span>
              <VerifiedBadge />
            </div>
            <span className="truncate text-sm font-medium tracking-[-0.02em] text-[#252525]">{campaignName}</span>
          </div>
          {/* Type + stats row */}
          <div className="flex flex-wrap items-center gap-3">
            {typeBadge}
            <div className="flex flex-wrap items-center gap-1.5 text-xs tracking-[-0.02em]">
              {stats}
            </div>
          </div>
        </div>
        {/* Submit button */}
        <div className="flex shrink-0 flex-col items-end justify-between self-stretch">
          <NavItem>Submit</NavItem>
        </div>
      </div>
    </div>
  );
}

function StatDot() {
  return <span className="text-xs font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.20)]">·</span>;
}

function StatPair({ label, value, valueColor = "#252525" }: { label: string; value: string; valueColor?: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-[rgba(37,37,37,0.50)]">{label}</span>
      <span className="font-medium" style={{ color: valueColor }}>{value}</span>
    </span>
  );
}

/* ─── Bell Icon (header) ─── */
function BellIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6 0C3.40402 0 1.26405 2.03564 1.13441 4.62838L1.0148 7.0206C1.0102 7.11274 0.986514 7.20293 0.945254 7.28545L0.127322 8.92131C0.0435915 9.08877 0 9.27343 0 9.46066C0 10.1267 0.53995 10.6667 1.20601 10.6667H2.73335C3.04219 12.1882 4.38736 13.3333 6 13.3333C7.61264 13.3333 8.95781 12.1882 9.26665 10.6667H10.794C11.4601 10.6667 12 10.1267 12 9.46066C12 9.27343 11.9564 9.08877 11.8727 8.92131L11.0547 7.28545C11.0135 7.20293 10.9898 7.11274 10.9852 7.0206L10.8656 4.62839C10.7359 2.03564 8.59598 0 6 0ZM6 12C5.12919 12 4.38836 11.4435 4.1138 10.6667H7.8862C7.61164 11.4435 6.87081 12 6 12Z" fill="currentColor"/>
    </svg>
  );
}

/* ─── MAIN PAGE ─── */
export default function CreatorHomePage() {
  const [feedIndex, setFeedIndex] = useState(0);
  const feedScrollRef = useRef<HTMLDivElement>(null);
  const feedTotal = 3;

  const scrollToFeed = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(feedTotal - 1, idx));
    setFeedIndex(clamped);
    const container = feedScrollRef.current;
    if (container) {
      const page = container.children[clamped] as HTMLElement;
      if (page) page.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 bg-[#F7F7F6] pb-5 font-inter">
      {/* ─── Top Header ─── */}
      <div className="flex items-center justify-between px-4 pt-4">
        {/* Left: Bell notification */}
        <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <BellIcon />
        </button>

        <div className="flex items-center gap-2">
          {/* Tier badge */}
          <div className="flex h-9 items-center gap-2.5 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white py-3 pl-3 pr-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium tracking-[-0.02em] text-[#E57100]">Recruit</span>
              <span className="text-sm font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.20)]">·</span>
              <span className="text-sm font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.40)]">36%</span>
            </div>
            {/* Avatar */}
            <div className="h-9 w-9 overflow-hidden rounded-full bg-[rgba(37,37,37,0.08)]">
              <img src="/creator-home/brand-logo-1.png" alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Balance Section ─── */}
      <div className="flex flex-col gap-4 rounded-t-2xl items-center">
        {/* Balance header row */}
        <div className="flex w-full flex-col gap-3 px-4">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium tracking-[-0.02em] text-[#252525]">Your balance</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-medium tracking-[-0.02em] text-[#252525]">$2,862.15</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2 py-[6px]">
                <ClockIcon />
                <span className="text-xs tracking-[-0.02em] text-[rgba(37,37,37,0.70)]">$326.15 pending</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <NavItem>Withdraw</NavItem>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(37,37,37,0.06)]">
                <HistoryIcon />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Stats Row ─── */}
        <div className="flex w-full gap-2 overflow-x-auto px-4 scrollbar-none">
          {/* Streak */}
          <div className={`flex min-w-0 flex-1 items-center gap-3 overflow-hidden rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white pr-3 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]`}>
            <StatIconContainer color="rgba(229,113,0,0.08)">
              <FireIcon size={17} />
            </StatIconContainer>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium tracking-[-0.02em] text-[#252525]">4 days</span>
              <div className="flex items-center gap-1">
                <span className={subtleText}>Streak</span>
                <QuestionIcon />
              </div>
            </div>
          </div>

          {/* Earned */}
          <div className={`flex min-w-0 flex-1 items-center gap-3 overflow-hidden rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white pr-3 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]`}>
            <StatIconContainer color="rgba(174,78,238,0.10)">
              <DollarIcon />
            </StatIconContainer>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium tracking-[-0.02em] text-[#252525]">$148.50</span>
              <span className={subtleText}>Earned this week</span>
            </div>
          </div>

          {/* Trust score */}
          <div className={`flex min-w-0 flex-1 items-center gap-3 overflow-hidden rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white pr-3 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]`}>
            <StatIconContainer color="rgba(0,153,77,0.08)">
              <WreathIcon />
            </StatIconContainer>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium tracking-[-0.02em] text-[#252525]">92</span>
              <div className="flex items-center gap-1">
                <span className={subtleText}>Trust score</span>
                <QuestionIcon />
              </div>
            </div>
          </div>

          {/* Views */}
          <div className={`flex min-w-0 flex-1 items-center gap-3 overflow-hidden rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white pr-3 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]`}>
            <StatIconContainer color="rgba(26,103,229,0.08)">
              <EyeIcon />
            </StatIconContainer>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium tracking-[-0.02em] text-[#252525]">24.5k</span>
              <span className={subtleText}>Views</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Feed Section ─── */}
      <div className={`${cardStyle} mx-4 flex flex-col gap-4 p-4`}>
        {/* Header */}
        <div className={sectionHeader}>
          <span className={headerTitle}>Feed</span>
          <div className="flex items-center gap-3">
            <button className={`flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(37,37,37,0.06)] ${feedIndex === 0 ? "opacity-30" : ""}`} onClick={() => scrollToFeed(feedIndex - 1)}>
              <ChevronLeft />
            </button>
            <span className={mutedText}>{feedIndex + 1}/{feedTotal}</span>
            <button className={`flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(37,37,37,0.06)] ${feedIndex === feedTotal - 1 ? "opacity-30" : ""}`} onClick={() => scrollToFeed(feedIndex + 1)}>
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* Swipable feed pages */}
        <div
          ref={feedScrollRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-none"
          onScroll={(e) => {
            const el = e.currentTarget;
            const idx = Math.round(el.scrollLeft / el.clientWidth);
            if (idx !== feedIndex) setFeedIndex(idx);
          }}
        >
          {/* Page 1 */}
          <div className="flex w-full shrink-0 snap-start flex-col gap-2">
            <div className="flex gap-2">
              <ActionCard
                icon={<MoneybagIcon />}
                badge={<span className="text-sm font-medium tracking-[-0.02em] text-[#00994D]">$2,862</span>}
                title="Withdraw your earnings"
                description="You have $2,862 available. Withdraw it to your account anytime."
                actions={
                  <>
                    <NavItem variant="dark">Withdraw</NavItem>
                    <NavItem>Share</NavItem>
                  </>
                }
              />
              <ActionCard
                icon={<VideoIcon />}
                badge={<XpBadge text="50 XP" />}
                title="Submit a new clip"
                description="Keep the momentum going. Your campaigns are waiting for content."
                actions={<NavItem>Submit clip</NavItem>}
              />
            </div>
          </div>

          {/* Page 2 */}
          <div className="flex w-full shrink-0 snap-start flex-col gap-2">
            <div className="flex gap-2">
              <ActionCard
                icon={<FireIcon size={14} />}
                badge={<XpBadge text="100 XP" />}
                title="Keep your streak alive"
                description="You're on a 4-day streak. Submit a clip today to keep it going."
                actions={<NavItem>Submit clip</NavItem>}
              />
              <ActionCard
                icon={<WreathIcon />}
                badge={<span className="text-sm font-medium tracking-[-0.02em] text-[#00994D]">92</span>}
                title="Trust score is high"
                description="Your trust score unlocks priority placement. Keep it above 90."
                actions={<NavItem>View details</NavItem>}
              />
            </div>
          </div>

          {/* Page 3 */}
          <div className="flex w-full shrink-0 snap-start flex-col gap-2">
            <div className="flex gap-2">
              <ActionCard
                icon={<PaperclipIcon />}
                title="Application expiring soon"
                description="Your CoD BO7 application closes in 2 days. Don't miss it."
                actions={<NavItem>View application</NavItem>}
              />
              <ActionCard
                icon={<EyeIcon />}
                badge={<span className="text-sm font-medium tracking-[-0.02em] text-[#1A67E5]">24.5k</span>}
                title="Views are trending up"
                description="Your clips gained 24.5k views this week. That's 12% more than last week."
                actions={<NavItem>View insights</NavItem>}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Streak + Tier Row ─── */}
      <div className="flex gap-2 px-4">
        {/* Your streak */}
        <div className={`${cardStyle} flex flex-1 flex-col gap-4 p-4`}>
          <div className={sectionHeader}>
            <span className={headerTitle}>Your streak</span>
            <span className={headerLink}>Learn more</span>
          </div>
          <div className="flex flex-1 flex-col justify-end gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-5xl font-medium tracking-[-0.02em] text-[#252525]">4d</span>
              <div className="flex items-center gap-1">
                <span className={subtleText}>Next reward</span>
                <XpBadge text="100 XP" />
                <span className={subtleText}>in 3 days.</span>
              </div>
            </div>
            {/* Day row */}
            <div className="flex items-center gap-2">
              <StreakDay day="Mon" active={false} current={false} future={false} />
              <StreakDay day="Tue" active={true} current={false} future={false} />
              <StreakDay day="Wed" active={true} current={false} future={false} />
              <StreakDay day="Thu" active={true} current={false} future={false} />
              <StreakDay day="Fri" active={false} current={true} future={false} />
              <StreakDay day="Sat" active={false} current={false} future={true} />
              <StreakDay day="Sun" active={false} current={false} future={true} />
            </div>
          </div>
        </div>

        {/* Your tier */}
        <div className={`${cardStyle} flex flex-1 flex-col gap-4 p-4`}>
          <div className={sectionHeader}>
            <span className={headerTitle}>Your tier</span>
            <span className={headerLink}>View perks</span>
          </div>
          <div className="flex flex-1 flex-col gap-3 justify-center">
            {/* Current vs next tier */}
            <div className="flex gap-2">
              {/* Current */}
              <div className="flex flex-1 flex-col gap-3">
                {/* Star badge icon */}
                <div className="relative h-10 w-10">
                  <svg width="43" height="43" viewBox="0 0 43 43" fill="none" className="absolute -left-[1.5px] -top-[1.5px]">
                    <defs>
                      <linearGradient id="starGrad" x1="21.5" y1="-1.15" x2="21.5" y2="46.1" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF8B1A"/><stop offset="1" stopColor="#E57100"/>
                      </linearGradient>
                    </defs>
                    <path d="M18.56 1.95C19.59.87 20.1.33 20.69.13 21.22-.04 21.78-.04 22.31.13c.6.2 1.11.74 2.13 1.82l6.26 6.6c.19.2.29.31.39.4.1.08.2.15.3.22.12.07.25.13.5.25l8.22 3.92c1.34.64 2.01.96 2.39 1.46.33.44.5.98.5 1.54-.01.63-.36 1.28-1.07 2.59l-4.34 8c-.13.25-.2.37-.25.5-.05.11-.09.23-.12.35-.03.14-.05.28-.08.55l-1.19 9.03c-.19 1.47-.29 2.21-.66 2.72-.32.45-.78.78-1.3.95-.6.19-1.33.05-2.79-.22l-8.95-1.66c-.28-.05-.41-.08-.55-.09-.12-.01-.25-.01-.37 0-.14.01-.28.04-.55.09l-8.95 1.66c-1.46.27-2.19.41-2.79.22-.53-.17-.99-.5-1.31-.95-.36-.51-.46-1.25-.66-2.72L5.87 28.33c-.04-.28-.05-.42-.09-.55-.03-.12-.07-.24-.12-.35-.05-.13-.12-.25-.25-.5l-4.34-8C.36 17.62.01 16.97 0 16.34c-.01-.55.17-1.09.5-1.54.37-.5 1.04-.82 2.39-1.46l8.22-3.92c.25-.12.38-.18.5-.25.1-.07.21-.14.3-.22.1-.09.2-.19.4-.4l6.26-6.6Z" fill="url(#starGrad)" stroke="rgba(37,37,37,0.06)"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-[33px] w-[33px] items-center justify-center rounded-full border border-[rgba(37,37,37,0.06)]">
                      <svg width="18" height="16" viewBox="0 0 21 18" fill="none">
                        <path d="M13.49.11c.32-.16.7-.14 1 .05.31.19.49.52.49.88v1.88l.01.02 4.32-2.48c.41-.24.86.27.57.65l-3.41 4.45 1.46 2.55c.32.57.5 1.21.5 1.86v.63c0 1.73-1.4 3.12-3.12 3.12-.48 0-.96-.11-1.4-.33l-1.75-.88c.14.76.24 1.68.24 2.76 0 .57-.46 1.03-1.03 1.03-.57 0-1.04-.46-1.04-1.03 0-1.41-.2-2.5-.4-3.23-.09-.34-.18-.6-.25-.78-.59-.37-1.07-.89-1.38-1.51-.39-.81-.5-1.73-.28-2.6l.19-.74c.14-.55.7-.89 1.25-.75.55.14.89.7.75 1.25l-.19.74c-.1.39-.05.81.13 1.18.17.33.43.6.76.76l3.91 1.96c.15.07.31.11.47.11.58 0 1.06-.47 1.06-1.06v-.63c0-.29-.08-.58-.22-.84l-3.09-5.4c-.09-.16-.14-.33-.14-.51v-.48l-1.09.54c-.19.09-.4.13-.61.1-2.59-.37-4.61.71-6.04 2.52-1.45 1.84-2.25 4.41-2.25 6.79 0 .57-.46 1.03-1.03 1.03-.57 0-1.04-.46-1.04-1.03 0-2.79.92-5.82 2.7-8.07C5.3 2.38 7.9.91 11.19 1.26l2.3-1.15Z" fill="rgba(37,37,37,0.80)"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium tracking-[-0.02em] text-[#252525]">Recruit</span>
                  <span className="text-xs font-medium tracking-[-0.02em] text-[#252525]">8% platform fee</span>
                </div>
              </div>
              {/* Next tier */}
              <div className="flex flex-1 flex-col items-end gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(37,37,37,0.12)]">
                  <LockIcon />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.50)]">Next: Operator</span>
                  <span className="text-xs font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.50)]">7% platform fee</span>
                </div>
              </div>
            </div>

            {/* Progress bars */}
            <div className={`flex items-center gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] p-3 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]`}>
              {/* XP progress */}
              <div className="flex flex-1 flex-col gap-2.5">
                <XpBadge text="320/500 XP" />
                <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(229,113,0,0.08)]">
                  <div className="h-full rounded-full bg-[#E57100]" style={{ width: "64%" }} />
                </div>
              </div>
              {/* Divider */}
              <div className="h-full w-px bg-[rgba(37,37,37,0.06)]" />
              {/* Badges progress */}
              <div className="flex flex-1 flex-col gap-2.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2 py-[6px]">
                  <MedalIcon />
                  <span className="text-xs font-medium tracking-[-0.02em] text-[#252525]">3/5 badges</span>
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

      {/* ─── Active Campaigns ─── */}
      <div className={`${cardStyle} mx-4 flex flex-col gap-4 p-4`}>
        <div className={sectionHeader}>
          <span className={headerTitle}>Active campaigns</span>
          <span className={headerLink}>Browse more</span>
        </div>

        <div className="flex flex-col gap-2">
          <CampaignRow
            thumb="/creator-home/campaign-thumb-1.png"
            brandLogo="/creator-home/brand-logo-1.png"
            brandName="Sound Network"
            campaignName="Harry Styles Podcast x Shania Twain Clipping [7434]"
            typeBadge={
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2 py-[6px]">
                <CalendarRepeatIcon />
                <span className="text-xs font-medium tracking-[-0.02em] text-[#E57100]">Retainer</span>
              </span>
            }
            stats={
              <>
                <StatPair label="Paid out" value="$3,561" />
                <StatDot />
                <StatPair label="Pending" value="$210" valueColor="#E57100" />
                <StatDot />
                <StatPair label="Submissions" value="7/21" valueColor="rgba(37,37,37,0.70)" />
              </>
            }
          />

          <CampaignRow
            thumb="/creator-home/campaign-thumb-2.png"
            brandLogo="/creator-home/brand-logo-2.png"
            brandName="Clipping Culture"
            campaignName="Call of Duty BO7 Official Clipping Campaign"
            typeBadge={
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2 py-[6px]">
                <EyeIconSmall />
                <span className="text-xs font-medium tracking-[-0.02em] text-[#1A67E5]">CPM</span>
              </span>
            }
            stats={
              <>
                <StatPair label="Paid out" value="$114" />
                <StatDot />
                <StatPair label="Pending" value="$0" valueColor="rgba(37,37,37,0.40)" />
                <StatDot />
                <StatPair label="Submissions" value="2/10" valueColor="rgba(37,37,37,0.70)" />
              </>
            }
          />

          <CampaignRow
            thumb="/creator-home/campaign-thumb-3.png"
            brandLogo="/creator-home/brand-logo-3.png"
            brandName="Scene Society"
            campaignName="Mumford & Sons | Prizefighter Clipping"
            typeBadge={
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2 py-[6px]">
                <EyeIconSmall />
                <span className="text-xs font-medium tracking-[-0.02em] text-[#1A67E5]">CPM</span>
              </span>
            }
            stats={
              <>
                <StatPair label="Paid out" value="$1,240" />
                <StatDot />
                <StatPair label="Pending" value="$58" valueColor="#E57100" />
                <StatDot />
                <StatPair label="Submissions" value="5/8" valueColor="rgba(37,37,37,0.70)" />
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}
