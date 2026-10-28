"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";

import { CloseSquareIcon } from "@/components/icons/close-square-icon";
import { cn } from "@/lib/utils";

export type RequestsSortOption =
  | "newest"
  | "oldest"
  | "nameAsc"
  | "nameDesc";

export const DEFAULT_REQUESTS_SORT: RequestsSortOption = "newest";

const SORT_OPTIONS: RequestsSortOption[] = [
  "newest",
  "oldest",
  "nameAsc",
  "nameDesc",
];

type RequestsSortDialogProps = {
  open: boolean;
  onClose: () => void;
  value?: RequestsSortOption;
  onApply: (sort: RequestsSortOption) => void;
  className?: string;
};

/**
 * Requests sort popup — newest, oldest, name A–Z / Z–A.
 */
export function RequestsSortDialog({
  open,
  onClose,
  value = DEFAULT_REQUESTS_SORT,
  onApply,
  className,
}: RequestsSortDialogProps) {
  const t = useTranslations("requests.sortDialog");
  const titleId = useId();
  const [draft, setDraft] = useState<RequestsSortOption>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

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
          "relative z-10 flex w-full max-w-[454px] flex-col items-center overflow-hidden",
          "rounded-[24px] bg-white px-[63px] py-[45px]",
          "shadow-[0_24px_48px_-12px_rgba(80,5,22,0.25)]",
          className,
        )}
      >
        <h2 id={titleId} className="text-base font-semibold leading-6 text-neutral-800">
          {t("title")}
        </h2>

        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute end-5 top-5 text-brand-800 transition-opacity hover:opacity-70"
        >
          <CloseSquareIcon size={40} />
        </button>

        <div className="mt-8 flex w-full max-w-[328px] flex-col gap-4">
          {SORT_OPTIONS.map((option) => {
            const selected = draft === option;
            return (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-3 text-sm leading-[18px] text-neutral-800"
              >
                <input
                  type="radio"
                  name="requests-sort"
                  checked={selected}
                  onChange={() => setDraft(option)}
                  className="size-4 accent-brand-700"
                />
                {t(option)}
              </label>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            onApply(draft);
            onClose();
          }}
          className="mt-10 inline-flex h-[52px] w-full max-w-[328px] items-center justify-center rounded-lg bg-brand-600 px-3 text-lg font-semibold leading-[27px] text-[#F0E9DF] transition-opacity hover:opacity-90"
        >
          {t("apply")}
        </button>
      </div>
    </div>
  );
}
