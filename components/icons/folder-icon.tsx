import type { SVGProps } from "react";

type FolderIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

/**
 * Iconly Light Folder (Figma) — brand #67051B via currentColor.
 */
export function FolderIcon({ size = 16, className, ...props }: FolderIconProps) {
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
        d="M15.1268 10.8615C15.1268 13.545 13.545 15.1268 10.8615 15.1268H5.025C2.33475 15.1268 0.75 13.545 0.75 10.8615V5.0115C0.75 2.33175 1.7355 0.75 4.41975 0.75H5.91975C6.45825 0.75075 6.96525 1.0035 7.28775 1.43475L7.9725 2.34525C8.2965 2.77575 8.8035 3.02925 9.342 3.03H11.4645C14.1548 3.03 15.1478 4.3995 15.1478 7.13775L15.1268 10.8615Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.67383 9.90967H11.2251"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
