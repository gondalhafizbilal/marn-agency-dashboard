"use client";

import { useTranslations } from "next-intl";

import { LogoutBoldIcon } from "@/components/icons/logout-bold-icon";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type LogoutConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * Logout preset of the shared ConfirmDialog.
 */
export function LogoutConfirmDialog({
  open,
  onClose,
  onConfirm,
}: LogoutConfirmDialogProps) {
  const t = useTranslations("logoutModal");

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={t("title")}
      confirmLabel={t("confirm")}
      icon={<LogoutBoldIcon size={83} />}
    />
  );
}
