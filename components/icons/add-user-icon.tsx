import type { SVGProps } from "react";

type AddUserIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

/**
 * Iconly Light Add User (Figma) — brand #67051B via currentColor.
 */
export function AddUserIcon({
  size = 18,
  className,
  ...props
}: AddUserIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.09525 10.0922C3.21225 10.0922 0.75 10.528 0.75 12.274C0.75 14.02 3.19725 14.4715 6.09525 14.4715C8.979 14.4715 11.4405 14.035 11.4405 12.2897C11.4405 10.5445 8.994 10.0922 6.09525 10.0922Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.09519 7.602C7.98744 7.602 9.52119 6.06825 9.52119 4.176C9.52119 2.28375 7.98744 0.75 6.09519 0.75C4.20369 0.75 2.66994 2.28375 2.66994 4.176C2.66319 6.0615 4.18569 7.59525 6.07194 7.602H6.09519Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.0908 5.18945V8.19695"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6251 6.69312H11.5576"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
