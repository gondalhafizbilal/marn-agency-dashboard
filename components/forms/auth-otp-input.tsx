"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";

type AuthOtpInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

/**
 * OTP boxes matching Figma (60×60 on md+; scaled down on mobile/tablet).
 */
export function AuthOtpInput({
  length = 4,
  value,
  onChange,
  className,
}: AuthOtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(length, " ").slice(0, length).split("");

  function updateDigit(index: number, next: string) {
    const char = next.replace(/\D/g, "").slice(-1);
    const nextDigits = digits.map((digit, i) =>
      i === index ? (char || " ") : digit === " " ? " " : digit,
    );
    const joined = nextDigits.join("").replace(/ /g, "");
    onChange(joined);

    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  }

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-2 sm:gap-3 md:gap-[13px]",
        className,
      )}
    >
      {Array.from({ length }).map((_, index) => {
        const digit = digits[index]?.trim() ?? "";
        const isActive = value.length === index;

        return (
          <input
            key={index}
            ref={(node) => {
              inputsRef.current[index] = node;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            aria-label={`Digit ${index + 1}`}
            onChange={(event) => updateDigit(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            className={cn(
              "size-12 shrink-0 rounded-lg border bg-white text-center text-lg font-bold text-black outline-none transition-colors sm:size-14 sm:text-xl md:size-[60px]",
              isActive ? "border-primary" : "border-neutral-300",
              "focus-visible:border-primary",
            )}
          />
        );
      })}
    </div>
  );
}
