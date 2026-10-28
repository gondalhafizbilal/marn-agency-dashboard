import type { SVGProps } from "react";

type DeleteIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

/**
 * Iconly Light Delete (Figma) — brand #67051B by default via currentColor.
 */
export function DeleteIcon({
  size = 18,
  className,
  ...props
}: DeleteIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <path
        d="M14.4937 7.10107C14.4937 7.10107 14.0865 12.1523 13.8502 14.2801C13.7377 15.2963 13.11 15.8918 12.0817 15.9106C10.125 15.9458 8.16596 15.9481 6.20996 15.9068C5.22071 15.8866 4.60346 15.2836 4.49321 14.2853C4.25546 12.1388 3.85046 7.10107 3.85046 7.10107"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5312 4.67969H2.81274"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.0804 4.67974C12.4917 4.67974 11.9847 4.26349 11.8692 3.68674L11.6869 2.77474C11.5744 2.35399 11.1934 2.06299 10.7592 2.06299H7.58443C7.15018 2.06299 6.76918 2.35399 6.65668 2.77474L6.47443 3.68674C6.35893 4.26349 5.85193 4.67974 5.26318 4.67974"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
