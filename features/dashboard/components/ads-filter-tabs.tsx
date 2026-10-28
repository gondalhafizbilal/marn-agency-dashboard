"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { AddUserIcon } from "@/components/icons/add-user-icon";
import { FilterIcon } from "@/components/icons/filter-icon";
import { FolderIcon } from "@/components/icons/folder-icon";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const TABS = ["all", "active", "inactive"] as const;

export type AdsFilterTab = (typeof TABS)[number];

type AdsFilterTabsProps = {
  className?: string;
  value?: AdsFilterTab;
  defaultTab?: AdsFilterTab;
  onChange?: (tab: AdsFilterTab) => void;
  /** Dashboard: show View All. Ads page: hide and use toolbar instead. */
  showViewAll?: boolean;
  /** Right-side tools (search / export / filter) for the Ads page. */
  toolbar?: React.ReactNode;
};

/**
 * Ads filter tabs (Figma):
 * All Ads / Active / Inactive + optional View All or Ads toolbar.
 */
export function AdsFilterTabs({
  className,
  value,
  defaultTab = "all",
  onChange,
  showViewAll = true,
  toolbar,
}: AdsFilterTabsProps) {
  const t = useTranslations("dashboard.adsFilter");
  const [uncontrolled, setUncontrolled] = useState<AdsFilterTab>(defaultTab);
  const activeTab = value ?? uncontrolled;

  function selectTab(tab: AdsFilterTab) {
    if (value === undefined) setUncontrolled(tab);
    onChange?.(tab);
  }

  return (
    <div className={cn("mx-auto w-full max-w-[983px]", className)}>
      <div className="relative flex items-center justify-between gap-3 pb-4 sm:gap-4 sm:pb-[19px]">
        <div
          className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-10 lg:gap-x-[57px]"
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
                  "relative shrink-0 pb-0.5 text-sm font-medium leading-[19px] text-brand-800 transition-opacity sm:text-base",
                  isActive ? "opacity-100" : "opacity-50 hover:opacity-75",
                )}
              >
                {t(tab)}
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute -bottom-[calc(1rem-2px)] start-0 h-[3px] w-full min-w-[48px] max-w-[90px] rounded-t-[10px] bg-brand-800 sm:-bottom-[19px]"
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {toolbar ? (
          toolbar
        ) : showViewAll ? (
          <Link
            href="/ads"
            className="shrink-0 text-sm font-normal leading-[19px] text-[#670506] underline underline-offset-2 transition-opacity hover:opacity-80 sm:text-base"
          >
            {t("viewAll")}
          </Link>
        ) : null}
      </div>

      <div className="h-px w-full bg-[#787878]" />
    </div>
  );
}

type AdsPageToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onExport?: () => void;
  onFilter?: () => void;
  onAdd?: () => void;
  className?: string;
};

/**
 * Ads page filter tools (Figma): search 300×30 + Sort By + Filter + Add Ad.
 */
export function AdsPageToolbar({
  search,
  onSearchChange,
  onExport,
  onFilter,
  onAdd,
  className,
}: AdsPageToolbarProps) {
  const t = useTranslations("ads.toolbar");

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center justify-stretch gap-2 sm:w-auto sm:justify-end sm:gap-3",
        className,
      )}
    >
      <label className="relative block h-[30px] w-full min-w-0 flex-1 sm:w-[300px] sm:flex-none sm:max-w-full">
        <span className="sr-only">{t("searchLabel")}</span>
        <SearchIcon
          className="pointer-events-none absolute start-2.5 top-1/2 size-5 -translate-y-1/2 text-[#B8B8B8]"
          strokeWidth={1.75}
        />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-[30px] w-full rounded border-0 bg-white pe-3 ps-10 text-sm leading-[18px] text-neutral-800 outline-none placeholder:text-[#CDCDCD]"
        />
      </label>

      <button
        type="button"
        onClick={onExport}
        className="inline-flex h-[30px] shrink-0 items-center justify-center gap-1 rounded border border-brand-700 px-2 text-sm leading-[18px] text-brand-700 transition-colors hover:bg-brand-25 sm:w-[87px]"
      >
        {t("export")}
        <FolderIcon size={16} className="text-brand-800" />
      </button>

      <button
        type="button"
        onClick={onFilter}
        className="inline-flex h-[30px] shrink-0 items-center justify-center gap-1 rounded border border-brand-700 px-2 text-sm leading-[18px] text-brand-700 transition-colors hover:bg-brand-25 sm:w-[79px]"
      >
        {t("filter")}
        <FilterIcon size={18} className="text-brand-700" />
      </button>

      <button
        type="button"
        onClick={onAdd}
        className="inline-flex h-[30px] shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded border border-brand-700 px-2 text-sm leading-[18px] text-brand-700 transition-colors hover:bg-brand-25"
      >
        <span>{t("addAd")}</span>
        <AddUserIcon size={16} className="shrink-0 text-brand-800" />
      </button>
    </div>
  );
}
