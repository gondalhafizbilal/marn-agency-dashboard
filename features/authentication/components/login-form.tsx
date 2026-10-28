"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  AuthField,
  AuthInput,
  AuthPasswordInput,
  AuthPhoneInput,
  AuthTitle,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useRouter } from "@/i18n/navigation";
import { loginSchema, type LoginFormValues } from "@/features/authentication/schemas";
import { AgencyAuthRepository, isAppApiError } from "@/services";
import { useAuthStore } from "@/store";

const DEFAULT_VALUES: LoginFormValues = {
  countryCode: "+974",
  phone: "",
  email: "",
  password: "",
  rememberMe: true,
};

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const countryCode = watch("countryCode");

  function saveSession(response: Awaited<ReturnType<typeof AgencyAuthRepository.login>>) {
    const nameParts = response.agency.agency_name.trim().split(/\s+/);
    setSession({
      user: {
        id: response.agency.uuid,
        email: response.agency.emailAddress,
        firstName: nameParts[0] ?? response.agency.agency_name,
        lastName: nameParts.slice(1).join(" "),
        role: response.agency.role,
        agencyId: response.agency.uuid,
        avatarUrl: response.agency.logo_url ?? undefined,
      },
      accessToken: response.accessToken,
      refreshToken: response.refreshToken ?? response.accessToken,
    });
  }

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    try {
      const response = await AgencyAuthRepository.login({
        emailAddress: values.email.trim(),
        password: values.password,
      });

      saveSession(response);

      toast.success("Signed in successfully");
      router.replace("/dashboard");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function loginWithOtp() {
    const identifier = window.prompt("Enter your Agency email address or phone number.");
    if (!identifier) return;
    setIsSubmitting(true);
    try {
      await AgencyAuthRepository.sendOtp(identifier.trim());
      const otp = window.prompt("Enter the OTP sent to your email or phone.");
      if (!otp) return;
      const response = await AgencyAuthRepository.verifyOtp(identifier.trim(), otp.trim());
      saveSession(response);
      toast.success("Signed in successfully");
      router.replace("/dashboard");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to sign in with OTP.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col items-center gap-5 sm:gap-6"
      noValidate
    >
      <AuthTitle description={t("signInDescription")}>{t("welcomeBack")}</AuthTitle>

      <div className="flex w-full flex-col gap-3 sm:gap-4">
        <AuthField label={t("contactNumber")} htmlFor="phone" error={errors.phone?.message}>
          <AuthPhoneInput
            countryCode={countryCode}
            onCountryCodeChange={(value) => setValue("countryCode", value)}
            countryCodeLabel={t("countryCode")}
            phoneProps={{
              id: "phone",
              placeholder: t("phonePlaceholder"),
              "aria-invalid": Boolean(errors.phone),
              ...register("phone"),
            }}
          />
        </AuthField>

        <AuthField label={t("email")} htmlFor="email" error={errors.email?.message}>
          <AuthInput
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </AuthField>

        <AuthField label={t("password")} htmlFor="password" error={errors.password?.message}>
          <AuthPasswordInput
            id="password"
            autoComplete="current-password"
            placeholder={t("passwordPlaceholder")}
            aria-invalid={Boolean(errors.password)}
            toggleLabelShow={t("showPassword")}
            toggleLabelHide={t("hidePassword")}
            {...register("password")}
          />
        </AuthField>

        <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <label className="flex cursor-pointer items-center gap-2">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  className="size-4 rounded-[4px] border-brand-700 data-checked:border-brand-700 data-checked:bg-brand-700"
                />
              )}
            />
            <span className="text-sm text-neutral-800">{t("rememberMe")}</span>
          </label>

          <Link
            href="/forgot-password"
            className="shrink-0 text-sm text-primary transition-opacity hover:opacity-80"
          >
            {t("forgotPasswordLink")}
          </Link>
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-4 sm:gap-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-lg bg-primary text-base font-normal text-primary-foreground shadow-[0px_8px_8px_-4px_rgba(0,136,255,0.03),0px_20px_24px_-4px_rgba(0,136,255,0.08)] hover:bg-brand-700 sm:h-[52px] sm:text-lg"
        >
          {isSubmitting ? t("signingIn") : t("signIn")}
        </Button>

        <button type="button" onClick={() => void loginWithOtp()} disabled={isSubmitting} className="text-sm font-medium text-primary hover:underline">
          Sign in with OTP
        </button>

        <p className="text-center text-sm text-neutral-800">
          {t("noAccount")}{" "}
          <Link href="/signup" className="font-semibold text-primary hover:opacity-80">
            {t("signUp")}
          </Link>
        </p>
      </div>
    </form>
  );
}
