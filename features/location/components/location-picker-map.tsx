"use client";

import { useCallback, useEffect, useRef } from "react";
import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useLocale, useTranslations } from "next-intl";

import { env } from "@/config";
import { cn } from "@/lib/utils";

import type { AgencyLocation } from "../types";
import { locationFromGeocoderResult } from "../utils";

type LocationPickerMapProps = {
  value: AgencyLocation;
  onChange: (location: AgencyLocation) => void;
  /** When set, pan/zoom the map to these coords (e.g. after search select). */
  flyTo?: google.maps.LatLngLiteral | null;
  onFlyToHandled?: () => void;
  className?: string;
};

/**
 * Google Map with fixed center pin. Pan the map to move the pin;
 * reverse-geocodes on idle (debounced). Must sit under LocationMapsProvider.
 */
export function LocationPickerMap({
  value,
  onChange,
  flyTo,
  onFlyToHandled,
  className,
}: LocationPickerMapProps) {
  const t = useTranslations("locationModal");
  const apiKey = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const skipNextIdleRef = useRef(false);

  if (!apiKey) {
    return (
      <div
        className={cn(
          "flex size-full items-center justify-center bg-neutral-100 px-6 text-center",
          className,
        )}
      >
        <p className="max-w-sm text-sm leading-5 text-neutral-400">
          {t("missingApiKey")}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("relative size-full", className)}>
      <Map
        className="absolute inset-0 size-full"
        defaultCenter={{ lat: value.lat, lng: value.lng }}
        defaultZoom={14}
        gestureHandling="greedy"
        disableDefaultUI
        zoomControl
        reuseMaps
      >
        <MapBehaviors
          onChange={onChange}
          flyTo={flyTo}
          onFlyToHandled={onFlyToHandled}
          skipNextIdleRef={skipNextIdleRef}
        />
      </Map>

      <div
        className="pointer-events-none absolute start-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full"
        aria-hidden
      >
        <MapPinMarker />
      </div>
    </div>
  );
}

function MapBehaviors({
  onChange,
  flyTo,
  onFlyToHandled,
  skipNextIdleRef,
}: {
  onChange: (location: AgencyLocation) => void;
  flyTo?: google.maps.LatLngLiteral | null;
  onFlyToHandled?: () => void;
  skipNextIdleRef: React.MutableRefObject<boolean>;
}) {
  const locale = useLocale();
  const map = useMap();
  const geocodingLib = useMapsLibrary("geocoding");

  const geocodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const language = locale === "ar" ? "ar" : "en";

  const reverseGeocode = useCallback(
    async (coords: google.maps.LatLngLiteral) => {
      if (!geocodingLib) return;
      try {
        const geocoder = new geocodingLib.Geocoder();
        const response = await geocoder.geocode({
          location: coords,
          language,
        });
        const result = response.results[0];
        if (!result) return;
        onChangeRef.current(locationFromGeocoderResult(result, coords));
      } catch {
        // Keep previous address if reverse geocode fails.
      }
    },
    [geocodingLib, language],
  );

  const scheduleReverseGeocode = useCallback(
    (coords: google.maps.LatLngLiteral) => {
      if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
      geocodeTimerRef.current = setTimeout(() => {
        void reverseGeocode(coords);
      }, 350);
    },
    [reverseGeocode],
  );

  useEffect(() => {
    return () => {
      if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!map || !flyTo) return;
    skipNextIdleRef.current = true;
    map.panTo(flyTo);
    map.setZoom(16);
    onFlyToHandled?.();
  }, [map, flyTo, onFlyToHandled, skipNextIdleRef]);

  useEffect(() => {
    if (!map) return;

    const listener = map.addListener("idle", () => {
      if (skipNextIdleRef.current) {
        skipNextIdleRef.current = false;
        return;
      }
      const center = map.getCenter();
      if (!center) return;
      scheduleReverseGeocode({ lat: center.lat(), lng: center.lng() });
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, scheduleReverseGeocode, skipNextIdleRef]);

  return null;
}

function MapPinMarker() {
  return (
    <div className="relative drop-shadow-[0_8px_12px_rgba(0,0,0,0.25)]">
      <svg width="56" height="72" viewBox="0 0 56 72" fill="none">
        <path
          d="M28 0C12.536 0 0 12.368 0 27.6C0 48.3 28 72 28 72S56 48.3 56 27.6C56 12.368 43.464 0 28 0Z"
          fill="#F2B04D"
        />
        <circle cx="28" cy="26" r="12" fill="white" />
      </svg>
    </div>
  );
}
