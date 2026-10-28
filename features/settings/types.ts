export type SettingsTab = "notifications" | "security";

export type NotificationSettings = {
  timezone: string;
  sendReceiveNotifications: boolean;
  merchantOrder: boolean;
  accountRecommendations: boolean;
};

export type SecuritySettings = {
  twoFactorEnabled: boolean;
  currentPassword: string;
  newPassword: string;
};

export type SettingsData = {
  notifications: NotificationSettings;
  security: SecuritySettings;
};
