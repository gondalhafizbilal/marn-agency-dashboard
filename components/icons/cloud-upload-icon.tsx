import type { SVGProps } from "react";

type CloudUploadIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

/**
 * Tabler-style cloud upload (Figma Media dropzone) — brand #7C0A23 via currentColor.
 */
export function CloudUploadIcon({
  size = 60,
  className,
  ...props
}: CloudUploadIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <path
        d="M17.4996 45C14.3803 45 11.3888 43.8147 9.1831 41.705C6.97742 39.5952 5.73828 36.7337 5.73828 33.75C5.73828 30.7663 6.97742 27.9048 9.1831 25.7951C11.3888 23.6853 14.3803 22.5 17.4996 22.5C18.2364 19.2179 20.3916 16.3337 23.4911 14.4818C25.0259 13.5648 26.7463 12.9289 28.5541 12.6103C30.3619 12.2917 32.2217 12.2967 34.0274 12.625C35.8331 12.9533 37.5492 13.5985 39.0779 14.5237C40.6065 15.4489 41.9177 16.636 42.9365 18.0173C43.9554 19.3986 44.662 20.947 45.016 22.574C45.37 24.201 45.3644 25.8749 44.9996 27.5H47.4996C49.8203 27.5 52.0459 28.4219 53.6868 30.0628C55.3278 31.7038 56.2496 33.9294 56.2496 36.25C56.2496 38.5706 55.3278 40.7962 53.6868 42.4372C52.0459 44.0781 49.8203 45 47.4996 45H44.9996"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.5 37.5L30 30L37.5 37.5M30 30V52.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
