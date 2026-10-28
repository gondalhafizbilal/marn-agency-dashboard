"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { SearchIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { env } from "@/config";
import { cn } from "@/lib/utils";

import { QATAR_MAP_BOUNDS, type AgencyLocation } from "../types";
import { cityLabelFromAddressComponents } from "../utils";

type LocationSearchFieldProps = {
  onSelect: (location: AgencyLocation) => void;
  className?: string;
};

type SuggestionItem = {
  id: string;
  label: string;
  prediction: google.maps.places.PlacePrediction;
};

/**
 * Places Autocomplete (New) with session tokens, biased to Qatar.
 * Must sit under LocationMapsProvider when a Maps API key is configured.
 */
export function LocationSearchField({
  onSelect,
  className,
}: LocationSearchFieldProps) {
  const apiKey = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className={cn("min-w-0 flex-1", className)}>
        <SearchInputShell disabled />
      </div>
    );
  }

  return (
    <div className={cn("relative min-w-0 flex-1", className)}>
      <LocationSearchInner onSelect={onSelect} />
    </div>
  );
}

function SearchInputShell({
  disabled,
  value,
  onChange,
  onFocus,
  onBlur,
}: {
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const t = useTranslations("locationModal");

  return (
    <label className="relative block">
      <span className="sr-only">{t("searchPlaceholder")}</span>
      <SearchIcon
        className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-brand-700"
        strokeWidth={2}
      />
      <input
        type="search"
        disabled={disabled}
        value={value}
        onChange={
          onChange ? (event) => onChange(event.target.value) : undefined
        }
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={t("searchPlaceholder")}
        autoComplete="off"
        className="h-12 w-full rounded-xl border border-neutral-300 bg-white pe-4 ps-12 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus-visible:border-brand-700 disabled:opacity-60"
      />
    </label>
  );
}

function LocationSearchInner({
  onSelect,
}: {
  onSelect: (location: AgencyLocation) => void;
}) {
  const t = useTranslations("locationModal");
  const locale = useLocale();
  const placesLib = useMapsLibrary("places");

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [open, setOpen] = useState(false);

  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  const language = locale === "ar" ? "ar" : "en";

  const ensureSessionToken = useCallback(() => {
    if (!placesLib) return null;
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
    }
    return sessionTokenRef.current;
  }, [placesLib]);

  const resetSessionToken = useCallback(() => {
    sessionTokenRef.current = null;
  }, []);

  useEffect(() => {
    if (!placesLib || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const handle = setTimeout(() => {
      void (async () => {
        try {
          const token = ensureSessionToken();
          const { suggestions: next } =
            await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
              input: query.trim(),
              sessionToken: token ?? undefined,
              includedRegionCodes: ["qa"],
              language,
              locationBias: QATAR_MAP_BOUNDS,
            });

          setSuggestions(
            next
              .map((item, index) => {
                const prediction = item.placePrediction;
                if (!prediction) return null;
                const label =
                  prediction.text?.text ??
                  prediction.mainText?.text ??
                  "";
                if (!label) return null;
                return {
                  id: prediction.placeId || `suggestion-${index}`,
                  label,
                  prediction,
                };
              })
              .filter((item): item is SuggestionItem => item !== null),
          );
          setOpen(true);
        } catch {
          setSuggestions([]);
        }
      })();
    }, 250);

    return () => clearTimeout(handle);
  }, [query, placesLib, language, ensureSessionToken]);

  async function selectSuggestion(item: SuggestionItem) {
    try {
      const place = item.prediction.toPlace();
      await place.fetchFields({
        fields: [
          "location",
          "formattedAddress",
          "addressComponents",
          "displayName",
        ],
      });

      const location = place.location;
      if (!location) return;

      const coords = { lat: location.lat(), lng: location.lng() };
      const formattedAddress =
        place.formattedAddress ?? place.displayName ?? item.label;

      const components = place.addressComponents?.map((component) => ({
        long_name: component.longText ?? "",
        short_name: component.shortText ?? "",
        types: [...(component.types ?? [])],
      })) as google.maps.GeocoderAddressComponent[] | undefined;

      onSelect({
        lat: coords.lat,
        lng: coords.lng,
        formattedAddress,
        cityLabel: cityLabelFromAddressComponents(components, formattedAddress),
      });

      setQuery(item.label);
      setSuggestions([]);
      setOpen(false);
      resetSessionToken();
    } catch {
      // Keep typing; user can try another suggestion.
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const first = suggestions[0];
    if (first) void selectSuggestion(first);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <SearchInputShell
          value={query}
          onChange={setQuery}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => {
            setTimeout(() => setOpen(false), 150);
          }}
        />
      </form>

      {open && suggestions.length > 0 ? (
        <ul
          role="listbox"
          className="absolute inset-x-0 top-[calc(100%+6px)] z-30 max-h-56 overflow-y-auto rounded-xl border border-neutral-300 bg-white py-1 shadow-[0_8px_24px_-4px_rgba(31,42,55,0.16)]"
        >
          {suggestions.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                role="option"
                className="flex w-full px-4 py-2.5 text-start text-sm leading-5 text-neutral-800 transition-colors hover:bg-brand-25"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => void selectSuggestion(item)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {open && query.trim().length >= 2 && suggestions.length === 0 ? (
        <p className="absolute inset-x-0 top-[calc(100%+6px)] z-30 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-400 shadow-[0_8px_24px_-4px_rgba(31,42,55,0.16)]">
          {t("noResults")}
        </p>
      ) : null}
    </>
  );
}
