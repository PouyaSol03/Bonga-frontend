import { PageFrame } from "../app/PageFrame";

import { CitySelectorSection } from "./publicLanding/components/CitySelectorSection";
import { DownloadAppSection } from "./publicLanding/components/DownloadAppSection";
import { LandingHero } from "./publicLanding/components/LandingHero";
import { LoginCallToAction } from "./publicLanding/components/LoginCallToAction";
import { PublicFooter } from "./publicLanding/components/PublicFooter";

export function PublicLandingPage() {
  return (
    <PageFrame className="overflow-y-auto bg-white" variant="flush">
      <LandingHero />
      <CitySelectorSection />
      <LoginCallToAction />
      <DownloadAppSection />
      <PublicFooter />
    </PageFrame>
  );
}
