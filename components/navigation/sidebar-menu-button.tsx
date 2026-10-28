"use client";

import { MenuIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { useUiStore } from "@/store";
import { cn } from "@/lib/utils";

type SidebarMenuButtonProps = {
  className?: string;
};

/**
 * Toggles the mobile/tablet nav drawer (hidden on lg+ where the sidebar is permanent).
 */
export function SidebarMenuButton({ className }: SidebarMenuButtonProps) {
  const t = useTranslations("nav");
  const isOpen = useUiStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={isOpen ? t("closeMenu") : t("openMenu")}
      aria-expanded={isOpen}
      aria-controls="dashboard-mobile-nav"
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-auth-panel transition-opacity hover:opacity-80 lg:hidden",
        className,
      )}
    >
      {isOpen ? (
        <XIcon className="size-6" strokeWidth={2} />
      ) : (
        <MenuIcon className="size-6" strokeWidth={2} />
      )}
    </button>
  );
}
