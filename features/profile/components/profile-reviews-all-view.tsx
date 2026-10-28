"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EllipsisIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { DeleteBoldIcon } from "@/components/icons/delete-bold-icon";
import { TickSquareBoldIcon } from "@/components/icons/tick-square-bold-icon";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AdsPagination } from "@/features/dashboard/components/ads-pagination";
import { cn } from "@/lib/utils";
import type { ProfileReview } from "@/features/profile/types";

const PAGE_SIZE = 12;

type ProfileReviewsAllViewProps = {
  totalCount: number;
  reviews: ProfileReview[];
  onBack: () => void;
  onDeleteReview?: (reviewId: string) => void;
  onReportReview?: (reviewId: string) => void;
  className?: string;
};

/**
 * Full reviews screen (Figma Frame 1000003273 expanded):
 * 980×742 white card — title, 3-col grid (12/page), pagination,
 * Comment Hold Pop-up (Delete / Report Review).
 */
export function ProfileReviewsAllView({
  totalCount,
  reviews,
  onBack,
  onDeleteReview,
  onReportReview,
  className,
}: ProfileReviewsAllViewProps) {
  const t = useTranslations("profile.reviews");
  const [page, setPage] = useState(1);
  const [menuReviewId, setMenuReviewId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ProfileReview | null>(
    null,
  );
  const [reportedReview, setReportedReview] = useState<ProfileReview | null>(
    null,
  );

  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageReviews = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return reviews.slice(start, start + PAGE_SIZE);
  }, [reviews, currentPage]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));
    if (page > maxPage) setPage(maxPage);
  }, [reviews.length, page]);

  function handleDeleteConfirm() {
    if (!pendingDelete) return;
    onDeleteReview?.(pendingDelete.id);
    setPendingDelete(null);
  }

  function handleReportConfirm() {
    if (!reportedReview) return;
    onReportReview?.(reportedReview.id);
    setReportedReview(null);
  }

  return (
    <div className={cn("flex w-full max-w-[980px] flex-col gap-4", className)}>
      <div className="flex w-full justify-start">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-brand-700 underline underline-offset-2 transition-opacity hover:opacity-80"
        >
          {t("back")}
        </button>
      </div>

      <section
        className="flex min-h-[742px] w-full flex-col gap-4 rounded-[25px] bg-white px-[30px] py-6"
        aria-labelledby="profile-reviews-all-heading"
      >
        <h2
          id="profile-reviews-all-heading"
          className="text-lg font-semibold leading-[27px] text-neutral-800"
        >
          {t("title", { count: totalCount })}
        </h2>

        <ul className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pageReviews.map((review) => (
            <li key={review.id}>
              <ReviewListCard
                review={review}
                moreLabel={t("more")}
                deleteLabel={t("menu.delete")}
                reportLabel={t("menu.report")}
                menuOpen={menuReviewId === review.id}
                onToggleMenu={() =>
                  setMenuReviewId((current) =>
                    current === review.id ? null : review.id,
                  )
                }
                onCloseMenu={() => setMenuReviewId(null)}
                onDelete={() => {
                  setMenuReviewId(null);
                  setPendingDelete(review);
                }}
                onReport={onReportReview ? () => {
                  setMenuReviewId(null);
                  setReportedReview(review);
                } : undefined}
              />
            </li>
          ))}
        </ul>
      </section>

      {reviews.length > 0 ? (
        <div className="flex w-full justify-end">
          <AdsPagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : null}

      <ConfirmDialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDeleteConfirm}
        title={t("deleteConfirm.title")}
        description={t("deleteConfirm.description")}
        confirmLabel={t("deleteConfirm.confirm")}
        icon={<DeleteBoldIcon size={64} />}
      />

      <ConfirmDialog
        open={reportedReview !== null}
        onClose={() => setReportedReview(null)}
        onConfirm={handleReportConfirm}
        title={t("reportSuccess.title")}
        description={t("reportSuccess.description")}
        confirmLabel={t("reportSuccess.exploreMore")}
        hideCancel
        icon={<TickSquareBoldIcon size={83} />}
      />
    </div>
  );
}

function ReviewListCard({
  review,
  moreLabel,
  deleteLabel,
  reportLabel,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onDelete,
  onReport,
}: {
  review: ProfileReview;
  moreLabel: string;
  deleteLabel: string;
  reportLabel: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onDelete: () => void;
  onReport?: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        onCloseMenu();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseMenu();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen, onCloseMenu]);

  return (
    <article className="relative flex h-[150px] w-full max-w-[300px] items-start gap-3 rounded-lg border border-neutral-300 bg-white p-6">
      <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-[#C4C4C4]">
        {review.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.avatarUrl}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-xs font-semibold text-brand-800">
            {initials(review.name)}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-col items-start gap-1.5 self-stretch">
          <div className="relative flex w-full items-center justify-between gap-2">
            <h3 className="truncate text-base font-semibold leading-6 text-neutral-800">
              {review.name}
            </h3>
            <div ref={menuRef} className="relative shrink-0">
              <button
                type="button"
                aria-label={moreLabel}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={onToggleMenu}
                className="inline-flex size-6 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-800"
              >
                <EllipsisIcon className="size-5" strokeWidth={1.5} />
              </button>

              {menuOpen ? (
                <div
                  role="menu"
                  className="absolute end-0 top-full z-20 mt-1 flex w-[168px] flex-col items-center justify-center gap-3 rounded-[14px] border-[0.5px] border-brand-700 bg-[#F5F1EC] p-3 shadow-sm"
                >
                  <div className="flex w-[146px] flex-col items-center gap-3">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={onDelete}
                      className="flex w-full items-center justify-center text-xs font-medium leading-[18px] text-brand-700 transition-opacity hover:opacity-80"
                    >
                      {deleteLabel}
                    </button>
                    {onReport ? <>
                      <div aria-hidden className="h-px w-[140px] bg-brand-700/50" />
                      <button type="button" role="menuitem" onClick={onReport} className="flex w-full items-center justify-center text-xs font-medium leading-[18px] text-brand-700 transition-opacity hover:opacity-80">
                        {reportLabel}
                      </button>
                    </> : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <StarRating rating={review.rating} />
        </div>
        <p className="line-clamp-3 text-sm font-normal leading-[18px] text-neutral-400">
          {review.comment}
        </p>
      </div>
    </article>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex shrink-0 items-center" aria-hidden>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = rating >= index + 1;
        const half = !filled && rating >= index + 0.5;
        return (
          <StarIcon
            key={index}
            tone={filled ? "full" : half ? "half" : "empty"}
          />
        );
      })}
    </span>
  );
}

function StarIcon({ tone }: { tone: "full" | "half" | "empty" }) {
  const fill =
    tone === "full" ? "#FDB022" : tone === "half" ? "#FEDF89" : "#FEDF89";

  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6.00065 1.16675L7.34898 4.19675L10.6673 4.56341L8.19232 6.78675L8.88232 10.0667L6.00065 8.41675L3.11898 10.0667L3.80898 6.78675L1.33398 4.56341L4.65232 4.19675L6.00065 1.16675Z"
        fill={fill}
      />
    </svg>
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
