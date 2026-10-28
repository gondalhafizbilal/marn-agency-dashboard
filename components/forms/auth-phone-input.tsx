import { ChevronDownIcon } from "lucide-react";

import { AuthInput } from "@/components/forms/auth-input";
import { cn } from "@/lib/utils";

type AuthPhoneInputProps = {
  countryCode: string;
  onCountryCodeChange: (value: string) => void;
  phoneProps?: React.ComponentProps<"input">;
  countryCodeLabel?: string;
  className?: string;
  /** Tighter 44px controls for tall auth frames (signup). */
  compact?: boolean;
};

const COUNTRY_CODES = [{ value: "+974", label: "+974" }] as const;

/**
 * Split phone field: country code (90px) + number input.
 */
export function AuthPhoneInput({
  countryCode,
  onCountryCodeChange,
  phoneProps,
  countryCodeLabel = "Country code",
  className,
  compact = false,
}: AuthPhoneInputProps) {
  const { className: phoneClassName, ...restPhoneProps } = phoneProps ?? {};
  /* compact stays 44px; default matches AuthInput (44 → 52 from sm+) */
  const controlHeight = compact ? "h-11" : "h-11 sm:h-[52px]";

  return (
    <div className={cn("flex w-full items-start gap-2 sm:gap-3", className)}>
      <div className="relative w-[80px] shrink-0 sm:w-[90px]">
        <select
          aria-label={countryCodeLabel}
          value={countryCode}
          onChange={(event) => onCountryCodeChange(event.target.value)}
          className={cn(
            controlHeight,
            "w-full appearance-none rounded-xl border border-neutral-300 bg-white pe-7 ps-2.5 text-sm text-neutral-800 outline-none focus-visible:border-brand-700 sm:pe-8 sm:ps-3",
          )}
        >
          {COUNTRY_CODES.map((code) => (
            <option key={code.value} value={code.value}>
              {code.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-brand-800"
          aria-hidden
        />
      </div>
      <AuthInput
        className={cn("flex-1", controlHeight, phoneClassName)}
        inputMode="tel"
        {...restPhoneProps}
      />
    </div>
  );
}
