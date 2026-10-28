import { cn } from "@/lib/utils";

type AuthFieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

export function AuthField({ label, htmlFor, error, children, className }: AuthFieldProps) {
  return (
    <div className={cn("flex w-full flex-col items-start gap-1", className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-semibold leading-[1.3] text-neutral-800"
      >
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
