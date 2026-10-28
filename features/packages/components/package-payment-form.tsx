"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { AuthField } from "@/components/forms/auth-field";
import { AuthInput } from "@/components/forms/auth-input";
import { PackageCreditCardPreview } from "@/features/packages/components/package-credit-card-preview";
import type { PackageCardData, PackagePaymentCard } from "@/features/packages/types";
import { cn } from "@/lib/utils";

type PaymentFormState = PackagePaymentCard;

type PackagePaymentFormProps = {
  package: PackageCardData;
  initialValues?: PackagePaymentCard;
  onBack: () => void;
  onSubmit?: (values: PackagePaymentCard) => void;
  className?: string;
};

const shellMinHeight =
  "min-h-[calc(100dvh-4rem-4.5rem)] sm:min-h-[calc(100dvh-5rem-4.5rem)] lg:min-h-[calc(100dvh-100px-4.5rem)]";

/**
 * Package checkout (Figma Frame 1000003282):
 * Card details form + live credit card preview + Add Card CTA.
 * Stacked on mobile/tablet; side-by-side from lg.
 */
export function PackagePaymentForm({
  package: _pkg,
  initialValues,
  onBack,
  onSubmit,
  className,
}: PackagePaymentFormProps) {
  const t = useTranslations("packages.checkout");
  const isUpdate = Boolean(initialValues);
  const [form, setForm] = useState<PaymentFormState>(
    initialValues ?? {
      name: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  );

  function update<K extends keyof PaymentFormState>(
    key: K,
    value: PaymentFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCardNumberChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    update("cardNumber", digits);
  }

  function handleExpiryChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) {
      update("expiry", digits);
      return;
    }

    update("expiry", `${digits.slice(0, 2)}/${digits.slice(2)}`);
  }

  function handleCvvChange(value: string) {
    update("cvv", value.replace(/\D/g, "").slice(0, 4));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit?.(form);
  }

  return (
    <div className={cn("flex w-full max-w-[980px] flex-col", shellMinHeight, className)}>
      <div className="flex w-full justify-start">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-brand-700 underline underline-offset-2 transition-opacity hover:opacity-80"
        >
          {t("back")}
        </button>
      </div>

      <form
        className="mt-4 flex min-h-0 flex-1 flex-col gap-8 sm:mt-6 sm:gap-10 lg:flex-row lg:items-stretch lg:gap-[86px]"
        onSubmit={handleSubmit}
      >
        <div className="flex w-full max-w-[448px] flex-col gap-4 lg:shrink-0">
          <h2 className="text-base font-semibold leading-6 text-neutral-800">
            {t("cardDetails")}
          </h2>

          <AuthField label={t("fields.name")} htmlFor="package-card-name">
            <AuthInput
              id="package-card-name"
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder={t("placeholder")}
              autoComplete="cc-name"
              className="w-full max-w-[327px]"
            />
          </AuthField>

          <AuthField label={t("fields.cardNumber")} htmlFor="package-card-number">
            <AuthInput
              id="package-card-number"
              value={formatCardNumberDisplay(form.cardNumber)}
              onChange={(event) => handleCardNumberChange(event.target.value)}
              placeholder={t("placeholder")}
              inputMode="numeric"
              autoComplete="cc-number"
              className="w-full max-w-[327px]"
            />
          </AuthField>

          <div className="flex w-full max-w-[327px] gap-3 sm:gap-4">
            <AuthField
              label={t("fields.expiry")}
              htmlFor="package-card-expiry"
              className="min-w-0 flex-1"
            >
              <AuthInput
                id="package-card-expiry"
                value={form.expiry}
                onChange={(event) => handleExpiryChange(event.target.value)}
                placeholder={t("expiryPlaceholder")}
                inputMode="numeric"
                autoComplete="cc-exp"
              />
            </AuthField>

            <AuthField
              label={t("fields.cvv")}
              htmlFor="package-card-cvv"
              className="min-w-0 flex-1"
            >
              <AuthInput
                id="package-card-cvv"
                value={form.cvv}
                onChange={(event) => handleCvvChange(event.target.value)}
                placeholder={t("placeholder")}
                inputMode="numeric"
                autoComplete="cc-csc"
              />
            </AuthField>
          </div>
        </div>

        <div className="flex w-full max-w-[399px] flex-1 flex-col lg:ms-auto">
          <PackageCreditCardPreview
            cardholderName={form.name}
            cardNumber={form.cardNumber}
            expiry={form.expiry}
            className="mx-auto w-full max-w-none shrink-0 lg:mx-0"
          />

          <div className="mt-8 flex w-full justify-stretch pt-0 sm:mt-auto sm:justify-end sm:pt-10">
            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center rounded-[15px] bg-brand-600 text-base font-medium leading-[22px] text-white transition-opacity hover:opacity-90 sm:h-[52px] sm:w-[300px] sm:text-lg"
            >
              {isUpdate ? t("updateCard") : t("addCard")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function formatCardNumberDisplay(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}
