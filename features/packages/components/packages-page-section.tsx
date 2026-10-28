"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { HeroBanner } from "@/components/layout";
import { PackagesGrid } from "@/features/packages/components/packages-grid";
import type { PackageCardData } from "@/features/packages/types";
import { AgencyPortalRepository, isAppApiError } from "@/services";
import { useAuthStore } from "@/store";

export function PackagesPageSection() {
  const [packages, setPackages] = useState<PackageCardData[]>([]);
  const [purchases, setPurchases] = useState<Array<Record<string, unknown>>>([]);
  const [packageToBuy, setPackageToBuy] = useState<string | null>(null);
  const [listingTargets, setListingTargets] = useState<Array<{ id: string; name: string }>>([]);
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [agencyType, setAgencyType] = useState<string | null>(null);
  const [plans, setPlans] = useState<Array<Record<string, unknown>>>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Record<string, unknown> | null>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<Array<Record<string, unknown>>>([]);
  const [canPost, setCanPost] = useState<{ canPost: boolean; reason?: string } | null>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    void AgencyPortalRepository.packages()
      .then((items) => {
        setPackages(
          items.map((item) => ({
            id: item.id,
            name: item.name ?? "Package",
            features: ["adsInCategory", "validDays"],
            priceQar: Number(item.price ?? 0),
            durationDays: Number(item.duration_days ?? 0),
          })),
        );
      })
      .catch(() => setPackages([]));
    void AgencyPortalRepository.packageHistory()
      .then((items) => setPurchases(items.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (user?.role !== "service_agency") return;
    void AgencyPortalRepository.profile().then((agency) => {
      setAgencyId(agency.uuid);
      setAgencyType(agency.agency_type);
      return Promise.all([
        AgencyPortalRepository.subscriptionPlansForAgency(agency.uuid, agency.agency_type),
        AgencyPortalRepository.currentSubscription(agency.uuid),
        AgencyPortalRepository.subscriptionHistory(agency.uuid),
        AgencyPortalRepository.canPost(agency.uuid),
      ]);
    }).then(([availablePlans, current, history, posting]) => {
      setPlans(availablePlans);
      setCurrentSubscription(current);
      setSubscriptionHistory(history);
      setCanPost(posting);
    }).catch(() => undefined);
  }, [user?.role]);

  function cancelPurchase(id: string) {
    void AgencyPortalRepository.cancelPackagePurchase(id)
      .then(() => {
        setPurchases((current) => current.filter((purchase) => String(purchase.uuid ?? purchase.id) !== id));
        toast.success("Package purchase cancelled.");
      })
      .catch((error) => toast.error(isAppApiError(error) ? error.message : "Unable to cancel package purchase."));
  }

  function handleBuy(packageId: string) {
    if (!user) return;
    setPackageToBuy(packageId);
    const request = user.role === "workforce_agency"
      ? AgencyPortalRepository.workers()
      : AgencyPortalRepository.myServices(String(user.agencyId ?? user.id));
    void request
      .then((response) => setListingTargets(response.data.map((item) => ({ id: String(item.uuid), name: String(item.name ?? "Untitled listing") }))))
      .catch((error) => {
        setPackageToBuy(null);
        toast.error(isAppApiError(error) ? error.message : "Unable to load listings for this package.");
      });
  }

  function purchasePackageForListing(listingId: string) {
    if (!packageToBuy || !user) return;
    const payload = user.role === "workforce_agency"
      ? { package_id: packageToBuy, worker_id: listingId }
      : { package_id: packageToBuy, service_id: listingId };
    void AgencyPortalRepository.purchasePackage(payload)
      .then(() => {
        toast.success("Package purchase started successfully.");
        setPackageToBuy(null);
        setListingTargets([]);
      })
      .catch((error) => toast.error(isAppApiError(error) ? error.message : "Unable to start package purchase."));
  }

  function purchaseSubscription(duration: string) {
    if (!agencyId || !agencyType) return;
    void AgencyPortalRepository.purchaseSubscription(agencyId, { agencyType, duration })
      .then(() => toast.success("Subscription purchase started successfully."))
      .catch((error) => toast.error(isAppApiError(error) ? error.message : "Unable to start subscription purchase."));
  }

  return (
    <div className="flex w-full flex-col items-center gap-6 sm:gap-10">
      <HeroBanner />
      <PackagesGrid packages={packages} onBuy={handleBuy} />
      {packageToBuy ? (
        <section className="w-full max-w-[980px] rounded-[25px] bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-neutral-800">Choose a listing for this package</h2>
            <button type="button" onClick={() => { setPackageToBuy(null); setListingTargets([]); }} className="text-sm text-brand-700">Cancel</button>
          </div>
          {listingTargets.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {listingTargets.map((listing) => <button key={listing.id} type="button" onClick={() => purchasePackageForListing(listing.id)} className="rounded-xl border border-neutral-200 p-4 text-left text-sm font-medium text-neutral-800 transition-colors hover:border-brand-700">{listing.name}</button>)}
          </div> : <p className="mt-4 text-sm text-neutral-500">No eligible listings are available for this package.</p>}
        </section>
      ) : null}
      {user?.role === "service_agency" ? (
        <section className="w-full max-w-[980px] rounded-[25px] bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-800">Service listing subscription</h2>
          <p className="mt-1 text-sm text-neutral-500">
            {canPost?.canPost ? "You can post service listings." : canPost?.reason ?? "Posting eligibility is being checked."}
          </p>
          {currentSubscription ? <p className="mt-3 text-sm text-neutral-700">Current status: {String(currentSubscription.status ?? "active")}</p> : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {plans.map((plan) => {
              const duration = String(plan.duration ?? "");
              const price = plan.priceAmount as Record<string, unknown> | undefined;
              return <div key={String(plan.uuid ?? duration)} className="rounded-xl border border-neutral-200 p-4">
                <p className="font-medium text-neutral-800">{duration.replace("_", " ")}</p>
                <p className="mt-1 text-sm text-neutral-500">QAR {String(price?.amount ?? plan.price ?? "—")} · {String(plan.maxActiveListings ?? "—")} active listings</p>
                <button type="button" onClick={() => purchaseSubscription(duration)} className="mt-3 text-sm font-medium text-brand-700">Choose plan</button>
              </div>;
            })}
          </div>
          {subscriptionHistory.length ? (
            <div className="mt-5 border-t border-neutral-100 pt-4">
              <h3 className="text-sm font-semibold text-neutral-800">Subscription history</h3>
              <div className="mt-2 space-y-2 text-sm text-neutral-600">
                {subscriptionHistory.map((subscription) => (
                  <p key={String(subscription.uuid ?? subscription.id)}>
                    {String(subscription.status ?? "unknown")} · expires {String(subscription.expiresAt ?? subscription.expires_at ?? "—")}
                  </p>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
      {purchases.length ? (
        <section className="w-full max-w-[980px] rounded-[25px] bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-800">Purchase history</h2>
          <div className="space-y-3">
            {purchases.map((purchase) => {
              const id = String(purchase.uuid ?? purchase.id);
              const status = String(purchase.status ?? "pending");
              return (
                <div key={id} className="flex items-center justify-between gap-4 rounded-xl border border-neutral-100 px-4 py-3">
                  <div>
                    <p className="font-medium text-neutral-800">{String(purchase.package_name ?? purchase.packageName ?? "Package")}</p>
                    <p className="text-sm text-neutral-500">{status}</p>
                  </div>
                  {status === "pending" ? <button type="button" onClick={() => cancelPurchase(id)} className="text-sm font-medium text-red-600">Cancel</button> : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
