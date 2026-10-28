import type { SVGProps } from "react";

type ChatIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

/**
 * Iconly Light Chat in white circle (Figma profile header) — 36×36.
 */
export function ChatIcon({ size = 36, className, ...props }: ChatIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <circle cx="18" cy="18" r="18" fill="white" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.0714 25.0699C22.0152 28.1263 17.4898 28.7867 13.7864 27.074C13.2397 26.8539 12.7915 26.676 12.3654 26.676C11.1785 26.683 9.70117 27.8339 8.93336 27.067C8.16555 26.2991 9.31726 24.8206 9.31726 23.6266C9.31726 23.2004 9.14642 22.7602 8.92632 22.2124C7.21283 18.5096 7.87411 13.9827 10.9303 10.9272C14.8316 7.02443 21.17 7.02443 25.0714 10.9262C28.9797 14.835 28.9727 21.1681 25.0714 25.0699Z"
        stroke="#7C0A23"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.9398 18.413H21.9488"
        stroke="#7C0A23"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.9301 18.413H17.9391"
        stroke="#7C0A23"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.9213 18.413H13.9303"
        stroke="#7C0A23"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
