import type { SVGProps } from "react";

export function AlquimaLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3v18" />
      <path d="m3.5 8.5 8.5 4 8.5-4" />
      <path d="m3.5 15.5 8.5-4 8.5 4" />
    </svg>
  );
}
