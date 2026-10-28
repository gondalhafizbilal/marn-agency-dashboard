import Link from "next/link";

import { MarnLogo } from "@/components/icons/marn-logo";
import { AuthBackgroundDecor } from "@/components/layout/auth-background-decor";

type NotFoundViewProps = {
  title: string;
  description: string;
  ctaLabel: string;
  /** Absolute path including locale when needed, e.g. `/en/dashboard`. */
  ctaHref: string;
};

/**
 * Shared branded 404 UI (maroon auth atmosphere + cream panel).
 * Uses next/link so it works in root not-found (no next-intl provider).
 */
export function NotFoundView({
  title,
  description,
  ctaLabel,
  ctaHref,
}: NotFoundViewProps) {
  return (
    <div
      className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-6 py-12"
      style={{ background: "var(--auth-gradient), var(--brand-900)" }}
    >
      <AuthBackgroundDecor />

      <div className="relative z-10 flex w-full max-w-[434px] flex-col items-center gap-10">
        <MarnLogo className="w-[min(100%,180px)]" />

        <div className="flex w-full flex-col items-center gap-8 rounded-[25px] bg-auth-panel px-8 py-12 sm:px-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-[72px] font-semibold leading-none tracking-tight text-brand-800">
              404
            </p>
            <h1 className="text-2xl font-semibold leading-8 text-neutral-800">
              {title}
            </h1>
            <p className="max-w-[280px] text-sm leading-[18px] text-neutral-400">
              {description}
            </p>
          </div>

          <Link
            href={ctaHref}
            className="inline-flex h-[52px] w-full items-center justify-center rounded-lg bg-brand-600 px-6 text-lg font-semibold leading-[27px] text-[#F0E9DF] transition-opacity hover:opacity-90"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
