"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { DeleteBoldIcon } from "@/components/icons/delete-bold-icon";
import { TickSquareBoldIcon } from "@/components/icons/tick-square-bold-icon";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ShareDialog } from "@/components/ui/share-dialog";
import { AdsStatsRow } from "@/features/dashboard/components/ads-stats-row";
import { AdCard, type AdCardData } from "@/features/dashboard/components/ad-card";
import {
  AdDetailsPanel,
  DEFAULT_AD_DETAILS,
} from "@/features/dashboard/components/ad-details-panel";
import {
  AdsFilterTabs,
  type AdsFilterTab,
} from "@/features/dashboard/components/ads-filter-tabs";
import { AdsPagination } from "@/features/dashboard/components/ads-pagination";
import { AdEditForm } from "@/features/ads/components/ad-edit-form";
import { AgencyPortalRepository, isAppApiError } from "@/services";
import { useAuthStore } from "@/store";

const PAGE_SIZE = 4;

type ConfirmAction = "delete" | "status";

/**
 * Filter tabs + ad cards list + pagination for the dashboard home.
 * Uses shared ConfirmDialog for destructive / status actions.
 */
export function DashboardAdsSection() {
  const t = useTranslations("dashboard.adCard");
  const tDetails = useTranslations("dashboard.adDetails");
  const [tab, setTab] = useState<AdsFilterTab>("all");
  const [page, setPage] = useState(1);
  const [adsList, setAdsList] = useState<AdCardData[]>([]);
  const [viewingAd, setViewingAd] = useState<AdCardData | null>(null);
  const [editingAd, setEditingAd] = useState<AdCardData | null>(null);
  const [pending, setPending] = useState<{
    action: ConfirmAction;
    ad: AdCardData;
  } | null>(null);
  const [shareAd, setShareAd] = useState<AdCardData | null>(null);
  const [stats, setStats] = useState<Partial<Record<"totalAds" | "active" | "inactive" | "drafts", number>>>({});
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) return;
    const listings = user.role === "workforce_agency"
      ? AgencyPortalRepository.workers()
      : AgencyPortalRepository.myServices(user.agencyId ?? user.id);
    void Promise.all([AgencyPortalRepository.stats(), listings])
      .then(([value, response]) => {
        setStats({
          totalAds: Number(value.total_ads ?? value.totalAds ?? value.total ?? 0),
          active: Number(value.active_ads ?? value.active ?? 0),
          inactive: Number(value.inactive_ads ?? value.inactive ?? 0),
          drafts: Number(value.draft_ads ?? value.drafts ?? 0),
        });
        setAdsList(response.data.map(toAdCardData));
      })
      .catch(() => undefined);
  }, [user]);

  const isDetailMode = viewingAd !== null || editingAd !== null;

  const filtered = useMemo(() => {
    if (tab === "all") return adsList;
    if (tab === "active") return adsList.filter((ad) => ad.status === "active");
    return adsList.filter((ad) => ad.status === "inactive");
  }, [tab, adsList]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const ads = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  function handleTabChange(next: AdsFilterTab) {
    setTab(next);
    setPage(1);
  }

  async function handleConfirm() {
    if (!pending) return;

    const current = pending;
    try {
      if (current.action === "delete") {
        if (user?.role === "workforce_agency") {
          await AgencyPortalRepository.deleteWorker(current.ad.id);
        } else {
          await AgencyPortalRepository.deleteService(current.ad.id);
        }
      } else if (user?.role === "workforce_agency") {
        await AgencyPortalRepository.archiveWorker(current.ad.id, current.ad.status === "active");
      } else {
        await AgencyPortalRepository.archiveService(current.ad.id, current.ad.status === "active");
      }
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to update listing.");
      return;
    }

    if (current.action === "delete") {
      setAdsList((prev) => prev.filter((item) => item.id !== current.ad.id));
      if (viewingAd?.id === current.ad.id) setViewingAd(null);
      if (editingAd?.id === current.ad.id) setEditingAd(null);
    }

    if (current.action === "status") {
      setAdsList((prev) =>
        prev.map((item) =>
          item.id === current.ad.id
            ? {
                ...item,
                status: item.status === "active" ? "inactive" : "active",
              }
            : item,
        ),
      );
      setViewingAd((viewing) =>
        viewing?.id === current.ad.id
          ? {
              ...viewing,
              status: viewing.status === "active" ? "inactive" : "active",
            }
          : viewing,
      );
    }

    setPending(null);
  }

  const confirmConfig =
    pending?.action === "delete"
      ? {
          title: t("confirm.deleteTitle"),
          description: t("confirm.deleteDescription"),
          confirmLabel: t("confirm.deleteConfirm"),
          icon: <DeleteBoldIcon size={83} />,
        }
      : pending?.action === "status"
        ? {
            title: t("confirm.statusTitle"),
            description: undefined,
            confirmLabel:
              pending.ad.status === "active"
                ? t("confirm.markInactive")
                : t("confirm.markActive"),
            icon: <TickSquareBoldIcon size={83} />,
          }
        : null;

  return (
    <div className="mx-auto flex w-full max-w-[980px] flex-col items-center gap-6 sm:gap-10">
      {!isDetailMode ? <AdsStatsRow stats={stats} /> : null}

      <div className="flex w-full flex-col items-center gap-4 sm:gap-6">
      {editingAd ? (
        <AdEditForm
          ad={editingAd}
          onCancel={() => setEditingAd(null)}
          onNext={(updated) => setEditingAd(updated)}
          onSave={(saved) => {
            setAdsList((prev) =>
              prev.map((item) => (item.id === saved.id ? saved : item)),
            );
            setEditingAd(null);
          }}
        />
      ) : !viewingAd ? (
        <AdsFilterTabs value={tab} onChange={handleTabChange} className="w-full max-w-none" />
      ) : (
        <div className="flex w-full justify-start">
          <button
            type="button"
            onClick={() => setViewingAd(null)}
            className="text-sm font-medium text-brand-700 underline underline-offset-2 transition-opacity hover:opacity-80"
          >
            {tDetails("back")}
          </button>
        </div>
      )}

      {editingAd ? null : viewingAd ? (
        <div className="flex w-full flex-col items-center gap-4 sm:gap-6">
          <AdCard
            ad={viewingAd}
            hideViewAction
            expanded
            className="max-w-none"
            onDelete={(item) => setPending({ action: "delete", ad: item })}
            onUpdateStatus={(item) =>
              setPending({ action: "status", ad: item })
            }
            onShare={(item) => setShareAd(item)}
            onEdit={(item) => {
              setViewingAd(null);
              setEditingAd(item);
            }}
          />
          <AdDetailsPanel details={DEFAULT_AD_DETAILS} />
        </div>
      ) : (
        <>
          <section className="flex w-full min-h-0 flex-col items-center gap-3 rounded-2xl bg-white p-3 sm:min-h-[594px] sm:gap-4 sm:rounded-[25px] sm:p-6">
            {ads.length === 0 ? (
              <p className="py-8 text-sm text-neutral-400">{t("empty")}</p>
            ) : (
              ads.map((ad) => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  onDelete={(item) => setPending({ action: "delete", ad: item })}
                  onUpdateStatus={(item) =>
                    setPending({ action: "status", ad: item })
                  }
                  onShare={(item) => setShareAd(item)}
                  onView={(item) => setViewingAd(item)}
                  onEdit={(item) => setEditingAd(item)}
                />
              ))
            )}
          </section>

          {filtered.length > 0 ? (
            <div className="flex w-full justify-center sm:justify-end">
              <AdsPagination
                page={Math.min(page, totalPages)}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          ) : null}
        </>
      )}

      {confirmConfig ? (
        <ConfirmDialog
          open={pending !== null}
          onClose={() => setPending(null)}
          onConfirm={handleConfirm}
          title={confirmConfig.title}
          description={confirmConfig.description}
          confirmLabel={confirmConfig.confirmLabel}
          icon={confirmConfig.icon}
        />
      ) : null}

      <ShareDialog
        open={shareAd !== null}
        onClose={() => setShareAd(null)}
        shareText={
          shareAd
            ? `${shareAd.name} — ${shareAd.role} · ${shareAd.salary}`
            : undefined
        }
      />
      </div>
    </div>
  );
}

function toAdCardData(item: Record<string, unknown>): AdCardData {
  const createdAt = String(item.createdAt ?? item.created_at ?? new Date().toISOString());
  const price = item.price ?? item.monthly_salary ?? item.salary ?? "";
  return {
    id: String(item.uuid ?? item.id),
    name: String(item.name ?? item.title ?? "Untitled"),
    location: [item.city, item.country].filter(Boolean).join(", "),
    role: String(item.category_name ?? item.category ?? item.service_type ?? ""),
    salary: price ? `QAR${String(price)}` : "—",
    dateCreated: new Date(createdAt).toLocaleDateString(),
    validDays: Number(item.days_remaining ?? item.valid_days ?? 0),
    status: item.status === "active" ? "active" : item.status === "draft" ? "draft" : "inactive",
    views: Number(item.views ?? 0),
    clicks: Number(item.clicks ?? 0),
  };
}
