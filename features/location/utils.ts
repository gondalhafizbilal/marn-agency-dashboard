import type { AgencyLocation } from "./types";

/** Build a short header label (e.g. "Doha, Qatar") from a full address. */
export function summarizeLocationLabel(fullAddress: string): string {
  const parts = fullAddress
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`;
  }

  return fullAddress;
}

/** Prefer locality / administrative_area for the header chip. */
export function cityLabelFromAddressComponents(
  components: google.maps.GeocoderAddressComponent[] | undefined,
  fallbackAddress: string,
): string {
  if (!components?.length) return summarizeLocationLabel(fallbackAddress);

  const locality =
    components.find((c) => c.types.includes("locality"))?.long_name ??
    components.find((c) => c.types.includes("administrative_area_level_2"))
      ?.long_name ??
    components.find((c) => c.types.includes("administrative_area_level_1"))
      ?.long_name;

  const country = components.find((c) => c.types.includes("country"))?.long_name;

  if (locality && country) return `${locality}, ${country}`;
  if (locality) return locality;
  return summarizeLocationLabel(fallbackAddress);
}

export function locationFromGeocoderResult(
  result: google.maps.GeocoderResult,
  coords: google.maps.LatLngLiteral,
): AgencyLocation {
  const formattedAddress = result.formatted_address;
  return {
    lat: coords.lat,
    lng: coords.lng,
    formattedAddress,
    cityLabel: cityLabelFromAddressComponents(
      result.address_components,
      formattedAddress,
    ),
  };
}
