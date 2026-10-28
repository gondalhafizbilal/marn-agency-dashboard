"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import {
  AuthField,
  AuthFileUpload,
  AuthPasswordInput,
  AuthPhoneInput,
  AuthSelect,
  AuthInput,
  AuthTitle,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { signupSchema, type SignupFormValues } from "@/features/authentication/schemas";
import { Link } from "@/i18n/navigation";
import { AgencyAuthRepository, isAppApiError } from "@/services";

const DEFAULT_VALUES: SignupFormValues = {
  agencyName: "",
  agencyType: "",
  email: "",
  countryCode: "+974",
  phone: "",
  password: "",
  acceptTerms: false,
};

export function SignupForm() {
  const t = useTranslations("auth");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const countryCode = watch("countryCode");
  const agencyType = watch("agencyType");

  const agencyTypeOptions = [
    { value: "hajj_umrah", label: t("agencyTypeTravel") },
    { value: "housemaid", label: t("agencyTypeRecruitment") },
    { value: "services", label: t("agencyTypeServices") },
    { value: "car_services", label: t("agencyTypeOther") },
  ];

  async function onSubmit(values: SignupFormValues) {
    console.log("documentsdocumentsdocuments", documents);
    
    if (documents.length < 3) {
      setDocumentsError(t("documentsRequired"));
      return;
    }
    setDocumentsError(null);
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const registration = await AgencyAuthRepository.register({
        agencyName: values.agencyName.trim(),
        emailAddress: values.email.trim(),
        countryCode: values.countryCode,
        phoneNumber: values.phone.trim(),
        password: values.password,
        agencyType: values.agencyType as "housemaid" | "hajj_umrah" | "services" | "car_services",
        termsAccepted: values.acceptTerms,
      });

      await AgencyAuthRepository.uploadDocuments(registration.registrationToken, documents);
      setRegistrationComplete(true);
    } catch (error) {
      setSubmitError(
        isAppApiError(error) ? error.message : "Unable to complete registration. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (registrationComplete) {
    return (
      <div className="flex w-full flex-col items-center gap-6 text-center">
        <AuthTitle description="Your documents were submitted for review.">
          Registration pending approval
        </AuthTitle>
        <p className="text-sm leading-6 text-neutral-700">
          You will be able to sign in once an administrator approves your agency.
        </p>
        <Link href="/login" className="text-sm font-semibold text-primary hover:opacity-80">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col items-center gap-3"
      noValidate
    >
      <AuthTitle>{t("registerAccount")}</AuthTitle>

      <div className="flex w-full flex-col gap-2">
        <AuthField label="Agency name" htmlFor="agency-name" error={errors.agencyName?.message}>
          <AuthInput
            id="agency-name"
            autoComplete="organization"
            aria-invalid={Boolean(errors.agencyName)}
            {...register("agencyName")}
            className="h-11"
          />
        </AuthField>
        <AuthField label={t("agencyType")} htmlFor="agencyType" error={errors.agencyType?.message}>
          <AuthSelect
            id="agencyType"
            value={agencyType}
            onChange={(value) => setValue("agencyType", value, { shouldValidate: true })}
            options={agencyTypeOptions}
            placeholder={t("agencyTypePlaceholder")}
            aria-invalid={Boolean(errors.agencyType)}
            className="h-11"
          />
        </AuthField>

        <AuthField label={t("email")} htmlFor="signup-email" error={errors.email?.message}>
          <AuthInput
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
            className="h-11"
          />
        </AuthField>

        <AuthField label={t("contactNumber")} htmlFor="signup-phone" error={errors.phone?.message}>
          <AuthPhoneInput
            countryCode={countryCode}
            onCountryCodeChange={(value) => setValue("countryCode", value)}
            countryCodeLabel={t("countryCode")}
            compact
            phoneProps={{
              id: "signup-phone",
              placeholder: t("phonePlaceholder"),
              "aria-invalid": Boolean(errors.phone),
              ...register("phone"),
            }}
          />
        </AuthField>

        <AuthField label={t("password")} htmlFor="signup-password" error={errors.password?.message}>
          <AuthPasswordInput
            id="signup-password"
            autoComplete="new-password"
            placeholder={t("passwordPlaceholder")}
            aria-invalid={Boolean(errors.password)}
            toggleLabelShow={t("showPassword")}
            toggleLabelHide={t("hidePassword")}
            {...register("password")}
            className="h-11"
          />
        </AuthField>

        <div className="flex w-full flex-col gap-1.5">
          <p className="text-sm font-semibold leading-5 text-neutral-800">{t("addDocuments")}</p>
          <AuthFileUpload
            files={documents}
            onChange={(files) => {
              setDocuments(files);
              setDocumentsError(null);
            }}
            error={documentsError ?? undefined}
            compact
          />
        </div>

        <label className="flex w-full cursor-pointer items-start gap-2">
          <Controller
            name="acceptTerms"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                className="mt-0.5 size-4 shrink-0 rounded-[4px] border-brand-700 data-checked:border-brand-700 data-checked:bg-brand-700"
              />
            )}
          />
          <span className="text-sm leading-5 text-pretty text-neutral-800">{t("agreeTerms")}</span>
        </label>
        {errors.acceptTerms ? (
          <p className="-mt-1 text-xs text-destructive">{errors.acceptTerms.message}</p>
        ) : null}
        {submitError ? <p className="text-xs text-destructive">{submitError}</p> : null}
      </div>

      <div className="flex w-full flex-col items-center gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-lg bg-primary text-base font-normal text-primary-foreground shadow-[0px_8px_8px_-4px_rgba(0,136,255,0.03),0px_20px_24px_-4px_rgba(0,136,255,0.08)] hover:bg-brand-700"
        >
          {isSubmitting ? t("registering") : t("signUp")}
        </Button>

        <p className="text-center text-sm text-neutral-800">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="font-semibold text-primary hover:opacity-80">
            {t("signIn")}
          </Link>
        </p>
      </div>
    </form>
  );
}
