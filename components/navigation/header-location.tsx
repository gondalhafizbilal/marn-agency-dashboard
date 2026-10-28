"use client";

import { useEffect, useId, useState } from "react";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  DEFAULT_AGENCY_LOCATION,
  LocationMapsProvider,
  LocationPickerMap,
  LocationSearchField,
  type AgencyLocation,
} from "@/features/location";
import { cn } from "@/lib/utils";

type HeaderLocationProps = {
  /** Displayed city/region in the header control. */
  value?: string;
  className?: string;
  /** Called when the user confirms a new pin (wire to agency profile later). */
  onLocationSave?: (location: AgencyLocation) => void;
};

/**
 * Dashboard header location control + Figma location modal (map + search + details).
 */
export function HeaderLocation({
  value: valueProp,
  className,
  onLocationSave,
}: HeaderLocationProps) {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<AgencyLocation>(() =>
    valueProp
      ? { ...DEFAULT_AGENCY_LOCATION, cityLabel: valueProp }
      : DEFAULT_AGENCY_LOCATION,
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          // Mobile: icon-only pin (~40px hit target). sm+: pin + city. lg+: label row.
          "inline-flex size-10 shrink-0 items-center justify-center transition-opacity hover:opacity-90",
          "sm:h-12 sm:w-auto sm:max-w-[9rem] sm:flex-col sm:items-start sm:justify-center sm:text-start",
          "lg:h-[52px] lg:w-[156px] lg:max-w-none",
          className,
        )}
        aria-label={t("locationAria", { location: saved.cityLabel })}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="hidden h-5 items-center gap-[5px] lg:flex">
          <span className="text-sm font-normal leading-[18px] text-neutral-400">
            {t("location")}
          </span>
          <ChevronDownIcon className="size-5 shrink-0 text-auth-panel" />
        </span>

        <span className="flex h-8 min-w-0 items-center gap-1">
          <LocationPinIcon className="size-5 shrink-0 text-auth-panel sm:size-6 lg:size-8" />
          <span className="hidden min-w-0 truncate text-sm font-semibold leading-5 text-auth-panel sm:inline-block sm:text-base lg:text-lg lg:leading-[23px]">
            {saved.cityLabel}
          </span>
        </span>
      </button>

      {open ? (
        <LocationModal
          initial={saved}
          onClose={() => setOpen(false)}
          onUpdate={(next) => {
            setSaved(next);
            onLocationSave?.(next);
            setOpen(false);
          }}
        />
      ) : null}
    </>
  );
}

type LocationModalProps = {
  initial: AgencyLocation;
  onUpdate: (location: AgencyLocation) => void;
  onClose: () => void;
};

/**
 * Figma location modal:
 * map fills rounded 24px panel; search + close on top; orange pin;
 * location details card + maroon "Update location" CTA at bottom.
 */
function LocationModal({ initial, onUpdate, onClose }: LocationModalProps) {
  const t = useTranslations("locationModal");
  const titleId = useId();
  const [draft, setDraft] = useState<AgencyLocation>(initial);
  const [flyTo, setFlyTo] = useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  function handleSearchSelect(location: AgencyLocation) {
    setDraft(location);
    setFlyTo({ lat: location.lat, lng: location.lng });
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label={t("close")}
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "absolute z-10 overflow-hidden rounded-3xl bg-white shadow-[0_24px_48px_-12px_rgba(80,5,22,0.35)]",
          "inset-3 sm:inset-6",
          "md:inset-auto md:bottom-[13.23%] md:left-[32.71%] md:right-[15.21%] md:top-[23.28%]",
        )}
      >
        <h2 id={titleId} className="sr-only">
          {t("title")}
        </h2>

        <LocationMapsProvider>
          <div className="absolute inset-0">
            <LocationPickerMap
              value={draft}
              onChange={setDraft}
              flyTo={flyTo}
              onFlyToHandled={() => setFlyTo(null)}
            />
          </div>

          {/*
            Overlay must not capture map gestures: pointer-events-none on the
            shell, pointer-events-auto only on interactive chrome.
            Pin stays fixed at center; pan the map underneath to choose a spot.
          */}
          <div className="pointer-events-none relative z-10 flex h-full min-h-[420px] flex-col p-4 sm:p-5 md:p-6">
            <div className="pointer-events-auto flex items-start gap-3">
              <LocationSearchField onSelect={handleSearchSelect} />

              <button
                type="button"
                onClick={onClose}
                aria-label={t("close")}
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-brand-700 bg-white text-brand-700 transition-colors hover:bg-brand-25"
              >
                <XIcon className="size-5" strokeWidth={2.25} />
              </button>
            </div>

            <div className="flex-1" aria-hidden />

            <div className="pointer-events-auto flex flex-col gap-4">
              <div className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_-4px_rgba(31,42,55,0.16)] sm:p-5">
                <p className="text-base font-semibold text-neutral-800">
                  {t("detailsTitle")}
                </p>
                <div className="mt-3 flex items-start gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-25">
                    <LocationPinIcon className="size-5 text-brand-700" />
                  </span>
                  <p className="pt-1 text-sm leading-5 text-neutral-400">
                    {draft.formattedAddress}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onUpdate(draft)}
                className="h-12 w-full rounded-xl bg-brand-700 text-base font-medium text-white transition-colors hover:bg-brand-800"
              >
                {t("updateLocation")}
              </button>
            </div>
          </div>
        </LocationMapsProvider>
      </div>
    </div>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M4.167 7.083 10 12.917l5.833-5.834"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationPinIcon({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 4.667c-4.418 0-8 3.432-8 7.666 0 5.417 6.222 12.528 7.333 13.722a.889.889 0 0 0 1.334 0C17.778 24.861 24 17.75 24 12.333c0-4.234-3.582-7.666-8-7.666Zm0 10.666a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        fill="currentColor"
      />
    </svg>
  );
}
