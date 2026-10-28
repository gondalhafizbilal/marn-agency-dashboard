export type PackageFeatureId = "adsInCategory" | "validDays";

export type PackageCardData = {
  id: string;
  /** Display name — e.g. VVVVIP, VVIP, VIP */
  name: string;
  features: PackageFeatureId[];
  /** Starting price amount in QAR */
  priceQar: number;
  /** Duration in days shown in the price line */
  durationDays: number;
};

export type PackagePaymentCard = {
  name: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

export type PackagePriceBreakdown = {
  periodLabel: string;
  monthlyPaymentQar: number;
  taxQar: number;
  totalQar: number;
};
