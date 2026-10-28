"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { TickSquareBoldIcon } from "@/components/icons/tick-square-bold-icon";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { RequestCard } from "@/features/requests/components/request-card";
import { useRouter } from "@/i18n/navigation";
import type { RequestCardData } from "@/features/requests/types";
import { cn } from "@/lib/utils";
import { AgencyPortalRepository } from "@/services";

type RequestDetailPageSectionProps = {
  requestId: string;
  className?: string;
};

/**
 * Full request detail page — back link + expanded card in white shell.
 */
export function RequestDetailPageSection({
  requestId,
  className,
}: RequestDetailPageSectionProps) {
  const t = useTranslations("requests.detail");
  const tSuccess = useTranslations("requests.completedSuccess");
  const router = useRouter();
  const [request, setRequest] = useState<RequestCardData | null>(null);
  const [completedRequest, setCompletedRequest] =
    useState<RequestCardData | null>(null);

  useEffect(() => {
    void AgencyPortalRepository.request(requestId, "en")
      .then((item) => setRequest(toRequestCardData(item)))
      .catch(() => setRequest(null));
  }, [requestId]);

  function handleMarkCompleted(next: RequestCardData) {
    setRequest((prev) => (prev ? { ...prev, status: "completed" } : prev));
    setCompletedRequest(next);
  }

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[980px] flex-col gap-4",
        className,
      )}
    >
      <div className="flex w-full justify-start">
        <button
          type="button"
          onClick={() => router.push("/requests")}
          className="text-sm font-medium text-brand-700 underline underline-offset-2 transition-opacity hover:opacity-80"
        >
          {t("back")}
        </button>
      </div>

      <section className="flex w-full flex-col rounded-[25px] bg-white px-[30px] py-6">
        <h1 className="mb-6 text-lg font-semibold leading-[27px] text-neutral-800">
          {t("title")}
        </h1>

        {request ? (
          <RequestCard request={request} variant="detail" onMarkCompleted={handleMarkCompleted} />
        ) : (
          <p className="py-8 text-sm text-neutral-400">Unable to load this request.</p>
        )}
      </section>

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
  const categoryKey = ["housemaid", "nanny", "driver", "cook", "caretaker"].includes(category.toLowerCase())
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
