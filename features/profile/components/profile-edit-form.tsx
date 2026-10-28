"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, FileIcon, PencilIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { CloudUploadIcon } from "@/components/icons/cloud-upload-icon";
import { cn } from "@/lib/utils";
import type { ProfileData } from "@/features/profile/types";

const EDIT_TABS = ["editProfile", "about", "media"] as const;
type EditTab = (typeof EDIT_TABS)[number];

const COUNTRY_CODES = [{ value: "+974", label: "+974" }] as const;

type ProfileEditFormProps = {
  profile: ProfileData;
  onCancel: () => void;
  onSave: (profile: ProfileData) => void;
  className?: string;
};

type FormState = {
  name: string;
  country: string;
  email: string;
  city: string;
  contactCountryCode: string;
  contactPhone: string;
  address: string;
  whatsappCountryCode: string;
  whatsappPhone: string;
  about: string;
};

/**
 * Edit profile form (Figma Group 367):
 * Tabs Edit Profile / About / Media, avatar, fields, Update CTA.
 */
export function ProfileEditForm({
  profile,
  onCancel,
  onSave,
  className,
}: ProfileEditFormProps) {
  const t = useTranslations("profile.edit");
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<EditTab>("editProfile");
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    profile.avatarUrl ?? null,
  );
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(profile),
  );

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoPreview(URL.createObjectURL(file));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const locationParts = [form.city.trim(), form.country.trim()].filter(
      Boolean,
    );

    onSave({
      ...profile,
      name: form.name.trim() || profile.name,
      location: locationParts.length
        ? locationParts.join(", ")
        : profile.location,
      avatarUrl: photoPreview ?? profile.avatarUrl,
      about: form.about,
      contacts: {
        ...profile.contacts,
        phone: joinPhone(form.contactCountryCode, form.contactPhone),
        whatsapp: joinPhone(form.whatsappCountryCode, form.whatsappPhone),
        chat: form.email
          ? `mailto:${form.email.trim()}`
          : profile.contacts.chat,
      },
    });
  }

  const countryOptions = [
    { value: "Qatar", label: t("countries.qatar") },
    { value: "UAE", label: t("countries.uae") },
    { value: "Saudi Arabia", label: t("countries.saudiArabia") },
    { value: "Kuwait", label: t("countries.kuwait") },
  ];

  const cityOptions = [
    { value: "Doha", label: t("cities.doha") },
    { value: "Lusail", label: t("cities.lusail") },
    { value: "Al Wakrah", label: t("cities.alWakrah") },
    { value: "Al Khor", label: t("cities.alKhor") },
  ];

  return (
    <div className={cn("flex w-full max-w-[980px] flex-col gap-4", className)}>
      <div className="flex w-full justify-start">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-brand-700 underline underline-offset-2 transition-opacity hover:opacity-80"
        >
          {t("back")}
        </button>
      </div>

      <section className="flex min-h-[717px] w-full flex-col rounded-[25px] bg-white px-[30px] pb-8 pt-9">
        <div className="relative mb-14 w-full">
          <div className="flex items-center gap-[72px] pb-[10px]">
            {EDIT_TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "relative text-base font-medium leading-[19px] text-brand-700 transition-opacity",
                    active ? "opacity-100" : "opacity-50 hover:opacity-75",
                  )}
                >
                  {t(`tabs.${tab}`)}
                  {active ? (
                    <span
                      aria-hidden
                      className="absolute -bottom-[10px] start-1/2 h-[3px] w-[114px] -translate-x-1/2 rounded-t-[10px] bg-brand-700"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
          <div className="h-px w-full bg-[#F4F5F7]" />
        </div>

        <form className="flex flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <AvatarPhoto
              photoPreview={photoPreview}
              initials={initialsFrom(form.name)}
              photoInputRef={photoInputRef}
              changePhotoLabel={t("changePhoto")}
              onPhotoChange={handlePhotoChange}
              onPickPhoto={() => photoInputRef.current?.click()}
            />

            {activeTab === "editProfile" ? (
              <div className="grid w-full max-w-[684px] flex-1 grid-cols-1 gap-x-[30px] gap-y-6 sm:grid-cols-2">
                <Field
                  label={t("fields.agencyName")}
                  value={form.name}
                  onChange={(v) => update("name", v)}
                  placeholder={t("placeholder")}
                />
                <SelectField
                  label={t("fields.country")}
                  value={form.country}
                  onChange={(v) => update("country", v)}
                  options={countryOptions}
                  placeholder={t("placeholder")}
                />
                <Field
                  label={t("fields.email")}
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  placeholder={t("placeholder")}
                  type="email"
                />
                <SelectField
                  label={t("fields.city")}
                  value={form.city}
                  onChange={(v) => update("city", v)}
                  options={cityOptions}
                  placeholder={t("placeholder")}
                />
                <PhoneField
                  label={t("fields.contactNumber")}
                  countryCode={form.contactCountryCode}
                  onCountryCodeChange={(v) => update("contactCountryCode", v)}
                  phone={form.contactPhone}
                  onPhoneChange={(v) => update("contactPhone", v)}
                  countryCodeLabel={t("fields.countryCode")}
                  placeholder={t("phonePlaceholder")}
                />
                <Field
                  label={t("fields.address")}
                  value={form.address}
                  onChange={(v) => update("address", v)}
                  placeholder={t("placeholder")}
                />
                <PhoneField
                  label={t("fields.whatsappNumber")}
                  countryCode={form.whatsappCountryCode}
                  onCountryCodeChange={(v) => update("whatsappCountryCode", v)}
                  phone={form.whatsappPhone}
                  onPhoneChange={(v) => update("whatsappPhone", v)}
                  countryCodeLabel={t("fields.countryCode")}
                  placeholder={t("phonePlaceholder")}
                />
              </div>
            ) : activeTab === "about" ? (
              <div className="flex w-full max-w-[684px] flex-1 flex-col gap-1">
                <label className="flex w-full flex-col gap-1">
                  <span className="text-sm font-semibold leading-[18px] text-neutral-800">
                    {t("fields.about")}
                  </span>
                  <textarea
                    value={form.about}
                    onChange={(event) => update("about", event.target.value)}
                    placeholder={t("placeholder")}
                    rows={10}
                    className="min-h-[240px] w-full resize-y rounded-xl border border-brand-700 bg-white px-4 py-3 text-sm leading-[18px] text-neutral-800 outline-none placeholder:text-neutral-400"
                  />
                </label>
              </div>
            ) : (
              <MediaPhotosUpload
                files={mediaFiles}
                onChange={setMediaFiles}
                title={t("fields.addPhotos")}
                uploadHint={t("uploadHint")}
                removeLabel={t("removePhoto")}
              />
            )}
          </div>

          <div className="mt-auto flex justify-end pt-10">
            <button
              type="submit"
              className="inline-flex h-[52px] w-[300px] items-center justify-center rounded-[15px] bg-brand-600 text-lg font-medium leading-[22px] text-white transition-opacity hover:opacity-90"
            >
              {t("update")}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function buildInitialForm(profile: ProfileData): FormState {
  const contact = splitPhone(profile.contacts.phone);
  const whatsapp = splitPhone(profile.contacts.whatsapp);
  const email = profile.contacts.chat?.replace(/^mailto:/i, "") ?? "";
  const { city, country } = splitLocation(profile.location);

  return {
    name: profile.name,
    country,
    email,
    city,
    contactCountryCode: contact.code,
    contactPhone: contact.number,
    address: "",
    whatsappCountryCode: whatsapp.code,
    whatsappPhone: whatsapp.number,
    about: profile.about,
  };
}

function splitLocation(location: string) {
  const [cityPart, ...rest] = location.split(",").map((part) => part.trim());
  return {
    city: cityPart || "Doha",
    country: rest.join(", ") || "Qatar",
  };
}

function splitPhone(value?: string): { code: string; number: string } {
  if (!value) return { code: "+974", number: "" };
  const match = value.match(/^(\+\d{1,4})(.*)$/);
  if (!match?.[1]) return { code: "+974", number: value.replace(/\D/g, "") };
  return {
    code: match[1],
    number: (match[2] ?? "").replace(/\D/g, ""),
  };
}

function joinPhone(code: string, number: string) {
  const digits = number.replace(/\D/g, "");
  return digits ? `${code}${digits}` : undefined;
}

function initialsFrom(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function AvatarPhoto({
  photoPreview,
  initials,
  photoInputRef,
  changePhotoLabel,
  onPhotoChange,
  onPickPhoto,
}: {
  photoPreview: string | null;
  initials: string;
  photoInputRef: React.RefObject<HTMLInputElement | null>;
  changePhotoLabel: string;
  onPhotoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPickPhoto: () => void;
}) {
  return (
    <div className="relative size-[130px] shrink-0">
      <div className="size-full overflow-hidden rounded-full bg-[#C4C4C4] shadow-[0px_4px_15px_rgba(0,0,0,0.05)]">
        {photoPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoPreview}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-2xl font-semibold text-brand-800">
            {initials}
          </span>
        )}
      </div>
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={onPhotoChange}
      />
      <button
        type="button"
        aria-label={changePhotoLabel}
        onClick={onPickPhoto}
        className="absolute bottom-1 end-0 flex size-[30px] items-center justify-center rounded-full bg-brand-700 text-white shadow-sm transition-opacity hover:opacity-90"
      >
        <PencilIcon className="size-[15px]" strokeWidth={2} />
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="flex w-full max-w-[327px] flex-col gap-1">
      <span className="text-sm font-semibold leading-[18px] text-neutral-800">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-[52px] w-full rounded-xl border border-brand-700 bg-white px-4 text-sm leading-[18px] text-neutral-800 outline-none placeholder:text-neutral-400"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[] | { value: string; label: string }[];
  placeholder: string;
}) {
  const normalized = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );

  return (
    <label className="relative flex w-full max-w-[327px] flex-col gap-1">
      <span className="text-sm font-semibold leading-[18px] text-neutral-800">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[52px] w-full appearance-none rounded-xl border border-brand-700 bg-white pe-10 ps-4 text-sm leading-[18px] text-neutral-800 outline-none"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {normalized.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        className="pointer-events-none absolute end-4 top-[38px] size-6 text-brand-800"
        strokeWidth={1.5}
      />
    </label>
  );
}

