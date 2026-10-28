"use client";

import { PackageCard } from "@/features/packages/components/package-card";
import type { PackageCardData } from "@/features/packages/types";
import { cn } from "@/lib/utils";

const SHARED_FEATURES = ["adsInCategory", "validDays"] as const;

/** Mock packages until packages API is wired. */
export const MOCK_PACKAGES: PackageCardData[] = [
  {
    id: "vvvvip",
    name: "VVVVIP",
    features: [...SHARED_FEATURES],
    priceQar: 2500,
    durationDays: 10,
  },
  {
    id: "vvip-1",
    name: "VVIP",
    features: [...SHARED_FEATURES],
    priceQar: 2500,
    durationDays: 10,
  },
  {
    id: "vvip-2",
    name: "VVIP",
    features: [...SHARED_FEATURES],
    priceQar: 2500,
    durationDays: 10,
  },
  {
    id: "vip",
    name: "VIP",
    features: [...SHARED_FEATURES],
    priceQar: 2500,
    durationDays: 10,
  },
];

type PackagesGridProps = {
  packages?: PackageCardData[];
  className?: string;
  onBuy?: (packageId: string) => void;
};

/**
 * Popular packages grid (Figma Popular):
 * 1 column on mobile, 2×2 from md (cards need width for price + CTA).
 */
export function PackagesGrid({
  packages = MOCK_PACKAGES,
  className,
  onBuy,
}: PackagesGridProps) {
  return (
    <div
      className={cn(
        "grid w-full max-w-[980px] grid-cols-1 gap-3 sm:gap-x-6 sm:gap-y-4 md:grid-cols-2",
        className,
      )}
    >
      {packages.map((pkg) => (
        <PackageCard key={pkg.id} package={pkg} onBuy={onBuy} />
      ))}
    </div>
  );
}
