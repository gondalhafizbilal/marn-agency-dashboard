"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

type StatItem = {
  key: "totalAds" | "active" | "inactive" | "drafts";
  value: number;
  icon: "category" | "shieldDone" | "shieldFail" | "paper";
};

/** Mock counts until dashboard API is wired. */
const STATS: StatItem[] = [
  { key: "totalAds", value: 300, icon: "category" },
  { key: "active", value: 268, icon: "shieldDone" },
  { key: "inactive", value: 132, icon: "shieldFail" },
  { key: "drafts", value: 25, icon: "paper" },
];

type AdsStatsRowProps = {
  className?: string;
  stats?: Partial<Record<StatItem["key"], number>>;
};

/**
 * Dashboard ads summary cards (Figma Group 301):
 * 2×2 on mobile/tablet, 4 across on desktop. Compact icons so labels stay visible.
 */
export function AdsStatsRow({ className, stats }: AdsStatsRowProps) {
  const t = useTranslations("dashboard.adsStats");

  return (
    <div
      className={cn(
        "mx-auto grid w-full max-w-[980px] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5",
        className,
      )}
      role="list"
      aria-label={t("ariaLabel")}
    >
      {STATS.map((stat) => (
        <article
          key={stat.key}
          role="listitem"
          className="relative flex min-h-[88px] w-full min-w-0 items-center gap-2 overflow-visible rounded-2xl bg-white px-3 py-3 sm:min-h-[100px] sm:gap-3 sm:rounded-[25px] sm:px-4 md:min-h-[120px] md:gap-4 md:px-5"
        >
          <div className="relative flex size-11 shrink-0 items-center justify-center sm:size-14 md:size-[74px]">
            <StatBlob variant={stat.icon} />
            <StatIcon variant={stat.icon} />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1 sm:gap-1.5 md:gap-2">
            <p className="text-xs font-normal leading-4 text-[#ACACAC] sm:text-sm sm:leading-[18px] md:text-base md:leading-[19px]">
              {t(stat.key)}
            </p>
            <p
              className={cn(
                "font-semibold text-[#232323]",
                stat.key === "drafts"
                  ? "text-sm leading-5 sm:text-base md:text-lg md:leading-[22px]"
                  : "text-base leading-5 sm:text-lg sm:leading-6 md:text-xl",
              )}
            >
              {stats?.[stat.key] ?? stat.value}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export type StatIconVariant = StatItem["icon"];

export function StatBlob({ variant }: { variant: StatIconVariant }) {
  if (variant === "category") {
    return (
      <svg
        width="74"
        height="66"
        viewBox="0 0 74 66"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M37.3006 0.00303927C43.421 -0.131309 48.7764 4.2122 53.3232 8.30286C57.36 11.9347 58.4425 17.5957 61.6897 21.9452C65.4788 27.0206 74.1168 29.6689 73.9988 35.9969C73.8801 42.3671 64.7393 44.4663 61.1713 49.7499C57.9449 54.5278 59.349 62.593 54.2342 65.2656C49.0653 67.9666 43.1338 62.3577 37.3006 62.2233C31.6578 62.0933 26.2155 66.125 20.8125 64.4956C15.1231 62.7798 10.9174 58.0082 7.42068 53.2121C3.6768 48.077 0.349948 42.3395 0.0348596 35.9969C-0.28608 29.5365 1.61063 22.818 5.65984 17.7672C9.53068 12.9388 16.2796 12.0294 21.6799 8.99746C27.01 6.00499 31.1864 0.137253 37.3006 0.00303927Z"
          fill="#F0E9DF"
        />
      </svg>
    );
  }

  if (variant === "shieldDone") {
    return (
      <svg
        width="63"
        height="68"
        viewBox="0 0 63 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M29.396 3.16101C33.0977 3.95348 37.1505 3.60068 40.3842 5.62633C43.576 7.62566 44.2937 12.4298 47.458 14.4752C51.4392 17.0486 57.5995 15.2332 60.7775 18.8082C63.6671 22.0588 62.9571 27.3575 62.8347 31.7726C62.7175 35.9965 60.8422 39.8625 60.0785 44.0136C59.2544 48.4929 60.197 53.4046 58.1156 57.4235C56.0147 61.4803 52.6011 65.3048 48.3506 66.6594C43.9585 68.059 39.3831 64.6283 34.7928 64.856C30.8584 65.0512 27.32 68.656 23.4504 67.8945C19.5792 67.1328 16.9282 63.4552 13.9717 60.759C11.289 58.3125 9.06031 55.5021 6.75738 52.6713C4.36944 49.736 0.453557 47.4374 0.0329885 43.6251C-0.408317 39.6248 3.70934 36.5287 4.54268 32.5959C5.26686 29.1783 3.78363 25.5905 4.5752 22.1889C5.42353 18.5435 7.50572 15.4224 9.29753 12.1634C11.5191 8.12265 12.3705 2.35814 16.4932 0.511544C20.5518 -1.30635 25.0653 2.23385 29.396 3.16101Z"
          fill="#F0E9DF"
        />
      </svg>
    );
  }

  if (variant === "shieldFail") {
    return (
      <svg
        width="60"
        height="70"
        viewBox="0 0 60 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M55.3842 38.5664C57.5574 46.3255 62.5154 55.087 58.4439 61.9887C54.4075 68.8308 44.6976 68.7929 36.9805 69.763C30.5309 70.5738 24.2975 69.214 18.1478 67.0544C12.0889 64.9268 5.30489 63.029 1.90273 57.4452C-1.43275 51.9708 0.589234 45.0257 0.790398 38.5664C0.983643 32.3613 -0.494117 25.5682 3.05184 20.5473C6.59734 15.527 13.6982 15.7342 19.0007 12.7814C26.0527 8.85442 31.6155 -2.33251 39.1686 0.435145C46.8025 3.23238 44.3461 15.6165 47.5964 23.2596C49.8965 28.6683 53.7952 32.893 55.3842 38.5664Z"
          fill="#F0E9DF"
        />
      </svg>
    );
  }

  return (
    <svg
      width="70"
      height="70"
      viewBox="0 0 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 size-full"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.2947 0.336992C41.5118 -1.00064 45.9546 1.96364 50.0436 3.63729C54.0777 5.28849 57.8707 7.3911 61.2241 10.1314C64.64 12.923 69.2401 15.59 69.9253 19.8846C70.6788 24.6076 65.5004 28.4892 64.9098 33.2342C64.4572 36.8713 66.8795 40.289 66.9299 43.9525C66.9876 48.1408 67.2258 52.5927 65.2276 56.3004C63.2156 60.0336 59.9143 63.7199 55.7209 64.751C51.2512 65.85 46.8244 60.9895 42.3176 61.9336C37.6401 62.9135 35.4973 70.3571 30.7281 69.9866C26.2318 69.6374 24.5984 63.6802 21.6754 60.3301C19.34 57.6535 17.9855 54.1798 15.0997 52.0749C11.0424 49.1156 4.3952 49.7346 1.54666 45.6486C-1.00386 41.9901 0.0638012 36.7037 1.44622 32.4902C2.79861 28.3682 5.95659 25.0024 9.2664 22.1194C12.1903 19.5725 16.2327 18.7913 19.5362 16.7327C22.3491 14.9799 24.9751 13.058 27.3992 10.8199C30.9662 7.52661 32.6235 1.81866 37.2947 0.336992Z"
        fill="#F0E9DF"
      />
    </svg>
  );
}

export function StatIcon({ variant }: { variant: StatIconVariant }) {
  if (variant === "category") {
    return (
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 size-[68%]"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M43.7509 13.9037C43.7509 18.13 40.3234 21.5575 36.0972 21.5575C31.8709 21.5575 28.4453 18.13 28.4453 13.9037C28.4453 9.6775 31.8709 6.25 36.0972 6.25C40.3234 6.25 43.7509 9.6775 43.7509 13.9037Z"
          stroke="#67051B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M21.5556 13.9037C21.5556 18.13 18.13 21.5575 13.9019 21.5575C9.6775 21.5575 6.25 18.13 6.25 13.9037C6.25 9.6775 9.6775 6.25 13.9019 6.25C18.13 6.25 21.5556 9.6775 21.5556 13.9037Z"
          stroke="#67051B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M43.7509 35.9623C43.7509 40.1886 40.3234 43.6142 36.0972 43.6142C31.8709 43.6142 28.4453 40.1886 28.4453 35.9623C28.4453 31.7361 31.8709 28.3086 36.0972 28.3086C40.3234 28.3086 43.7509 31.7361 43.7509 35.9623Z"
          stroke="#67051B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M21.5556 35.9623C21.5556 40.1886 18.13 43.6142 13.9019 43.6142C9.6775 43.6142 6.25 40.1886 6.25 35.9623C6.25 31.7361 9.6775 28.3086 13.9019 28.3086C18.13 28.3086 21.5556 31.7361 21.5556 35.9623Z"
          stroke="#67051B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (variant === "shieldDone") {
    return (
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 size-[68%]"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24.9677 45.012C29.8323 45.012 40.951 40.1745 40.951 26.8307C40.951 13.489 41.5302 12.4453 40.2489 11.162C38.9656 9.87863 32.2781 5.73071 24.9677 5.73071C17.6573 5.73071 10.9698 9.87863 9.68852 11.162C8.40518 12.4453 8.98435 13.489 8.98435 26.8307C8.98435 40.1745 20.1052 45.012 24.9677 45.012Z"
          stroke="#67051B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.5542 24.7393L23.4959 28.6873L31.6167 20.5623"
          stroke="#67051B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (variant === "shieldFail") {
    return (
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 size-[68%]"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24.9693 45.012C29.8318 45.012 40.9526 40.1745 40.9526 26.8307C40.9526 13.489 41.5318 12.4453 40.2484 11.162C38.9651 9.87863 32.2797 5.73071 24.9693 5.73071C17.6589 5.73071 10.9714 9.87863 9.68803 11.162C8.40469 12.4453 8.98386 13.489 8.98386 26.8307C8.98386 40.1745 20.1047 45.012 24.9693 45.012Z"
          stroke="#67051B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28.8835 28.8011L21.0522 20.9719"
          stroke="#67051B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.0527 28.8011L28.884 20.9719"
          stroke="#67051B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative z-10 size-[68%]"
      aria-hidden
    >
      <path
        d="M29.8027 32.1872H18.5527"
        stroke="#67051B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25.5424 23.8302H18.5508"
        stroke="#67051B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M41.9998 17.2915L30.1873 6.0415C28.6665 5.83317 26.9582 5.729 25.0832 5.729C11.979 5.729 7.604 10.5623 7.604 24.9998C7.604 39.4582 11.979 44.2707 25.0832 44.2707C38.2082 44.2707 42.5832 39.4582 42.5832 24.9998C42.5832 22.0415 42.3957 19.479 41.9998 17.2915Z"
        stroke="#67051B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29.0298 5.90137V11.4451C29.0298 15.316 32.1673 18.4514 36.0381 18.4514H42.186"
        stroke="#67051B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
