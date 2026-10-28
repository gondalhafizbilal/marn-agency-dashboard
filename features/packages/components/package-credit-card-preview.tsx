"use client";

import { cn } from "@/lib/utils";

type PackageCreditCardPreviewProps = {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  className?: string;
};

function splitCardNumberGroups(value: string): string[] {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  const groups: string[] = [];

  for (let index = 0; index < 4; index += 1) {
    const chunk = digits.slice(index * 4, index * 4 + 4);
    groups.push(chunk.padEnd(4, "•"));
  }

  return groups;
}

function displayName(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "Jack Lewis";
}

function displayExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length === 0) return "06/21";

  const month = digits.slice(0, 2).padEnd(2, "•");
  const year = digits.slice(2, 4).padEnd(2, "•");
  return `${month}/${year}`;
}

/**
 * Live credit card preview (Figma Credit Card):
 * 399×250 on desktop; aspect-ratio fluid with scaled type on mobile.
 */
export function PackageCreditCardPreview({
  cardholderName,
  cardNumber,
  expiry,
  className,
}: PackageCreditCardPreviewProps) {
  const groups = splitCardNumberGroups(cardNumber);

  return (
    <div
      className={cn(
        "relative aspect-[399/250] w-full max-w-[399px] overflow-hidden rounded-[15px]",
        className,
      )}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, #000000 0%, #343434 50.83%, #4E4E4E 100%)",
        }}
      />
      <div className="absolute -end-[12%] -top-[71%] size-[200px] rounded-full bg-white/20" />
      <div className="absolute -start-[5%] top-[18%] size-[220px] rounded-full bg-gradient-to-br from-white/40 to-transparent" />

      <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <span className="text-sm font-medium leading-5 text-white sm:text-[17px] sm:leading-[22px]">
            Credit Card
          </span>
          <MastercardLogo className="h-7 w-[46px] shrink-0 sm:h-9 sm:w-[59px]" />
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-5">
          {groups.map((group, index) => (
            <span
              key={index}
              className="text-base font-normal leading-6 tracking-wide text-white sm:text-[19.5px] sm:leading-[29px]"
            >
              {group}
            </span>
          ))}
        </div>

        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <span className="truncate text-sm font-normal leading-5 text-white sm:text-[17px] sm:leading-[22px]">
            {displayName(cardholderName)}
          </span>
          <span className="shrink-0 text-xs font-normal leading-5 text-white sm:text-[14.6px] sm:leading-[22px]">
            {displayExpiry(expiry)}
          </span>
        </div>
      </div>
    </div>
  );
}

function MastercardLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 59 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="21" cy="18" r="18" fill="#EB001B" />
      <circle cx="38" cy="18" r="18" fill="#F79E1B" />
      <path
        d="M29.5 6.5C26.5 9.1 24.5 13 24.5 18C24.5 23 26.5 26.9 29.5 29.5C32.5 26.9 34.5 23 34.5 18C34.5 13 32.5 9.1 29.5 6.5Z"
        fill="#FF5F00"
      />
    </svg>
  );
}
