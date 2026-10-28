import type { SVGProps } from "react";

type FilterIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

/**
 * Iconly Light Filter (Figma) — brand #7C0A23 via currentColor.
 */
export function FilterIcon({ size = 18, className, ...props }: FilterIconProps) {
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
        d="M7.748 12.4447H3.02246"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.85547 5.17525H14.581"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.54472 5.13469C6.54472 4.16295 5.7511 3.375 4.77236 3.375C3.79362 3.375 3 4.16295 3 5.13469C3 6.10643 3.79362 6.89438 4.77236 6.89438C5.7511 6.89438 6.54472 6.10643 6.54472 5.13469Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9998 12.4153C14.9998 11.4436 14.2068 10.6556 13.228 10.6556C12.2487 10.6556 11.4551 11.4436 11.4551 12.4153C11.4551 13.3871 12.2487 14.175 13.228 14.175C14.2068 14.175 14.9998 13.3871 14.9998 12.4153Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
