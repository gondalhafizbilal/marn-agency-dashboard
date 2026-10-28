"use client";

import { cn } from "@/lib/utils";

type SettingsToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
};

/**
 * Settings toggle (Figma Group 269–271):
 * 56×31 track, 27px thumb — ON #540113, OFF #DFEAF2.
 */
export function SettingsToggle({
  checked,
  onChange,
  label,
  className,
}: SettingsToggleProps) {
  return (
    <div className={cn("flex items-center gap-5", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-[31px] w-14 shrink-0 rounded-[25px] transition-colors",
          checked ? "bg-brand-900" : "bg-[#DFEAF2]",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute top-[2px] size-[27px] rounded-full bg-white shadow-[0px_2px_5px_rgba(0,0,0,0.1)] transition-[inset-inline-start]",
            checked ? "start-[29px]" : "start-[2px]",
          )}
        />
      </button>
      <span className="text-base font-normal leading-[19px] text-[#232323]">
        {label}
      </span>
    </div>
  );
}
