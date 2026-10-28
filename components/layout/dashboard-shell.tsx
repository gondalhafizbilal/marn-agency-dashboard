import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";

type DashboardShellProps = {
  children: React.ReactNode;
};

/**
 * Main app shell (Figma):
 * - Maroon header (compact on mobile/tablet, 100px on lg+)
 * - Sidebar: drawer below lg, permanent 220px rail on lg+
 * - Cream content panel: #F0E9DF, 24px radius, ~80px left gutter after sidebar on desktop
 */
export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-brand-700">
      <DashboardHeader />

      <div className="flex min-h-0 flex-1 pt-16 sm:pt-20 lg:pt-[100px]">
        <DashboardSidebar />

        <div className="flex min-h-[calc(100dvh-4rem)] flex-1 overflow-y-auto pb-4 pe-3 ps-3 pt-px sm:min-h-[calc(100dvh-5rem)] sm:pb-6 sm:pe-4 sm:ps-4 lg:min-h-[calc(100dvh-100px)] lg:pe-5 lg:ps-20">
          <div className="min-h-[calc(100dvh-4rem-1rem)] w-full rounded-2xl bg-auth-panel p-4 text-neutral-800 sm:min-h-[calc(100dvh-5rem-1.5rem)] sm:rounded-3xl sm:p-5 lg:min-h-[calc(100dvh-100px-1.5rem)] lg:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
