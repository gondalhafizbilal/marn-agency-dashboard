"use client";

import { PhoneIcon, Share2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

import { ChatIcon } from "@/components/icons/chat-icon";
import { EditIcon } from "@/components/icons/edit-icon";
import { cn } from "@/lib/utils";
import type { ProfileData } from "@/features/profile/types";

type ProfileHeaderCardProps = {
  profile: ProfileData;
  className?: string;
  onShare?: () => void;
  onEdit?: () => void;
};

/**
 * Profile header card (Figma Frame 1000003271):
 * 980×177 white card — avatar, identity, contact icons, Share/Edit.
 */
export function ProfileHeaderCard({
  profile,
  className,
  onShare,
  onEdit,
}: ProfileHeaderCardProps) {
  const t = useTranslations("profile.header");

  return (
    <section
      className={cn(
        "flex w-full max-w-[980px] flex-col items-start gap-6 rounded-[25px] bg-white px-[30px] py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8",
        className,
      )}
      aria-label={t("ariaLabel")}
    >
      <div className="flex min-w-0 items-center gap-6">
        <div className="relative size-[130px] shrink-0 overflow-hidden rounded-full bg-[#C4C4C4] shadow-[0px_4px_15px_rgba(0,0,0,0.05)]">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-2xl font-semibold text-brand-800">
              {initials(profile.name)}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            <h1 className="truncate text-lg font-semibold leading-[27px] text-neutral-800">
              {profile.name}
            </h1>
            <p className="text-sm font-normal leading-[18px] text-neutral-400">
              {profile.location}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ContactIconButton
              href={telHref(profile.contacts.phone)}
              label={t("call")}
            >
              <PhoneIcon className="size-[19px] text-brand-700" strokeWidth={1.5} />
            </ContactIconButton>

            <ContactIconButton
              href={profile.contacts.chat}
              label={t("chat")}
              className="bg-transparent"
            >
              <ChatIcon size={36} />
            </ContactIconButton>

            <ContactIconButton
              href={whatsappHref(profile.contacts.whatsapp)}
              label={t("whatsapp")}
              className="bg-[#25D366]"
            >
              <WhatsAppGlyph className="size-[22px] text-white" />
            </ContactIconButton>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-[3.5px] self-end sm:self-auto">
        <ActionButton
          icon={<Share2Icon className="size-[18px]" strokeWidth={1.5} />}
          label={t("share")}
          onClick={onShare}
        />
        <ActionButton
          icon={<EditIcon size={18} />}
          label={t("edit")}
          onClick={onEdit}
        />
      </div>
    </section>
  );
}

function ContactIconButton({
  href,
  label,
  children,
  className,
}: {
  href?: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const classes = cn(
    "inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white transition-opacity hover:opacity-80",
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" aria-label={label} className={classes}>
      {children}
    </button>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-[30px] items-center justify-center gap-1 rounded border border-brand-700 px-2 text-sm leading-[18px] text-brand-700 transition-colors hover:bg-brand-25"
    >
      <span className="text-brand-800">{icon}</span>
      {label}
    </button>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83H12.05C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91ZM12.05 20.15C10.59 20.15 9.16 19.76 7.91 19.03L7.61 18.85L4.42 19.69L5.28 16.58L5.08 16.27C4.28 15 3.82 13.47 3.82 11.91C3.82 7.38 7.51 3.69 12.04 3.69C14.24 3.69 16.3 4.55 17.85 6.11C19.41 7.66 20.26 9.73 20.26 11.92C20.26 16.45 16.57 20.15 12.05 20.15ZM16.56 13.99C16.31 13.87 15.09 13.27 14.87 13.18C14.64 13.1 14.48 13.06 14.31 13.31C14.15 13.56 13.68 14.11 13.54 14.27C13.4 14.44 13.26 14.46 13.01 14.33C12.76 14.21 11.96 13.95 11.01 13.1C10.27 12.44 9.77 11.62 9.63 11.37C9.49 11.12 9.61 10.99 9.73 10.87C9.84 10.76 9.97 10.59 10.09 10.45C10.21 10.31 10.25 10.21 10.33 10.05C10.41 9.89 10.37 9.75 10.31 9.62C10.25 9.5 9.77 8.31 9.57 7.81C9.37 7.33 9.17 7.39 9.02 7.39C8.88 7.38 8.71 7.38 8.55 7.38C8.38 7.38 8.12 7.44 7.9 7.69C7.67 7.94 7.05 8.52 7.05 9.7C7.05 10.88 7.9 12.02 8.02 12.18C8.14 12.35 9.72 14.78 12.07 15.8C12.63 16.04 13.07 16.18 13.4 16.29C13.94 16.46 14.43 16.44 14.82 16.38C15.25 16.31 16.24 15.79 16.45 15.21C16.65 14.64 16.65 14.15 16.59 14.05C16.53 13.95 16.37 13.89 16.12 13.77L16.56 13.99Z" />
    </svg>
  );
}

function telHref(phone?: string) {
  if (!phone) return undefined;
  return `tel:${phone.replace(/\s+/g, "")}`;
}

function whatsappHref(phone?: string) {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : undefined;
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
