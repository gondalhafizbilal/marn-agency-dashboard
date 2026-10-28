"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { LogoutConfirmDialog } from "@/components/navigation/logout-confirm-dialog";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore, useUiStore } from "@/store";
import { AgencyAuthRepository } from "@/services";

const NAV_LINKS = [
  { key: "dashboard", href: "/dashboard" },
  { key: "requests", href: "/requests" },
  { key: "ads", href: "/ads" },
  { key: "profile", href: "/profile" },
  { key: "settings", href: "/settings" },
  { key: "packages", href: "/packages" },
] as const;

const ITEM_HEIGHT = 35;
const ITEM_GAP = 30;
const INDICATOR_HEIGHT = 60;
/** Distance from sidebar top (below header offset) to first item. */
const NAV_TOP = 12;

type SidebarNavProps = {
  pathname: string;
  onNavigate?: () => void;
  onLogout: () => void;
};

function SidebarNav({ pathname, onNavigate, onLogout }: SidebarNavProps) {
  const t = useTranslations("nav");

  const itemClassName = (isActive: boolean) =>
    cn(
      "h-[35px] self-stretch text-start text-[22px] font-semibold leading-[35px] text-[#F5F1EC] transition-opacity hover:opacity-100 sm:text-[25px]",
      isActive ? "opacity-100" : "opacity-50",
    );

  return (
    <nav
      className="ms-10 flex w-[min(100%,142px)] flex-col sm:ms-[78px] sm:w-[142px]"
      style={{ marginTop: NAV_TOP, gap: ITEM_GAP }}
      aria-label={t("menu")}
    >
      {NAV_LINKS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.key}
            href={item.href}
            onClick={onNavigate}
            className={itemClassName(isActive)}
          >
            {t(item.key)}
          </Link>
        );
      })}

      <button type="button" onClick={onLogout} className={itemClassName(false)}>
        {t("logout")}
      </button>
    </nav>
  );
}

function ActiveRail({ activeIndex }: { activeIndex: number }) {
  if (activeIndex < 0) return null;

  const indicatorTop =
    NAV_TOP + activeIndex * (ITEM_HEIGHT + ITEM_GAP) + (ITEM_HEIGHT - INDICATOR_HEIGHT) / 2;

  return (
    <div
      aria-hidden
      className="absolute start-0 z-10 w-[7.2px] rounded-e-[10px] bg-auth-panel transition-[top] duration-200"
      style={{ top: `calc(19px + ${indicatorTop}px)`, height: INDICATOR_HEIGHT }}
    />
  );
}

/**
 * Dashboard sidebar (Figma Sidebar Menu):
 * Desktop: 220px permanent rail.
 * Mobile/tablet: slide-over drawer driven by `useUiStore.isSidebarOpen`.
 */
export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const activeIndex = NAV_LINKS.findIndex(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSidebarOpen]);

  async function handleConfirmLogout() {
    try {
      await AgencyAuthRepository.logout();
    } finally {
      clearSession();
      setLogoutOpen(false);
      setSidebarOpen(false);
      router.replace("/login");
    }
  }

  return (
    <>
      {/* Desktop permanent sidebar */}
      <aside className="relative hidden w-[220px] shrink-0 bg-brand-700 pt-[19px] lg:block">
        <ActiveRail activeIndex={activeIndex} />
        <SidebarNav pathname={pathname} onLogout={() => setLogoutOpen(true)} />
      </aside>

      {/* Mobile / tablet drawer */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/45 transition-opacity duration-200 lg:hidden",
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!isSidebarOpen}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        id="dashboard-mobile-nav"
        className={cn(
          "fixed inset-y-0 start-0 z-40 w-[min(100%,280px)] bg-brand-700 pt-[calc(4rem+19px)] transition-transform duration-200 sm:pt-[calc(5rem+19px)] lg:hidden",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
        )}
        aria-hidden={!isSidebarOpen}
      >
        <ActiveRail activeIndex={activeIndex} />
        <SidebarNav
          pathname={pathname}
          onNavigate={() => setSidebarOpen(false)}
          onLogout={() => setLogoutOpen(true)}
        />
      </aside>

      <LogoutConfirmDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
