"use client";

import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { FilterIcon } from "@/components/icons/filter-icon";
import { FolderIcon } from "@/components/icons/folder-icon";
import { cn } from "@/lib/utils";

type RequestsPageToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onSort?: () => void;
  onFilter?: () => void;
  className?: string;
};

/**
 * Requests toolbar (Figma): search + Sort By + Filters.
 */
export function RequestsPageToolbar({
  search,
  onSearchChange,
  onSort,
  onFilter,
  className,
}: RequestsPageToolbarProps) {
  const t = useTranslations("requests.toolbar");

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-end gap-3",
        className,
      )}
    >
      <label className="relative block h-[30px] w-[300px] max-w-full">
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
        onClick={onSort}
        className="inline-flex h-[30px] w-[87px] items-center justify-center gap-1 rounded border border-brand-700 px-2 text-sm leading-[18px] text-brand-700 transition-colors hover:bg-brand-25"
      >
        {t("sortBy")}
        <FolderIcon size={16} className="text-brand-800" />
      </button>

      <button
        type="button"
        onClick={onFilter}
        className="inline-flex h-[30px] w-[79px] items-center justify-center gap-1 rounded border border-brand-700 px-2 text-sm leading-[18px] text-brand-700 transition-colors hover:bg-brand-25"
      >
        {t("filter")}
        <FilterIcon size={18} className="text-brand-700" />
      </button>
    </div>
  );
}
