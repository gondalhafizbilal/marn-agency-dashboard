"use client";

import { useTranslations } from "next-intl";

import {
  StatBlob,
  StatIcon,
  type StatIconVariant,
} from "@/features/dashboard/components/ads-stats-row";
import { cn } from "@/lib/utils";

type StatItem = {
  key: "totalRequests" | "completed" | "pending";
  value: number;
  icon: StatIconVariant;
};

/** Mock counts until requests API is wired. */
const STATS: StatItem[] = [
  { key: "totalRequests", value: 120, icon: "category" },
  { key: "completed", value: 86, icon: "shieldDone" },
  { key: "pending", value: 34, icon: "shieldFail" },
];

type RequestsStatsRowProps = {
  className?: string;
};

/**
 * Requests summary cards — same layout as ads stats, first three only (no drafts).
 */
export function RequestsStatsRow({ className }: RequestsStatsRowProps) {
  const t = useTranslations("requests.stats");

  return (
    <div
      className={cn(
        "mx-auto grid w-full max-w-[980px] grid-cols-1 gap-5 sm:grid-cols-3",
        className,
      )}
      role="list"
      aria-label={t("ariaLabel")}
    >
      {STATS.map((stat) => (
        <article
          key={stat.key}
          role="listitem"
          className="relative flex h-[120px] w-full items-center gap-4 rounded-[25px] bg-white px-5"
        >
          <div className="relative flex size-[74px] shrink-0 items-center justify-center">
            <StatBlob variant={stat.icon} />
            <StatIcon variant={stat.icon} />
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <p className="truncate text-base font-normal leading-[19px] text-[#ACACAC]">
              {t(stat.key)}
            </p>
            <p className="text-xl font-semibold leading-6 text-[#232323]">
              {stat.value}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
