"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";

import { CloseSquareIcon } from "@/components/icons/close-square-icon";
import { cn } from "@/lib/utils";

export type AdsFilterValues = {
  category: string;
  location: string;
  experience: string;
  nationalities: string[];
  priceMin: number;
  priceMax: number;
};

const PRICE_MIN = 100;
const PRICE_MAX = 5000;

export const DEFAULT_ADS_FILTERS: AdsFilterValues = {
  category: "",
  location: "",
  experience: "",
  nationalities: [],
  priceMin: PRICE_MIN,
  priceMax: PRICE_MAX,
};

const NATIONALITIES = [
  "pakistan",
  "india",
  "qatar",
  "uae",
  "bangladesh",
] as const;

type AdsFilterDialogProps = {
  open: boolean;
  onClose: () => void;
  value?: AdsFilterValues;
  onApply: (filters: AdsFilterValues) => void;
  className?: string;
};

/**
 * Ads Filters popup (Figma Filter Pop-up):
 * 454×742 white card — selects, nationality checks, price range, Reset / Apply.
 */
export function AdsFilterDialog({
  open,
  onClose,
  value = DEFAULT_ADS_FILTERS,
  onApply,
  className,
}: AdsFilterDialogProps) {
  const t = useTranslations("ads.filter");
  const tEdit = useTranslations("ads.edit");
  const titleId = useId();
  const [draft, setDraft] = useState<AdsFilterValues>(value);

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

  function toggleNationality(id: string) {
    setDraft((prev) => {
      const selected = prev.nationalities.includes(id)
        ? prev.nationalities.filter((item) => item !== id)
        : [...prev.nationalities, id];
      return { ...prev, nationalities: selected };
    });
  }

  function handleReset() {
    setDraft({ ...DEFAULT_ADS_FILTERS });
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
              label={tEdit("fields.category")}
              value={draft.category}
              placeholder={tEdit("placeholder")}
              options={[
                { value: "housemaid", label: "Housemaid" },
                { value: "nanny", label: "Nanny" },
                { value: "driver", label: "Driver" },
                { value: "cook", label: "Cook" },
              ]}
              onChange={(category) => setDraft((prev) => ({ ...prev, category }))}
            />

            <FilterSelect
              label={tEdit("fields.location")}
              value={draft.location}
              placeholder={tEdit("placeholder")}
              options={[
                { value: "doha", label: "Doha, Qatar" },
                { value: "lusail", label: "Lusail, Qatar" },
                { value: "al-wakrah", label: "Al Wakrah, Qatar" },
                { value: "al-rayyan", label: "Al Rayyan, Qatar" },
                { value: "al-khor", label: "Al Khor, Qatar" },
              ]}
              onChange={(location) => setDraft((prev) => ({ ...prev, location }))}
            />

            <FilterSelect
              label={tEdit("fields.experience")}
              value={draft.experience}
              placeholder={tEdit("placeholder")}
              options={[
                { value: "0-1", label: "0–1 years" },
                { value: "1-3", label: "1–3 years" },
                { value: "3-5", label: "3–5 years" },
                { value: "5+", label: "5+ years" },
              ]}
              onChange={(experience) =>
                setDraft((prev) => ({ ...prev, experience }))
              }
            />

            <div className="flex w-full flex-col items-start gap-4">
              <p className="text-base font-semibold leading-6 text-neutral-800">
                {t("nationality")}
              </p>
              <div className="flex w-full flex-col gap-1">
                {NATIONALITIES.map((id) => {
                  const checked = draft.nationalities.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleNationality(id)}
                      className="flex h-6 w-full items-center justify-between gap-4 text-start"
                    >
                      <span className="flex-1 text-xs leading-[18px] text-neutral-800">
                        {t(`nationalities.${id}`)}
                      </span>
                      <NationalityCheckbox checked={checked} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex w-full flex-col items-start gap-4">
              <p className="text-base font-semibold leading-6 text-neutral-800">
                {t("priceRange")}
              </p>
              <PriceRangeSlider
                min={draft.priceMin}
                max={draft.priceMax}
                onChange={(priceMin, priceMax) =>
                  setDraft((prev) => ({ ...prev, priceMin, priceMax }))
                }
              />
            </div>
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
          !value && "text-neutral-800",
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

function NationalityCheckbox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className="inline-flex size-6 shrink-0 items-center justify-center"
    >
      {checked ? <TickSquareFilledIcon /> : <TickSquareEmptyIcon />}
    </span>
  );
}

function TickSquareFilledIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#7C0A23" />
      <path
        d="M7.5 12.2L10.4 15.1L16.5 9"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TickSquareEmptyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="3.5"
        stroke="#D2D6DB"
        strokeWidth="1.5"
      />
    </svg>
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

function PriceRangeSlider({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const t = useTranslations("ads.filter");
  const minPct = ((min - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPct = ((max - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="relative h-3 w-full">
        <div className="absolute start-0 end-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-neutral-300" />
        <div
          className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-brand-700"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={50}
          value={min}
          aria-label={t("priceMin")}
          onChange={(event) => {
            const next = Number(event.target.value);
            onChange(Math.min(next, max - 50), max);
          }}
          className="pointer-events-none absolute inset-0 z-20 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-brand-700 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-700"
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={50}
          value={max}
          aria-label={t("priceMax")}
          onChange={(event) => {
            const next = Number(event.target.value);
            onChange(min, Math.max(next, min + 50));
          }}
          className="pointer-events-none absolute inset-0 z-30 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-brand-700 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-30 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-700"
        />
      </div>
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-semibold leading-[18px] text-neutral-400">
          {t("priceLabel", { amount: PRICE_MIN })}
        </span>
        <span className="text-xs font-semibold leading-[18px] text-neutral-400">
          {t("priceLabel", { amount: PRICE_MAX })}
        </span>
      </div>
    </div>
  );
}
