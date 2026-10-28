import { HeroBanner } from "@/components/layout";
import { RequestsSection } from "@/features/requests/components/requests-section";

/**
 * Requests page: hero banner + stats + filter + request cards.
 */
export function RequestsPageSection() {
  return (
    <div className="flex w-full flex-col items-center gap-10">
      <HeroBanner />
      <RequestsSection />
    </div>
  );
}
