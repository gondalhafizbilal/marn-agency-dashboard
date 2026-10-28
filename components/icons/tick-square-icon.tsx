import type { SVGProps } from "react";

type TickSquareIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

/**
 * Iconly Light-Outline Tick Square (Figma) — brand #7C0A23 by default.
 */
export function TickSquareIcon({
  size = 20,
  className,
  ...props
}: TickSquareIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.38752 2.91675C4.27919 2.91675 2.91669 4.36091 2.91669 6.59675V13.4034C2.91669 15.6392 4.27919 17.0834 6.38752 17.0834H13.6109C15.72 17.0834 17.0834 15.6392 17.0834 13.4034V6.59675C17.0834 4.36091 15.72 2.91675 13.6117 2.91675H6.38752ZM13.6109 18.3334H6.38752C3.56335 18.3334 1.66669 16.3517 1.66669 13.4034V6.59675C1.66669 3.64841 3.56335 1.66675 6.38752 1.66675H13.6117C16.4359 1.66675 18.3334 3.64841 18.3334 6.59675V13.4034C18.3334 16.3517 16.4359 18.3334 13.6109 18.3334Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.01127 12.6025C8.8521 12.6025 8.69127 12.5417 8.5696 12.4192L6.59127 10.4417C6.3471 10.1975 6.3471 9.8025 6.59127 9.55833C6.83543 9.31416 7.23043 9.31416 7.4746 9.55833L9.01127 11.0933L12.5246 7.58083C12.7688 7.33666 13.1638 7.33666 13.4079 7.58083C13.6521 7.825 13.6521 8.22 13.4079 8.46416L9.45293 12.4192C9.33127 12.5417 9.17127 12.6025 9.01127 12.6025Z"
        fill="currentColor"
      />
    </svg>
  );
}
