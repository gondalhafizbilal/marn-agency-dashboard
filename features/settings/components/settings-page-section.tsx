"use client";

import { useEffect, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { AuthPasswordInput } from "@/components/forms/auth-password-input";
import { cn } from "@/lib/utils";
import { SettingsToggle } from "@/features/settings/components/settings-toggle";
import { AgencyAuthRepository, AgencyPortalRepository, isAppApiError } from "@/services";
import type {
  NotificationSettings,
  SecuritySettings,
  SettingsTab,
} from "@/features/settings/types";

const TABS: SettingsTab[] = ["notifications", "security"];

const TIMEZONE_OPTIONS = [
  {
    value: "Pacific/Kwajalein",
    labelKey: "timezones.dateLineWest" as const,
  },
  {
    value: "Asia/Qatar",
    labelKey: "timezones.qatar" as const,
  },
  {
    value: "Asia/Dubai",
    labelKey: "timezones.dubai" as const,
  },
  {
    value: "Asia/Riyadh",
    labelKey: "timezones.riyadh" as const,
  },
] as const;

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  timezone: "Pacific/Kwajalein",
  sendReceiveNotifications: true,
  merchantOrder: false,
  accountRecommendations: true,
};

const DEFAULT_SECURITY: SecuritySettings = {
  twoFactorEnabled: true,
  currentPassword: "",
  newPassword: "",
};

/**
 * Settings page (Figma Group 1000003272 / 1000003271):
 * Notifications + Security tabs, Save CTA.
 */
