import { getLocale, getTranslations } from "next-intl/server";

import { NotFoundView } from "@/components/layout/not-found-view";

/**
 * Locale 404 — rendered when `notFound()` is called under `[locale]`
 * (including the catch-all for unknown paths like `/en/does-not-exist`).
 */
export default async function LocaleNotFound() {
  const t = await getTranslations("common");
  const locale = await getLocale();

  return (
    <NotFoundView
      title={t("pageNotFound")}
      description={t("pageNotFoundDescription")}
      ctaLabel={t("backToDashboard")}
      ctaHref={`/${locale}/dashboard`}
    />
  );
}
