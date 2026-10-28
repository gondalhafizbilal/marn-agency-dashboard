"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { TickSquareBoldIcon } from "@/components/icons/tick-square-bold-icon";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AdsPagination } from "@/features/dashboard/components/ads-pagination";
import { AdsSearchEmpty } from "@/features/ads/components/ads-search-empty";
import { RequestCard } from "@/features/requests/components/request-card";
import {
  DEFAULT_REQUESTS_FILTERS,
  RequestsFilterDialog,
  type RequestsFilterValues,
} from "@/features/requests/components/requests-filter-dialog";
import {
  RequestsFilterTabs,
  type RequestsFilterTab,
} from "@/features/requests/components/requests-filter-tabs";
import { RequestsPageToolbar } from "@/features/requests/components/requests-page-toolbar";
import {
  DEFAULT_REQUESTS_SORT,
  RequestsSortDialog,
  type RequestsSortOption,
} from "@/features/requests/components/requests-sort-dialog";
import { RequestsStatsRow } from "@/features/requests/components/requests-stats-row";
import { MOCK_REQUESTS } from "@/features/requests/mock-data";
import { useRouter } from "@/i18n/navigation";
import { AgencyPortalRepository } from "@/services";
import type { RequestCardData } from "@/features/requests/types";

const PAGE_SIZE = 3;

function sortRequests(items: RequestCardData[], sort: RequestsSortOption): RequestCardData[] {
  const sorted = [...items];

  switch (sort) {
    case "oldest":
      return sorted.sort((a, b) => a.submittedAt - b.submittedAt);
    case "nameAsc":
      return sorted.sort((a, b) => a.customerName.localeCompare(b.customerName));
    case "nameDesc":
      return sorted.sort((a, b) => b.customerName.localeCompare(a.customerName));
    case "newest":
    default:
      return sorted.sort((a, b) => b.submittedAt - a.submittedAt);
  }
}

/**
 * Requests stats + filter tabs + toolbar + cards list + pagination (3 per page).
 */
export function RequestsSection() {
  const t = useTranslations("requests.card");
  const tSuccess = useTranslations("requests.completedSuccess");
  const router = useRouter();
  const [tab, setTab] = useState<RequestsFilterTab>("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<RequestsSortOption>(DEFAULT_REQUESTS_SORT);
  const [filters, setFilters] = useState<RequestsFilterValues>(DEFAULT_REQUESTS_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [completedRequest, setCompletedRequest] = useState<RequestCardData | null>(null);

  useEffect(() => {
    void AgencyPortalRepository.requests({ lang: "en", itemsPerPage: 100 })
      .then((response) => setRequests(response.data.map(toRequestCardData)))
      .catch(() => {
        // Preserve the existing visual fallback when the marketplace is unavailable.
      });
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const matches = requests.filter((item) => {
      const matchesTab = tab === "all" ? true : item.status === tab;

      if (!matchesTab) return false;

      if (query) {
        const matchesSearch =
          item.customerName.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (filters.category && item.categoryKey !== filters.category) {
        return false;
      }

      if (filters.status && item.status !== filters.status) {
        return false;
      }

      return true;
    });

    return sortRequests(matches, sort);
  }, [requests, tab, search, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  function handleTabChange(next: RequestsFilterTab) {
    setTab(next);
    setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleMarkCompleted(request: RequestCardData) {
    setRequests((prev) =>
      prev.map((item) => (item.id === request.id ? { ...item, status: "completed" } : item)),
    );
    setCompletedRequest(request);
  }

  return (
    <div className="mx-auto flex w-full max-w-[980px] flex-col items-center gap-10">
      <RequestsStatsRow />

      <div className="flex w-full flex-col items-center gap-6">
        <RequestsFilterTabs
          value={tab}
          onChange={handleTabChange}
          className="w-full max-w-none"
          toolbar={
            <RequestsPageToolbar
              search={search}
              onSearchChange={handleSearchChange}
              onSort={() => setSortOpen(true)}
              onFilter={() => setFiltersOpen(true)}
            />
          }
        />

        <section className="flex w-full min-h-[864px] flex-col items-center gap-4 rounded-[25px] bg-white p-6">
          {pageItems.length === 0 ? (
            search.trim() ? (
              <AdsSearchEmpty className="my-auto" />
            ) : (
              <p className="py-8 text-sm text-neutral-400">{t("empty")}</p>
            )
          ) : (
            pageItems.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onClick={() => router.push(`/requests/${request.id}`)}
                onMarkCompleted={handleMarkCompleted}
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
      </div>

      <RequestsFilterDialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={filters}
        onApply={(next) => {
          setFilters(next);
          setPage(1);
        }}
      />

      <RequestsSortDialog
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        value={sort}
        onApply={(next) => {
          setSort(next);
          setPage(1);
        }}
      />

      <ConfirmDialog
        open={completedRequest !== null}
        onClose={() => setCompletedRequest(null)}
        onConfirm={() => setCompletedRequest(null)}
        title={tSuccess("title")}
        description={
          completedRequest
            ? tSuccess("description", {
                customerName: completedRequest.customerName,
              })
            : undefined
        }
        confirmLabel={tSuccess("exploreMore")}
        hideCancel
        icon={<TickSquareBoldIcon size={83} />}
      />
    </div>
  );
}

function toRequestCardData(item: Record<string, unknown>): RequestCardData {
  const category = String(item.category_name ?? item.category ?? "Request");
  const createdAt = String(item.createdAt ?? item.created_at ?? new Date().toISOString());
  const submittedAt = Date.parse(createdAt);
  const categoryKey = ["housemaid", "nanny", "driver", "cook", "caretaker"].includes(
    category.toLowerCase(),
  )
    ? (category.toLowerCase() as RequestCardData["categoryKey"])
    : "housemaid";

  return {
    id: String(item.uuid ?? item.id),
    customerName: String(item.customer_name ?? item.customerName ?? "Customer"),
    category,
    categoryKey,
    dateSubmitted: new Date(createdAt).toLocaleDateString(),
    submittedAt: Number.isNaN(submittedAt) ? Date.now() : submittedAt,
    status: item.status === "completed" ? "completed" : "pending",
    description: String(item.description ?? item.descriptionEn ?? item.description_en ?? ""),
    contacts: {
      phone: typeof item.contactPhone === "string" ? item.contactPhone : undefined,
      whatsapp: typeof item.whatsappNumber === "string" ? item.whatsappNumber : undefined,
    },
  };
}
