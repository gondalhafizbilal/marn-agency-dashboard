"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

type AdsPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

/**
 * Dashboard ads pagination (Figma Group 335):
 * Previous · page pills · Next — compact on mobile, full labels from sm+.
 */
export function AdsPagination({
  page,
  totalPages,
  onPageChange,
  className,
}: AdsPaginationProps) {
  const t = useTranslations("dashboard.pagination");

  if (totalPages < 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label={t("ariaLabel")}
      className={cn(
        "flex h-10 w-full max-w-full items-center justify-between gap-3 sm:max-w-[297px] sm:gap-0",
        className,
      )}
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium leading-[18px] text-brand-700 transition-opacity disabled:opacity-40 sm:text-[15px]"
      >
        <Chevron direction="prev" />
        <span className="hidden sm:inline">{t("previous")}</span>
      </button>

      <ul className="flex items-center gap-3 sm:gap-[26px]">
        {pages.map((n) => {
          const active = n === page;
          return (
            <li key={n}>
              <button
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => onPageChange(n)}
                className={cn(
                  "flex items-center justify-center text-sm font-medium leading-[18px] transition-colors sm:text-[15px]",
                  active
                    ? "size-9 rounded-[10px] bg-brand-700 text-white sm:size-10"
                    : "min-w-[10px] text-brand-700 hover:opacity-70",
                )}
              >
                {n}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium leading-[18px] text-brand-700 transition-opacity disabled:opacity-40 sm:text-[15px]"
      >
        <span className="hidden sm:inline">{t("next")}</span>
        <Chevron direction="next" />
      </button>
    </nav>
  );
}

function Chevron({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      width="12"
      height="6"
      viewBox="0 0 12 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn(
        "shrink-0 text-brand-700",
        direction === "prev" && "rotate-90 rtl:-rotate-90",
        direction === "next" && "-rotate-90 rtl:rotate-90",
      )}
    >
      {/* Down-pointing chevron; rotated for left/right */}
      <path
        d="M1 1L6 5L11 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
