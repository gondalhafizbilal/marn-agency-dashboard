"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { AgencyPortalRepository, type AgencyNotification } from "@/services";

type HeaderNotificationsProps = {
  /** Show unread badge on the trigger (Figma red dot). */
  hasUnread?: boolean;
  className?: string;
};

/**
 * Dashboard header notification control + popover panel (Figma Group 1000003280).
 */
export function HeaderNotifications({
  hasUnread,
  className,
}: HeaderNotificationsProps) {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    void AgencyPortalRepository.notifications()
      .then((notifications) => setItems(notifications.map(toNotificationItem)))
      .catch(() => setItems([]));
  }, []);

  const unread = hasUnread ?? items.some((item) => item.unread);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={t("notifications")}
        aria-expanded={open}
        aria-controls={panelId}
        className="relative inline-flex size-10 shrink-0 items-center justify-center transition-opacity hover:opacity-90 sm:size-[50px]"
      >
        <NotificationTriggerIcon hasUnread={unread} className="size-10 sm:size-[50px]" />
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={t("notifications")}
          className="absolute end-0 top-[calc(100%+0.5rem)] z-50 w-[min(100vw-1.5rem,411px)] sm:top-0"
        >
          <NotificationsPanel items={items} onRead={(id) => {
            setItems((current) => current.map((item) => item.id === id ? { ...item, unread: false } : item));
            void AgencyPortalRepository.markNotificationRead(id).catch(() => undefined);
          }} />
        </div>
      ) : null}
    </div>
  );
}

type NotificationItem = {
  id: string;
  message: string;
  icon: "bell" | "profile" | "avatar";
  /** Unread red dot on icon */
  unread?: boolean;
  /** Emphasized body (neutral-800 / medium) */
  emphasized?: boolean;
  /** Initials for avatar variant */
  initials?: string;
  createdAt?: string;
};

function NotificationsPanel({ items, onRead }: { items: NotificationItem[]; onRead: (id: string) => void }) {
  const t = useTranslations("notificationsPanel");
  const today = items.filter((item) => isToday(item.createdAt));
  const earlier = items.filter((item) => !isToday(item.createdAt));

  return (
    <div className="relative h-[min(598px,calc(100dvh-2rem))] w-full overflow-hidden rounded-3xl bg-auth-panel shadow-[0_20px_40px_-12px_rgba(80,5,22,0.25)]">
      {/* Figma top band #F5F1EC */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[209px] rounded-t-3xl bg-[#F5F1EC]"
      />

      <div className="relative flex h-full flex-col gap-5 overflow-y-auto px-5 py-6 sm:gap-6 sm:px-[35px] sm:py-8">
        <section className="flex w-full max-w-[327px] flex-col gap-4">
          <h2 className="text-base font-semibold leading-6 text-neutral-800">
            {t("today")}
          </h2>
          <ul className="flex flex-col gap-3">
            {today.length ? today.map((item) => (
              <NotificationRow key={item.id} item={item} onRead={onRead} />
            )) : <li className="text-xs text-neutral-400">No new notifications.</li>}
          </ul>
        </section>

        {earlier.length ? <>
          <h2 className="w-full max-w-[327px] text-base font-semibold leading-6 text-neutral-800">
            {t("yesterday")}
          </h2>
          <ul className="flex w-full max-w-[327px] flex-col gap-3">
            {earlier.map((item) => <NotificationRow key={item.id} item={item} onRead={onRead} />)}
          </ul>
        </> : null}
      </div>
    </div>
  );
}

function NotificationRow({ item, onRead }: { item: NotificationItem; onRead: (id: string) => void }) {

  return (
    <li>
      <button
        type="button"
        onClick={() => item.unread && onRead(item.id)}
        className="flex w-full items-start gap-3 text-start transition-opacity hover:opacity-80"
      >
        <NotificationIcon
          variant={item.icon}
          unread={item.unread}
          initials={item.initials}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <p
            className={cn(
              "text-xs leading-[18px]",
              item.emphasized
                ? "font-medium text-neutral-800"
                : "font-normal text-neutral-400",
            )}
          >
            {item.message}
          </p>
          <div className="h-px w-full bg-[#E5E7EB]" />
        </div>
      </button>
    </li>
  );
}

function toNotificationItem(notification: AgencyNotification): NotificationItem {
  const message = String(notification.message ?? notification.body ?? notification.title ?? "Notification");
  return {
    id: notification.uuid,
    message,
    icon: "bell",
    unread: !(notification.isRead ?? notification.is_read ?? notification.read ?? false),
    emphasized: true,
    createdAt: String(notification.createdAt ?? notification.created_at ?? ""),
  };
}

function isToday(value?: string) {
  if (!value) return true;
  const date = new Date(value);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}

function NotificationIcon({
  variant,
  unread,
  initials,
}: {
  variant: NotificationItem["icon"];
  unread?: boolean;
  initials?: string;
}) {
  if (variant === "avatar") {
    return (
      <span
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#D9D9D9] text-[10px] font-semibold text-neutral-800"
        aria-hidden
      >
        {initials}
      </span>
    );
  }

  return (
    <span className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white">
      {variant === "bell" ? <BellGlyph /> : <ProfileGlyph />}
      {unread ? (
        <span className="absolute end-1 top-1 size-1 rounded-full bg-[#F04438]" />
      ) : null}
    </span>
  );
}

function BellGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4.5c-3.2 0-5.5 2.35-5.5 5.4 0 3.15-1.6 3-1.6 5.55C5.1 17.7 7.9 18.3 12 18.3s6.9-.6 7.1-2.85c0-2.55-1.6-2.4-1.6-5.55 0-3.05-2.3-5.4-5.5-5.4Z"
        stroke="#7C0A23"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 20.2c-1.1 1.2-2.85 1.22-3.95 0"
        stroke="#7C0A23"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfileGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8.2" r="3.2" stroke="#7C0A23" strokeWidth="1.43" />
      <path
        d="M6.5 18.5c1.4-2.4 3.3-3.5 5.5-3.5s4.1 1.1 5.5 3.5"
        stroke="#7C0A23"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NotificationTriggerIcon({
  hasUnread,
  className,
}: {
  hasUnread: boolean;
  className?: string;
}) {
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect
        x="0.5"
        y="0.5"
        width="49"
        height="49"
        rx="24.5"
        fill="white"
        stroke="#D2D6DB"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.9999 31.6449C31.4081 31.6449 34.3727 30.8228 34.659 27.5232C34.659 24.2258 32.5921 24.4378 32.5921 20.392C32.5921 17.2318 29.5968 13.6362 24.9999 13.6362C20.4031 13.6362 17.4077 17.2318 17.4077 20.392C17.4077 24.4378 15.3408 24.2258 15.3408 27.5232C15.6283 30.8353 18.5928 31.6449 24.9999 31.6449Z"
        stroke="#1F2A37"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27.7145 35.0649C26.1643 36.7862 23.7461 36.8066 22.1812 35.0649"
        stroke="#1F2A37"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {hasUnread ? (
        <circle cx="34.091" cy="10.2272" r="3.40909" fill="#F04438" />
      ) : null}
    </svg>
  );
}
