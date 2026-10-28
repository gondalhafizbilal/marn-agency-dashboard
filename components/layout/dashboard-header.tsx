import { AppHeader } from "@/components/layout/app-header";
import {
  AuthLocaleSwitcher,
  HeaderLocation,
  HeaderNotifications,
  SidebarMenuButton,
} from "@/components/navigation";

/**
 * Dashboard header: menu (mobile) + logo + location + locale + notifications.
 */
export function DashboardHeader() {
  return (
    <AppHeader
      logoHref="/dashboard"
      className="z-50"
      leadingExtra={<SidebarMenuButton />}
      startExtra={<HeaderLocation />}
      endExtra={
        <>
          <AuthLocaleSwitcher className="text-auth-panel" />
          <HeaderNotifications />
        </>
      }
    />
  );
}
