import { useEffect, useState } from "react";

import { PageFrame } from "../app/PageFrame";
import { getMostVisitedCityList } from "../api/cityApi";

import { CitySelectorSection } from "./publicLanding/components/CitySelectorSection";
import { DownloadAppSection } from "./publicLanding/components/DownloadAppSection";
import { LandingHero } from "./publicLanding/components/LandingHero";
import { LoginCallToAction } from "./publicLanding/components/LoginCallToAction";
import { PublicFooter } from "./publicLanding/components/PublicFooter";
import { cities as fallbackCities } from "./publicLanding/publicLandingData";
import type { City } from "./publicLanding/publicLandingTypes";

export function PublicLandingPage() {
  const [cities, setCities] = useState<City[]>(fallbackCities);

  useEffect(() => {
    let ignore = false;

    getMostVisitedCityList()
      .then((mostVisitedCities) => {
        if (ignore || mostVisitedCities.length === 0) {
          return;
        }

        setCities(
          mostVisitedCities.map((city, index) => ({
            icon: city.logo || fallbackCities[index % fallbackCities.length].icon,
            name: city.name,
          })),
        );
      })
      .catch(() => {
        if (!ignore) {
          setCities(fallbackCities);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

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
