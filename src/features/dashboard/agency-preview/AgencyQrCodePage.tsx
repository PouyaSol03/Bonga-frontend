import { SEO } from "../../../shared/components/SEO";
import { TopBar } from "../../../shared/components/TopBar";
import { useToast } from "../../../shared/hooks/useToast";
import LinearShare from "../../../shared/icons/LinearShare";
import {
  getActiveAuthRole,
  getStoredAuthSession,
} from "../../../shared/auth/auth-storage";
import { REAL_ESTATE_MANAGER } from "../../../shared/constants/roles.constants";
import { readStoredSelectedCity } from "../../../shared/lib/selectedCityStorage";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { useMyAgencyProfileQuery } from "../../account/api/account.hooks";
import {
  usePublicAgencyDetailQuery,
  usePublicAgentDetailQuery,
} from "../../agencies/api/agency.hooks";
import { AgencyQrCard } from "./components/AgencyQrCard";
import { getProfileNeighborhoodIds } from "./profileHelpers";
import { agencyPreviewPath } from "./types";
import {
  getAbsoluteAgencyPreviewUrl,
  getPreviewSearchParam,
  getPublicPreviewId,
  isPublicAgencyPreviewPath,
  isPublicAgentPreviewPath,
  shareOrCopyAgencyUrl,
} from "./urlHelpers";

export function AgencyQrCodePage() {
  const { showToast } = useToast();
  const isPublicPreview = isPublicAgencyPreviewPath();
  const isAgentPreview = isPublicAgentPreviewPath();
  const publicPreviewId = getPublicPreviewId();
  const isRealEstateManager = getActiveAuthRole(getStoredAuthSession()) === REAL_ESTATE_MANAGER;

  const publicAgencyQuery = usePublicAgencyDetailQuery({
    enabled: isPublicPreview && !isAgentPreview && Boolean(publicPreviewId),
    id: publicPreviewId,
  });
  const publicAgentQuery = usePublicAgentDetailQuery({
    enabled: isPublicPreview && isAgentPreview && Boolean(publicPreviewId),
    id: publicPreviewId,
  });
  const agencyProfileQuery = useMyAgencyProfileQuery({
    enabled: !isPublicPreview && isRealEstateManager,
  });

  const profile = agencyProfileQuery.data;
  const publicAgency = publicAgencyQuery.data;
  const publicAgent = publicAgentQuery.data;
  const selectedCity = readStoredSelectedCity();

  const agencyId = isPublicPreview
    ? publicPreviewId
    : String(profile?.id ?? profile?._id ?? "").trim();

  const agencyName = isAgentPreview
    ? publicAgent?.name || getPreviewSearchParam("name") || "مشاور املاک"
    : isPublicPreview
      ? publicAgency?.name || getPreviewSearchParam("name") || "آژانس املاک"
      : profile?.name?.trim() || getPreviewSearchParam("name") || "آژانس املاک";

  const publicPath =
    typeof window !== "undefined"
      ? `${window.location.pathname.replace(/\/qr-code\/?$/, "")}${window.location.search}`
      : "";

  const agencyUrl = isPublicPreview
    ? typeof window !== "undefined"
      ? new URL(publicPath, window.location.origin).toString()
      : publicPath
    : getAbsoluteAgencyPreviewUrl(agencyId, {
        cityId: String(profile?.city_id ?? selectedCity?.id ?? "").trim() || undefined,
        cityName: profile?.city_name?.trim() || selectedCity?.name || undefined,
        location: profile?.address?.trim() || undefined,
        name: agencyName,
        neighborhoodIds: getProfileNeighborhoodIds(profile),
      });

  const backTo = isPublicPreview ? publicPath : agencyPreviewPath;
  const pageTitle = isAgentPreview ? "کیوآرکد مشاور" : "کیوآرکد آژانس";
  const shareText = `صفحه ${isAgentPreview ? "مشاور" : "آژانس"} ${agencyName}`;

  async function handleShareClick() {
    try {
      const result = await shareOrCopyAgencyUrl(agencyUrl, agencyName, shareText);

      if (result === "copied") {
        showToast(`لینک صفحه ${isAgentPreview ? "مشاور" : "آژانس"} کپی شد.`);
      }
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") {
        return;
      }

      showToast("اشتراک‌گذاری با خطا مواجه شد.", "خطا", "error");
    }
  }

  return (
    <div className="bg-surface-container-lowest text-on-surface relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden [direction:rtl]">
      <SEO title={`${pageTitle} ${agencyName}`} />
      <TopBar
        backTo={backTo}
        className="bg-surface-container-lowest"
        contentClassName="px-2"
        title={pageTitle}
      />

      <main className="bg-surface-container-lowest flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 pb-14">
        <AgencyQrCard agencyUrl={agencyUrl} qrLabel={agencyName} />
      </main>

      <footer className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-4 pt-2 pb-[max(16px,env(safe-area-inset-bottom))]">
        <Button
          className="border-primary bg-surface-container-lowest text-primary active:bg-primary/10 flex w-full items-center justify-center gap-2 border transition-colors"
          onClick={() => void handleShareClick()}
          type="button"
          size="x-medium"
          radius="medium"
        >
          <LinearShare className="text-on-surface-var h-5 w-5 shrink-0" />
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-primary"
          >
            اشتراک گذاری
          </Typography>
        </Button>
      </footer>
    </div>
  );
}
