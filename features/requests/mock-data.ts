import type { RequestCardData, RequestCategoryKey } from "@/features/requests/types";

const REQUEST_DESCRIPTION =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. 1500s, Lorem Ipsum is simply dummy text of the printing and typesetting industry. 1500s, Lorem Ipsum is simply dummy text of the printing and typesetting industry. 1500s,";

const CUSTOMER_NAMES = [
  "Dana Al-Fadala",
  "Tariq Al-Abdulla",
  "Sara Al-Mansouri",
  "Omar Khalid",
  "Fatima Hassan",
  "Ahmed Al-Marri",
  "Layla Noor",
  "Hassan Ibrahim",
  "Mariam Saleh",
] as const;

const CATEGORY_OPTIONS: { key: RequestCategoryKey; label: string }[] = [
  { key: "housemaid", label: "Housemaid" },
  { key: "nanny", label: "Nanny" },
  { key: "driver", label: "Driver" },
  { key: "cook", label: "Cook" },
  { key: "caretaker", label: "Caretaker" },
];

const SUBMITTED_DATES = [
  { label: "Nov 01, 2026", at: Date.parse("2026-11-01") },
  { label: "Oct 18, 2026", at: Date.parse("2026-10-18") },
  { label: "Sep 05, 2026", at: Date.parse("2026-09-05") },
  { label: "Aug 22, 2026", at: Date.parse("2026-08-22") },
  { label: "Jul 10, 2026", at: Date.parse("2026-07-10") },
  { label: "Jun 03, 2026", at: Date.parse("2026-06-03") },
  { label: "May 15, 2026", at: Date.parse("2026-05-15") },
  { label: "Apr 28, 2026", at: Date.parse("2026-04-28") },
  { label: "Mar 12, 2026", at: Date.parse("2026-03-12") },
] as const;

/** Mock requests until requests API is wired. */
export const MOCK_REQUESTS: RequestCardData[] = Array.from({ length: 9 }, (_, index) => {
  const category = CATEGORY_OPTIONS[index % CATEGORY_OPTIONS.length]!;
  const submitted = SUBMITTED_DATES[index % SUBMITTED_DATES.length]!;

  return {
    id: String(index + 1),
    customerName: CUSTOMER_NAMES[index % CUSTOMER_NAMES.length]!,
    category: category.label,
    categoryKey: category.key,
    dateSubmitted: submitted.label,
    submittedAt: submitted.at,
    status: index % 3 === 0 ? "completed" : "pending",
    description: REQUEST_DESCRIPTION,
    contacts: {
      phone: "+97444123456",
      chat: "mailto:contact@example.qa",
      whatsapp: "+97444123456",
    },
  };
});

export function getMockRequestById(id: string): RequestCardData | undefined {
  return MOCK_REQUESTS.find((request) => request.id === id);
}
