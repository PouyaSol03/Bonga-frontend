import { PageFrame } from "../app/PageFrame";

import { CitySelectorSection } from "./publicLanding/components/CitySelectorSection";
import { DownloadAppSection } from "./publicLanding/components/DownloadAppSection";
import { LandingHero } from "./publicLanding/components/LandingHero";
import { LoginCallToAction } from "./publicLanding/components/LoginCallToAction";
import { PublicFooter } from "./publicLanding/components/PublicFooter";

export function PublicLandingPage() {
  return (
    <PageFrame className="flex min-h-0 flex-col overflow-hidden bg-white" variant="flush">
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <LandingHero />
        <CitySelectorSection />
        <LoginCallToAction />
        <DownloadAppSection />
        <PublicFooter />
      </main>
    </PageFrame>
  );
}
