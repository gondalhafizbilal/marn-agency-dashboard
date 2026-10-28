export type RequestStatus = "completed" | "pending";

export type RequestCategoryKey =
  | "housemaid"
  | "nanny"
  | "driver"
  | "cook"
  | "caretaker";

export type RequestCardData = {
  id: string;
  customerName: string;
  category: string;
  categoryKey: RequestCategoryKey;
  dateSubmitted: string;
  /** Unix timestamp for sorting. */
  submittedAt: number;
  status: RequestStatus;
  description: string;
  avatarUrl?: string;
  contacts: {
    phone?: string;
    chat?: string;
    whatsapp?: string;
  };
};