function PhoneField({
  label,
  countryCode,
  onCountryCodeChange,
  phone,
  onPhoneChange,
  countryCodeLabel,
  placeholder,
}: {
  label: string;
  countryCode: string;
  onCountryCodeChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  countryCodeLabel: string;
  placeholder: string;
}) {
  return (
    <div className="flex w-full max-w-[329px] flex-col gap-1">
      <span className="text-sm font-semibold leading-[18px] text-neutral-800">
        {label}
      </span>
      <div className="flex items-start gap-3">
        <div className="relative w-[90px] shrink-0">
          <select
            aria-label={countryCodeLabel}
            value={countryCode}
            onChange={(event) => onCountryCodeChange(event.target.value)}
            className="h-[52px] w-full appearance-none rounded-xl border border-brand-700 bg-white pe-8 ps-3 text-sm leading-[18px] text-neutral-800 outline-none"
          >
            {COUNTRY_CODES.map((code) => (
              <option key={code.value} value={code.value}>
                {code.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            className="pointer-events-none absolute end-2 top-1/2 size-6 -translate-y-1/2 text-brand-800"
            strokeWidth={1.5}
          />
        </div>
        <input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(event) => onPhoneChange(event.target.value)}
          placeholder={placeholder}
          className="h-[52px] w-[225px] flex-1 rounded-xl border border-brand-700 bg-white px-4 text-sm leading-[18px] text-neutral-800 outline-none placeholder:text-neutral-400"
        />
      </div>
    </div>
  );
}

function MediaPhotosUpload({
  files,
  onChange,
  title,
  uploadHint,
  removeLabel,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  title: string;
  uploadHint: string;
  removeLabel: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const images = Array.from(list).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (!images.length) return;
    onChange([...files, ...images]);
  }

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="flex w-full max-w-[680px] flex-1 flex-col gap-4">
      <h3 className="text-base font-semibold leading-6 text-neutral-800">
        {title}
      </h3>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          addFiles(event.dataTransfer.files);
        }}
        className="flex h-[139px] w-full flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-neutral-300 bg-white transition-colors hover:border-brand-700 focus-visible:border-brand-700 focus-visible:outline-none"
      >
        <CloudUploadIcon size={60} className="text-brand-700" />
        <span className="text-xs font-normal leading-[18px] text-neutral-400">
          {uploadHint}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {files.length > 0 ? (
        <ul className="flex w-full flex-col gap-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.lastModified}-${index}`}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800"
            >
              <FileIcon className="size-4 shrink-0 text-brand-700" />
              <span className="min-w-0 flex-1 truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-neutral-400 hover:text-neutral-800"
                aria-label={removeLabel}
              >
                <XIcon className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

