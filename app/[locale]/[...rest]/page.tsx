import { notFound } from "next/navigation";

/**
 * Catch unknown paths under a valid locale (e.g. `/en/does-not-exist`)
 * so Next.js renders `app/[locale]/not-found.tsx` instead of the default 404.
 * @see https://next-intl.dev/docs/environments/error-files
 */
export default function CatchAllPage() {
  notFound();
}
