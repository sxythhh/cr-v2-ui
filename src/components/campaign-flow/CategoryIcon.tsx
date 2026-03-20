export function CategoryIcon({ category }: { category: string }) {
  const cls = "shrink-0";
  switch (category.toLowerCase()) {
    case "gaming":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={cls}>
          <path d="M7.861 1.75L4.78491 6.19323L7.80674 9.21506L12.25 6.13897V1.75H7.861Z" fill="currentColor" />
          <path d="M2.82601 5.50098L1.62464 7.30303L3.02977 9.27021L0.925049 11.3749L2.62501 13.0749L4.72973 10.9702L6.69691 12.3753L8.49896 11.1739L2.82601 5.50098Z" fill="currentColor" />
        </svg>
      );
    case "music":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={cls}>
          <path d="M12.249 0.96582L5.24902 3.06582V9.02479C4.89478 8.84716 4.4907 8.74984 4.08236 8.74984C2.89779 8.74984 1.74902 9.56886 1.74902 10.7915C1.74902 12.0142 2.89779 12.8332 4.08236 12.8332C5.26692 12.8332 6.41569 12.0142 6.41569 10.7915V3.93386L11.0824 2.53386V7.27479C10.7281 7.09716 10.324 6.99984 9.91569 6.99984C8.73113 6.99984 7.58236 7.81886 7.58236 9.0415C7.58236 10.2642 8.73113 11.0832 9.91569 11.0832C11.1003 11.0832 12.249 10.2642 12.249 9.0415V0.96582Z" fill="currentColor" />
        </svg>
      );
    case "entertainment":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={cls}>
          <path d="M8.707 2.293l3.293 3.292l3.293 -3.292a1 1 0 0 1 1.32 -.083l.094 .083a1 1 0 0 1 0 1.414l-2.293 2.293h4.586a3 3 0 0 1 3 3v9a3 3 0 0 1 -3 3h-14a3 3 0 0 1 -3 -3v-9a3 3 0 0 1 3 -3h4.585l-2.292 -2.293a1 1 0 0 1 1.414 -1.414" />
        </svg>
      );
    case "sports":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={cls}>
          <path d="M11 3a1 1 0 0 1 1.496 -.868l7 4a1 1 0 0 1 0 1.736l-6.496 3.712v6.42a1 1 0 0 1 -.883 .993l-.117 .007a1 1 0 0 1 -1 -1z" />
          <path d="M14.135 17.168a1 1 0 0 1 1.367 -.363c.916 .532 1.498 1.291 1.498 2.195c0 1.84 -2.319 3 -5 3s-5 -1.16 -5 -3c0 -.911 .577 -1.66 1.498 -2.195a1 1 0 1 1 1.004 1.73c-.365 .212 -.502 .39 -.502 .465c0 .086 .179 .296 .622 .518c.6 .3 1.456 .482 2.378 .482s1.777 -.182 2.378 -.482c.443 -.222 .622 -.432 .622 -.518c0 -.07 -.142 -.256 -.502 -.465a1 1 0 0 1 -.363 -1.367" />
        </svg>
      );
    case "education":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" />
          <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" />
        </svg>
      );
    case "lifestyle":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={cls}>
          <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
        </svg>
      );
    case "technology":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M5 6a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1l0 -12" />
          <path d="M9 9h6v6h-6l0 -6" />
          <path d="M3 10h2" />
          <path d="M3 14h2" />
          <path d="M10 3v2" />
          <path d="M14 3v2" />
          <path d="M21 10h-2" />
          <path d="M21 14h-2" />
          <path d="M14 21v-2" />
          <path d="M10 21v-2" />
        </svg>
      );
    default:
      return null;
  }
}
