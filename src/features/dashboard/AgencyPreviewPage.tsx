import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { SEO } from "../../shared/components/SEO";
import { AdCard } from "../advertisements/components/AdCard";
import type { AdCardData } from "../advertisements/components/AdCard";
import { BottomSheet } from "../../shared/components/BottomSheet";
import { QRCodeSVG } from "qrcode.react";
import { DivIcon } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import LinearAdd from "../../shared/icons/LinearAdd";
import LinearArrowDown1 from "../../shared/icons/LinearArrowDown1";
import LinearArrowLeft1 from "../../shared/icons/LinearArrowLeft1";
import LinearChat from "../../shared/icons/LinearChat";
import LinearFilterHorizontal from "../../shared/icons/LinearFilterHorizontal";
import LinearLocation from "../../shared/icons/LinearLocation";
import LinearQrCode from "../../shared/icons/LinearQrCode";
import LinearRanking from "../../shared/icons/LinearRanking";
import LinearSearch from "../../shared/icons/LinearSearch";
import LinearShare from "../../shared/icons/LinearShare";
import LinearStar from "../../shared/icons/LinearStar";
import LinearTag from "../../shared/icons/LinearTag";
import { TopBar } from "../../shared/components/TopBar";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import LinearUserSolid from "../../shared/icons/LinearUserSolid";
import { getApiAssetUrl, getApiErrorMessage } from "../../shared/api/api";
import { getActiveAuthRole, getStoredAuthSession } from "../../shared/auth/auth-storage";
import { REAL_ESTATE_MANAGER } from "../../shared/constants/roles.constants";
import { useMyAdsInfiniteQuery, useMyAgencyProfileQuery } from "../account/api/account.hooks";
import {
  useAgencyConsultantsQuery,
  usePublicAgencyDetailQuery,
  usePublicAgentDetailQuery,
} from "../agencies/api/agency.hooks";
import { useAgencyDashboardQuery } from "./api/dashboard.hooks";
import { useNeighborhoodListQuery } from "../locations/api/neighborhood.hooks";
import { readStoredSelectedCity } from "../../shared/lib/selectedCityStorage";
import type { MyAgencyProfile } from "../account/api/account.service";
import type {
  AgencyConsultantDto,
  PublicAgentAgencySummary,
} from "../agencies/api/agency.service";
import { mapAdvertisementToAdCard } from "../advertisements/api/advertisement.service";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";
import LinearAddToList from "../../shared/icons/LinearAddToList";
import TonalInstagram from "../../shared/icons/TonalInstagram";
import TonalTelegram from "../../shared/icons/TonalTelegram";
import TonalWhatsapp from "../../shared/icons/TonalWhatsapp";
import LinearBuilding2 from "../../shared/icons/LinearBuilding2";

const agencyEditPath = "/account/dashboard/agency";
const agencyPreviewPath = "/account/dashboard/agency/preview";
const agencyQrCodePath = `${agencyPreviewPath}/qr-code`;
type AgencyPreviewContactInfo = {
  phone: string;
  secondPhone: string;
  landline: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  lat?: number;
  lng?: number;
};

type AgencyPreviewTab = "info" | "ads" | "consultants";

const consultantAvatarClasses = [
  "from-[#f7c59f] to-[#e6a078]",
  "from-[#b6dcc0] to-[#68a987]",
  "from-[#d7c1ab] to-[#a87556]",
  "from-[#f0d0a7] to-[#b98457]",
];

const agencyTabs: { id: AgencyPreviewTab; label: string }[] = [
  { id: "ads", label: "آگهی‌ها" },
  { id: "consultants", label: "مشاوران" },
  { id: "info", label: "اطلاعات" },
];

function getPreviewSearchParam(name: string) {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(name)?.trim() ?? "";
}

