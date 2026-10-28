"use client";

import { useTranslations } from "next-intl";

import { BuyIcon } from "@/components/icons/buy-icon";
import { TickSquareIcon } from "@/components/icons/tick-square-icon";
import { cn } from "@/lib/utils";
import type { PackageCardData } from "@/features/packages/types";

type PackageCardProps = {
  package: PackageCardData;
  className?: string;
  onBuy?: (packageId: string) => void;
  /** Hide Buy Now — used on confirm/payment summary. */
  hideBuyButton?: boolean;
};

/**
 * Package card (Figma Ad card/Card/Package):
 * Desktop ~478×158; fluid height on mobile so price + CTA can stack.
 */
export function PackageCard({
  package: pkg,
  className,
  onBuy,
  hideBuyButton = false,
}: PackageCardProps) {
  const t = useTranslations("packages");

  return (
    <article
      className={cn(
        "flex w-full max-w-[478px] flex-col justify-center rounded-[13px] bg-[#FCFCFD] shadow-[0px_4px_10px_rgba(0,0,0,0.1)]",
        hideBuyButton
          ? "min-h-0 px-4 py-4 sm:px-6 sm:py-[19.5px]"
          : "min-h-[158px] p-3 sm:p-3",
        className,
      )}
    >
      <div className="flex w-full flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base font-semibold leading-6 text-black sm:text-lg sm:leading-[27px]">
            {pkg.name}
          </h3>

          <ul className="flex flex-col gap-1">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex items-center gap-1">
                <TickSquareIcon
                  size={24}
                  className="size-5 shrink-0 text-brand-700 sm:size-6"
                />
                <span className="text-sm font-normal leading-[18px] text-[#111927]">
                  {t(`features.${feature}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={cn(
            "flex w-full gap-3",
            hideBuyButton
              ? "items-center justify-start"
              : "flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4",
          )}
        >
          <p className="text-xs leading-[14px]">
            <span className="font-medium text-brand-700">
              {t("startingFrom")}{" "}
            </span>
            <span className="text-base font-bold leading-5 text-brand-700">
              {t("priceAmount", { price: pkg.priceQar })}
            </span>
            <span className="font-normal text-neutral-400">
              {t("priceDuration", { days: pkg.durationDays })}
            </span>
          </p>

          {!hideBuyButton ? (
            <button
              type="button"
              onClick={() => onBuy?.(pkg.id)}
              className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-1.5 rounded-[6px] bg-brand-700 px-3 text-sm font-semibold leading-[18px] text-[#FCFCFD] transition-opacity hover:opacity-90 sm:w-auto"
            >
              <BuyIcon size={24} className="size-5 shrink-0 sm:size-6" />
              <span>{t("buyNow")}</span>
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
