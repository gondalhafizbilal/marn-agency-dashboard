"use client";

import { useTranslations } from "next-intl";

import { TickSquareIcon } from "@/components/icons/tick-square-icon";
import { cn } from "@/lib/utils";
import type { ProfileServiceId } from "@/features/profile/types";

const MAX_MEDIA = 3;

type ProfileAboutCardProps = {
  description: string;
  services: ProfileServiceId[];
  /** Image URLs — only the first 3 are shown. */
  media?: string[];
  className?: string;
};

/**
 * Profile about card (Figma Frame 1000003272):
 * About Agency copy + service ticks + up to 3 media tiles (300×374).
 */
export function ProfileAboutCard({
  description,
  services,
  media = [],
  className,
}: ProfileAboutCardProps) {
  const t = useTranslations("profile.about");
  const visibleMedia = media.slice(0, MAX_MEDIA);

  return (
    <section
      className={cn(
        "flex w-full max-w-[980px] flex-col items-start gap-3 rounded-[25px] bg-white px-[30px] py-6",
        className,
      )}
      aria-labelledby="profile-about-heading"
    >
      <div className="flex w-full flex-col gap-4">
        <h2
          id="profile-about-heading"
          className="text-lg font-semibold leading-[27px] text-neutral-800"
        >
          {t("title")}
        </h2>
        <p className="text-sm font-normal leading-[18px] text-neutral-400">
          {description}
        </p>
      </div>

      <ul className="grid w-full auto-cols-fr grid-flow-col grid-rows-4 gap-x-4 gap-y-1 rounded-lg sm:grid-rows-2">
        {services.map((service) => (
          <li key={service} className="flex items-center gap-1">
            <TickSquareIcon size={24} className="size-6 shrink-0 text-brand-700" />
            <span className="text-sm font-normal leading-[18px] text-[#111927]">
              {t(`services.${service}`)}
            </span>
          </li>
        ))}
      </ul>

      {visibleMedia.length > 0 ? (
        <ul
          className="flex w-full gap-3 overflow-x-auto pb-1 [scrollbar-width:thin]"
          aria-label={t("mediaAria")}
        >
          {visibleMedia.map((src, index) => (
            <li key={`${src}-${index}`} className="shrink-0">
              <div className="relative h-[374px] w-[300px] overflow-hidden rounded-lg border border-neutral-300 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
