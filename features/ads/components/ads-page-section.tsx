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
  AdsPageToolbar,
  type AdsFilterTab,
} from "@/features/dashboard/components/ads-filter-tabs";
import { AdsPagination } from "@/features/dashboard/components/ads-pagination";
import { AdEditForm } from "@/features/ads/components/ad-edit-form";
import {
  AdsFilterDialog,
  DEFAULT_ADS_FILTERS,
  type AdsFilterValues,
} from "@/features/ads/components/ads-filter-dialog";
import { AdsSearchEmpty } from "@/features/ads/components/ads-search-empty";
import { AgencyPortalRepository, isAppApiError } from "@/services";
import { useAuthStore } from "@/store";

const PAGE_SIZE = 6;

/** Temporary id until a new ad is saved into the list. */
const NEW_AD_ID = "__new__";

function createBlankAd(): AdCardData {
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return {
    id: NEW_AD_ID,
    name: "",
    location: "",
    role: "",
    salary: "",
    dateCreated: today,
    validDays: 30,
    status: "draft",
    views: 0,
    clicks: 0,
  };
}

type ConfirmAction = "delete" | "status";

/** Mock ads until listings API is wired — enough for multi-page at 6/page. */
const INITIAL_ADS: AdCardData[] = [
  {
    id: "1",
    name: "Ahmed Al-Marri",
    location: "Doha, Qatar",
    role: "Housemaid",
    salary: "QAR2500/mon",
    dateCreated: "Nov 01, 2026",
    validDays: 30,
    status: "active",
    views: 250,
    clicks: 50,
  },
  {
    id: "2",
    name: "Fatima Hassan",
    location: "Lusail, Qatar",
    role: "Nanny",
    salary: "QAR2800/mon",
    dateCreated: "Oct 18, 2026",
    validDays: 30,
    status: "active",
    views: 180,
    clicks: 32,
  },
  {
    id: "3",
    name: "Omar Khalid",
    location: "Al Wakrah, Qatar",
    role: "Driver",
    salary: "QAR3200/mon",
    dateCreated: "Sep 05, 2026",
    validDays: 15,
    status: "inactive",
    views: 94,
    clicks: 12,
  },
  {
    id: "4",
    name: "Sara Abdullah",
    location: "Al Rayyan, Qatar",
    role: "Cook",
    salary: "QAR2200/mon",
    dateCreated: "Nov 10, 2026",
    validDays: 30,
    status: "draft",
    views: 0,
    clicks: 0,
  },
  {
    id: "5",
    name: "Layla Ibrahim",
    location: "Doha, Qatar",
    role: "Housemaid",
    salary: "QAR2400/mon",
    dateCreated: "Oct 02, 2026",
    validDays: 30,
    status: "active",
    views: 210,
    clicks: 41,
  },
  {
    id: "6",
    name: "Youssef Mansour",
    location: "Al Khor, Qatar",
    role: "Driver",
    salary: "QAR3000/mon",
    dateCreated: "Sep 22, 2026",
    validDays: 20,
    status: "active",
    views: 156,
    clicks: 28,
  },
  {
    id: "7",
    name: "Noor Al-Ali",
    location: "Lusail, Qatar",
    role: "Nanny",
    salary: "QAR2700/mon",
    dateCreated: "Aug 14, 2026",
    validDays: 30,
    status: "inactive",
    views: 88,
    clicks: 9,
  },
  {
    id: "8",
    name: "Hassan Farid",
    location: "Doha, Qatar",
    role: "Cook",
    salary: "QAR2600/mon",
    dateCreated: "Nov 05, 2026",
    validDays: 30,
    status: "active",
    views: 132,
    clicks: 22,
  },
];

/**
 * Ads page list: tabs + search/export/filter toolbar, 6 cards per page.
 */
