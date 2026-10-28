"use client";

import { useEffect, useId, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { CloseSquareIcon } from "@/components/icons/close-square-icon";
import { cn } from "@/lib/utils";

export type SharePlatform =
  | "facebook"
  | "instagram"
  | "twitter"
  | "whatsapp"
  | "linkedin"
  | "pinterest";

type ShareDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Absolute or relative URL to share (defaults to current page). */
  shareUrl?: string;
  shareText?: string;
  onShare?: (platform: SharePlatform) => void;
  className?: string;
};

const PLATFORMS: {
  id: SharePlatform;
  labelKey: SharePlatform;
  className: string;
  icon: ReactNode;
}[] = [
  {
    id: "facebook",
    labelKey: "facebook",
    className: "bg-[#537ACB]",
    icon: <FacebookIcon />,
  },
  {
    id: "instagram",
    labelKey: "instagram",
    className: "bg-[linear-gradient(50.95deg,#FBDA61_-3.65%,#C850C0_87.9%)]",
    icon: <InstagramIcon />,
  },
  {
    id: "twitter",
    labelKey: "twitter",
    className: "bg-[#13B9ED]",
    icon: <TwitterIcon />,
  },
  {
    id: "whatsapp",
    labelKey: "whatsapp",
    className: "bg-[#25D366]",
    icon: <WhatsAppIcon />,
  },
  {
    id: "linkedin",
    labelKey: "linkedin",
    className: "bg-[#006599]",
    icon: <LinkedInIcon />,
  },
  {
    id: "pinterest",
    labelKey: "pinterest",
    className: "bg-[#B42318]",
    icon: <PinterestIcon />,
  },
];

/**
 * Share popup (Figma Group 1000003281):
 * 492×345 white card — Share to + social grid (2×3).
 */