function getProfileNeighborhoodIds(profile?: MyAgencyProfile | null) {
  if (!profile) return [];

  return Array.from(
    new Set(
      (profile.neighborhood_ids ?? [])
        .flatMap((value) => String(value).split(","))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

function getPreviewNeighborhoodIds() {
  return Array.from(
    new Set(
      getPreviewSearchParam("neighborhood_ids")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

function toPersianDigits(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)] ?? digit);
}

function toOptionalCoordinate(value: number | string | null | undefined) {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string" || !value.trim()) return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getAgencyConsultantRoleLabel(role: string) {
  switch (role.trim().toLowerCase()) {
    case "owner":
      return "مدیر آژانس";
    case "manager":
      return "مدیر";
    case "consultant":
    case "member":
      return "مشاور املاک";
    default:
      return role.trim() || "مشاور املاک";
  }
}

function readAgencyProfileSocialValue(
  profile: MyAgencyProfile | null | undefined,
  key: "instagram" | "telegram" | "whatsapp",
) {
  if (!profile) return "";

  const record = profile as unknown as Record<string, unknown>;
  const directValue = record[key];
  if (typeof directValue === "string" && directValue.trim()) return directValue.trim();

  for (const sourceKey of ["social", "contact_social", "contacts"]) {
    const source = record[sourceKey];
    if (!source || typeof source !== "object" || Array.isArray(source)) continue;

    const value = (source as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
}

function resolvePreviewContactInfo(
  profile: MyAgencyProfile | null | undefined,
  isPublicPreview: boolean,
): AgencyPreviewContactInfo {
  if (!profile) {
    return {
      phone: isPublicPreview ? getPreviewSearchParam("phone1") : "",
      secondPhone: isPublicPreview ? getPreviewSearchParam("phone2") : "",
      landline: isPublicPreview ? getPreviewSearchParam("phone3") : "",
      whatsapp: "",
      telegram: "",
      instagram: "",
      lat: undefined,
      lng: undefined,
    };
  }

  return {
    phone: profile.phone1?.trim() ?? "",
    secondPhone: profile.phone2?.trim() ?? "",
    landline: profile.phone3?.trim() ?? "",
    whatsapp: readAgencyProfileSocialValue(profile, "whatsapp"),
    telegram: readAgencyProfileSocialValue(profile, "telegram"),
    instagram: readAgencyProfileSocialValue(profile, "instagram"),
    lat: toOptionalCoordinate(profile.lat),
    lng: toOptionalCoordinate(profile.lng),
  };
}

function getInitialAgencyTab(): AgencyPreviewTab {
  if (typeof window === "undefined") return "info";

  const tab = new URLSearchParams(window.location.search).get("tab");

  if (window.location.pathname.startsWith("/agents/") && tab === "consultants") {
    return "info";
  }

  return tab === "ads" || tab === "consultants" || tab === "info" ? tab : "info";
}

function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function isPublicAgencyPreviewPath() {
  return (
    typeof window !== "undefined" &&
    (window.location.pathname.startsWith("/agencies/") ||
      window.location.pathname.startsWith("/agents/"))
  );
}

function isPublicAgentPreviewPath() {
  return typeof window !== "undefined" && window.location.pathname.startsWith("/agents/");
}

function getPublicPreviewId() {
  if (typeof window === "undefined") return "";

  const match = window.location.pathname.match(/^\/(?:agencies|agents)\/([^/]+)\/?$/);
  return match?.[1] ? decodeURIComponent(match[1]) : "";
}

function getCurrentAgencyPreviewPath() {
  if (typeof window === "undefined") return agencyPreviewPath;

  return isPublicAgencyPreviewPath() ? window.location.pathname : agencyPreviewPath;
}

function getAgencyDisplayName() {
  if (typeof window === "undefined") return "";

  return new URLSearchParams(window.location.search).get("name")?.trim() || "";
}

function getAgencyLocationLabel() {
  if (typeof window === "undefined") return "";

  return new URLSearchParams(window.location.search).get("location")?.trim() || "";
}

function getAbsoluteAgencyPreviewUrl(
  agencyId?: string,
  data?: {
    aboutUs?: string;
    activeAds?: string;
    cityId?: string;
    cityName?: string;
    location?: string;
    logo?: string;
    name?: string;
    neighborhoodIds?: string[];
    phone1?: string;
    phone2?: string;
    phone3?: string;
    rank?: string;
    score?: string;
  },
) {
  if (typeof window === "undefined") return agencyPreviewPath;

  const path = !isPublicAgencyPreviewPath() && agencyId
    ? `/agencies/${encodeURIComponent(agencyId)}`
    : getCurrentAgencyPreviewPath();
  const url = new URL(path, window.location.origin);

  if (data?.name) url.searchParams.set("name", data.name);
  if (data?.location) url.searchParams.set("location", data.location);
  if (data?.logo) url.searchParams.set("logo", data.logo);
  if (data?.aboutUs) url.searchParams.set("about_us", data.aboutUs);
  if (data?.cityId) url.searchParams.set("city_id", data.cityId);
  if (data?.cityName) url.searchParams.set("city_name", data.cityName);
  if (data?.neighborhoodIds?.length) {
    url.searchParams.set("neighborhood_ids", data.neighborhoodIds.join(","));
  }
  if (data?.phone1) url.searchParams.set("phone1", data.phone1);
  if (data?.phone2) url.searchParams.set("phone2", data.phone2);
  if (data?.phone3) url.searchParams.set("phone3", data.phone3);
  if (data?.rank) url.searchParams.set("rank", data.rank);
  if (data?.score) url.searchParams.set("score", data.score);
  if (data?.activeAds) url.searchParams.set("active_ads", data.activeAds);

  return url.toString();
}

function getCurrentPageUrl() {
  if (typeof window === "undefined") return agencyPreviewPath;

  return window.location.href;
}

async function shareOrCopyAgencyUrl(url: string, title: string, text: string) {
  const shareData = { text, title, url };

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      if (!navigator.canShare || navigator.canShare(shareData)) {
        await navigator.share(shareData);

        return "shared" as const;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }
    }
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);

      return "copied" as const;
    } catch {
      // Fall through to the legacy copy method for non-secure browser contexts.
    }
  }

  if (typeof document !== "undefined") {
    const input = document.createElement("textarea");
    input.value = url;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(input);

    if (copied) return "copied" as const;
  }

  throw new Error("Sharing is not supported in this browser.");
}

type AgencyToast = {
  message: string;
  title: string;
  variant: "error" | "success" | "info" | "warning";
};


export function AgencyPreviewPage() {
  const [activeTab, setActiveTab] = useState<AgencyPreviewTab>(getInitialAgencyTab);
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false);
  const [toast, setToast] = useState<AgencyToast | null>(null);
  const isPublicPreview = isPublicAgencyPreviewPath();
  const isAgentPreview = isPublicAgentPreviewPath();
  const previewPath = getCurrentAgencyPreviewPath();
  const publicPreviewId = getPublicPreviewId();
  const isRealEstateManager =
    getActiveAuthRole(getStoredAuthSession()) === REAL_ESTATE_MANAGER;
  const publicAgencyQuery = usePublicAgencyDetailQuery({
    enabled: isPublicPreview && !isAgentPreview,
    id: publicPreviewId,
  });
  const publicAgentQuery = usePublicAgentDetailQuery({
    enabled: isPublicPreview && isAgentPreview,
    id: publicPreviewId,
  });
  const agencyProfileQuery = useMyAgencyProfileQuery({
    enabled: !isPublicPreview && isRealEstateManager,
  });
  const agencyDashboardQuery = useAgencyDashboardQuery({
    enabled: !isPublicPreview && isRealEstateManager,
    period: "30d",
  });
  const ownAdsQuery = useMyAdsInfiniteQuery({
    enabled: !isPublicPreview && isRealEstateManager && activeTab === "ads",
    perPage: 100,
    type: "active",
  });
  const agencyConsultantsQuery = useAgencyConsultantsQuery({
    enabled:
      !isPublicPreview && isRealEstateManager && activeTab === "consultants",
    perPage: 100,
  });
  const profile = agencyProfileQuery.data;
  const publicAgency = publicAgencyQuery.data;
  const publicAgent = publicAgentQuery.data;
  const selectedCity = readStoredSelectedCity();
  const entityId = isAgentPreview
    ? publicAgent?.id ?? publicPreviewId
    : publicAgency?.id ?? String(profile?.id ?? profile?._id ?? "").trim();
  const entityName = isAgentPreview
    ? publicAgent?.name || getAgencyDisplayName() || "مشاور املاک"
    : publicAgency?.name || profile?.name?.trim() || getAgencyDisplayName() || "آژانس املاک";
  const cityId = String(
    profile?.city_id || getPreviewSearchParam("city_id") || selectedCity?.id || "",
  ).trim();
  const cityName =
    profile?.city_name?.trim() ||
    getPreviewSearchParam("city_name") ||
    selectedCity?.name ||
    "";
  const entityLocation = isAgentPreview
    ? publicAgent?.agency?.address ||
      publicAgent?.agency?.name ||
      cityName ||
      getAgencyLocationLabel()
    : publicAgency?.address || profile?.address?.trim() || cityName || getAgencyLocationLabel();
  const entityLogo = isAgentPreview
    ? publicAgent?.avatar || getPreviewSearchParam("logo")
    : publicAgency?.logo ||
      publicAgency?.img ||
      (profile?.logo ? getApiAssetUrl(profile.logo) : "") ||
      getPreviewSearchParam("logo");
  const entityAbout = isAgentPreview
    ? publicAgent?.about_us || getPreviewSearchParam("about_us")
    : publicAgency?.about_us ||
      profile?.about_us?.trim() ||
      (isPublicPreview ? getPreviewSearchParam("about_us") : "");
  const activityAreaIds = isAgentPreview
    ? publicAgent?.neighborhood_ids ?? getPreviewNeighborhoodIds()
    : publicAgency?.neighborhood_ids ??
      (profile ? getProfileNeighborhoodIds(profile) : getPreviewNeighborhoodIds());
  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: Boolean(cityId) && activityAreaIds.length > 0,
    page: 1,
    perPage: 500,
    q: "",
  });
  const neighborhoodNameById = new Map(
    (neighborhoodsQuery.data ?? []).map((neighborhood) => [
      String(neighborhood.id ?? neighborhood._id ?? ""),
      neighborhood.name,
    ]),
  );
  const activityAreas = activityAreaIds.map(
    (id) => neighborhoodNameById.get(id) ?? id,
  );
  const contactInfo: AgencyPreviewContactInfo = isAgentPreview
    ? {
        phone: publicAgent?.mobile ?? getPreviewSearchParam("phone1"),
        secondPhone: "",
        landline: "",
        whatsapp: publicAgent?.whatsapp ?? "",
        telegram: publicAgent?.telegram ?? "",
        instagram: publicAgent?.instagram ?? "",
        lat: undefined,
        lng: undefined,
      }
    : publicAgency
      ? {
          phone: publicAgency.phone1 ?? "",
          secondPhone: publicAgency.phone2 ?? "",
          landline: publicAgency.phone3 ?? "",
          whatsapp: publicAgency.whatsapp ?? "",
          telegram: publicAgency.telegram ?? "",
          instagram: publicAgency.instagram ?? "",
          lat: publicAgency.lat,
          lng: publicAgency.lng,
        }
      : resolvePreviewContactInfo(profile, isPublicPreview);
  const dashboard = agencyDashboardQuery.data;
  const publicScore = isAgentPreview ? publicAgent?.score : publicAgency?.score;
  const publicRank = isAgentPreview ? publicAgent?.rank : publicAgency?.rank;
  const publicActiveAds = isAgentPreview
    ? publicAgent?.active_advertises_count
    : publicAgency?.active_advertises_count;
  const entityLevel = isAgentPreview
    ? publicAgent?.level_slug
    : publicAgency?.level_slug;
  const workingHours = isAgentPreview ? "" : publicAgency?.working_hours ?? profile?.working_hours ?? "";
  const entityStats = [
    {
      icon: <LinearStar className="h-4 w-4" />,
      label: "امتیاز",
      value: isPublicPreview
        ? toPersianDigits(publicScore ?? null)
        : dashboard
          ? toPersianDigits(dashboard.ranking.current.totalScore)
          : toPersianDigits(getPreviewSearchParam("score") || null),
    },
    {
      icon: <LinearRanking className="h-4 w-4" />,
      label: "رتبه",
      value: isPublicPreview
        ? toPersianDigits(publicRank ?? null)
        : dashboard
          ? toPersianDigits(dashboard.ranking.rank)
          : toPersianDigits(getPreviewSearchParam("rank") || null),
    },
    {
      icon: <LinearTag className="h-4 w-4" />,
      label: "آگهی فعال",
      value: isPublicPreview
        ? toPersianDigits(publicActiveAds ?? null)
        : dashboard
          ? toPersianDigits(dashboard.publishedAdvertises.total)
          : toPersianDigits(getPreviewSearchParam("active_ads") || null),
    },
  ];
  const recentAdvertises = isAgentPreview
    ? publicAgent?.recent_advertises ?? []
    : publicAgency?.recent_advertises ?? [];
  const previewAds = isPublicPreview
    ? recentAdvertises.map((advertise, index) => ({
        ...mapAdvertisementToAdCard(advertise, index),
        agency: entityName,
      }))
    : (ownAdsQuery.data?.pages ?? [])
        .flatMap((page) => page.data)
        .map((advertise, index) => ({
          ...mapAdvertisementToAdCard(advertise, index),
          agency: entityName,
        }));
  const consultants = isPublicPreview
    ? publicAgency?.consultants ?? []
    : agencyConsultantsQuery.data?.data ?? [];
  const availableTabs = isAgentPreview
    ? agencyTabs.filter((tab) => tab.id !== "consultants")
    : agencyTabs;
  const entityLabel = isAgentPreview ? "مشاور" : "آژانس";
  const pageTitle = `صفحه ${entityLabel}`;
  const seoTitle = `${entityName} | ${entityLabel} املاک | بنگاه`;
  const seoDescription =
    entityAbout?.trim() ||
    `${entityName}، ${entityLabel} املاک${entityLocation ? ` در ${entityLocation}` : ""}. مشاهده اطلاعات، آگهی‌های فعال و راه‌های ارتباطی در بنگاه.`;
  const shareTitle = entityName;
  const shareText = `${pageTitle} ${shareTitle}`;
  const shareUrl = isPublicPreview
    ? getCurrentPageUrl()
    : getAbsoluteAgencyPreviewUrl(entityId, {
        aboutUs: entityAbout,
        activeAds: dashboard
          ? String(dashboard.publishedAdvertises.total)
          : undefined,
        cityId,
        cityName,
        location: entityLocation,
        logo: entityLogo,
        name: entityName,
        neighborhoodIds: activityAreaIds,
        phone1: contactInfo.phone,
        phone2: contactInfo.secondPhone,
        phone3: contactInfo.landline,
        rank: dashboard ? String(dashboard.ranking.rank) : undefined,
        score: dashboard
          ? String(dashboard.ranking.current.totalScore)
          : undefined,
      });
  const publicPreviewLoading = isAgentPreview
    ? publicAgentQuery.isLoading
    : publicAgencyQuery.isLoading;
  const publicPreviewError = isAgentPreview
    ? publicAgentQuery.error
    : publicAgencyQuery.error;
  const hasPublicPreviewData = isAgentPreview ? Boolean(publicAgent) : Boolean(publicAgency);

  useEffect(() => {
    if (isAgentPreview && activeTab === "consultants") {
      setActiveTab("info");
    }
  }, [activeTab, isAgentPreview]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (
    message: string,
    title = "انجام شد",
    variant: "error" | "success" | "info" | "warning" = "success",
  ) => {
    setToast({ message, title, variant });
  };

  async function handleShareClick() {
    try {
      const result = await shareOrCopyAgencyUrl(shareUrl, shareTitle, shareText);

      if (result === "copied") {
        showToast(`لینک صفحه ${entityLabel} کپی شد.`);
      }
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") {
        return;
      }

      showToast("اشتراک‌گذاری با خطا مواجه شد.", "خطا", "error");
    }
  }

  function changeTab(tab: AgencyPreviewTab) {
    if (isAgentPreview && tab === "consultants") return;

    setActiveTab(tab);

    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    window.history.replaceState(window.history.state ?? {}, "", `${previewPath}?${params.toString()}`);
  }

  const retryPublicPreview = () => {
    if (isAgentPreview) {
      void publicAgentQuery.refetch();
    } else {
      void publicAgencyQuery.refetch();
    }
  };

  return (
    <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]">
      <SEO
        title={seoTitle}
        description={seoDescription}
        ogImage={entityLogo || undefined}
        ogType={isAgentPreview ? "profile" : "website"}
        twitterCard={entityLogo ? "summary_large_image" : "summary"}
        structuredData={
          isPublicPreview
            ? {
                "@context": "https://schema.org",
                "@type": isAgentPreview ? "Person" : "Organization",
                name: entityName,
                description: seoDescription,
                ...(entityLogo ? { image: entityLogo } : {}),
                ...(entityLocation ? { address: entityLocation } : {}),
              }
            : undefined
        }
      />
      <h1 className="sr-only">{seoTitle}</h1>
      <TopBar
        actions={
          isPublicPreview
            ? [
                {
                  id: "share",
                  label: "اشتراک‌گذاری",
                  icon: <LinearShare className="h-6 w-6" />,
                  onClick: () => void handleShareClick(),
                },
              ]
            : [
                {
                  id: "share",
                  label: "اشتراک‌گذاری",
                  icon: <LinearShare className="h-6 w-6" />,
                  onClick: () => void handleShareClick(),
                },
                {
                  id: "qr-code",
                  label: "کد QR",
                  icon: <LinearQrCode className="h-6 w-6" />,
                  to: agencyQrCodePath,
                },
              ]
        }
        backTo={isPublicPreview ? "/home" : agencyEditPath}
        contentClassName="px-1"
        title={pageTitle}
      />
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-15">
        {isPublicPreview && publicPreviewLoading ? (
          <PublicPreviewLoadingState />
        ) : isPublicPreview && (!hasPublicPreviewData || publicPreviewError) ? (
          <PublicPreviewErrorState
            message={
              publicPreviewError instanceof Error
                ? publicPreviewError.message
                : getApiErrorMessage(
                    publicPreviewError,
                    `دریافت اطلاعات ${entityLabel} ناموفق بود.`,
                  )
            }
            onRetry={retryPublicPreview}
          />
        ) : (
          <>
            <AgencyHero
              agencyLocation={entityLocation}
              agencyLogo={entityLogo}
              agencyName={entityName}
              agencyStats={entityStats}
              isAgent={isAgentPreview}
              levelSlug={entityLevel}
            />
            <AgencySegmentedTabs
              activeTab={activeTab}
              onChange={changeTab}
              tabs={availableTabs}
            />
            {activeTab === "ads" ? (
              <AgencyAdsTab
                ads={previewAds}
                previewPath={previewPath}
                showFilter={!isPublicPreview}
              />
            ) : activeTab === "consultants" && !isAgentPreview ? (
              <AgencyConsultantsTab consultants={consultants} />
            ) : (
              <AgencyInfoTab
                aboutUs={entityAbout}
                activityAreas={activityAreas}
                agencyName={entityName}
                agentAgency={isAgentPreview ? publicAgent?.agency : undefined}
                entityLabel={entityLabel}
                workingHours={workingHours}
              />
            )}
          </>
        )}
      </main>
      {(!isPublicPreview || hasPublicPreviewData) ? (
        <AgencyPreviewFooter
          entityLabel={entityLabel}
          onContactClick={() => setIsContactSheetOpen(true)}
        />
      ) : null}
      <AgencyContactBottomSheet
        contactInfo={contactInfo}
        isOpen={isContactSheetOpen}
        onClose={() => setIsContactSheetOpen(false)}
      />
    </div>
  );
}

