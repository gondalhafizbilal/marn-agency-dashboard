"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";

import { CloseSquareIcon } from "@/components/icons/close-square-icon";
import { cn } from "@/lib/utils";

export type RequestsFilterValues = {
  category: string;
  status: string;
};

export const DEFAULT_REQUESTS_FILTERS: RequestsFilterValues = {
  category: "",
  status: "",
};

type RequestsFilterDialogProps = {
  open: boolean;
  onClose: () => void;
  value?: RequestsFilterValues;
  onApply: (filters: RequestsFilterValues) => void;
  className?: string;
};

/**
 * Requests filter popup — category + status selects.
 */
export function RequestsFilterDialog({
  open,
  onClose,
  value = DEFAULT_REQUESTS_FILTERS,
  onApply,
  className,
}: RequestsFilterDialogProps) {
  const t = useTranslations("requests.filterDialog");
  const titleId = useId();
  const [draft, setDraft] = useState<RequestsFilterValues>(value);

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

  function handleReset() {
    setDraft({ ...DEFAULT_REQUESTS_FILTERS });
  }

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
        <h2 id={titleId} className="sr-only">
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

        <div className="flex w-full max-w-[328px] flex-col items-center gap-[46px]">
          <div className="flex w-full flex-col items-start gap-6">
            <FilterSelect
              label={t("category")}
              value={draft.category}
              placeholder={t("placeholder")}
              options={[
                { value: "housemaid", label: t("categories.housemaid") },
                { value: "nanny", label: t("categories.nanny") },
                { value: "driver", label: t("categories.driver") },
                { value: "cook", label: t("categories.cook") },
                { value: "caretaker", label: t("categories.caretaker") },
              ]}
              onChange={(category) => setDraft((prev) => ({ ...prev, category }))}
            />

            <FilterSelect
              label={t("status")}
              value={draft.status}
              placeholder={t("placeholder")}
              options={[
                { value: "completed", label: t("statuses.completed") },
                { value: "pending", label: t("statuses.pending") },
              ]}
              onChange={(status) => setDraft((prev) => ({ ...prev, status }))}
            />
          </div>

          <div className="flex w-full shrink-0 items-center justify-between gap-6">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-[52px] w-[160px] items-center justify-center rounded-lg bg-white px-3 text-lg font-medium leading-[27px] text-neutral-400 transition-opacity hover:opacity-80"
            >
              {t("reset")}
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(draft);
                onClose();
              }}
              className="inline-flex h-[52px] w-[160px] items-center justify-center rounded-lg bg-brand-600 px-3 text-lg font-semibold leading-[27px] text-[#F0E9DF] transition-opacity hover:opacity-90"
            >
              {t("apply")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative flex w-full max-w-[327px] flex-col justify-center gap-1">
      <span className="text-base font-semibold leading-6 text-neutral-800">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-10 w-full appearance-none rounded-lg border border-neutral-300 bg-white px-4 py-2 pe-10",
          "text-sm leading-[18px] text-neutral-800 outline-none",
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ArrowDownIcon className="pointer-events-none absolute end-4 top-[38px] size-6 text-brand-800" />
    </label>
  );
}

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M5 9.5L12 16.5L19 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
