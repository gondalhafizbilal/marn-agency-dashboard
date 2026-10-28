"use client";

import { APIProvider } from "@vis.gl/react-google-maps";

import { env } from "@/config";

type LocationMapsProviderProps = {
  children: React.ReactNode;
};

/**
 * Loads Google Maps JS (+ Places) once when the location modal opens.
 */
export function LocationMapsProvider({ children }: LocationMapsProviderProps) {
  const apiKey = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return <>{children}</>;

  return (
    <APIProvider apiKey={apiKey} libraries={["places"]}>
      {children}
    </APIProvider>
  );
}
