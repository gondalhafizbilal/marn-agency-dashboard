"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon, PhoneIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import {
  AuthField,
  AuthInput,
  AuthOtpInput,
  AuthPasswordInput,
  AuthTitle,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
  newPasswordSchema,
  type NewPasswordFormValues,
  type ResetMethod,
} from "@/features/authentication/schemas";
import { useRouter } from "@/i18n/navigation";
import { AgencyAuthRepository, isAppApiError } from "@/services";

import { ContactMethodOption } from "./contact-method-option";
import { PasswordSuccessIcon } from "./password-success-icon";

type ForgotPasswordStep = "method" | "otp" | "password" | "success";

const primaryCtaClassName =
  "h-11 w-full rounded-lg bg-primary text-base font-normal text-primary-foreground hover:bg-brand-700 sm:h-[52px] sm:text-lg";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [step, setStep] = useState<ForgotPasswordStep>("method");
  const [method, setMethod] = useState<ResetMethod>("email");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordForm = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function goToOtp() {
    if (!identifier.trim()) {
      setOtpError("Enter your registered email address or phone number.");
      return;
    }
    setIsSubmitting(true);
    try {
      await AgencyAuthRepository.forgotPassword(
        method === "email"
          ? { emailAddress: identifier.trim() }
          : { phoneNumber: identifier.trim() },
      );
      setOtp("");
      setOtpError(null);
      setStep("otp");
    } catch (error) {
      setOtpError(isAppApiError(error) ? error.message : "Unable to send a verification code.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyOtp(code: string) {
    if (code.length !== 4) {
      setOtpError(t("otpRequired"));
      return;
    }
    setOtpError(null);
    setIsSubmitting(true);
    try {
      const response = await AgencyAuthRepository.verifyResetOtp(identifier.trim(), code);
      setResetToken(response.resetToken);
      setStep("password");
    } catch (error) {
      setOtpError(isAppApiError(error) ? error.message : "Invalid verification code.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordSubmit(values: NewPasswordFormValues) {
    setIsSubmitting(true);
    try {
      await AgencyAuthRepository.resetPassword(resetToken, values.password);
      setStep("success");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "method") {
    return (
      <div className="flex w-full flex-col items-center gap-6 sm:gap-8">
        <AuthTitle description={t("forgotPasswordSelectDescription")}>
          {t("forgotPasswordTitle")}
        </AuthTitle>

        <div className="flex w-full flex-col gap-3 sm:gap-4">
          <ContactMethodOption
            selected={method === "whatsapp"}
            onSelect={() => setMethod("whatsapp")}
            label={t("viaWhatsapp")}
            value="Use your registered phone number"
            icon={<PhoneIcon className="size-5 text-primary sm:size-6" strokeWidth={1.5} />}
          />
          <ContactMethodOption
            selected={method === "email"}
            onSelect={() => setMethod("email")}
            label={t("viaEmail")}
            value="Use your registered email address"
            icon={<MailIcon className="size-5 text-primary sm:size-6" strokeWidth={1.5} />}
          />
          <AuthField
            label={method === "email" ? "Email address" : "Phone number"}
            htmlFor="reset-identifier"
          >
            <AuthInput
              id="reset-identifier"
              type={method === "email" ? "email" : "tel"}
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              autoComplete={method === "email" ? "email" : "tel"}
            />
          </AuthField>
          {otpError ? <p className="text-xs text-destructive">{otpError}</p> : null}
        </div>

        <Button
          type="button"
          disabled={isSubmitting}
          onClick={goToOtp}
          className={primaryCtaClassName}
        >
          {isSubmitting ? t("sendingCode") : t("continue")}
        </Button>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="flex w-full flex-col items-center gap-8 sm:gap-12">
        <AuthTitle description={method === "whatsapp" ? t("otpSentWhatsapp") : t("otpSentEmail")}>
          {t("enterVerificationCode")}
        </AuthTitle>

        <div className="flex w-full flex-col items-center gap-8 sm:gap-12">
          <div className="w-full">
            <AuthOtpInput
              value={otp}
              onChange={(value) => {
                setOtp(value);
                setOtpError(null);
                if (value.length === 4) {
                  void verifyOtp(value);
                }
              }}
            />
            {otpError ? (
              <p className="mt-2 text-center text-xs text-destructive">{otpError}</p>
            ) : null}
          </div>

          <div className="flex flex-col items-center gap-1">
            <p className="text-sm text-neutral-800">{t("didNotReceiveCode")}</p>
            <button
              type="button"
              onClick={() => {
                setOtp("");
                setOtpError(null);
              }}
              className="text-sm text-error-400 transition-opacity hover:opacity-80"
            >
              {t("resendCode")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "password") {
    return (
      <form
        onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
        className="flex w-full flex-col items-start gap-6 sm:gap-8"
        noValidate
      >
        <AuthTitle description={t("createNewPasswordDescription")}>
          {t("createNewPassword")}
        </AuthTitle>

        <div className="flex w-full flex-col gap-3 sm:gap-4">
          <AuthField
            label={t("newPassword")}
            htmlFor="new-password"
            error={passwordForm.formState.errors.password?.message}
          >
            <AuthPasswordInput
              id="new-password"
              autoComplete="new-password"
              placeholder={t("passwordPlaceholder")}
              toggleLabelShow={t("showPassword")}
              toggleLabelHide={t("hidePassword")}
              aria-invalid={Boolean(passwordForm.formState.errors.password)}
              {...passwordForm.register("password")}
            />
          </AuthField>

          <AuthField
            label={t("confirmPassword")}
            htmlFor="confirm-password"
            error={passwordForm.formState.errors.confirmPassword?.message}
          >
            <AuthPasswordInput
              id="confirm-password"
              autoComplete="new-password"
              placeholder={t("passwordPlaceholder")}
              toggleLabelShow={t("showPassword")}
              toggleLabelHide={t("hidePassword")}
              aria-invalid={Boolean(passwordForm.formState.errors.confirmPassword)}
              {...passwordForm.register("confirmPassword")}
            />
          </AuthField>
        </div>

        <Button type="submit" disabled={isSubmitting} className={primaryCtaClassName}>
          {isSubmitting ? t("savingPassword") : t("savePassword")}
        </Button>
      </form>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-8 sm:gap-[42px]">
      <PasswordSuccessIcon />

      <div className="flex w-full max-w-[290px] flex-col items-center gap-3 text-center sm:gap-4">
        <h1 className="text-lg font-semibold leading-[1.3] text-balance text-neutral-800 sm:text-xl">
          {t("passwordSuccessTitle")}
        </h1>
        <p className="text-sm leading-[1.3] text-pretty text-neutral-400">
          {t("passwordSuccessDescription")}
        </p>
      </div>

      <Button
        type="button"
        onClick={() => router.push("/login")}
        className={`${primaryCtaClassName} shadow-[0px_8px_8px_-4px_rgba(161,29,58,0.03),0px_20px_24px_-4px_rgba(161,29,58,0.08)]`}
      >
        {t("logInAgain")}
      </Button>
    </div>
  );
}
