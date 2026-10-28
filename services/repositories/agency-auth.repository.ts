import { API_ENDPOINTS } from "@/constants";

import { api } from "../api";

export type AgencyRole = "service_agency" | "workforce_agency";
export type AgencyStatus = "pending_documents" | "pending" | "active" | "suspended" | "rejected";

export type AuthAgency = {
  uuid: string;
  agency_name: string;
  emailAddress: string;
  phoneNumber?: string | null;
  role: AgencyRole;
  status: AgencyStatus;
  logo_url?: string | null;
};

export type AgencyAuthResponse = {
  accessToken: string;
  refreshToken?: string;
  agency: AuthAgency;
};

export type RegisterAgencyPayload = {
  agencyName: string;
  emailAddress: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  agencyType:
    | "housemaid"
    | "housemaid_local"
    | "hajj_umrah"
    | "events"
    | "services"
    | "car_services"
    | "laundry_services"
    | "home_projects";
  termsAccepted: boolean;
};

export type LoginAgencyPayload = {
  emailAddress: string;
  password: string;
};

class AgencyAuthRepositoryClass {
  register(payload: RegisterAgencyPayload) {
    return api.post<{ registrationToken: string; agencyUuid: string }, RegisterAgencyPayload>(
      API_ENDPOINTS.AUTH.REGISTER,
      payload,
    );
  }

  async uploadDocuments(registrationToken: string, documents: File[]) {
    const body = new FormData();
    body.set("registrationToken", registrationToken);
    documents.forEach((document) => body.append("documents", document));

    return api.post<{ agency: AuthAgency; message: string }, FormData>(
      API_ENDPOINTS.AUTH.REGISTER_DOCUMENTS,
      body,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  }

  login(payload: LoginAgencyPayload) {
    return api.post<AgencyAuthResponse, LoginAgencyPayload>(API_ENDPOINTS.AUTH.LOGIN, payload);
  }

  sendOtp(identifier: string, purpose: "login" | "password_reset" = "login") {
    return api.post<{ message: string }>(API_ENDPOINTS.AUTH.SEND_OTP, { identifier, purpose });
  }

  verifyOtp(identifier: string, otp: string, purpose: "login" | "password_reset" = "login") {
    return api.post<AgencyAuthResponse>(API_ENDPOINTS.AUTH.VERIFY_OTP, {
      identifier,
      otp,
      purpose,
    });
  }

  forgotPassword(payload: { emailAddress?: string; phoneNumber?: string }) {
    return api.post<{ message: string }>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload);
  }

  verifyResetOtp(identifier: string, otp: string) {
    return api.post<{ resetToken: string }>(API_ENDPOINTS.AUTH.VERIFY_RESET_OTP, {
      identifier,
      otp,
    });
  }

  resetPassword(resetToken: string, newPassword: string) {
    return api.post<{ message: string }>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      resetToken,
      newPassword,
    });
  }

  changePassword(currentPassword: string, newPassword: string) {
    return api.put<{ message: string }>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
  }

  async logout() {
    try {
      await api.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Local sign-out must still succeed if the token has expired.
    }
  }

  logoutAll() {
    return api.post<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT_ALL);
  }

  me() {
    return api.get<AuthAgency>(API_ENDPOINTS.AUTH.ME);
  }
}

export const AgencyAuthRepository = new AgencyAuthRepositoryClass();
