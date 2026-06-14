import { PageFrame } from "../app/PageFrame";
import { useMostVisitedCityListQuery } from "../api/queries";

import { CitySelectorSection } from "./publicLanding/components/CitySelectorSection";
import { DownloadAppSection } from "./publicLanding/components/DownloadAppSection";
import { LandingHero } from "./publicLanding/components/LandingHero";
import { LoginCallToAction } from "./publicLanding/components/LoginCallToAction";
import { PublicFooter } from "./publicLanding/components/PublicFooter";
import { cities as fallbackCities } from "./publicLanding/publicLandingData";
import type { City } from "./publicLanding/publicLandingTypes";

export function PublicLandingPage() {
  const { data: mostVisitedCities = [] } = useMostVisitedCityListQuery();
  const cities: City[] =
    mostVisitedCities.length > 0
      ? mostVisitedCities.map((city, index) => ({
          id: city.id ?? city._id,
          icon: city.logo || fallbackCities[index % fallbackCities.length].icon,
          name: city.name,
        }))
      : fallbackCities;

  return (
    <PageFrame className="flex min-h-0 flex-col overflow-hidden bg-white" variant="flush">
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <LandingHero />
        <CitySelectorSection cities={cities} />
        <LoginCallToAction />
        <DownloadAppSection />
        <PublicFooter />
      </main>
    </PageFrame>
  );
}