export function AdsPageSection() {
  const t = useTranslations("dashboard.adCard");
  const tDetails = useTranslations("dashboard.adDetails");
  const [tab, setTab] = useState<AdsFilterTab>("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<AdsFilterValues>(DEFAULT_ADS_FILTERS);
  const [adsList, setAdsList] = useState(INITIAL_ADS);
  const [viewingAd, setViewingAd] = useState<AdCardData | null>(null);
  const [editingAd, setEditingAd] = useState<AdCardData | null>(null);
  const [editMode, setEditMode] = useState<"create" | "edit">("edit");
  const [pending, setPending] = useState<{
    action: ConfirmAction;
    ad: AdCardData;
  } | null>(null);
  const [shareAd, setShareAd] = useState<AdCardData | null>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) return;

    const load =
      user.role === "workforce_agency"
        ? AgencyPortalRepository.workers()
        : AgencyPortalRepository.myServices(user.agencyId ?? user.id);

    void load
      .then((response) => setAdsList(response.data.map(toAdCardData)))
      .catch(() => {
        // Keep the designed fallback list visible if the remote list cannot load.
      });
  }, [user]);

  const isDetailMode = viewingAd !== null || editingAd !== null;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return adsList.filter((ad) => {
      const matchesTab =
        tab === "all" ? true : tab === "active" ? ad.status === "active" : ad.status === "inactive";

      if (!matchesTab) return false;

      if (query) {
        const matchesSearch =
          ad.name.toLowerCase().includes(query) ||
          ad.role.toLowerCase().includes(query) ||
          ad.location.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (filters.category && !ad.role.toLowerCase().includes(filters.category.toLowerCase())) {
        return false;
      }

      if (
        filters.location &&
        !ad.location.toLowerCase().includes(filters.location.replace("-", " "))
      ) {
        return false;
      }

      const salaryAmount = Number.parseInt(ad.salary.replace(/\D/g, ""), 10);
      if (
        Number.isFinite(salaryAmount) &&
        (salaryAmount < filters.priceMin || salaryAmount > filters.priceMax)
      ) {
        return false;
      }

      return true;
    });
  }, [adsList, tab, search, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const ads = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  function handleTabChange(next: AdsFilterTab) {
    setTab(next);
    setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleConfirm() {
    if (!pending) return;

    const current = pending;
    const isWorkforce = user?.role === "workforce_agency";

    if (isWorkforce) {
      const operation = current.action === "delete"
        ? AgencyPortalRepository.deleteWorker(current.ad.id)
        : AgencyPortalRepository.archiveWorker(current.ad.id, current.ad.status === "active");
      void operation.then(() => {
        applyConfirmedAction(current);
        toast.success(current.action === "delete" ? "Worker deleted." : "Worker status updated.");
      }).catch((error) => toast.error(isAppApiError(error) ? error.message : "Unable to update worker."));
      setPending(null);
      return;
    }
    const operation = current.action === "delete"
      ? AgencyPortalRepository.deleteService(current.ad.id)
      : AgencyPortalRepository.archiveService(current.ad.id, current.ad.status === "active");
    void operation.then(() => {
      applyConfirmedAction(current);
      toast.success(current.action === "delete" ? "Service deleted." : "Service status updated.");
    }).catch((error) => toast.error(isAppApiError(error) ? error.message : "Unable to update service."));
    setPending(null);
  }

  function applyConfirmedAction(action: { action: ConfirmAction; ad: AdCardData }) {
    if (action.action === "delete") {
      setAdsList((prev) => prev.filter((item) => item.id !== action.ad.id));
      if (viewingAd?.id === action.ad.id) setViewingAd(null);
      if (editingAd?.id === action.ad.id) setEditingAd(null);
    }

    if (action.action === "status") {
      setAdsList((prev) =>
        prev.map((item) =>
          item.id === action.ad.id
            ? {
                ...item,
                status: item.status === "active" ? "inactive" : "active",
              }
            : item,
        ),
      );
      setViewingAd((current) =>
        current?.id === action.ad.id
          ? {
              ...current,
              status: current.status === "active" ? "inactive" : "active",
            }
          : current,
      );
    }

    setPending(null);
  }

  function runListingAction(ad: AdCardData, action: "submit" | "resubmit" | "pay" | "renew" | "share" | "skills" | "pricing" | "tags") {
    const workforce = user?.role === "workforce_agency";
    const ids = () => (window.prompt(`Enter comma-separated ${action === "tags" ? "tag" : "skill"} UUIDs`) ?? "").split(",").map((value) => value.trim()).filter(Boolean);
    const price = () => ({ price: Number(window.prompt("Price") ?? 0) });
    const operation = workforce
      ? action === "submit" ? AgencyPortalRepository.submitWorker(ad.id)
        : action === "resubmit" ? AgencyPortalRepository.resubmitWorker(ad.id)
          : action === "pay" ? AgencyPortalRepository.payWorker(ad.id)
            : action === "renew" ? AgencyPortalRepository.renewWorker(ad.id)
              : action === "share" ? AgencyPortalRepository.shareWorker(ad.id)
                : action === "skills" ? AgencyPortalRepository.updateWorkerSkills(ad.id, { skill_uuids: ids() })
                  : AgencyPortalRepository.updateWorkerPricing(ad.id, price())
      : action === "submit" ? AgencyPortalRepository.submitService(ad.id)
        : action === "resubmit" ? AgencyPortalRepository.resubmitService(ad.id)
          : action === "pay" ? AgencyPortalRepository.payService(ad.id)
            : action === "renew" ? AgencyPortalRepository.renewService(ad.id)
              : action === "share" ? AgencyPortalRepository.shareService(ad.id)
                : action === "tags" ? AgencyPortalRepository.updateServiceTags(ad.id, { tag_uuids: ids() })
                  : AgencyPortalRepository.updateServicePricing(ad.id, price());
    void operation.then(() => toast.success(`Listing ${action} completed.`)).catch((error) => toast.error(isAppApiError(error) ? error.message : `Unable to ${action} listing.`));
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
              pending.ad.status === "active" ? t("confirm.markInactive") : t("confirm.markActive"),
            icon: <TickSquareBoldIcon size={83} />,
          }
        : null;

  return (
    <div className="mx-auto flex w-full max-w-[980px] flex-col items-center gap-10">
      {!isDetailMode ? <AdsStatsRow /> : null}

      <div className="flex w-full flex-col items-center gap-6">
        {editingAd ? (
          <AdEditForm
            ad={editingAd}
            mode={editMode}
            onCancel={() => {
              setEditingAd(null);
              setEditMode("edit");
            }}
            onNext={(updated) => setEditingAd(updated)}
            onSave={(saved) => {
              const isWorkforce = user?.role === "workforce_agency";
              if (editMode === "create" || saved.id === NEW_AD_ID) {
                if (isWorkforce) {
                  void AgencyPortalRepository.createWorker({ name: saved.name, country: saved.location, category: saved.role })
                    .then((response) => {
                      setAdsList((prev) => [{ ...saved, id: response.worker_id, status: "draft", views: 0, clicks: 0 }, ...prev]);
                      setPage(1);
                      setTab("all");
                      toast.success("Worker draft created.");
                    })
                    .catch((error) => toast.error(isAppApiError(error) ? error.message : "Unable to create worker."));
                } else {
                  void AgencyPortalRepository.createService({ name: saved.name, description: saved.role, country: saved.location, city: saved.location })
                    .then((response) => {
                      setAdsList((prev) => [{ ...saved, id: response.service_id, status: "draft", views: 0, clicks: 0 }, ...prev]);
                      setPage(1);
                      setTab("all");
                      toast.success("Service draft created.");
                    })
                    .catch((error) => toast.error(isAppApiError(error) ? error.message : "Unable to create service."));
                }
              } else {
                if (isWorkforce) {
                  void AgencyPortalRepository.updateWorker(saved.id, { name: saved.name, country: saved.location, category: saved.role })
                    .then(() => {
                      setAdsList((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
                      toast.success("Worker updated.");
                    })
                    .catch((error) => toast.error(isAppApiError(error) ? error.message : "Unable to update worker."));
                } else {
                  void AgencyPortalRepository.updateService(saved.id, { name: saved.name, description: saved.role, country: saved.location, city: saved.location })
                    .then(() => {
                      setAdsList((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
                      toast.success("Service updated.");
                    })
                    .catch((error) => toast.error(isAppApiError(error) ? error.message : "Unable to update service."));
                }
              }
              setEditingAd(null);
              setEditMode("edit");
            }}
          />
        ) : !viewingAd ? (
          <AdsFilterTabs
            value={tab}
            onChange={handleTabChange}
            showViewAll={false}
            className="w-full max-w-none"
            toolbar={
              <AdsPageToolbar
                search={search}
                onSearchChange={handleSearchChange}
                onFilter={() => setFiltersOpen(true)}
                onAdd={() => {
                  setViewingAd(null);
                  setEditMode("create");
                  setEditingAd(createBlankAd());
                }}
              />
            }
          />
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
          <div className="flex w-full flex-col items-center gap-6">
            <AdCard
              ad={viewingAd}
              hideViewAction
              expanded
              className="max-w-none"
              onDelete={(item) => setPending({ action: "delete", ad: item })}
              onUpdateStatus={(item) => setPending({ action: "status", ad: item })}
              onShare={(item) => setShareAd(item)}
              onEdit={(item) => {
                setViewingAd(null);
                setEditMode("edit");
                setEditingAd(item);
              }}
            />
            <div className="flex flex-wrap gap-2 rounded-xl bg-white p-4 text-sm">
              {(["submit", "resubmit", "pay", "renew", "share"] as const).map((action) => <button key={action} type="button" onClick={() => runListingAction(viewingAd, action)} className="rounded border px-3 py-2 capitalize">{action}</button>)}
              <button type="button" onClick={() => runListingAction(viewingAd, user?.role === "workforce_agency" ? "skills" : "tags")} className="rounded border px-3 py-2">{user?.role === "workforce_agency" ? "Skills" : "Tags"}</button>
              <button type="button" onClick={() => runListingAction(viewingAd, "pricing")} className="rounded border px-3 py-2">Pricing</button>
              <label className="cursor-pointer rounded border px-3 py-2">Upload image<input type="file" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; const request = user?.role === "workforce_agency" ? AgencyPortalRepository.uploadWorkerPhoto(viewingAd.id, file) : AgencyPortalRepository.uploadServiceImage(viewingAd.id, file); void request.then(() => toast.success("Image uploaded.")).catch(() => toast.error("Unable to upload image.")); }} /></label>
            </div>
            <AdDetailsPanel details={DEFAULT_AD_DETAILS} />
          </div>
        ) : (
          <>
            <section className="flex w-full min-h-[594px] flex-col items-center gap-4 rounded-[25px] bg-white p-6">
              {ads.length === 0 ? (
                search.trim() ? (
                  <AdsSearchEmpty className="my-auto" />
                ) : (
                  <p className="py-8 text-sm text-neutral-400">{t("empty")}</p>
                )
              ) : (
                ads.map((ad) => (
                  <AdCard
                    key={ad.id}
                    ad={ad}
                    onDelete={(item) => setPending({ action: "delete", ad: item })}
                    onUpdateStatus={(item) => setPending({ action: "status", ad: item })}
                    onShare={(item) => setShareAd(item)}
                    onView={(item) => setViewingAd(item)}
                    onEdit={(item) => {
                      setEditMode("edit");
                      setEditingAd(item);
                    }}
                  />
                ))
              )}
            </section>

            {filtered.length > 0 ? (
              <div className="flex w-full justify-end">
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
          shareText={shareAd ? `${shareAd.name} — ${shareAd.role} · ${shareAd.salary}` : undefined}
        />

        <AdsFilterDialog
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          value={filters}
          onApply={(next) => {
            setFilters(next);
            setPage(1);
          }}
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
