import { cn } from "@/lib/utils";

type AuthTitleProps = {
  children: React.ReactNode;
  className?: string;
  /** Optional subtitle under the title */
  description?: React.ReactNode;
};

/**
 * Auth frame title block (locale switcher lives in AuthHeader).
 */
export function AuthTitle({ children, className, description }: AuthTitleProps) {
  return (
    <div className={cn("flex w-full flex-col items-start gap-1.5 self-stretch sm:gap-2", className)}>
      <h1 className="text-lg font-semibold leading-[1.3] text-balance text-neutral-800 sm:text-xl">
        {children}
      </h1>
      {description ? (
        <p className="text-sm leading-[1.3] text-pretty text-neutral-400">{description}</p>
      ) : null}
    </div>
  );
}
