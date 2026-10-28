/** Structured location saved from the header map picker. */
export type AgencyLocation = {
  lat: number;
  lng: number;
  formattedAddress: string;
  cityLabel: string;
};

/** Default pin — West Bay / Corniche, Doha. */
export const DEFAULT_AGENCY_LOCATION: AgencyLocation = {
  lat: 25.3265,
  lng: 51.5308,
  formattedAddress: "West Bay, Corniche Street, Doha, Qatar",
  cityLabel: "Doha, Qatar",
};

/** Qatar bias for Places autocomplete / map default. */
export const QATAR_MAP_BOUNDS = {
  north: 26.2,
  south: 24.4,
  east: 51.7,
  west: 50.7,
} as const;
