import { SVGProps } from "react";

export function PencilIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.43934 0.43934C7.02513 -0.146446 7.97487 -0.146447 8.56066 0.439339L9.39645 1.27513C9.98223 1.86091 9.98223 2.81066 9.39645 3.39645L8.70703 4.08586L5.75 1.12883L5.04289 1.83594L7.99992 4.79297L3.25 9.54289C3.06246 9.73043 2.80811 9.83579 2.54289 9.83579H0.5C0.223858 9.83579 0 9.61193 0 9.33579V7.29289C0 7.02768 0.105357 6.77332 0.292893 6.58579L6.43934 0.43934Z"
        fill="currentColor"
      />
    </svg>
  );
}
