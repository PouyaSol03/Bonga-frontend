import { type AgencyPreviewTab, agencyPreviewPath } from "./types";

export function getPreviewSearchParam(name: string) {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(name)?.trim() ?? "";
}

export function getPreviewNeighborhoodIds() {
  return Array.from(
    new Set(
      getPreviewSearchParam("neighborhood_ids")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

export function getInitialAgencyTab(): AgencyPreviewTab {
  if (typeof window === "undefined") return "info";
  const tab = new URLSearchParams(window.location.search).get("tab");
  if (window.location.pathname.startsWith("/agents/") && tab === "consultants") {
    return "info";
  }
  return tab === "ads" || tab === "consultants" || tab === "info" ? tab : "info";
}

export function isPublicAgencyPreviewPath() {
  return (
    typeof window !== "undefined" &&
    (window.location.pathname.startsWith("/agencies/") ||
      window.location.pathname.startsWith("/agents/"))
  );
}

export function isPublicAgentPreviewPath() {
  return typeof window !== "undefined" && window.location.pathname.startsWith("/agents/");
}

export function getPublicPreviewId() {
  if (typeof window === "undefined") return "";
  const match = window.location.pathname.match(/^\/(?:agencies|agents)\/([^/]+)(?:\/qr-code)?\/?$/);
  return match?.[1] ? decodeURIComponent(match[1]) : "";
}

export function getCurrentAgencyPreviewPath() {
  if (typeof window === "undefined") return agencyPreviewPath;
  return isPublicAgencyPreviewPath() ? window.location.pathname : agencyPreviewPath;
}

export function getAgencyDisplayName() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("name")?.trim() || "";
}

export function getAgencyLocationLabel() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("location")?.trim() || "";
}

export function getAbsoluteAgencyPreviewUrl(
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
  const path =
    !isPublicAgencyPreviewPath() && agencyId
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

export function getCurrentPageUrl() {
  if (typeof window === "undefined") return agencyPreviewPath;
  return window.location.href;
}

export async function shareOrCopyAgencyUrl(url: string, title: string, text: string) {
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
