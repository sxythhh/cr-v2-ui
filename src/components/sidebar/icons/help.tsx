import { SVGProps } from "react";

export function Help(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M8 14.667A6.667 6.667 0 1 0 8 1.333a6.667 6.667 0 0 0 0 13.334ZM7.5 5.5a.5.5 0 0 0-.5.5.167.167 0 0 1-.333 0A.833.833 0 0 1 7.5 5.167h.7A1.3 1.3 0 0 1 9 7.467l-.473.397v.303a.167.167 0 0 1-.334 0v-.5a.333.333 0 0 1 .091-.243l.744-.63A.967.967 0 0 0 8.2 5.5H7.5ZM8 10.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" fill="currentColor" />
    </svg>
  );
}
