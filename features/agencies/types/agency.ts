export type AgencyStatus = "active" | "inactive" | "suspended";

export type Agency = {
  id: string;
  name: string;
  nameAr?: string;
  email: string;
  phone?: string;
  crNumber?: string;
  status: AgencyStatus;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAgencyInput = {
  name: string;
  nameAr?: string;
  email: string;
  phone?: string;
  crNumber?: string;
  status?: AgencyStatus;
  logoUrl?: string;
};

export type UpdateAgencyInput = Partial<CreateAgencyInput>;
