"use client";

import { EyeIcon, MapPinIcon, PhoneIcon, Share2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

import { DeleteIcon } from "@/components/icons/delete-icon";
import { EditIcon } from "@/components/icons/edit-icon";
import { TickSquareIcon } from "@/components/icons/tick-square-icon";
import { cn } from "@/lib/utils";

export type AdCardStatus = "active" | "inactive" | "draft";

export type AdCardData = {
  id: string;
  name: string;
  location: string;
  role: string;
  salary: string;
  dateCreated: string;
  validDays: number;
  status: AdCardStatus;
  views: number;
  clicks: number;
  avatarUrl?: string;
};

type AdCardProps = {
  ad: AdCardData;
  className?: string;
  /** Hide View action when already in expanded detail mode. */
  hideViewAction?: boolean;
  /** Taller card layout used on the expanded detail screen. */
  expanded?: boolean;
  onUpdateStatus?: (ad: AdCardData) => void;
  onDelete?: (ad: AdCardData) => void;
  onShare?: (ad: AdCardData) => void;
  onEdit?: (ad: AdCardData) => void;
  onView?: (ad: AdCardData) => void;
};

/**
 * Dashboard ad card (Figma Ad card/Card/Profile):
 * Mobile: 100px avatar + stacked meta, compact metrics/actions (Figma 327×208).
 * Desktop: existing horizontal identity + metrics/actions row.
 */
export function AdCard({
  ad,
  className,
  hideViewAction = false,
  expanded = false,
  onUpdateStatus,
  onDelete,
  onShare,
  onEdit,
  onView,
}: AdCardProps) {
  const t = useTranslations("dashboard.adCard");

  return (
    <article
      className={cn(
        "flex w-full max-w-[925px] flex-col items-start justify-center rounded-[13px] bg-white shadow-[0px_4px_25px_rgba(0,0,0,0.05)]",
        expanded ? "min-h-0 gap-3 p-3 sm:min-h-[180px] sm:gap-5 sm:p-5" : "gap-3 p-3",
        className,
      )}
    >
      {/* Top: avatar + identity */}
      <div className="flex w-full items-start gap-3 sm:gap-4">
        <div className="relative size-[100px] shrink-0 overflow-hidden rounded-[13px] bg-auth-panel sm:size-[61px] sm:rounded-[10px]">
          {ad.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ad.avatarUrl} alt="" className="size-full object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center text-sm font-semibold text-brand-800 sm:text-sm">
              {initials(ad.name)}
            </span>
          )}
        </div>

        {/* Mobile meta (Figma Desc column) */}
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:hidden">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between gap-[11px]">
              <h3 className="truncate text-sm font-semibold leading-[18px] text-black">
                {ad.name}
              </h3>
              <StatusBadge status={ad.status} compact />
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
              <span className="inline-flex items-center gap-1 text-[10px] leading-[14px] text-neutral-400">
                <MapPinIcon className="size-4 shrink-0" strokeWidth={1.5} />
                {ad.location}
              </span>
              <span className="text-[10px] leading-[14px] text-neutral-400">{ad.role}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold leading-[14px] text-brand-700">
              <SalaryLabel salary={ad.salary} />
            </span>
            <p className="text-[10px] font-semibold leading-[14px] text-brand-700">
              {t("dateCreated", { date: ad.dateCreated, days: ad.validDays })}
            </p>
          </div>
        </div>

        {/* Desktop / tablet meta */}
        <div className="hidden min-w-0 flex-1 flex-col gap-1.5 sm:flex">
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate text-lg font-semibold leading-[27px] text-black">{ad.name}</h3>
            <StatusBadge status={ad.status} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              <span className="inline-flex items-center gap-1 text-sm leading-[18px] text-neutral-400">
                <MapPinIcon className="size-4 shrink-0" strokeWidth={1.5} />
                {ad.location}
              </span>
              <span className="text-sm leading-[18px] text-neutral-400">{ad.role}</span>
              <span className="text-sm font-semibold leading-[18px] text-brand-700">
                <SalaryLabel salary={ad.salary} />
              </span>
            </div>
            <p className="text-[10px] font-semibold leading-[14px] text-brand-700">
              {t("dateCreated", { date: ad.dateCreated, days: ad.validDays })}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics + actions */}
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:gap-y-2 lg:gap-x-[58px]">
        <div className="flex w-full flex-wrap items-center gap-[6.5px] sm:w-auto">
          <MetricChip icon={<TickSquareIcon size={14} className="size-3.5 sm:size-5" />}>
            {t("metricActive")}
          </MetricChip>
          <MetricChip icon={<EyeIcon className="size-3.5 sm:size-5" strokeWidth={1.5} />}>
            {t("views", { count: ad.views })}
          </MetricChip>
          <MetricChip icon={<PhoneIcon className="size-3.5 sm:size-5" strokeWidth={1.5} />}>
            {t("clicks", { count: ad.clicks })}
          </MetricChip>
        </div>

        {/* Figma mobile order: Update Status, Share, Delete, Edit */}
        <div className="flex w-full flex-wrap items-center gap-[5px] sm:w-auto sm:gap-1">
          <ActionButton
            icon={<TickSquareIcon size={14} className="size-3.5 sm:size-[18px]" />}
            label={t("actions.republish")}
            onClick={() => onUpdateStatus?.(ad)}
          />
          <ActionButton
            icon={<Share2Icon className="size-3.5 sm:size-[18px]" strokeWidth={1.5} />}
            label={t("actions.share")}
            onClick={() => onShare?.(ad)}
          />
          <ActionButton
            icon={<DeleteIcon size={14} className="size-3.5 sm:size-[18px]" />}
            label={t("actions.delete")}
            onClick={() => onDelete?.(ad)}
          />
          <ActionButton
            icon={<EditIcon size={14} className="size-3.5 sm:size-[18px]" />}
            label={t("actions.edit")}
            onClick={() => onEdit?.(ad)}
          />
          {!hideViewAction ? (
            <ActionButton
              icon={<EyeIcon className="size-3.5 sm:size-[18px]" strokeWidth={1.5} />}
              label={t("actions.view")}
              onClick={() => onView?.(ad)}
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}

function SalaryLabel({ salary }: { salary: string }) {
  const slashIndex = salary.lastIndexOf("/");
  if (slashIndex === -1) return <>{salary}</>;

  return (
    <>
      {salary.slice(0, slashIndex)}
      <span className="text-neutral-400">{salary.slice(slashIndex)}</span>
    </>
  );
}

function StatusBadge({ status, compact = false }: { status: AdCardStatus; compact?: boolean }) {
  const t = useTranslations("dashboard.adCard.status");

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-normal",
        compact
          ? "h-[18px] rounded-lg px-2 text-[10px] leading-[14px]"
          : "h-[30px] min-w-[90px] rounded-full border px-3 text-[15px] font-medium leading-[18px]",
        status === "active" &&
          (compact
            ? "bg-[#D1FADF] text-[#027A48]"
            : "border-[#027A48] bg-[#D1FADF] text-[#027A48]"),
        status === "inactive" &&
          (compact
            ? "bg-gray-100 text-neutral-400"
            : "border-neutral-300 bg-gray-100 text-neutral-400"),
        status === "draft" &&
          (compact
            ? "bg-brand-25 text-brand-700"
            : "border-brand-700/30 bg-brand-25 text-brand-700"),
      )}
    >
      {t(status)}
    </span>
  );
}

function MetricChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex h-[30px] min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[6px] bg-brand-25 px-1.5 text-[10px] leading-[14px] text-brand-700 sm:min-w-[110px] sm:flex-none sm:gap-1.5 sm:text-sm sm:leading-[18px]">
      <span className="shrink-0 text-brand-700">{icon}</span>
      {children}
    </span>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-[30px] items-center justify-center gap-1 rounded-[6px] border border-brand-700 bg-[#FCFCFD] px-2 text-[10px] leading-[14px] text-brand-700 transition-colors hover:bg-brand-25 sm:px-2 sm:text-sm sm:leading-[18px]"
    >
      <span className="shrink-0 text-brand-800">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
