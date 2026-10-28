"use client";

import { useEffect, useId, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { CloseSquareIcon } from "@/components/icons/close-square-icon";
import { cn } from "@/lib/utils";

export type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** Dialog heading — unique per operation. */
  title: string;
  /** Optional supporting line under the title. */
  description?: string;
  /** Center logo/icon inside the pink badge ring. */
  icon: ReactNode;
  /** Primary action label (defaults to shared Yes). */
  confirmLabel?: string;
  /** Secondary action label (defaults to shared Cancel). */
  cancelLabel?: string;
  /** Hide the secondary Cancel button (single CTA success dialogs). */
  hideCancel?: boolean;
  /** Close button aria-label (defaults to shared Close). */
  closeLabel?: string;
  className?: string;
};

/**
 * Shared confirmation popup (Figma Pop up):
 * 750×504 white card, pink badge + custom icon, confirm / cancel.
 * Reuse for logout, delete ad, status change, etc. — pass different title + icon.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  icon,
  confirmLabel,
  cancelLabel,
  hideCancel = false,
  closeLabel,
  className,
}: ConfirmDialogProps) {
  const t = useTranslations("confirmDialog");
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={closeLabel ?? t("close")}
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "relative z-10 flex h-[min(504px,90vh)] w-full max-w-[750px] flex-col items-center justify-center",
          "rounded-[24px] bg-white px-[11.2%]",
          "shadow-[0_24px_48px_-12px_rgba(80,5,22,0.25)]",
          className,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel ?? t("close")}
          className="absolute end-[2.67%] top-5 text-brand-800 transition-opacity hover:opacity-70"
        >
          <CloseSquareIcon size={40} />
        </button>

        <div className="flex flex-col items-center gap-[46px]">
          <div className="flex w-full max-w-[396px] flex-col items-center gap-6">
            <div className="relative flex size-[150px] items-center justify-center">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-brand-25"
              />
              <span
                aria-hidden
                className="absolute size-[125px] rounded-full bg-white"
              />
              <span className="relative z-10 text-brand-700">{icon}</span>
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-4">
              <h2
                id={titleId}
                className="w-full text-center text-2xl font-semibold leading-8 text-neutral-800"
              >
                {title}
              </h2>
              {description ? (
                <p
                  id={descriptionId}
                  className="w-full text-center text-base font-normal leading-6 text-neutral-400"
                >
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex h-[52px] w-[189px] items-center justify-center rounded-lg bg-brand-600 px-6 text-lg leading-[27px] text-white transition-opacity hover:opacity-90"
            >
              {confirmLabel ?? t("confirm")}
            </button>
            {!hideCancel ? (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-[52px] w-[183px] items-center justify-center rounded-lg bg-neutral-300 px-6 text-lg leading-[27px] text-white transition-opacity hover:opacity-90"
              >
                {cancelLabel ?? t("cancel")}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
