export type ProfileContactLinks = {
  phone?: string;
  chat?: string;
  whatsapp?: string;
};

export type ProfileServiceId =
  | "nannies"
  | "drivers"
  | "caretakers"
  | "electrician"
  | "elderly"
  | "nurse"
  | "babySitter"
  | "cooker";

export type ProfileReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatarUrl?: string;
};

export type ProfileData = {
  id: string;
  name: string;
  location: string;
  avatarUrl?: string;
  contacts: ProfileContactLinks;
  about: string;
  services: ProfileServiceId[];
  /** Agency media gallery — show up to 3 on the about card. */
  media: string[];
  reviewCount: number;
  reviews: ProfileReview[];
};
