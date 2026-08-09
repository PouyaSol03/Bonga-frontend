import { useState } from "react";
import { SEO } from "../../shared/components/SEO";

import { PageFrame } from "../../app/layout/PageFrame";

import { readStoredSelectedCity } from "../../shared/lib/selectedCityStorage";
import { CitySelectionScreen } from "../home/components/CitySelectionScreen";
import { CitySelectorSection } from "./components/CitySelectorSection";
import { DownloadAppSection } from "./components/DownloadAppSection";
import { LandingHero } from "./components/LandingHero";
import { LoginCallToAction } from "./components/LoginCallToAction";
import { PublicFooter } from "./components/PublicFooter";

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
      <SEO 
        title="بنگاه | جامع‌ترین سامانه تخصصی املاک و مستغلات" 
        description="با اپلیکیشن بنگاه، به سادگی ملک مورد نظر خود را برای خرید، فروش، رهن یا اجاره پیدا کنید. ارتباط مستقیم با مشاورین املاک و دسترسی به هزاران آگهی روزانه."
        keywords="اپلیکیشن املاک, خرید و فروش ملک, رهن و اجاره آپارتمان, آژانس املاک, ثبت آگهی ملک, دانلود اپلیکیشن بنگاه"
      />
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
