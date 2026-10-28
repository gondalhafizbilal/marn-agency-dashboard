"use client";

import { useTranslations } from "next-intl";

import { TickSquareIcon } from "@/components/icons/tick-square-icon";
import { cn } from "@/lib/utils";

export type AdDetailsData = {
  nationality: string;
  maritalStatus: string;
  age: number;
  kids: number;
  education: string;
  language: string;
  experience: string;
  height: string;
  weight: string;
  description: string;
  skills: AdSkill[];
};

export type AdSkill =
  | "nannies"
  | "drivers"
  | "caretakers"
  | "electrician"
  | "elderly"
  | "nurse"
  | "babySitter"
  | "cooker";

type AdDetailsPanelProps = {
  details: AdDetailsData;
  className?: string;
};

const SKILL_COLUMNS: AdSkill[][] = [
  ["nannies", "drivers"],
  ["caretakers", "electrician"],
  ["elderly", "nurse"],
  ["babySitter", "cooker"],
];

/**
 * Expanded ad details (Figma Frame 1000003272):
 * Details grid + description + skill ticks — responsive columns on mobile.
 */
export function AdDetailsPanel({ details, className }: AdDetailsPanelProps) {
  const t = useTranslations("dashboard.adDetails");

  const columns = [
    [
      { label: t("nationality"), value: details.nationality },
      { label: t("maritalStatus"), value: details.maritalStatus },
    ],
    [
      { label: t("age"), value: String(details.age) },
      { label: t("kids"), value: String(details.kids) },
    ],
    [
      { label: t("education"), value: details.education },
      { label: t("language"), value: details.language },
    ],
    [
      { label: t("experience"), value: details.experience },
      { label: t("height"), value: details.height },
    ],
    [{ label: t("weight"), value: details.weight }],
  ];

  return (
    <section
      className={cn(
        "flex w-full max-w-[980px] flex-col items-start gap-5 rounded-2xl bg-white px-4 py-5 sm:gap-6 sm:rounded-[25px] sm:px-6 sm:pb-[23px] sm:pt-6 lg:px-[30px]",
        className,
      )}
    >
      <div className="flex w-full flex-col gap-4">
        <h2 className="text-base font-semibold leading-6 text-neutral-800 sm:text-lg sm:leading-[27px]">
          {t("title")}
        </h2>

        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-start lg:justify-between lg:gap-x-8">
          {columns.map((group, index) => (
            <div key={index} className="flex flex-col gap-3">
              {group.map((field) => (
                <DetailField
                  key={field.label}
                  label={field.label}
                  value={field.value}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 sm:gap-4">
        <h2 className="text-base font-semibold leading-6 text-neutral-800 sm:text-lg sm:leading-[27px]">
          {t("description")}
        </h2>
        <p className="text-sm leading-[18px] text-pretty text-neutral-400">
          {details.description}
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-1 rounded-lg sm:grid-cols-2 lg:grid-cols-4">
        {SKILL_COLUMNS.map((column) => (
          <div
            key={column.join("-")}
            className="flex min-w-0 flex-col justify-center gap-1"
          >
            {column.map((skill) =>
              details.skills.includes(skill) ? (
                <div
                  key={skill}
                  className="flex items-center gap-1 py-0.5 text-sm leading-[18px] text-[#111927]"
                >
                  <TickSquareIcon
                    size={24}
                    className="size-5 shrink-0 text-brand-700 sm:size-6"
                  />
                  {t(`skills.${skill}`)}
                </div>
              ) : null,
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col justify-center gap-1">
      <span className="text-xs leading-[14px] text-neutral-400">{label}</span>
      <span className="text-sm font-semibold leading-[18px] text-neutral-800">
        {value}
      </span>
    </div>
  );
}

/** Default mock details matching Figma until API provides real data. */
export const DEFAULT_AD_DETAILS: AdDetailsData = {
  nationality: "Indian",
  maritalStatus: "Married",
  age: 34,
  kids: 2,
  education: "High School",
  language: "English, Arabic",
  experience: "6Yrs",
  height: "5’7",
  weight: "82kgs",
  description:
    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.",
  skills: [
    "nannies",
    "drivers",
    "caretakers",
    "electrician",
    "elderly",
    "nurse",
    "babySitter",
    "cooker",
  ],
};