export function SettingsPageSection() {
  const t = useTranslations("settings");
  const [activeTab, setActiveTab] = useState<SettingsTab>("notifications");
  const [notifications, setNotifications] =
    useState<NotificationSettings>(DEFAULT_NOTIFICATIONS);
  const [security, setSecurity] = useState<SecuritySettings>(DEFAULT_SECURITY);

  useEffect(() => {
    void AgencyPortalRepository.notificationPreferences()
      .then((preferences) => {
        setNotifications((current) => ({
          ...current,
          sendReceiveNotifications: preferences.general?.push ?? current.sendReceiveNotifications,
          merchantOrder: preferences.general?.email ?? current.merchantOrder,
          accountRecommendations: preferences.recommendations?.push ?? current.accountRecommendations,
        }));
      })
      .catch(() => undefined);
  }, []);

  function updateNotification<K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K],
  ) {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  }

  function updateSecurity<K extends keyof SecuritySettings>(
    key: K,
    value: SecuritySettings[K],
  ) {
    setSecurity((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    try {
      if (activeTab === "security") {
        await AgencyAuthRepository.changePassword(security.currentPassword, security.newPassword);
      } else {
        await AgencyPortalRepository.updateNotificationPreferences({
          general: { push: notifications.sendReceiveNotifications, email: notifications.merchantOrder },
          recommendations: { push: notifications.accountRecommendations },
        });
      }
      toast.success("Settings saved.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to save settings.");
    }
  }

  return (
    <div className="flex w-full flex-col items-center">
      <form
        className="flex w-full max-w-[980px] flex-col"
        onSubmit={handleSave}
      >
        <section className="flex min-h-[531px] w-full flex-col rounded-[25px] bg-white px-[30px] pb-8 pt-9">
          <div className="relative mb-10 w-full">
            <div className="flex items-center gap-[72px] pb-[10px]">
              {TABS.map((tab) => {
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "relative text-base font-medium leading-[19px] transition-opacity",
                      active
                        ? "text-brand-700 opacity-100"
                        : "text-brand-900 opacity-100 hover:opacity-80",
                    )}
                  >
                    {t(`tabs.${tab}`)}
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute -bottom-[10px] start-1/2 h-[3px] w-[114px] -translate-x-1/2 rounded-t-[10px] bg-brand-900"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
            <div className="h-px w-full bg-[#F4F5F7]" />
          </div>

          <div className="flex flex-1 flex-col">
            {activeTab === "notifications" ? (
              <SettingsNotificationsPanel
                notifications={notifications}
                onUpdate={updateNotification}
              />
            ) : (
              <SettingsSecurityPanel
                security={security}
                onUpdate={updateSecurity}
              />
            )}

            <div className="mt-auto flex justify-end pt-10">
              <button
                type="submit"
                className="inline-flex h-[52px] w-[300px] items-center justify-center rounded-[15px] bg-brand-600 text-lg font-medium leading-[22px] text-white transition-opacity hover:opacity-90"
              >
                {t("save")}
              </button>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}

function SettingsNotificationsPanel({
  notifications,
  onUpdate,
}: {
  notifications: NotificationSettings;
  onUpdate: <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K],
  ) => void;
}) {
  const t = useTranslations("settings");

  return (
    <div className="flex w-full max-w-[477px] flex-col gap-8">
      <label className="relative flex w-full flex-col gap-1">
        <span className="sr-only">{t("fields.timezone")}</span>
        <select
          value={notifications.timezone}
          onChange={(event) => onUpdate("timezone", event.target.value)}
          className="h-[52px] w-full appearance-none rounded-xl border border-brand-700 bg-white pe-10 ps-4 text-sm leading-[18px] text-neutral-800 outline-none"
        >
          {TIMEZONE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.labelKey)}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute end-4 top-[17px] size-6 text-brand-800"
          strokeWidth={1.5}
        />
      </label>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold leading-[17px] text-[#333B69]">
          {t("sections.notification")}
        </h3>

        <div className="flex flex-col gap-4">
          <SettingsToggle
            checked={notifications.sendReceiveNotifications}
            onChange={(value) => onUpdate("sendReceiveNotifications", value)}
            label={t("toggles.sendReceiveNotifications")}
          />
          <SettingsToggle
            checked={notifications.merchantOrder}
            onChange={(value) => onUpdate("merchantOrder", value)}
            label={t("toggles.merchantOrder")}
          />
          <SettingsToggle
            checked={notifications.accountRecommendations}
            onChange={(value) => onUpdate("accountRecommendations", value)}
            label={t("toggles.accountRecommendations")}
          />
        </div>
      </div>
    </div>
  );
}

function SettingsSecurityPanel({
  security,
  onUpdate,
}: {
  security: SecuritySettings;
  onUpdate: <K extends keyof SecuritySettings>(
    key: K,
    value: SecuritySettings[K],
  ) => void;
}) {
  const t = useTranslations("settings");
  const tAuth = useTranslations("auth");

  return (
    <div className="flex w-full max-w-[401px] flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold leading-[17px] text-[#333B69]">
          {t("sections.notification")}
        </h3>
        <SettingsToggle
          checked={security.twoFactorEnabled}
          onChange={(value) => onUpdate("twoFactorEnabled", value)}
          label={t("toggles.twoFactor")}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold leading-[22px] text-[#333B69]">
          {t("sections.changePassword")}
        </h3>

        <label className="flex w-full max-w-[327px] flex-col gap-1">
          <span className="text-sm font-semibold leading-[18px] text-neutral-800">
            {t("fields.currentPassword")}
          </span>
          <AuthPasswordInput
            value={security.currentPassword}
            onChange={(event) =>
              onUpdate("currentPassword", event.target.value)
            }
            placeholder={t("placeholder")}
            autoComplete="current-password"
            toggleLabelShow={tAuth("showPassword")}
            toggleLabelHide={tAuth("hidePassword")}
            className="border-brand-700 focus-visible:border-brand-700"
          />
        </label>

        <label className="flex w-full max-w-[327px] flex-col gap-1">
          <span className="text-sm font-semibold leading-[18px] text-neutral-800">
            {t("fields.newPassword")}
          </span>
          <AuthPasswordInput
            value={security.newPassword}
            onChange={(event) => onUpdate("newPassword", event.target.value)}
            placeholder={t("placeholder")}
            autoComplete="new-password"
            toggleLabelShow={tAuth("showPassword")}
            toggleLabelHide={tAuth("hidePassword")}
            className="border-brand-700 focus-visible:border-brand-700"
          />
        </label>
      </div>
    </div>
  );
}
