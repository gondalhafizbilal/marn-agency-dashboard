import { cn } from "@/lib/utils";

/**
 * Auth-styled text input matching Figma:
 * 44px on mobile, 52px from sm+, radius 12px, white fill, neutral border.
 */
export function AuthInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="auth-input"
      className={cn(
        "h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm text-neutral-800 outline-none transition-colors sm:h-[52px] sm:px-4",
        "placeholder:text-neutral-400",
        "focus-visible:border-brand-700",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}
