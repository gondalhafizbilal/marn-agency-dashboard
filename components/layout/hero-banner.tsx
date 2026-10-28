"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

const DEFAULT_IMAGE_SRC = "/images/dashboard/Group 323.png";

type HeroBannerProps = {
  className?: string;
  /** Override image path; defaults to the shared promotional hero asset. */
  src?: string;
};

/**
 * Shared promotional hero banner (Figma 980×276, radius 25px).
 * Aspect-ratio fluid on mobile/tablet; used on Dashboard, Packages, etc.
 */
export function HeroBanner({
  className,
  src = DEFAULT_IMAGE_SRC,
}: HeroBannerProps) {
  const t = useTranslations("common.heroBanner");

  return (
    <section
      className={cn(
        "relative mx-auto aspect-[980/276] w-full max-w-[980px] overflow-hidden rounded-2xl sm:rounded-[25px]",
        className,
      )}
      aria-label={t("ariaLabel")}
    >
      <Image
        src={src}
        alt={t("ariaLabel")}
        fill
        priority
        className="object-cover object-center"
        sizes="(max-width: 980px) 100vw, 980px"
      />
    </section>
  );
}