export function ShareDialog({
  open,
  onClose,
  shareUrl,
  shareText,
  onShare,
  className,
}: ShareDialogProps) {
  const t = useTranslations("shareDialog");
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const url =
    shareUrl ??
    (typeof window !== "undefined" ? window.location.href : "");
  const text = shareText ?? "";

  function handleShare(platform: SharePlatform) {
    onShare?.(platform);
    const target = buildShareUrl(platform, url, text);
    if (target) window.open(target, "_blank", "noopener,noreferrer");
  }

  const row1 = PLATFORMS.slice(0, 3);
  const row2 = PLATFORMS.slice(3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("close")}
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative z-10 flex h-[345px] w-full max-w-[492px] flex-col items-center justify-center",
          "rounded-[24px] bg-white",
          "shadow-[0_24px_48px_-12px_rgba(80,5,22,0.25)]",
          className,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute end-4 top-4 text-brand-800 transition-opacity hover:opacity-70 sm:end-5 sm:top-5"
        >
          <CloseSquareIcon size={40} />
        </button>

        <div className="flex w-[295px] flex-col items-center gap-8">
          <h2
            id={titleId}
            className="text-center text-base font-semibold leading-6 text-neutral-800"
          >
            {t("title")}
          </h2>

          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full items-start justify-between gap-[35px]">
              {row1.map((item) => (
                <ShareItem
                  key={item.id}
                  label={t(item.labelKey)}
                  className={item.className}
                  icon={item.icon}
                  onClick={() => handleShare(item.id)}
                />
              ))}
            </div>
            <div className="flex w-full items-start justify-between gap-16">
              {row2.map((item) => (
                <ShareItem
                  key={item.id}
                  label={t(item.labelKey)}
                  className={item.className}
                  icon={item.icon}
                  onClick={() => handleShare(item.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareItem({
  label,
  className,
  icon,
  onClick,
}: {
  label: string;
  className: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-[57px] flex-col items-center gap-2"
    >
      <span
        className={cn(
          "flex size-[53px] items-center justify-center rounded-full text-white",
          className,
        )}
      >
        {icon}
      </span>
      <span className="text-center text-xs font-semibold leading-[18px] text-neutral-800">
        {label}
      </span>
    </button>
  );
}

function buildShareUrl(platform: SharePlatform, url: string, text: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text || url);

  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "pinterest":
      return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`;
    case "instagram":
      // Instagram has no web share intent — copy URL as a practical fallback.
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        void navigator.clipboard.writeText(url);
      }
      return null;
    default:
      return null;
  }
}

function FacebookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 8.5V6.75C14 5.784 14.784 5 15.75 5H17V2H14C11.239 2 9 4.239 9 7V8.5H6V12H9V22H13V12H15.5L16.5 8.5H14Z"
        fill="white"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 7.2A4.8 4.8 0 1 0 12 16.8A4.8 4.8 0 1 0 12 7.2ZM12 15.2A3.2 3.2 0 1 1 12 8.8A3.2 3.2 0 1 1 12 15.2ZM17.52 6.98A1.12 1.12 0 1 1 17.52 4.74A1.12 1.12 0 1 1 17.52 6.98ZM21.6 7.02C21.552 5.98 21.316 5.26 20.92 4.64C20.508 3.98 20.02 3.492 19.36 3.08C18.74 2.684 18.02 2.448 16.98 2.4C15.924 2.348 15.588 2.336 12 2.336C8.412 2.336 8.076 2.348 7.02 2.4C5.98 2.448 5.26 2.684 4.64 3.08C3.98 3.492 3.492 3.98 3.08 4.64C2.684 5.26 2.448 5.98 2.4 7.02C2.348 8.076 2.336 8.412 2.336 12C2.336 15.588 2.348 15.924 2.4 16.98C2.448 18.02 2.684 18.74 3.08 19.36C3.492 20.02 3.98 20.508 4.64 20.92C5.26 21.316 5.98 21.552 7.02 21.6C8.076 21.652 8.412 21.664 12 21.664C15.588 21.664 15.924 21.652 16.98 21.6C18.02 21.552 18.74 21.316 19.36 20.92C20.02 20.508 20.508 20.02 20.92 19.36C21.316 18.74 21.552 18.02 21.6 16.98C21.652 15.924 21.664 15.588 21.664 12C21.664 8.412 21.652 8.076 21.6 7.02ZM19.99 16.87C19.95 17.75 19.77 18.23 19.53 18.55C19.23 18.96 18.96 19.23 18.55 19.53C18.23 19.77 17.75 19.95 16.87 19.99C15.83 20.04 15.52 20.05 12 20.05C8.48 20.05 8.17 20.04 7.13 19.99C6.25 19.95 5.77 19.77 5.45 19.53C5.04 19.23 4.77 18.96 4.47 18.55C4.23 18.23 4.05 17.75 4.01 16.87C3.96 15.83 3.95 15.52 3.95 12C3.95 8.48 3.96 8.17 4.01 7.13C4.05 6.25 4.23 5.77 4.47 5.45C4.77 5.04 5.04 4.77 5.45 4.47C5.77 4.23 6.25 4.05 7.13 4.01C8.17 3.96 8.48 3.95 12 3.95C15.52 3.95 15.83 3.96 16.87 4.01C17.75 4.05 18.23 4.23 18.55 4.47C18.96 4.77 19.23 5.04 19.53 5.45C19.77 5.77 19.95 6.25 19.99 7.13C20.04 8.17 20.05 8.48 20.05 12C20.05 15.52 20.04 15.83 19.99 16.87Z"
        fill="white"
      />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22 5.8C21.3 6.1 20.5 6.3 19.7 6.4C20.5 5.9 21.1 5.2 21.4 4.3C20.6 4.8 19.8 5.1 18.8 5.3C18.1 4.5 17.1 4 16 4C13.9 4 12.2 5.7 12.2 7.8C12.2 8.1 12.2 8.4 12.3 8.6C9.1 8.5 6.2 6.9 4.3 4.5C4 5.1 3.8 5.7 3.8 6.4C3.8 7.7 4.5 8.9 5.5 9.5C4.9 9.5 4.3 9.3 3.8 9.1V9.1C3.8 11 5.1 12.5 6.9 12.9C6.6 13 6.3 13 6 13C5.8 13 5.6 13 5.4 12.9C5.8 14.4 7.2 15.5 8.9 15.5C7.6 16.5 5.9 17.1 4.1 17.1C3.8 17.1 3.5 17.1 3.2 17C4.9 18.1 7 18.7 9.2 18.7C16 18.7 19.7 13.1 19.7 8.2C19.7 8 19.7 7.9 19.7 7.7C20.5 7.2 21.3 6.5 22 5.8Z"
        fill="white"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83H12.05C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91ZM12.05 20.15C10.59 20.15 9.16 19.76 7.91 19.03L7.61 18.85L4.42 19.69L5.28 16.58L5.08 16.27C4.28 15 3.82 13.47 3.82 11.91C3.82 7.38 7.51 3.69 12.04 3.69C14.24 3.69 16.3 4.55 17.85 6.11C19.41 7.66 20.26 9.73 20.26 11.92C20.26 16.45 16.57 20.15 12.05 20.15ZM16.56 13.99C16.31 13.87 15.09 13.27 14.87 13.18C14.64 13.1 14.48 13.06 14.31 13.31C14.15 13.56 13.68 14.11 13.54 14.27C13.4 14.44 13.26 14.46 13.01 14.33C12.76 14.21 11.96 13.95 11.01 13.1C10.27 12.44 9.77 11.62 9.63 11.37C9.49 11.12 9.61 10.99 9.73 10.87C9.84 10.76 9.97 10.59 10.09 10.45C10.21 10.31 10.25 10.21 10.33 10.05C10.41 9.89 10.37 9.75 10.31 9.62C10.25 9.5 9.77 8.31 9.57 7.81C9.37 7.33 9.17 7.39 9.02 7.39C8.88 7.38 8.71 7.38 8.55 7.38C8.38 7.38 8.12 7.44 7.9 7.69C7.67 7.94 7.05 8.52 7.05 9.7C7.05 10.88 7.9 12.02 8.02 12.18C8.14 12.35 9.72 14.78 12.07 15.8C12.63 16.04 13.07 16.18 13.4 16.29C13.94 16.46 14.43 16.44 14.82 16.38C15.25 16.31 16.24 15.79 16.45 15.21C16.65 14.64 16.65 14.15 16.59 14.05C16.53 13.95 16.37 13.89 16.12 13.77L16.56 13.99Z"
        fill="white"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20.45 20.45H16.89V14.88C16.89 13.55 16.86 11.84 15.04 11.84C13.19 11.84 12.91 13.29 12.91 14.78V20.45H9.35V9H12.76V10.56H12.81C13.29 9.66 14.45 8.71 16.18 8.71C19.78 8.71 20.45 11.08 20.45 14.17V20.45ZM5.34 7.43C4.2 7.43 3.27 6.49 3.27 5.36C3.27 4.23 4.2 3.3 5.34 3.3C6.47 3.3 7.4 4.23 7.4 5.36C7.4 6.49 6.47 7.43 5.34 7.43ZM7.12 20.45H3.55V9H7.12V20.45ZM22.22 0H1.77C0.8 0 0 0.77 0 1.73V22.27C0 23.23 0.8 24 1.77 24H22.22C23.2 24 24 23.23 24 22.27V1.73C24 0.77 23.2 0 22.22 0Z"
        fill="white"
      />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 0C5.373 0 0 5.373 0 12C0 17.013 3.334 21.29 7.906 22.647C7.823 21.773 7.752 20.433 7.938 19.473L9.061 14.721C9.061 14.721 8.752 14.103 8.752 13.191C8.752 11.759 9.582 10.69 10.615 10.69C11.495 10.69 11.92 11.351 11.92 12.143C11.92 13.027 11.355 14.35 11.064 15.574C10.821 16.598 11.578 17.433 12.583 17.433C14.404 17.433 15.804 15.514 15.804 12.743C15.804 10.29 14.041 8.575 11.52 8.575C8.598 8.575 6.882 10.766 6.882 13.001C6.882 13.884 7.222 14.832 7.647 15.346C7.731 15.449 7.743 15.538 7.718 15.644L7.404 16.919C7.363 17.087 7.268 17.124 7.094 17.042C5.747 16.414 4.907 14.449 4.907 12.965C4.907 9.681 7.292 6.665 11.797 6.665C15.418 6.665 18.222 9.246 18.222 12.698C18.222 16.46 15.852 19.5 12.74 19.5C11.697 19.5 10.713 18.958 10.376 18.317L9.723 20.807C9.486 21.72 8.827 22.867 8.385 23.56C9.511 23.847 10.733 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0Z"
        fill="white"
      />
    </svg>
  );
}
