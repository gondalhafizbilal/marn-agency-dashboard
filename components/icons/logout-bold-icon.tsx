import type { SVGProps } from "react";

type LogoutBoldIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

/**
 * Iconly Bold Logout (Figma) — brand #67051B via currentColor.
 */
export function LogoutBoldIcon({
  size = 83,
  className,
  ...props
}: LogoutBoldIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 83 83"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M34.0153 38.6031C32.5114 38.6031 31.3222 39.7719 31.3222 41.25C31.3222 42.6937 32.5114 43.8969 34.0153 43.8969H55V60.3281C55 68.75 48.0401 75.625 39.4363 75.625H22.4037C13.8349 75.625 6.875 68.7844 6.875 60.3625V22.1719C6.875 13.7156 13.8699 6.875 22.4387 6.875H39.5063C48.0401 6.875 55 13.7156 55 22.1375V38.6031H34.0153ZM67.4788 29.3569L77.5163 39.3601C78.0319 39.8757 78.3069 40.5288 78.3069 41.2507C78.3069 41.9382 78.0319 42.6257 77.5163 43.1069L67.4788 53.1101C66.9632 53.6257 66.2757 53.9007 65.6226 53.9007C64.9351 53.9007 64.2476 53.6257 63.7319 53.1101C62.7007 52.0788 62.7007 50.3944 63.7319 49.3632L69.2319 43.8976H55.0007V38.6038H69.2319L63.7319 33.1382C62.7007 32.1069 62.7007 30.4226 63.7319 29.3913C64.7632 28.3257 66.4476 28.3257 67.4788 29.3569Z"
        fill="currentColor"
      />
    </svg>
  );
}