export function AgencyQrCodePage() {
  const [toast, setToast] = useState<AgencyToast | null>(null);
  const isRealEstateManager =
    getActiveAuthRole(getStoredAuthSession()) === REAL_ESTATE_MANAGER;
  const agencyProfileQuery = useMyAgencyProfileQuery({ enabled: isRealEstateManager });
  const profile = agencyProfileQuery.data;
  const selectedCity = readStoredSelectedCity();
  const agencyId = String(profile?.id ?? profile?._id ?? "").trim();
  const agencyName = profile?.name?.trim() || "آژانس املاک";
  const agencyUrl = getAbsoluteAgencyPreviewUrl(agencyId, {
    cityId: String(profile?.city_id ?? selectedCity?.id ?? "").trim() || undefined,
    cityName: profile?.city_name?.trim() || selectedCity?.name || undefined,
    location: profile?.address?.trim() || undefined,
    name: agencyName,
    neighborhoodIds: getProfileNeighborhoodIds(profile),
  });
  const qrLabel = agencyId ? `Agency${agencyId}` : "—";
  const shareText = `صفحه آژانس ${agencyName}`;

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (
    message: string,
    title = "انجام شد",
    variant: "error" | "success" | "info" | "warning" = "success",
  ) => {
    setToast({ message, title, variant });
  };

  async function handleShareClick() {
    try {
      const result = await shareOrCopyAgencyUrl(agencyUrl, agencyName, shareText);

      if (result === "copied") {
        showToast("لینک صفحه آژانس کپی شد.");
      }
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") {
        return;
      }

      showToast("اشتراک‌گذاری با خطا مواجه شد.", "خطا", "error");
    }
  }

  return (
    <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]">
      <TopBar
        backTo={agencyPreviewPath}
        className="bg-[#f0f0f0]"
        contentClassName="px-2"
        title="کیوآرکد آژانس"
        titleClassName="text-base font-semibold leading-6"
      />

      <main className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto bg-white px-4 pb-14">
        <AgencyQrCard agencyUrl={agencyUrl} qrLabel={qrLabel} />
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-2">
        <Button
          className="flex w-full items-center justify-center gap-2 border border-[#0048c4] bg-white text-[#0048c4] transition-colors active:bg-[#0048c414]"
          onClick={() => void handleShareClick()}
          type="button"
          size="x-medium"
          radius="medium"
        >
          <LinearShare className="h-5 w-5 shrink-0 text-[#4d4d4d]" />
          <Typography as="span" variant="label" size="medium" weight="medium" className="text-[#0048c4]">
            اشتراک گذاری
          </Typography>
        </Button>
      </footer>
    </div>
  );
}

