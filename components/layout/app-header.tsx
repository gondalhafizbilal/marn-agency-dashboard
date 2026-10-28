import { MarnLogoHeader } from "@/components/icons/marn-logo-header";
import { AuthLocaleSwitcher } from "@/components/navigation";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type AppHeaderProps = {
  /** Logo destination — auth → login, dashboard → home. */
  logoHref?: string;
  /** Content before the logo (e.g. mobile menu button). */
  leadingExtra?: React.ReactNode;
  /** Content after the logo (e.g. location picker). */
  startExtra?: React.ReactNode;
  /** Trailing actions; defaults to locale switcher. */
  endExtra?: React.ReactNode;
  className?: string;
};

/**
 * Shared maroon app header bar (Figma 100px / brand-700 on desktop).
 * Shorter on mobile/tablet to free vertical space.
 */
export function AppHeader({
  logoHref = "/login",
  leadingExtra,
  startExtra,
  endExtra,
  className,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        "absolute inset-x-0 top-0 z-20 flex h-16 w-full items-center bg-brand-700 sm:h-20 lg:h-[100px]",
        className,
      )}
    >
      <div className="flex w-full items-center gap-3 px-4 sm:gap-5 sm:px-6 lg:gap-8 lg:px-[6.94%] min-[1440px]:gap-14">
        {leadingExtra}

        <Link href={logoHref} className="inline-flex shrink-0 items-center">
          <MarnLogoHeader className="h-5 w-auto sm:h-6 lg:h-7" />
        </Link>

        {startExtra}

        <div className="ms-auto flex items-center gap-2 sm:gap-3">
          {endExtra ?? <AuthLocaleSwitcher className="text-auth-panel" />}
        </div>
      </div>
    </header>
  );
}
