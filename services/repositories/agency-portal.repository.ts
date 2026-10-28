import { API_ENDPOINTS } from "@/constants";

import { api } from "../api";

export type ListResult<T> = { data: T[]; total: number };

export type AgencyLocation = {
  id: string;
  uuid?: string;
  country: string;
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
};

export type AgencyDocument = {
  uuid: string;
  doc_type: string;
  file_url: string;
  file_name: string;
  verified: boolean;
};

export type AgencyProfile = {
  uuid: string;
  agency_name: string;
  emailAddress: string;
  phoneNumber?: string | null;
  about?: string | null;
  logo_url?: string | null;
  agency_type: string;
  role: "service_agency" | "workforce_agency";
  status: string;
};

export type RequestItem = {
  uuid: string;
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type Package = {
  id: string;
  name?: string;
  price?: number;
  [key: string]: unknown;
};

export type Worker = {
  uuid: string;
  name: string;
  status: string;
  [key: string]: unknown;
};

export type ServiceListing = {
  uuid: string;
  name: string;
  status: string;
  [key: string]: unknown;
};

export type AgencyReview = {
  uuid: string;
  rating: number;
  comment?: string;
  customer?: { full_name?: string; name?: string; avatar_url?: string };
  [key: string]: unknown;
};

export type NotificationPreferences = Record<string, { push?: boolean; email?: boolean }>;

export type AgencyNotification = {
  uuid: string;
  title?: string;
  message?: string;
  body?: string;
  is_read?: boolean;
  isRead?: boolean;
  read?: boolean;
  created_at?: string;
  createdAt?: string;
  [key: string]: unknown;
};

class AgencyPortalRepositoryClass {
  profile() {
    return api.get<AgencyProfile>(API_ENDPOINTS.AGENCY_PROFILE.ROOT);
  }

  updateProfile(payload: Partial<AgencyProfile>) {
    return api.put<AgencyProfile, Partial<AgencyProfile>>(
      API_ENDPOINTS.AGENCY_PROFILE.ROOT,
      payload,
    );
  }

  stats() {
    return api.get<Record<string, number>>(API_ENDPOINTS.AGENCY_PROFILE.STATS);
  }

  packageHistory() {
    return api.get<unknown[]>(API_ENDPOINTS.AGENCY_PROFILE.PACKAGES);
  }

  documents() {
    return api.get<AgencyDocument[]>(API_ENDPOINTS.AGENCY_PROFILE.DOCUMENTS);
  }

  notificationPreferences() {
    return api.get<NotificationPreferences>(API_ENDPOINTS.AGENCY_PROFILE.NOTIFICATION_PREFERENCES);
  }

  updateNotificationPreferences(payload: NotificationPreferences) {
    return api.patch<NotificationPreferences>(
      API_ENDPOINTS.AGENCY_PROFILE.NOTIFICATION_PREFERENCES,
      payload,
    );
  }

  async uploadLogo(file: File) {
    const body = new FormData();
    body.set("file", file);
    return api.post<unknown, FormData>(API_ENDPOINTS.AGENCY_PROFILE.LOGO, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  locations() {
    return api.get<AgencyLocation[]>(API_ENDPOINTS.AGENCY_PROFILE.LOCATIONS);
  }

  createLocation(payload: Omit<AgencyLocation, "id" | "uuid">) {
    return api.post<AgencyLocation>(API_ENDPOINTS.AGENCY_PROFILE.LOCATIONS, payload);
  }

  updateLocation(id: string, payload: Partial<AgencyLocation>) {
    return api.put<AgencyLocation>(API_ENDPOINTS.AGENCY_PROFILE.LOCATION_BY_ID(id), payload);
  }

  deleteLocation(id: string) {
    return api.delete(API_ENDPOINTS.AGENCY_PROFILE.LOCATION_BY_ID(id));
  }

  reviews(agencyId: string) {
    return api.get<AgencyReview[]>(API_ENDPOINTS.AGENCY_REVIEWS.ROOT(agencyId));
  }

  review(agencyId: string, reviewId: string) {
    return api.get<AgencyReview>(API_ENDPOINTS.AGENCY_REVIEWS.BY_ID(agencyId, reviewId));
  }

  createGenuineReview(agencyId: string, payload: Record<string, unknown>) {
    return api.post<AgencyReview>(`${API_ENDPOINTS.AGENCY_REVIEWS.ROOT(agencyId)}/genuine`, payload);
  }

  updateReview(agencyId: string, reviewId: string, payload: Record<string, unknown>) {
    return api.put<AgencyReview>(API_ENDPOINTS.AGENCY_REVIEWS.BY_ID(agencyId, reviewId), payload);
  }

  deleteReview(agencyId: string, reviewId: string) {
    return api.delete(API_ENDPOINTS.AGENCY_REVIEWS.BY_ID(agencyId, reviewId));
  }

  reconcileReviews(agencyId: string) {
    return api.patch<void>(API_ENDPOINTS.AGENCY_REVIEWS.RECONCILE(agencyId));
  }

  deleteReviewImage(agencyId: string, reviewId: string, imageId: string) {
    return api.delete(`${API_ENDPOINTS.AGENCY_REVIEWS.BY_ID(agencyId, reviewId)}/images/${imageId}`);
  }

  requests(params?: Record<string, string | number | undefined>) {
    return api.get<ListResult<RequestItem>>(API_ENDPOINTS.REQUESTS.ROOT, { params });
  }

  request(id: string, lang?: "en" | "ar") {
    return api.get<RequestItem>(API_ENDPOINTS.REQUESTS.BY_ID(id), { params: { lang } });
  }

  notifications() {
    return api.get<AgencyNotification[]>(API_ENDPOINTS.AGENCY_NOTIFICATIONS.ROOT);
  }

  markNotificationRead(id: string) {
    return api.patch<AgencyNotification>(API_ENDPOINTS.AGENCY_NOTIFICATIONS.MARK_READ(id));
  }

  packages(categoryId?: string) {
    return api.get<Package[]>(API_ENDPOINTS.PACKAGES.ROOT, { params: { category_id: categoryId } });
  }

  purchasePackage(payload: {
    package_id: string;
    worker_id?: string;
    service_id?: string;
    category_id?: string;
  }) {
    return api.post<unknown>(API_ENDPOINTS.PACKAGES.PURCHASE, payload);
  }

  cancelPackagePurchase(id: string) {
    return api.post<{ cancelled: boolean }>(API_ENDPOINTS.PACKAGES.CANCEL(id));
  }

  workers(params?: Record<string, string | number | undefined>) {
    return api.get<ListResult<Worker>>(API_ENDPOINTS.WORKERS.ROOT, { params });
  }

  worker(id: string) {
    return api.get<Worker>(API_ENDPOINTS.WORKERS.BY_ID(id));
  }

  createWorker(payload: Record<string, unknown>) {
    return api.post<{ worker_id: string; status: string }>(API_ENDPOINTS.WORKERS.ROOT, payload);
  }

  updateWorker(id: string, payload: Record<string, unknown>) {
    return api.put<Worker>(API_ENDPOINTS.WORKERS.BY_ID(id), payload);
  }

  updateWorkerSkills(id: string, payload: { skill_uuids: string[] }) {
    return api.put<Worker>(API_ENDPOINTS.WORKERS.SKILLS(id), payload);
  }

  updateWorkerPricing(id: string, payload: Record<string, unknown>) {
    return api.put<Worker>(API_ENDPOINTS.WORKERS.PRICING(id), payload);
  }

  async uploadWorkerPhoto(id: string, file: File) {
    const body = new FormData();
    body.set("photo", file);
    return api.post<Worker, FormData>(API_ENDPOINTS.WORKERS.PHOTO(id), body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  submitWorker(id: string) {
    return api.post<Worker>(API_ENDPOINTS.WORKERS.SUBMIT(id));
  }
  resubmitWorker(id: string) {
    return api.post<Worker>(API_ENDPOINTS.WORKERS.RESUBMIT(id));
  }
  deleteWorker(id: string) {
    return api.delete(API_ENDPOINTS.WORKERS.BY_ID(id));
  }
  payWorker(id: string) {
    return api.post(API_ENDPOINTS.WORKERS.PAY(id));
  }
  renewWorker(id: string) {
    return api.post<Worker>(API_ENDPOINTS.WORKERS.RENEW(id));
  }
  shareWorker(id: string) {
    return api.post<unknown>(API_ENDPOINTS.WORKERS.SHARE(id));
  }
  archiveWorker(id: string, status: boolean) {
    return api.put<Worker>(API_ENDPOINTS.WORKERS.ARCHIVE(id), { status });
  }

  services(params?: Record<string, string | number | undefined>) {
    return api.get<ListResult<ServiceListing>>(API_ENDPOINTS.SERVICES.ROOT, { params });
  }

  myServices(id: string, params?: Record<string, string | number | undefined>) {
    return api.get<ListResult<ServiceListing>>(API_ENDPOINTS.SERVICES.MINE(id), { params });
  }

  createService(payload: { name: string; description: string; country: string; city: string }) {
    return api.post<{ service_id: string; status: string }>(API_ENDPOINTS.SERVICES.ROOT, payload);
  }

  updateService(id: string, payload: Record<string, unknown>) {
    return api.put<ServiceListing>(API_ENDPOINTS.SERVICES.BY_ID(id), payload);
  }
  service(id: string) {
    return api.get<ServiceListing>(API_ENDPOINTS.SERVICES.BY_ID(id));
  }
  serviceImages(id: string) {
    return api.get<unknown[]>(API_ENDPOINTS.SERVICES.IMAGES(id));
  }
  async uploadServiceImage(id: string, file: File) {
    const body = new FormData();
    body.set("file", file);
    return api.post<unknown, FormData>(API_ENDPOINTS.SERVICES.IMAGES(id), body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  deleteServiceImage(id: string, imageId: string) {
    return api.delete(API_ENDPOINTS.SERVICES.IMAGE_BY_ID(id, imageId));
  }

  deleteService(id: string) {
    return api.delete(API_ENDPOINTS.SERVICES.BY_ID(id));
  }
  updateServiceTags(id: string, payload: { tag_uuids: string[] }) {
    return api.put<ServiceListing>(API_ENDPOINTS.SERVICES.TAGS(id), payload);
  }
  updateServicePricing(id: string, payload: Record<string, unknown>) {
    return api.put<ServiceListing>(API_ENDPOINTS.SERVICES.PRICING(id), payload);
  }
  submitService(id: string) {
    return api.post<ServiceListing>(API_ENDPOINTS.SERVICES.SUBMIT(id));
  }
  resubmitService(id: string) {
    return api.post<ServiceListing>(API_ENDPOINTS.SERVICES.RESUBMIT(id));
  }
  payService(id: string) {
    return api.post(API_ENDPOINTS.SERVICES.PAY(id));
  }
  renewService(id: string) {
    return api.post<ServiceListing>(API_ENDPOINTS.SERVICES.RENEW(id));
  }
  shareService(id: string) {
    return api.post<unknown>(API_ENDPOINTS.SERVICES.SHARE(id));
  }
  archiveService(id: string, status: boolean) {
    return api.put<ServiceListing>(API_ENDPOINTS.SERVICES.ARCHIVE(id), { status });
  }

  subscriptionPlans() {
    return api.get<unknown[]>(API_ENDPOINTS.SUBSCRIPTIONS.PLANS);
  }
  subscriptionPlansForAgency(agencyId: string, agencyType: string) {
    return api.get<Array<Record<string, unknown>>>(API_ENDPOINTS.SUBSCRIPTIONS.PLANS_FOR_AGENCY(agencyId, agencyType));
  }
  currentSubscription(agencyId: string) {
    return api.get<Record<string, unknown> | null>(API_ENDPOINTS.SUBSCRIPTIONS.CURRENT(agencyId));
  }
  subscriptionHistory(agencyId: string) {
    return api.get<Array<Record<string, unknown>>>(API_ENDPOINTS.SUBSCRIPTIONS.HISTORY(agencyId));
  }
  canPost(agencyId: string) {
    return api.get<{ canPost: boolean; reason?: string }>(
      API_ENDPOINTS.SUBSCRIPTIONS.CAN_POST(agencyId),
    );
  }
  purchaseSubscription(agencyId: string, payload: { agencyType: string; duration: string; autoRenew?: boolean }) {
    return api.post<unknown>(API_ENDPOINTS.SUBSCRIPTIONS.PURCHASE(agencyId), payload);
  }
}

export const AgencyPortalRepository = new AgencyPortalRepositoryClass();
