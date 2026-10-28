"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ShareDialog } from "@/components/ui/share-dialog";
import { ProfileAboutCard } from "@/features/profile/components/profile-about-card";
import { ProfileEditForm } from "@/features/profile/components/profile-edit-form";
import { ProfileHeaderCard } from "@/features/profile/components/profile-header-card";
import { ProfileReviewsAllView } from "@/features/profile/components/profile-reviews-all-view";
import { ProfileReviewsCard } from "@/features/profile/components/profile-reviews-card";
import type { ProfileData } from "@/features/profile/types";
import { AgencyPortalRepository, isAppApiError } from "@/services";

const INITIAL_PROFILE: ProfileData = {
  id: "",
  name: "",
  location: "",
  contacts: {},
  about: "",
  services: [],
  media: [],
  reviewCount: 0,
  reviews: [],
};

type ProfileView = "overview" | "edit" | "reviews";

export function ProfilePageSection() {
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [view, setView] = useState<ProfileView>("overview");
  const [shareOpen, setShareOpen] = useState(false);
  const [documents, setDocuments] = useState<Array<{ uuid: string; file_name: string }>>([]);
  const [locations, setLocations] = useState<Array<{ id: string; city: string; country: string; address?: string }>>([]);

  useEffect(() => {
    let active = true;

    void AgencyPortalRepository.profile().then(async (agency) => {
      const [agencyLocations, reviews, agencyDocuments] = await Promise.all([
        AgencyPortalRepository.locations().catch(() => []),
        AgencyPortalRepository.reviews(agency.uuid).catch(() => []),
        AgencyPortalRepository.documents().catch(() => []),
      ]);
      if (!active) return;
      const location = agencyLocations[0];
      setLocations(agencyLocations.map((item) => ({ id: item.uuid ?? item.id, city: item.city, country: item.country, address: item.address })));
      setDocuments(agencyDocuments.map((item) => ({ uuid: item.uuid, file_name: item.file_name })));
      setProfile((current) => ({
        ...current,
        id: agency.uuid,
        name: agency.agency_name,
        avatarUrl: agency.logo_url ?? undefined,
        about: agency.about ?? "",
        location: location ? [location.city, location.country].filter(Boolean).join(", ") : current.location,
        contacts: {
          phone: agency.phoneNumber ?? undefined,
          chat: agency.emailAddress ? `mailto:${agency.emailAddress}` : undefined,
          whatsapp: agency.phoneNumber ?? undefined,
        },
        reviewCount: reviews.length,
        reviews: reviews.map((review) => ({
          id: review.uuid,
          name: String(review.customer?.full_name ?? review.customer?.name ?? "Customer"),
          rating: Number(review.rating ?? 0),
          comment: String(review.comment ?? ""),
          avatarUrl: review.customer?.avatar_url,
        })),
      }));
    }).catch((error) => {
      if (active) toast.error(isAppApiError(error) ? error.message : "Unable to load agency profile.");
    });

    return () => {
      active = false;
    };
  }, []);

  function addLocation() {
    const country = window.prompt("Country");
    const city = window.prompt("City");
    if (!country || !city) return;
    void AgencyPortalRepository.createLocation({ country, city }).then((location) => setLocations((current) => [...current, { id: location.uuid ?? location.id, country: location.country, city: location.city, address: location.address }])).catch(() => toast.error("Unable to add location."));
  }

  function editLocation(location: { id: string; city: string; country: string; address?: string }) {
    const city = window.prompt("City", location.city);
    if (!city) return;
    void AgencyPortalRepository.updateLocation(location.id, { city }).then((updated) => setLocations((current) => current.map((item) => item.id === location.id ? { ...item, city: updated.city } : item))).catch(() => toast.error("Unable to update location."));
  }

  function removeLocation(id: string) {
    void AgencyPortalRepository.deleteLocation(id).then(() => setLocations((current) => current.filter((item) => item.id !== id))).catch(() => toast.error("Unable to delete location."));
  }

  function uploadLogo(file: File) {
    void AgencyPortalRepository.uploadLogo(file).then(() => toast.success("Logo uploaded.")).catch(() => toast.error("Unable to upload logo."));
  }

  function createGenuineReview() {
    const emailAddress = window.prompt("Customer email address");
    const ratingInput = window.prompt("Rating (1-5)", "5");
    const comment = window.prompt("Review comment");
    const rating = Number(ratingInput);
    if (!profile.id || !emailAddress || !comment || !Number.isFinite(rating) || rating < 1 || rating > 5) return;
    void AgencyPortalRepository.createGenuineReview(profile.id, { emailAddress, rating, comment })
      .then((review) => {
        setProfile((current) => ({ ...current, reviews: [{ id: review.uuid, name: emailAddress, rating: review.rating, comment: review.comment ?? "" }, ...current.reviews], reviewCount: current.reviewCount + 1 }));
        toast.success("Genuine review created.");
      })
      .catch((error) => toast.error(isAppApiError(error) ? error.message : "Unable to create genuine review."));
  }

  function reconcileReviews() {
    if (!profile.id) return;
    void AgencyPortalRepository.reconcileReviews(profile.id)
      .then(() => toast.success("Reviews reconciled."))
      .catch((error) => toast.error(isAppApiError(error) ? error.message : "Unable to reconcile reviews."));
  }

  if (view === "edit") {
    return (
      <div className="flex w-full flex-col items-center">
        <ProfileEditForm
          profile={profile}
          onCancel={() => setView("overview")}
          onSave={(next) => {
            setProfile(next);
            void AgencyPortalRepository.updateProfile({
              agency_name: next.name,
              about: next.about,
            });
            setView("overview");
          }}
        />
      </div>
    );
  }

  if (view === "reviews") {
    return (
      <div className="flex w-full flex-col items-center">
        <ProfileReviewsAllView
          totalCount={profile.reviewCount}
          reviews={profile.reviews}
          onBack={() => setView("overview")}
          onDeleteReview={(reviewId) => {
            void AgencyPortalRepository.deleteReview(profile.id, reviewId)
              .then(() => {
                setProfile((current) => ({
                  ...current,
                  reviews: current.reviews.filter((item) => item.id !== reviewId),
                  reviewCount: Math.max(0, current.reviewCount - 1),
                }));
                toast.success("Review deleted.");
              })
              .catch((error) => toast.error(isAppApiError(error) ? error.message : "Unable to delete review."));
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <ProfileHeaderCard
        profile={profile}
        onShare={() => setShareOpen(true)}
        onEdit={() => setView("edit")}
      />
      <section className="w-full max-w-[980px] rounded-[25px] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-neutral-800">Profile assets</h2>
          <label className="cursor-pointer text-sm font-medium text-brand-700">Upload logo<input type="file" accept="image/*" className="sr-only" onChange={(event) => event.target.files?.[0] && uploadLogo(event.target.files[0])} /></label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-neutral-600">{documents.map((document) => <span key={document.uuid} className="rounded bg-neutral-100 px-3 py-2">{document.file_name}</span>)}</div>
        <div className="mt-4 flex flex-wrap gap-2">{locations.map((location) => <span key={location.id} className="rounded bg-neutral-100 px-3 py-2 text-sm">{location.city}, {location.country} <button type="button" onClick={() => editLocation(location)} className="text-brand-700">Edit</button> <button type="button" onClick={() => removeLocation(location.id)} className="text-red-600">Delete</button></span>)}<button type="button" onClick={addLocation} className="text-sm font-medium text-brand-700">Add location</button></div>
      </section>

      <ProfileAboutCard
        description={profile.about}
        services={profile.services}
        media={profile.media}
      />

      <div className="w-full max-w-[980px]">
        <div className="mb-3 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={createGenuineReview} className="text-sm font-medium text-brand-700">Add genuine review</button>
          <button type="button" onClick={reconcileReviews} className="text-sm font-medium text-brand-700">Reconcile reviews</button>
        </div>
        <ProfileReviewsCard totalCount={profile.reviewCount} reviews={profile.reviews.slice(0, 4)} onSeeAll={() => setView("reviews")} />
      </div>

      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} shareText={profile.name} />
    </div>
  );
}
