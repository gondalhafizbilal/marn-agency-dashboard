"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

type AdsSearchEmptyProps = {
  className?: string;
};

/**
 * Empty search state (Figma Frame 156):
 * Illustration + “Search not found” + supporting copy.
 */
export function AdsSearchEmpty({ className }: AdsSearchEmptyProps) {
  const t = useTranslations("ads.searchEmpty");

  return (
    <div
      className={cn(
        "flex w-full max-w-[289px] flex-col items-center gap-6 py-16",
        className,
      )}
    >
      <Image
        src="/images/ads/empty-search.svg"
        alt=""
        width={215}
        height={119}
        className="h-[119px] w-[215px] shrink-0"
        priority
      />

      <div className="flex w-full flex-col items-center justify-center gap-4">
        <h2 className="text-center text-xl font-semibold leading-[26px] text-neutral-800">
          {t("title")}
        </h2>
        <p className="w-full text-center text-sm leading-[18px] text-neutral-400">
          {t("description")}
        </p>
      </div>
    </div>
  );
}
