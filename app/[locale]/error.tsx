"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleError({ error, reset }: ErrorPageProps) {
  const t = useTranslations("common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">{t("somethingWentWrong")}</h1>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        {t("unexpectedError")}
      </p>
      <Button type="button" onClick={reset}>
        {t("tryAgain")}
      </Button>
    </div>
  );
}