function AgencyQrCard({
  agencyUrl,
  qrLabel,
}: {
  agencyUrl: string;
  qrLabel: string;
}) {
  return (
    <section className="flex w-full flex-col items-center justify-center text-center">
      <div className="relative h-[240px] w-[240px] overflow-hidden bg-white">
        <QRCodeSVG
          bgColor="#ffffff"
          className="block h-[240px] w-[240px]"
          fgColor="#000000"
          level="M"
          marginSize={0}
          size={240}
          title="کد QR صفحه آژانس"
          value={agencyUrl}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#002099] to-[#4b5070] mix-blend-screen"
        />
      </div>

      <Typography as="p" variant="headline" size="small" className="m-0 mt-2 text-center text-[28px] font-medium leading-9 text-[#4b5070] [direction:ltr]">
        {qrLabel}
      </Typography>
    </section>
  );
}

function PublicPreviewLoadingState() {
  return (
    <div className="animate-pulse space-y-2">
      <section className="bg-white px-4 pb-5 pt-5 text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-[#e6e9ef]" />
        <div className="mx-auto mt-4 h-7 w-40 rounded-lg bg-[#e6e9ef]" />
        <div className="mx-auto mt-3 h-6 w-28 rounded-full bg-[#eef0f4]" />
        <div className="mt-6 grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="h-12 rounded-lg bg-[#eef0f4]" key={index} />
          ))}
        </div>
      </section>
      <div className="h-14 bg-white" />
      <div className="h-48 bg-white" />
    </div>
  );
}

function PublicPreviewErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[420px] w-full flex-col items-center justify-center px-6 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-[#fff0ef] text-2xl text-[#d93645]">!</div>
      <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 mt-4 text-base font-bold text-[#1a1a1a]">دریافت اطلاعات ناموفق بود</Typography>
      <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 max-w-sm text-sm leading-6 text-[#808080]">{message}</Typography>
      <Button unstyled
        className="mt-5 h-10 rounded-xl bg-[#0048c4] px-6 text-sm font-semibold text-white"
        onClick={onRetry}
        type="button"
      >
        تلاش دوباره
      </Button>
    </div>
  );
}

function AgencyHero({
  agencyLocation,
  agencyLogo,
  agencyName,
  agencyStats,
  isAgent = false,
  levelSlug,
}: {
  agencyLocation: string;
  agencyLogo?: string;
  agencyName: string;
  agencyStats: Array<{ icon: ReactNode; label: string; value: string }>;
  isAgent?: boolean;
  levelSlug?: string;
}) {
  return (
    <section className="bg-white px-4 pb-4 pt-3 text-center">
      {agencyLogo ? (
        <img
          alt={agencyName}
          className={`mx-auto h-19 w-19 ${isAgent ? "rounded-full object-cover" : "object-contain"}`}
          src={agencyLogo}
        />
      ) : (
        <div className="mx-auto grid h-19 w-19 place-items-center rounded-full bg-[#eef0f4] text-[#808080]">
          <LinearBuilding2 className="h-10 w-10" />
        </div>
      )}
      <Typography as="h2" variant="title" size="large" weight="semibold" className="m-0 mt-2 text-[#4d4d4d]">{agencyName}</Typography>
      <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
        {agencyLocation ? (
          <div className="inline-flex items-center gap-1 rounded-full bg-[#e7e8ed] px-2 py-0.5 text-[#4B5070]">
            <LinearLocation className="h-4 w-4 text-[#4B5070]" />
            <Typography variant="body" size="small" weight="medium">
            {agencyLocation}
            </Typography>
          </div>
        ) : null}
        {levelSlug ? (
          <Typography as="span" variant="label" size="small" weight="semibold" className="inline-flex min-h-7 items-center rounded-full bg-[#eef4ff] px-2.5 py-1 text-xs font-semibold text-[#0048c4]">
            سطح {levelSlug.replace(/[-_]/g, " ")}
          </Typography>
        ) : null}
      </div>

      <div className="mt-4 flex items-center text-[#4d4d4d]">
        {agencyStats.map((item, index) => (
          <div className="contents" key={item.label}>
            <div className="grid flex-1 gap-1 text-center">
              <Typography as="span" variant="body" size="small" weight="regular" className="mx-auto inline-flex items-center gap-1 text-on-surface">
                {item.icon}
                {item.label}
              </Typography>
              <Typography variant="title" size="small" weight="semibold" className="text-on-surface">
                {item.value}
              </Typography>
            </div>
            {index < agencyStats.length - 1 ? (
              <div aria-hidden="true" className="h-7 w-px shrink-0 bg-[#dddddd]" />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function AgencySegmentedTabs({
  activeTab,
  onChange,
  tabs = agencyTabs,
}: {
  activeTab: AgencyPreviewTab;
  onChange: (tab: AgencyPreviewTab) => void;
  tabs?: Array<{ id: AgencyPreviewTab; label: string }>;
}) {
  return (
    <div className="relative z-10 bg-white px-4 pb-4 shadow-[0_4px_12px_rgba(0,0,0,0.10)]">
      <div
        className="grid h-10 overflow-hidden rounded-xl border border-[#808080] bg-white text-sm font-semibold leading-5 text-[#4d4d4d]"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <Button unstyled
              aria-pressed={isActive}
              className={`h-full transition-colors ${isActive ? "bg-[#dfe8fa] text-[#0048c4]" : "bg-white text-[#4d4d4d]"}`}
              key={tab.id}
              onClick={() => onChange(tab.id)}
              type="button"
            >
              <Typography variant="label" size="large" weight="medium">
              {tab.label}
              </Typography>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function AgencyInfoTab({
  aboutUs,
  activityAreas,
  agencyName,
  agentAgency,
  entityLabel = "آژانس",
  workingHours = "",
}: {
  aboutUs: string;
  activityAreas: string[];
  agencyName: string;
  agentAgency?: PublicAgentAgencySummary;
  entityLabel?: string;
  workingHours?: string;
}) {
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const activityAreaText = activityAreas.length
    ? activityAreas.join("، ")
    : "محدوده فعالیت ثبت نشده است.";
  const aboutText = aboutUs || `توضیحی برای این ${entityLabel} ثبت نشده است.`;

  return (
    <div className="space-y-2 bg-[#f0f0f0]">
      <section className="bg-white px-4 py-4">
        <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0 text-right">نشان‌ها</Typography>
        <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-4 text-center text-[#808080]">
          اطلاعات نشان‌ها از سرور دریافت نشده است.
        </Typography>
      </section>

      <section className="bg-white p-4">
        <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6">محدوده فعالیت</Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-4 text-sm font-normal leading-7 text-[#4d4d4d]">
          {activityAreaText}
        </Typography>
      </section>

      {agentAgency?.name ? (
        <Button unstyled
          className="flex w-full items-center gap-3 bg-white p-4 text-right"
          onClick={() => {
            if (agentAgency.id) {
              navigateTo(`/agencies/${encodeURIComponent(agentAgency.id)}`);
            }
          }}
          type="button"
        >
          {agentAgency.logo ? (
            <img
              alt={agentAgency.name}
              className="h-12 w-12 shrink-0 rounded-xl object-contain"
              src={agentAgency.logo}
            />
          ) : (
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#eef0f4] text-[#808080]">
              <LinearUserSolid className="h-6 w-6" />
            </div>
          )}
          <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1">
            <strong className="block truncate text-sm text-[#1a1a1a]">{agentAgency.name}</strong>
            {agentAgency.address ? (
              <Typography as="span" variant="body" size="small" weight="regular" className="mt-1 block truncate text-xs text-[#808080]">{agentAgency.address}</Typography>
            ) : null}
          </Typography>
          {agentAgency.id ? <LinearArrowLeft1 className="h-5 w-5 text-[#4d4d4d]" /> : null}
        </Button>
      ) : null}

      {workingHours ? (
        <section className="bg-white p-4">
          <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6">ساعات کاری</Typography>
          <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-3 text-sm leading-6 text-[#4d4d4d]">{workingHours}</Typography>
        </section>
      ) : null}

      <AgencyActionRow icon={<LinearAdd className="h-6 w-6 text-on-surface-var" />} title="ثبت آگهی رایگان" />
      <AgencyActionRow icon={<LinearAddToList className="h-6 w-6 text-on-surface-var" />} title="ثبت بازخورد" />

      <section className="bg-white p-4 text-center">
        <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0 text-right text-base font-semibold leading-6">درباره {agencyName}</Typography>
        <img alt="" src="/vectors/Bonga.svg" />
        <Typography as="p" variant="body" size="medium" weight="regular" className={`m-0 mt-5 text-right font-normal leading-8 text-[#4d4d4d] ${isAboutExpanded ? "" : "line-clamp-5"}`}>
          {aboutText}
        </Typography>
        {aboutText.length > 220 ? (
          <Button unstyled
            aria-expanded={isAboutExpanded}
            className="mx-auto mt-2 inline-flex items-center gap-1 text-xs font-semibold leading-4 text-[#0048c4]"
            onClick={() => setIsAboutExpanded((prev) => !prev)}
            type="button"
          >
            <LinearArrowDown1 className={`h-4 w-4 transition-transform duration-300 ${isAboutExpanded ? "rotate-180" : ""}`} />
            {isAboutExpanded ? "نمایش کمتر" : "نمایش بیشتر"}
          </Button>
        ) : null}
      </section>

    </div>
  );
}

function AgencyActionRow({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <Button unstyled className="flex w-full items-center gap-3 bg-white p-4 text-right" type="button">
      <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-6 w-6 place-items-center text-[#4d4d4d]">{icon}</Typography>
      <Typography as="span" variant="label" size="large" weight="medium" className="min-w-0 flex-1 text-[#1a1a1a]">{title}</Typography>
      <LinearArrowLeft1 className="h-6 w-6 text-[#4d4d4d]" />
    </Button>
  );
}

function AgencyAdsTab({
  ads,
  previewPath,
  showFilter = true,
}: {
  ads: AdCardData[];
  previewPath: string;
  showFilter?: boolean;
}) {
  const [query, setQuery] = useState("");
  const filterReturnTo = encodeURIComponent(`${previewPath}?tab=ads`);
  const normalizedQuery = query.trim().toLocaleLowerCase("fa-IR");
  const visibleAds = useMemo(
    () =>
      normalizedQuery
        ? ads.filter((ad) =>
            [ad.title, ad.agency, ad.area, ad.timeAndLocation, ...ad.badges]
              .join(" ")
              .toLocaleLowerCase("fa-IR")
              .includes(normalizedQuery),
          )
        : ads,
    [ads, normalizedQuery],
  );

  return (
    <div className="space-y-2 bg-surface-container-lowest px-0 pb-3 pt-5">
      <div className="flex items-center gap-2 px-4 [direction:ltr]">
        {showFilter ? (
          <Button unstyled
            aria-label="فیلتر آگهی‌ها"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-primary bg-[#eaf2ff] text-primary"
            onClick={() => navigateTo(`${agencyPreviewPath}/filter?returnTo=${filterReturnTo}`)}
            type="button"
          >
            <LinearFilterHorizontal className="h-6 w-6" />
          </Button>
        ) : null}
        <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#a6a6a6] bg-white px-3 [direction:rtl]">
          <LinearSearch className="h-6 w-6 shrink-0 text-[#4d4d4d]" />
          <input
            className="min-w-0 flex-1 border-0 bg-transparent text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجو در آگهی‌ها"
            type="search"
            value={query}
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        {visibleAds.length ? (
          visibleAds.map((ad) => <AdCard key={ad.id} ad={ad} to={`/ads/${ad.id}`} />)
        ) : normalizedQuery ? (
          <SearchEmptyState />
        ) : (
          <div className="bg-white px-4 py-12 text-center text-sm text-[#808080]">
            آگهی فعالی برای نمایش وجود ندارد.
          </div>
        )}
      </div>
    </div>
  );
}

function AgencyConsultantsTab({ consultants }: { consultants: AgencyConsultantDto[] }) {
  return (
    <section className="flex flex-col gap-y-2">
      {consultants.map((consultant, index) => (
        <Button unstyled
          className={`flex w-full items-center justify-center gap-4 bg-white px-4 py-4 text-center transition active:bg-[#fafafa] ${index < consultants.length - 1 ? "border-b border-[#f0f0f0]" : ""}`}
          key={consultant.agentId ?? consultant.userId}
          onClick={() => {
            if (consultant.agentId === undefined) return;
            navigateTo(`/agents/${encodeURIComponent(String(consultant.agentId))}`);
          }}
          type="button"
        >
          <div className="flex flex-col items-center">
            <ConsultantAvatar
              className={consultantAvatarClasses[index % consultantAvatarClasses.length]}
              name={consultant.name}
              src={consultant.avatar}
            />
            <Typography as="h3" variant="title" size="medium" weight="medium" className="m-0 mt-2 text-[#4D4D4D]">{consultant.name}</Typography>
            <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-1 px-2 py-0.5 rounded-lg bg-[#80808014] text-[#808080]">{getAgencyConsultantRoleLabel(consultant.role)}</Typography>
            <div className="mt-4 flex items-center justify-center gap-5 text-xs font-medium leading-4 text-[#4d4d4d]">
              <Typography as="span" variant="body" size="medium" weight="regular" className="inline-flex items-center gap-1">
                <LinearStar className="h-4 w-4" />
                <Typography as="p" variant="body" size="small" weight="medium" className="text-xs font-medium text-[#1A1A1A]">امتیاز</Typography>
                <Typography as="span" variant="label" size="medium" weight="semibold" className="mr-3 font-semibold text-sm text-[#11A366]">{toPersianDigits(consultant.metrics.rankingScore)}</Typography>
              </Typography>
              <div className="h-4.75 w-px bg-[#CCCCCC]"></div>
              <Typography as="span" variant="body" size="medium" weight="regular" className="inline-flex items-center gap-1">
                <LinearRanking className="h-4 w-4" />
                <Typography as="p" variant="body" size="small" weight="medium" className="text-xs font-medium text-[#1A1A1A]">رتبه</Typography>
                <Typography as="span" variant="label" size="medium" weight="semibold" className="mr-3 font-semibold text-sm text-[#11A366]">—</Typography>
              </Typography>
            </div>
          </div>
        </Button>
      ))}
    </section>
  );
}

function ConsultantAvatar({
  className: _className = "",
  name,
  src,
}: {
  className?: string;
  name: string;
  src?: string;
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const shouldShowImage = Boolean(src) && !hasImageError;

  return (
    <div
      className="grid h-18 w-18 place-items-center overflow-hidden rounded-full bg-gradient-to-br bg-surface-container-low"
    >
      {shouldShowImage ? (
        <img
          alt={name}
          className="h-full w-full rounded-full object-cover"
          onError={() => setHasImageError(true)}
          src={src}
        />
      ) : (
        <LinearUserSolid className="h-9 w-9 text-[#808080]" />
      )}
    </div>
  );
}
function AgencyContactBottomSheet({
  contactInfo,
  isOpen,
  onClose,
}: {
  contactInfo: AgencyPreviewContactInfo;
  isOpen: boolean;
  onClose: () => void;
}) {
  const phoneHref = toEnglishDigits(contactInfo.phone).replace(/[^\d+]/g, "");
  const secondPhoneHref = toEnglishDigits(contactInfo.secondPhone).replace(/[^\d+]/g, "");
  const messagePhoneHref = toEnglishDigits(contactInfo.landline).replace(/[^\d+]/g, "");
  const socialLinks = [
    {
      label: "واتساپ",
      href: normalizeSocialUrl("whatsapp", contactInfo.whatsapp),
      icon: <TonalWhatsapp className="h-6 w-6" />,
    },
    {
      label: "تلگرام",
      href: normalizeSocialUrl("telegram", contactInfo.telegram),
      icon: <TonalTelegram className="h-6 w-6" />,
    },
    {
      label: "اینستاگرام",
      href: normalizeSocialUrl("instagram", contactInfo.instagram),
      icon: <TonalInstagram className="h-6 w-6" />,
    },
  ].filter((item) => item.href);
  const hasMap = contactInfo.lat !== undefined && contactInfo.lng !== undefined;
  const contactRowCount = [contactInfo.phone, contactInfo.secondPhone, contactInfo.landline].filter(Boolean).length;
  const hasAnyContactInfo = contactRowCount > 0 || hasMap || socialLinks.length > 0;
  const hasRichContactInfo = contactRowCount === 3 && hasMap && socialLinks.length > 0;

  return (
    <BottomSheet
      ariaLabel="اطلاعات تماس"
      contentClassName="mx-4 mt-2 pb-5"
      heightClassName={
        hasRichContactInfo
          ? "h-[min(571px,calc(100dvh-56px))]"
          : "h-auto max-h-[calc(100dvh-56px)]"
      }
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-2"
      title="اطلاعات تماس"
    >
      <div>
        {contactInfo.phone ? (
          <ContactRow href={`tel:${phoneHref}`} label="شماره اصلی" value={contactInfo.phone} />
        ) : null}
        {contactInfo.secondPhone ? (
          <ContactRow href={`tel:${secondPhoneHref}`} label="شماره دوم" value={contactInfo.secondPhone} />
        ) : null}
        {contactInfo.landline ? (
          <ContactRow
            href={`sms:${messagePhoneHref}`}
            icon="message"
            label="پیامک"
            value={contactInfo.landline}
          />
        ) : null}
      </div>

      {hasMap ? (
        <div className={`${contactRowCount ? "mt-4" : "mt-2"} overflow-hidden rounded-2xl bg-[#f6f6f3]`}>
          <AgencyMiniMap lat={contactInfo.lat as number} lng={contactInfo.lng as number} />
        </div>
      ) : null}

      {socialLinks.length ? (
        <div className="mt-4 pb-1">
          <Typography
            as="p"
            variant="label"
            size="medium"
            weight="medium"
            className="m-0 text-right text-sm font-medium leading-5 text-[#4d4d4d]"
          >
            شبکه‌های اجتماعی
          </Typography>
          <div className="mt-3 flex items-center justify-end gap-10 [direction:ltr]">
            {socialLinks.map((item) => (
              <a
                aria-label={item.label}
                className="grid h-6 w-6 shrink-0 place-items-center no-underline"
                href={item.href}
                key={item.label}
                rel="noreferrer"
                target="_blank"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {!hasAnyContactInfo ? (
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="m-0 py-6 text-center text-sm text-[#808080]"
        >
          اطلاعات تماسی ثبت نشده است.
        </Typography>
      ) : null}
    </BottomSheet>
  );
}

function ContactPhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="M6.6 4.8 9 4.2l2.1 4.8-1.5 1.1a11.2 11.2 0 0 0 4.3 4.3L15 12.9l4.8 2.1-.6 2.4c-.3 1.2-1.4 2-2.6 1.8C10.2 18.2 5.8 13.8 4.8 7.4 4.6 6.2 5.4 5.1 6.6 4.8Z" />
    </svg>
  );
}

function ContactMessageIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="M5 18.5V20l3.1-1.6A8 8 0 1 0 4 11.5c0 2.6 1.2 4.9 3.1 6.4" />
      <path d="M8.5 12h7" />
    </svg>
  );
}

function ContactRow({
  href,
  icon = "phone",
  label,
  value,
}: {
  href: string;
  icon?: "message" | "phone";
  label: string;
  value: string;
}) {
  return (
    <a
      className="flex h-14 items-center justify-between gap-3 border-b border-[#dedede] text-[#1a1a1a] no-underline [direction:ltr]"
      href={href}
    >
      <Typography
        as="span"
        variant="label"
        size="large"
        weight="medium"
        className="text-left text-base font-medium leading-6 text-[#1a1a1a]"
      >
        {toPersianDigits(value)}
      </Typography>
      <span className="inline-flex min-w-0 items-center gap-2 [direction:rtl]">
        {icon === "message" ? (
          <ContactMessageIcon className="h-6 w-6 shrink-0 text-[#4d4d4d]" />
        ) : (
          <ContactPhoneIcon className="h-6 w-6 shrink-0 text-[#4d4d4d]" />
        )}
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="text-right text-sm font-normal leading-5 text-[#808080]"
        >
          {label}
        </Typography>
      </span>
    </a>
  );
}

function createAgencyContactMapMarkerIcon() {
  return new DivIcon({
    className: "agency-contact-map-marker-wrapper",
    html: `
      <svg aria-hidden="true" width="31" height="42" viewBox="0 0 31 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15.5" cy="40.5" rx="6" ry="1.5" fill="#1A1A1A" fill-opacity="0.12"/>
        <path d="M20.738 30.061C26.721 27.916 31 22.199 31 15.484C31 6.932 24.06 0 15.5 0S0 6.932 0 15.484c0 6.715 4.279 12.431 10.261 14.577 2.136.868 3.947 2.591 3.947 4.778v3.87a1.292 1.292 0 0 0 2.584 0v-3.87c0-2.187 1.811-3.91 3.946-4.778Z" fill="#11A366"/>
        <circle cx="15.5" cy="15" r="6" fill="white"/>
      </svg>
    `,
    iconAnchor: [15.5, 42],
    iconSize: [31, 42],
  });
}

function AgencyMiniMap({ lat, lng }: { lat: number; lng: number }) {
  return (
    <MapContainer
      attributionControl={false}
      center={[lat, lng]}
      className="h-[196px] w-full"
      dragging={false}
      doubleClickZoom={false}
      keyboard={false}
      scrollWheelZoom={false}
      touchZoom={false}
      zoom={16}
      zoomControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker
        icon={createAgencyContactMapMarkerIcon()}
        interactive={false}
        position={[lat, lng]}
      />
    </MapContainer>
  );
}

function toEnglishDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

function normalizeSocialUrl(type: "instagram" | "telegram" | "whatsapp", value: string) {
  const cleanValue = value.trim();

  if (!cleanValue) return "";
  if (/^https?:\/\//i.test(cleanValue)) return cleanValue;

  if (type === "instagram") {
    const username = cleanValue.replace(/^@/, "").replace(/^instagram\.com\//i, "");
    return username ? `https://www.instagram.com/${username}` : "";
  }

  if (type === "telegram") {
    const username = cleanValue.replace(/^@/, "").replace(/^t\.me\//i, "");
    return username ? `https://t.me/${username}` : "";
  }

  const digits = toEnglishDigits(cleanValue).replace(/[^\d]/g, "");
  if (!digits) return "";

  return `https://wa.me/${digits.startsWith("0") ? `98${digits.slice(1)}` : digits}`;
}

function AgencyPreviewFooter({
  entityLabel = "آژانس",
  onContactClick,
}: {
  entityLabel?: string;
  onContactClick: () => void;
}) {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-20 bg-white px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
      <div className="grid h-10 grid-cols-2 gap-4 [direction:ltr]">
        <Button unstyled
          className="cursor-pointer rounded-lg bg-[#0048c4] text-sm font-semibold leading-5 text-white"
          onClick={onContactClick}
          type="button"
        >
          تماس با {entityLabel}
        </Button>
        <Button unstyled className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#0048c4] bg-white text-sm font-semibold leading-5 text-[#0048c4]" type="button">
          چت با {entityLabel}
          <LinearChat className="h-5 w-5" />
        </Button>
      </div>
    </footer>
  );
}
