"use client";

import { PhoneIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { cn } from "@/lib/utils";
import type { RequestCardData, RequestStatus } from "@/features/requests/types";

type RequestCardProps = {
  request: RequestCardData;
  className?: string;
  variant?: "list" | "detail";
  onClick?: () => void;
  onMarkCompleted?: (request: RequestCardData) => void;
};

/**
 * Request card (Figma Request card):
 * 925×264 white card — customer, contacts, category, status, description, CTA.
 */
export function RequestCard({
  request,
  className,
  variant = "list",
  onClick,
  onMarkCompleted,
}: RequestCardProps) {
  const t = useTranslations("requests.card");
  const isList = variant === "list";

  function handleCardClick(event: React.MouseEvent<HTMLElement>) {
    if (!onClick) return;
    if ((event.target as HTMLElement).closest("a, button")) return;
    onClick();
  }

  function handleCardKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (!onClick) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onClick();
  }

  return (
    <article
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "flex w-full flex-col items-start justify-center gap-6",
        isList
          ? "max-w-[925px] rounded-[13px] bg-white px-3 py-6 shadow-[0px_4px_25px_rgba(0,0,0,0.05)]"
          : "max-w-none rounded-none bg-transparent p-0 shadow-none",
        onClick &&
          "cursor-pointer transition-shadow hover:shadow-[0px_4px_25px_rgba(0,0,0,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
        className,
      )}
    >
      <div className="flex w-full items-start gap-4">
        <div
          className={cn(
            "relative shrink-0 overflow-hidden rounded-full bg-auth-panel",
            isList ? "size-[61px]" : "size-[80px]",
          )}
        >
          {request.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={request.avatarUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <span
              className={cn(
                "flex size-full items-center justify-center font-semibold text-brand-800",
                isList ? "text-sm" : "text-base",
              )}
            >
              {initials(request.customerName)}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-6">
            <h3
              className={cn(
                "font-semibold text-black",
                isList ? "text-lg leading-[27px]" : "text-xl leading-[30px]",
              )}
            >
              {request.customerName}
            </h3>

            <div className="flex items-center gap-2">
              <ContactButton
                href={telHref(request.contacts.phone)}
                label={t("call")}
                className="bg-[#EAECF0]"
              >
                <PhoneIcon className="size-6 text-brand-700" strokeWidth={1.5} />
              </ContactButton>
              <ContactButton
                href={request.contacts.chat}
                label={t("chat")}
                className="bg-[#EAECF0]"
              >
                <RequestChatIcon />
              </ContactButton>
              <ContactButton
                href={whatsappHref(request.contacts.whatsapp)}
                label={t("whatsapp")}
              >
                <WhatsAppIcon size={36} />
              </ContactButton>
            </div>
          </div>

          <span className="text-sm font-normal leading-[18px] text-neutral-400">
            {request.category}
          </span>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <StatusBadge status={request.status} />
          <p className="text-[10px] font-semibold leading-[14px] text-brand-700">
            {t("dateSubmitted", { date: request.dateSubmitted })}
          </p>
        </div>
      </div>

      <p
        className={cn(
          "w-full font-normal text-neutral-400",
          isList ? "text-sm leading-[18px]" : "text-base leading-6",
        )}
      >
        {request.description}
      </p>

      {request.status === "pending" ? (
        <button
          type="button"
          onClick={() => onMarkCompleted?.(request)}
          className={cn(
            "inline-flex w-full items-center justify-center gap-1.5 rounded-[6px] bg-brand-600 px-2 font-semibold text-[#FCFCFD] transition-opacity hover:opacity-90",
            isList
              ? "h-[30px] text-[10px] leading-[14px]"
              : "h-[52px] max-w-[300px] self-end text-lg leading-[27px]",
          )}
        >
          <MessageIcon />
          {t("markCompleted")}
        </button>
      ) : null}
    </article>
  );
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const t = useTranslations("requests.card.status");

  return (
    <span
      className={cn(
        "inline-flex h-[30px] min-w-[111px] shrink-0 items-center justify-center rounded-full border px-3 text-[15px] font-medium leading-[18px]",
        status === "completed"
          ? "border-[#027A48] bg-[#D1FADF] text-[#027A48]"
          : "border-[#F97066] bg-[#FEE4E2] text-[#F97066]",
      )}
    >
      {t(status)}
    </span>
  );
}

function ContactButton({
  href,
  label,
  className,
  children,
}: {
  href?: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  const classNames = cn(
    "inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80",
    className,
  );

  if (!href) {
    return (
      <span className={classNames} aria-hidden>
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={classNames}
      aria-label={label}
    >
      {children}
    </a>
  );
}

function RequestChatIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M20 12.5C20 16.6421 16.6421 20 12.5 20C11.214 20 9.998 19.685 8.925 19.125L4 20.5L5.375 15.575C4.815 14.502 4.5 13.286 4.5 12C4.5 7.85786 7.85786 4.5 12 4.5C16.1421 4.5 19.5 7.85786 19.5 12H20Z"
        stroke="#7C0A23"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="12" r="1" fill="#7C0A23" />
      <circle cx="12.5" cy="12" r="1" fill="#7C0A23" />
      <circle cx="15.5" cy="12" r="1" fill="#7C0A23" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.5 2.083C2.5 1.669 2.836 1.333 3.25 1.333H10.75C11.164 1.333 11.5 1.669 11.5 2.083V8.417C11.5 8.831 11.164 9.167 10.75 9.167H5.25L2.5 11.083V2.083Z"
        fill="#FCFCFD"
      />
    </svg>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function telHref(phone?: string) {
  if (!phone) return undefined;
  return `tel:${phone.replace(/\s/g, "")}`;
}

function whatsappHref(phone?: string) {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}
