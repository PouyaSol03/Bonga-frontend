import { useState } from "react";

import { PageFrame } from "../app/PageFrame";

import { readStoredSelectedCity } from "../lib/selectedCityStorage";
import { CitySelectionScreen } from "./home/components/CitySelectionScreen";
import { CitySelectorSection } from "./publicLanding/components/CitySelectorSection";
import { DownloadAppSection } from "./publicLanding/components/DownloadAppSection";
import { LandingHero } from "./publicLanding/components/LandingHero";
import { LoginCallToAction } from "./publicLanding/components/LoginCallToAction";
import { PublicFooter } from "./publicLanding/components/PublicFooter";

export function PublicLandingPage() {
  const [isCitySearchOpen, setIsCitySearchOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState(
    () => readStoredSelectedCity()?.name ?? "",
  );

  const navigateToHome = () => {
    window.history.pushState({}, "", "/home");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <PageFrame className="relative flex min-h-0 flex-col overflow-hidden bg-white" variant="flush">
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <LandingHero />
        <CitySelectorSection onOpenCitySearch={() => setIsCitySearchOpen(true)} />
        <LoginCallToAction />
        <DownloadAppSection />
        <PublicFooter />
      </main>
      <CitySelectionScreen
        currentCity={currentCity}
        isOpen={isCitySearchOpen}
        onClose={() => setIsCitySearchOpen(false)}
        onConfirm={(city) => {
          if (!city.name) return;

          setCurrentCity(city.name);
          setIsCitySearchOpen(false);
          navigateToHome();
        }}
        openSearchOnOpen
      />
    </PageFrame>
  );
}
