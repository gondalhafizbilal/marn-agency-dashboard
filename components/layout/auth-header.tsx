import { AppHeader } from "@/components/layout/app-header";
import { AuthLocaleSwitcher } from "@/components/navigation";

/**
 * Auth layout header — shared maroon bar + locale switcher.
 */
export function AuthHeader() {
  return (
    <AppHeader
      logoHref="/login"
      endExtra={<AuthLocaleSwitcher className="text-auth-panel" />}
    />
  );
}
