"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

const TABS = ["all", "completed", "pending"] as const;

export type RequestsFilterTab = (typeof TABS)[number];

type RequestsFilterTabsProps = {
  className?: string;
  value?: RequestsFilterTab;
  defaultTab?: RequestsFilterTab;
  onChange?: (tab: RequestsFilterTab) => void;
  toolbar?: React.ReactNode;
};

/**
 * Requests filter tabs — All / Completed / Pending (same pattern as ads).
 */
export function RequestsFilterTabs({
  className,
  value,
  defaultTab = "all",
  onChange,
  toolbar,
}: RequestsFilterTabsProps) {
  const t = useTranslations("requests.filter");
  const [uncontrolled, setUncontrolled] = useState<RequestsFilterTab>(defaultTab);
  const activeTab = value ?? uncontrolled;

  function selectTab(tab: RequestsFilterTab) {
    if (value === undefined) setUncontrolled(tab);
    onChange?.(tab);
  }

  return (
    <div className={cn("mx-auto w-full max-w-[983px]", className)}>
      <div className="relative flex flex-wrap items-center justify-between gap-4 pb-[19px]">
        <div
          className="flex items-center gap-[57px]"
          role="tablist"
          aria-label={t("ariaLabel")}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectTab(tab)}
                className={cn(
                  "relative text-base font-medium leading-[19px] text-brand-800 transition-opacity",
                  isActive ? "opacity-100" : "opacity-50 hover:opacity-75",
                )}
              >
                {t(tab)}
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute -bottom-[19px] start-0 h-[3px] w-[90px] rounded-t-[10px] bg-brand-800"
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {toolbar}
      </div>

      <div className="h-px w-full bg-[#787878]" />
    </div>
  );
}
