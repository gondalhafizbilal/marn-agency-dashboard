"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import type { ProfileReview } from "@/features/profile/types";

type ProfileReviewsCardProps = {
  totalCount: number;
  reviews: ProfileReview[];
  className?: string;
  onSeeAll?: () => void;
};

/**
 * Profile reviews card (Figma Frame 1000003273):
 * 980×234 white card — title + See all, horizontal review cards.
 */
export function ProfileReviewsCard({
  totalCount,
  reviews,
  className,
  onSeeAll,
}: ProfileReviewsCardProps) {
  const t = useTranslations("profile.reviews");

  return (
    <section
      className={cn(
        "flex w-full max-w-[980px] flex-col items-start gap-4 rounded-[25px] bg-white px-[30px] py-6",
        className,
      )}
      aria-labelledby="profile-reviews-heading"
    >
      <div className="flex w-full items-center justify-between gap-4">
        <h2
          id="profile-reviews-heading"
          className="text-lg font-semibold leading-[27px] text-neutral-800"
        >
          {t("title", { count: totalCount })}
        </h2>
        <button
          type="button"
          onClick={onSeeAll}
          className="shrink-0 text-base font-normal leading-5 text-brand-700 underline transition-opacity hover:opacity-80"
        >
          {t("seeAll")}
        </button>
      </div>

      <ul className="-mx-1 flex w-[calc(100%+0.5rem)] gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
        {reviews.map((review) => (
          <li key={review.id} className="shrink-0">
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ReviewCard({ review }: { review: ProfileReview }) {
  return (
    <article className="flex h-[140px] w-[300px] items-start gap-3 rounded-lg border border-neutral-300 bg-white p-6">
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
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-base font-semibold leading-6 text-neutral-800">
            {review.name}
          </h3>
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
