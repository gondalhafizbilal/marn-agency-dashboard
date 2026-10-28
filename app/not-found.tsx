import { NotFoundView } from "@/components/layout/not-found-view";

/**
 * Root 404 for requests outside a valid locale segment
 * (e.g. invalid locale triggering notFound from the locale layout).
 */
export default function RootNotFound() {
  return (
    <NotFoundView
      title="Page not found"
      description="This page doesn’t exist or may have been moved. Head back to your dashboard to continue."
      ctaLabel="Back to dashboard"
      ctaHref="/en/dashboard"
    />
  );
}
