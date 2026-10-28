"use client";

import { useTranslations } from "next-intl";

import { PackageCard } from "@/features/packages/components/package-card";
import type {
  PackageCardData,
  PackagePaymentCard,
} from "@/features/packages/types";
import { cn } from "@/lib/utils";

type PackageConfirmPaymentProps = {
  package: PackageCardData;
  paymentCard: PackagePaymentCard;
  onBack: () => void;
  onEditCard: () => void;
  onConfirm?: () => void;
  className?: string;
};

function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "");
  const lastFour = digits.slice(-4).padStart(4, "•");
  return `${".".repeat(11)}${lastFour}`;
}

const shellMinHeight =
  "min-h-[calc(100dvh-4rem-4.5rem)] sm:min-h-[calc(100dvh-5rem-4.5rem)] lg:min-h-[calc(100dvh-100px-4.5rem)]";

/**
 * Confirm payment screen after Add Card (Figma Payments / Package Details / Price Details).
 * Stacked on mobile/tablet; package card + Confirm CTA align on the right from lg.
 */
export function PackageConfirmPayment({
  package: pkg,
  paymentCard,
  onBack,
  onEditCard,
  onConfirm,
  className,
}: PackageConfirmPaymentProps) {
  const t = useTranslations("packages.confirm");

  const monthlyPayment = Math.max(pkg.priceQar - 10, 0);
  const tax = 10;
  const total = pkg.priceQar;

  return (
    <div className={cn("flex w-full max-w-[980px] flex-col", shellMinHeight, className)}>
      <div className="flex w-full justify-start">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-brand-700 underline underline-offset-2 transition-opacity hover:opacity-80"
        >
          {t("back")}
        </button>
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col gap-8 sm:mt-6 sm:gap-10 lg:flex-row lg:items-stretch lg:justify-between lg:gap-8">
        <div className="flex w-full max-w-[448px] flex-col gap-6 lg:shrink-0">
          <section className="flex w-full flex-col gap-4">
            <h2 className="text-base font-semibold leading-6 text-neutral-800">
              {t("payments")}
            </h2>

            <div className="flex w-full flex-col gap-3">
              <div className="flex w-full items-center justify-between gap-3 sm:gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                  <MastercardMark className="h-8 w-[41px] shrink-0" />
                  <span className="truncate text-sm font-normal leading-[18px] text-neutral-800">
                    {maskCardNumber(paymentCard.cardNumber)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onEditCard}
                  className="shrink-0 text-xs font-semibold leading-[18px] text-neutral-800 transition-opacity hover:opacity-70"
                >
                  {t("edit")}
                </button>
              </div>
              <div className="h-px w-full max-w-[327px] bg-neutral-200" />
            </div>
          </section>

          <section className="flex w-full flex-col gap-4">
            <h2 className="text-base font-semibold leading-6 text-neutral-800">
              {t("priceDetails")}
            </h2>

            <div className="flex w-full flex-col gap-2">
              <PriceRow label={t("periodTime")} value={t("periodValue")} />
              <PriceRow
                label={t("monthlyPayment")}
                value={t("amount", { amount: monthlyPayment.toFixed(2) })}
              />
              <PriceRow
                label={t("tax")}
                value={t("amount", { amount: tax.toFixed(2) })}
              />
              <div className="flex w-full items-center justify-between gap-4 sm:gap-9">
                <span className="flex-1 text-xs font-medium leading-[18px] text-neutral-800">
                  {t("total")}
                </span>
                <span className="text-base font-semibold leading-6 text-brand-700">
                  {t("totalAmount", { amount: total })}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="flex w-full max-w-[478px] flex-1 flex-col lg:ms-auto">
          <section className="flex flex-col gap-4">
            <h2 className="text-base font-semibold leading-6 text-neutral-800">
              {t("packageDetails")}
            </h2>
            <PackageCard package={pkg} hideBuyButton className="max-w-none" />
          </section>

          <div className="mt-8 flex w-full justify-stretch pt-0 sm:mt-auto sm:justify-end sm:pt-10">
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand-600 px-6 text-base font-normal leading-[27px] text-white shadow-[0px_8px_8px_-4px_rgba(0,136,255,0.03),0px_20px_24px_-4px_rgba(0,136,255,0.08)] transition-opacity hover:opacity-90 sm:h-[52px] sm:w-[300px] sm:text-lg"
            >
              {t("confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full items-center justify-between gap-4 sm:gap-9">
      <span className="flex-1 text-xs font-medium leading-[18px] text-neutral-400">
        {label}
      </span>
      <span className="text-xs font-normal leading-[18px] text-neutral-800">
        {value}
      </span>
    </div>
  );
}

function MastercardMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 42 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="14.5" cy="14.5" r="13" fill="#EB001B" />
      <circle cx="27.5" cy="14.5" r="13" fill="#F79E1B" />
      <path
        d="M21 5.5C18.7 7.6 17.2 10.7 17.2 14.5C17.2 18.3 18.7 21.4 21 23.5C23.3 21.4 24.8 18.3 24.8 14.5C24.8 10.7 23.3 7.6 21 5.5Z"
        fill="#FF5F00"
      />
      <path
        d="M10 30.5C12.2 31.4 14.7 31.8 17.2 31.8C19.7 31.8 22.2 31.4 24.4 30.5H10Z"
        fill="#1F2A37"
        opacity="0.15"
      />
    </svg>
  );
}
