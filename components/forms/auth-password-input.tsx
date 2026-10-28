"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { AuthInput } from "@/components/forms/auth-input";
import { cn } from "@/lib/utils";

type AuthPasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  toggleLabelShow?: string;
  toggleLabelHide?: string;
};

export function AuthPasswordInput({
  className,
  toggleLabelShow = "Show password",
  toggleLabelHide = "Hide password",
  ...props
}: AuthPasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-full">
      <AuthInput
        type={visible ? "text" : "password"}
        className={cn("pe-12", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        className="absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-800"
        aria-label={visible ? toggleLabelHide : toggleLabelShow}
      >
        {visible ? <EyeIcon className="size-5" /> : <EyeOffIcon className="size-5" />}
      </button>
    </div>
  );
}
