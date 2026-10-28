/** API path constants — never hardcode endpoint strings in repositories. */

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/agency/register",
    REGISTER_DOCUMENTS: "/auth/agency/register/documents",
    LOGIN: "/auth/agency/login",
    SEND_OTP: "/auth/agency/send-otp",
    VERIFY_OTP: "/auth/agency/verify-otp",
    REFRESH: "/auth/agency/refresh",
    FORGOT_PASSWORD: "/auth/agency/forgot-password",
    VERIFY_RESET_OTP: "/auth/agency/verify-reset-otp",
    RESET_PASSWORD: "/auth/agency/reset-password",
    CHANGE_PASSWORD: "/auth/agency/change-password",
    LOGOUT: "/auth/agency/logout",
    LOGOUT_ALL: "/auth/agency/logout-all",
    ME: "/auth/agency/me",
  },
  AGENCIES: {
    ROOT: "/agencies",
    BY_ID: (id: string) => `/agencies/${id}`,
  },
  AGENCY_PROFILE: {
    ROOT: "/agencies/me",
    STATS: "/agencies/me/stats",
    PACKAGES: "/agencies/me/packages",
    LOGO: "/agencies/me/logo",
    DOCUMENTS: "/agencies/me/documents",
    LOCATIONS: "/agencies/me/locations",
    LOCATION_BY_ID: (id: string) => `/agencies/me/locations/${id}`,
    NOTIFICATION_PREFERENCES: "/agencies/me/notification-preferences",
  },
  AGENCY_REVIEWS: {
    ROOT: (agencyId: string) => `/agency/${agencyId}/reviews`,
    BY_ID: (agencyId: string, reviewId: string) => `/agency/${agencyId}/reviews/${reviewId}`,
    RECONCILE: (agencyId: string) => `/agency/${agencyId}/reviews`,
  },
  REQUESTS: {
    ROOT: "/requests",
    BY_ID: (id: string) => `/requests/${id}`,
  },
  AGENCY_NOTIFICATIONS: {
    ROOT: "/agency-notifications",
    MARK_READ: (id: string) => `/agency-notifications/${id}/read`,
  },
  PACKAGES: {
    ROOT: "/packages",
    PURCHASE: "/packages/purchase",
    CANCEL: (id: string) => `/packages/purchase/${id}/cancel`,
  },
  WORKERS: {
    ROOT: "/workers",
    BY_ID: (id: string) => `/agencies/workers/${id}`,
    SKILLS: (id: string) => `/agencies/workers/${id}/skills`,
    PRICING: (id: string) => `/agencies/workers/${id}/pricing`,
    PHOTO: (id: string) => `/agencies/workers/${id}/photo`,
    SUBMIT: (id: string) => `/agencies/workers/${id}/submit`,
    RESUBMIT: (id: string) => `/agencies/workers/${id}/resubmit`,
    PAY: (id: string) => `/agencies/workers/${id}/pay`,
    RENEW: (id: string) => `/agencies/workers/${id}/renew`,
    SHARE: (id: string) => `/agencies/workers/${id}/share`,
    ARCHIVE: (id: string) => `/agencies/workers/${id}/archive`,
  },
  SERVICES: {
    ROOT: "/services",
    MINE: (id: string) => `/services/${id}/all`,
    BY_ID: (id: string) => `/services/${id}`,
    TAGS: (id: string) => `/services/${id}/tags`,
    PRICING: (id: string) => `/services/${id}/pricing`,
    SUBMIT: (id: string) => `/services/${id}/submit`,
    RESUBMIT: (id: string) => `/services/${id}/resubmit`,
    PAY: (id: string) => `/services/${id}/pay`,
    RENEW: (id: string) => `/services/${id}/renew`,
    SHARE: (id: string) => `/services/${id}/share`,
    ARCHIVE: (id: string) => `/services/${id}/archive/toggle`,
    IMAGES: (id: string) => `/services/${id}/images`,
    IMAGE_BY_ID: (id: string, imageId: string) => `/services/${id}/images/${imageId}`,
  },
  SUBSCRIPTIONS: {
    PLANS: "/subscriptions/plans",
    PLAN_BY_ID: (id: string) => `/subscriptions/plans/${id}`,
    FOR_AGENCY: (agencyId: string) => `/agency/${agencyId}/subscriptions`,
    PLANS_FOR_AGENCY: (agencyId: string, agencyType: string) =>
      `/agency/${agencyId}/subscriptions/plans/${agencyType}`,
    CURRENT: (agencyId: string) => `/agency/${agencyId}/subscriptions/current`,
    HISTORY: (agencyId: string) => `/agency/${agencyId}/subscriptions/history`,
    CAN_POST: (agencyId: string) => `/agency/${agencyId}/subscriptions/can-post`,
    PURCHASE: (agencyId: string) => `/agency/${agencyId}/subscriptions/purchase`,
  },
  USERS: {
    ROOT: "/users",
    BY_ID: (id: string) => `/users/${id}`,
  },
  CLIENTS: {
    ROOT: "/clients",
    BY_ID: (id: string) => `/clients/${id}`,
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
} as const;

export const TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: "marn_access_token",
  REFRESH_TOKEN: "marn_refresh_token",
} as const;
