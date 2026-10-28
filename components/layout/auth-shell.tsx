import { MarnLogo } from "@/components/icons/marn-logo";

import { AuthBackgroundDecor } from "./auth-background-decor";
import { AuthHeader } from "./auth-header";

type AuthShellProps = {
  children: React.ReactNode;
};

/**
 * Auth shell from Figma (1440×900 desktop):
 * - Header: maroon bar (compact on mobile/tablet, 100px on lg+)
 * - Mobile/tablet: stacked logo → cream form, page scrolls
 * - Desktop (lg+): brand column + cream frame side-by-side
 * - 1440+: brand 780px, frame 434px, right gutter 226px
 */
export function AuthShell({ children }: AuthShellProps) {
  return (
    <div
      className="relative isolate flex min-h-dvh w-full flex-col overflow-x-hidden lg:h-dvh lg:overflow-hidden lg:flex-row"
      style={{ background: "var(--auth-gradient), var(--brand-900)" }}
    >
      <AuthBackgroundDecor />
      <AuthHeader />

      {/* Brand mark — compact above the form on small screens; left column on lg+ */}
      <div className="relative z-10 flex shrink-0 items-center justify-center px-6 pb-4 pt-20 sm:pb-6 sm:pt-24 lg:flex-1 lg:pb-0 lg:pt-[100px] min-[1440px]:w-[780px] min-[1440px]:shrink-0 min-[1440px]:flex-none">
        <MarnLogo className="w-[min(100%,148px)] sm:w-[min(100%,200px)] lg:w-[min(100%,247px)]" />
      </div>

      {/* Cream form frame — natural page scroll on mobile; internal scroll on desktop */}
      <div className="relative z-10 flex flex-1 items-start justify-center px-4 pb-8 sm:px-6 sm:pb-10 lg:items-center lg:justify-end lg:pb-4 lg:pe-16 lg:pt-[100px] min-[1440px]:pe-[226px]">
        <div className="relative z-10 flex w-full max-w-[434px] flex-col overscroll-contain rounded-2xl bg-auth-panel px-5 py-5 sm:px-10 sm:py-6 md:px-[52px] lg:max-h-[calc(100dvh-100px-2rem)] lg:overflow-y-auto lg:rounded-[25px] lg:py-6">
          {/* my-auto centers short forms; when content overflows, margins collapse so scroll can reach the top */}
          <div className="mx-auto my-auto w-full max-w-[329px] shrink-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
