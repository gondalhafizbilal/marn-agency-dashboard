"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import type { AdCardData } from "@/features/dashboard/components/ad-card";
import { DEFAULT_AD_DETAILS } from "@/features/dashboard/components/ad-details-panel";

const EDIT_TABS = ["workerInfo", "skills", "pricing"] as const;
type EditTab = (typeof EDIT_TABS)[number];

type AdEditFormProps = {
  ad: AdCardData;
  /** Create uses the same UI with empty fields; Save adds a new listing. */
  mode?: "create" | "edit";
  onCancel: () => void;
  /** Called when advancing Worker Info → Skills → Pricing (draft sync). */
  onNext?: (ad: AdCardData) => void;
  /** Called on Pricing Save (persist + close from parent). */
  onSave?: (ad: AdCardData) => void;
  className?: string;
};

type FormState = {
  fullName: string;
  category: string;
  location: string;
  nationality: string;
  age: string;
  experience: string;
  education: string;
  dateOfBirth: string;
  maritalStatus: string;
  availableUntil: string;
  description: string;
  salary: string;
  salaryPeriod: string;
};

/**
 * Create / edit ad form (Figma Group 367) — Worker Info → Skills → Pricing.
 */
export function AdEditForm({
  ad,
  mode = "edit",
  onCancel,
  onNext,
  onSave,
  className,
}: AdEditFormProps) {
  const t = useTranslations("ads.edit");
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<EditTab>("workerInfo");
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    ad.avatarUrl ?? null,
  );
  const [skillDraft, setSkillDraft] = useState("");
  const [skills, setSkills] = useState<string[]>(() =>
    mode === "create"
      ? []
      : ["Nannies", "Drivers", "Caretakers", "Electrician", "Elderly"],
  );
  const [form, setForm] = useState<FormState>(() =>
    mode === "create"
      ? {
          fullName: "",
          category: "",
          location: "",
          nationality: "",
          age: "",
          experience: "",
          education: "",
          dateOfBirth: "",
          maritalStatus: "",
          availableUntil: "",
          description: "",
          salary: "",
          salaryPeriod: "mon",
        }
      : {
          fullName: ad.name,
          category: ad.role,
          location: ad.location,
          nationality: DEFAULT_AD_DETAILS.nationality,
          age: String(DEFAULT_AD_DETAILS.age),
          experience: DEFAULT_AD_DETAILS.experience,
          education: DEFAULT_AD_DETAILS.education,
          dateOfBirth: "",
          maritalStatus: DEFAULT_AD_DETAILS.maritalStatus,
          availableUntil: "",
          description: DEFAULT_AD_DETAILS.description,
          salary: ad.salary.replace(/[^0-9]/g, "") || "2500",
          salaryPeriod: "mon",
        },
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

  function addSkill() {
    const next = skillDraft.trim();
    if (!next) return;
    setSkills((prev) =>
      prev.some((item) => item.toLowerCase() === next.toLowerCase())
        ? prev
        : [...prev, next],
    );
    setSkillDraft("");
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((item) => item !== skill));
  }

  function buildUpdatedAd(): AdCardData {
    const periodLabel =
      form.salaryPeriod === "mon"
        ? "mon"
        : form.salaryPeriod === "week"
          ? "week"
          : "day";

    return {
      ...ad,
      name: form.fullName,
      role: form.category,
      location: form.location,
      avatarUrl: photoPreview ?? ad.avatarUrl,
      salary: form.salary
        ? `QAR${form.salary}/${periodLabel}`
        : ad.salary || "QAR0/mon",
    };
  }

  function handleNext() {
    const updated = buildUpdatedAd();

    if (activeTab === "workerInfo") {
      onNext?.(updated);
      setActiveTab("skills");
      return;
    }

    if (activeTab === "skills") {
      onNext?.(updated);
      setActiveTab("pricing");
      return;
    }

    onSave?.(updated);
  }

  return (
    <div className={cn("flex w-full max-w-[980px] flex-col gap-6", className)}>
      <div className="flex w-full justify-start">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-brand-700 underline underline-offset-2 transition-opacity hover:opacity-80"
        >
          {t("back")}
        </button>
      </div>

      <section
        className={cn(
          "flex w-full flex-col rounded-[25px] bg-white px-[30px] pb-8 pt-9",
          activeTab === "workerInfo" ? "min-h-[937px]" : "min-h-[717px]",
        )}
      >
        {/* Tabs */}
        <div className="relative mb-14 w-full">
          <div className="flex items-center gap-[60px] pb-[10px]">
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

        {activeTab === "workerInfo" ? (
          <form
            className="flex flex-1 flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              handleNext();
            }}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
              <AvatarPhoto
                photoPreview={photoPreview}
                initials={initialsFrom(form.fullName)}
                photoInputRef={photoInputRef}
                changePhotoLabel={t("changePhoto")}
                onPhotoChange={handlePhotoChange}
                onPickPhoto={() => photoInputRef.current?.click()}
              />

              {/* Fields grid */}
              <div className="grid w-full max-w-[684px] flex-1 grid-cols-1 gap-x-[30px] gap-y-6 sm:grid-cols-2">
                <Field
                  label={t("fields.fullName")}
                  value={form.fullName}
                  onChange={(v) => update("fullName", v)}
                  placeholder={t("placeholder")}
                />
                <SelectField
                  label={t("fields.category")}
                  value={form.category}
                  onChange={(v) => update("category", v)}
                  options={["Housemaid", "Nanny", "Driver", "Cook"]}
                  placeholder={t("placeholder")}
                />
                <Field
                  label={t("fields.location")}
                  value={form.location}
                  onChange={(v) => update("location", v)}
                  placeholder={t("placeholder")}
                />
                <SelectField
                  label={t("fields.nationality")}
                  value={form.nationality}
                  onChange={(v) => update("nationality", v)}
                  options={["Indian", "Filipino", "Nepali", "Indonesian"]}
                  placeholder={t("placeholder")}
                />
                <Field
                  label={t("fields.age")}
                  value={form.age}
                  onChange={(v) => update("age", v)}
                  placeholder={t("placeholder")}
                  inputMode="numeric"
                />
                <Field
                  label={t("fields.experience")}
                  value={form.experience}
                  onChange={(v) => update("experience", v)}
                  placeholder={t("placeholder")}
                />
                <SelectField
                  label={t("fields.education")}
                  value={form.education}
                  onChange={(v) => update("education", v)}
                  options={["High School", "Diploma", "Bachelor", "Master"]}
                  placeholder={t("placeholder")}
                />
                <DateField
                  label={t("fields.dateOfBirth")}
                  value={form.dateOfBirth}
                  onChange={(v) => update("dateOfBirth", v)}
                  placeholder={t("placeholder")}
                />
                <SelectField
                  label={t("fields.maritalStatus")}
                  value={form.maritalStatus}
                  onChange={(v) => update("maritalStatus", v)}
                  options={["Single", "Married", "Divorced", "Widowed"]}
                  placeholder={t("placeholder")}
                />
                <DateField
                  label={t("fields.availableUntil")}
                  value={form.availableUntil}
                  onChange={(v) => update("availableUntil", v)}
                  placeholder={t("placeholder")}
                />

                <div className="sm:col-span-2">
                  <label className="flex w-full flex-col gap-1">
                    <span className="text-sm font-semibold leading-[18px] text-neutral-800">
                      {t("fields.description")}
                    </span>
                    <textarea
                      value={form.description}
                      onChange={(event) =>
                        update("description", event.target.value)
                      }
                      placeholder={t("placeholder")}
                      rows={8}
                      className="min-h-[208px] w-full resize-y rounded-xl border border-brand-700 bg-white px-4 py-3 text-sm leading-[18px] text-neutral-800 outline-none placeholder:text-neutral-400"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-auto flex justify-end pt-10">
              <button
                type="submit"
                className="inline-flex h-[52px] w-[300px] items-center justify-center rounded-[15px] bg-brand-600 text-lg font-medium leading-[22px] text-white transition-opacity hover:opacity-90"
              >
                {t("next")}
              </button>
            </div>
          </form>
        ) : activeTab === "skills" ? (
          <form
            className="flex flex-1 flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              handleNext();
            }}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
              <AvatarPhoto
                photoPreview={photoPreview}
                initials={initialsFrom(form.fullName)}
                photoInputRef={photoInputRef}
                changePhotoLabel={t("changePhoto")}
                onPhotoChange={handlePhotoChange}
                onPickPhoto={() => photoInputRef.current?.click()}
              />

              <div className="flex w-full max-w-[685px] flex-1 flex-col gap-5">
                <label className="flex w-full max-w-[327px] flex-col gap-1">
                  <span className="text-sm font-semibold leading-[18px] text-neutral-800">
                    {t("fields.skill")}
                  </span>
                  <input
                    type="text"
                    value={skillDraft}
                    onChange={(event) => setSkillDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder={t("placeholder")}
                    className="h-[52px] w-full rounded-xl border border-brand-700 bg-white px-4 text-sm leading-[18px] text-neutral-800 outline-none placeholder:text-neutral-400"
                  />
                </label>

                <div className="flex min-h-[208px] w-full flex-wrap content-start gap-2 rounded-xl border border-brand-700 bg-white px-6 py-3">
                  {skills.length === 0 ? (
                    <p className="self-center text-sm text-neutral-400">
                      {t("skillsHint")}
                    </p>
                  ) : (
                    skills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => removeSkill(skill)}
                        title={t("removeSkill")}
                        className="inline-flex h-10 min-w-[121px] items-center justify-center rounded-[6px] bg-brand-25 px-1.5 text-sm leading-[18px] text-brand-700 transition-opacity hover:opacity-80"
                      >
                        {skill}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-auto flex justify-end pt-10">
              <button
                type="submit"
                className="inline-flex h-[52px] w-[300px] items-center justify-center rounded-[15px] bg-brand-600 text-lg font-medium leading-[22px] text-white transition-opacity hover:opacity-90"
              >
                {t("next")}
              </button>
            </div>
          </form>
        ) : activeTab === "pricing" ? (
          <form
            className="flex flex-1 flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              handleNext();
            }}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
              <AvatarPhoto
                photoPreview={photoPreview}
                initials={initialsFrom(form.fullName)}
                photoInputRef={photoInputRef}
                changePhotoLabel={t("changePhoto")}
                onPhotoChange={handlePhotoChange}
                onPickPhoto={() => photoInputRef.current?.click()}
              />

              <div className="grid w-full max-w-[684px] flex-1 grid-cols-1 gap-x-[30px] gap-y-6 sm:grid-cols-2">
                <Field
                  label={t("fields.salary")}
                  value={form.salary}
                  onChange={(v) => update("salary", v)}
                  placeholder={t("placeholder")}
                  inputMode="numeric"
                />
                <SelectField
                  label={t("fields.salaryPeriod")}
                  value={form.salaryPeriod}
                  onChange={(v) => update("salaryPeriod", v)}
                  options={[
                    { value: "mon", label: t("periods.month") },
                    { value: "week", label: t("periods.week") },
                    { value: "day", label: t("periods.day") },
                  ]}
                  placeholder={t("placeholder")}
                />
              </div>
            </div>

            <div className="mt-auto flex justify-end pt-10">
              <button
                type="submit"
                className="inline-flex h-[52px] w-[300px] items-center justify-center rounded-[15px] bg-brand-600 text-lg font-medium leading-[22px] text-white transition-opacity hover:opacity-90"
              >
                {t("save")}
              </button>
            </div>
          </form>
        ) : null}
      </section>
    </div>
  );
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
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="flex w-full max-w-[327px] flex-col gap-1">
      <span className="text-sm font-semibold leading-[18px] text-neutral-800">
        {label}
      </span>
      <input
        type="text"
        value={value}
        inputMode={inputMode}
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

function DateField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex w-full max-w-[327px] flex-col gap-1">
      <span className="text-sm font-semibold leading-[18px] text-neutral-800">
        {label}
      </span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-[52px] w-full rounded-xl border border-brand-700 bg-white px-4 text-sm leading-[18px] text-neutral-800 outline-none placeholder:text-neutral-400"
      />
    </label>
  );
}
