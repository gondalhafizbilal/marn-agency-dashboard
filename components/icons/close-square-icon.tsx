import type { SVGProps } from "react";

type CloseSquareIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

/**
 * Exact Iconly Light Close Square (Figma) — brand #67051B via currentColor.
 * Used by confirm, share, and filter popups.
 */
export function CloseSquareIcon({
  size = 40,
  className,
  ...props
}: CloseSquareIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <path
        d="M23.9925 15.9912L16.0059 23.9779"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.9953 23.9828L16.002 15.9878"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.224 4.5835H12.7757C7.74065 4.5835 4.58398 8.1485 4.58398 13.1935V26.8068C4.58398 31.8518 7.72565 35.4168 12.7757 35.4168H27.2223C32.274 35.4168 35.4173 31.8518 35.4173 26.8068V13.1935C35.4173 8.1485 32.274 4.5835 27.224 4.5835Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
