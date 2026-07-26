import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { PageFrame } from "../app/PageFrame";
import { BottomSheet } from "../components/BottomSheet";
import { getRequestErrorState } from "../components/ErrorState";
import { HorizontalFilterBar } from "../components/HorizontalFilterBar";
import { RadioIndicator } from "../components/RadioIndicator";
import { useAgencyInfiniteQuery, usePublicAgentsInfiniteQuery } from "../hooks/agency.hooks";
import { useNeighborhoodListQuery } from "../hooks/neighborhood.hooks";
import { readStoredSelectedCity } from "../lib/selectedCityStorage";
import type { AgencySort, PublicAgencyDto, PublicAgentListDto } from "../services/agency.service";
import type { NeighborhoodDto } from "../services/neighborhood.service";
import {
  AgencyDirectoryMapView,
  type AgencyDirectoryMapItem,
} from "./consultants/AgencyDirectoryMapView";
import LinearMapsLocation from "../components/(icons)/LinearMapsLocation";

type DirectoryMode = "agency" | "consultant";

type DirectoryItem = AgencyDirectoryMapItem & {
  badge?: string;
};

type SortOptionId = AgencySort;

type SortOption = {
  id: SortOptionId;
  label: string;
};

const sortOptions: SortOption[] = [
  { id: "score", label: "امتیاز" },
  { id: "rank", label: "رتبه" },
  { id: "newest", label: "جدیدترین" },
  { id: "oldest", label: "قدیمی‌ترین" },
];

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const agencyPageSize = 20;
const loadMoreRemainingItemCount = 10;
const searchDebounceMs = 350;

function toPersianNumber(value: number | string) {
  return String(value).replace(
    /\d/g,
    (digit) => persianDigits[Number(digit)] ?? digit,
  );
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
}

function getNeighborhoodId(neighborhood: NeighborhoodDto) {
  return String(neighborhood.id ?? neighborhood._id ?? neighborhood.name);
}

function mapAgencyToDirectoryItem(agency: PublicAgencyDto): DirectoryItem {
  return {
    address: agency.address,
    id: agency.id,
    image: agency.logo ?? agency.img,
    latitude: agency.lat,
    longitude: agency.lng,
    name: agency.name,
    neighborhoodIds: agency.neighborhood_ids,
    rank: toPersianNumber(agency.rank),
    score: toPersianNumber(agency.score),
  };
}

function mapAgentToDirectoryItem(agent: PublicAgentListDto): DirectoryItem {
  return {
    badge: agent.agency?.name ? `مشاور ${agent.agency.name}` : "مشاور",
    id: agent.id,
    image: agent.avatar,
    name: agent.fullName,
    rank: toPersianNumber(agent.rank ?? 0),
    score: toPersianNumber(agent.score ?? 0),
  };
}

function getInitialMode(): DirectoryMode {
  const mode = new URLSearchParams(window.location.search).get("type");

  return mode === "consultant" ? "consultant" : "agency";
}

function navigateBack() {
  window.history.pushState({}, "", "/home");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function setRouteMode(mode: DirectoryMode) {
  const nextPath =
    mode === "consultant" ? "/consultants?type=consultant" : "/consultants";

  window.history.pushState({}, "", nextPath);
}

function navigateToAgency(item: DirectoryItem) {
  if (!item.id) return;

  const params = new URLSearchParams();
  const selectedCity = readStoredSelectedCity();

  if (item.name) params.set("name", item.name);
  if (item.address) params.set("location", item.address);
  if (item.image) params.set("logo", item.image);
  if (selectedCity?.id) params.set("city_id", selectedCity.id);
  if (selectedCity?.name) params.set("city_name", selectedCity.name);
  if (item.neighborhoodIds?.length) {
    params.set("neighborhood_ids", item.neighborhoodIds.join(","));
  }
  if (item.rank) params.set("rank", item.rank);
  if (item.score) params.set("score", item.score);

  const queryString = params.toString();
  const path = `/agencies/${encodeURIComponent(item.id)}${queryString ? `?${queryString}` : ""}`;

  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function navigateToAgent(item: DirectoryItem) {
  if (!item.id) return;

  const params = new URLSearchParams();

  if (item.name) params.set("name", item.name);
  if (item.image) params.set("logo", item.image);

  const queryString = params.toString();
  const path = `/agents/${encodeURIComponent(item.id)}${queryString ? `?${queryString}` : ""}`;

  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function BackIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M15 7L20 12L15 17M20 12H4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M10.8 18.2a7.4 7.4 0 1 0 0-14.8 7.4 7.4 0 0 0 0 14.8ZM16.1 16.1 21 21"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <path
        d="m5.5 7.5 4.5 4.5 4.5-4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function CloseChipIcon() {
  return (
    <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
      <span className="absolute left-1/2 top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current" />
      <span className="absolute left-1/2 top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
    </span>
  );
}

function SortIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M7.70833 14.5833C7.70833 14.0626 7.70782 13.7093 7.68555 13.4367C7.66389 13.1718 7.625 13.0381 7.57813 12.946C7.46325 12.7205 7.27939 12.5367 7.05404 12.4219C6.96189 12.375 6.82816 12.3361 6.56331 12.3145C6.29069 12.2922 5.93744 12.2917 5.41667 12.2917C4.89589 12.2917 4.54264 12.2922 4.27002 12.3145C4.00518 12.3361 3.87144 12.375 3.7793 12.4219C3.55395 12.5367 3.37008 12.7205 3.25521 12.946C3.20833 13.0381 3.16945 13.1718 3.14779 13.4367C3.12551 13.7093 3.125 14.0626 3.125 14.5833C3.125 15.1041 3.12551 15.4574 3.14779 15.73C3.16945 15.9949 3.20833 16.1286 3.25521 16.2207C3.37008 16.4461 3.55395 16.63 3.7793 16.7448C3.87144 16.7917 4.00518 16.8306 4.27002 16.8522C4.54264 16.8745 4.89589 16.875 5.41667 16.875C5.93744 16.875 6.29069 16.8745 6.56331 16.8522C6.82816 16.8306 6.96189 16.7917 7.05404 16.7448C7.27938 16.63 7.46325 16.4461 7.57813 16.2207C7.625 16.1286 7.66389 15.9949 7.68555 15.73C7.70782 15.4574 7.70833 15.1041 7.70833 14.5833ZM14.375 12.1151C14.375 10.1975 14.3619 9.42933 14.0584 8.76058C13.7549 8.09181 13.1854 7.57614 11.7424 6.31348L11.2549 5.88705L11.2093 5.84229C10.9932 5.61065 10.9832 5.24841 11.1963 5.00488C11.4094 4.76149 11.7698 4.7231 12.028 4.90641L12.0785 4.94629L12.5659 5.37272C13.9242 6.56118 14.7556 7.27143 15.1969 8.24382C15.6382 9.21624 15.625 10.3102 15.625 12.1151V14.6712C15.6985 14.5948 15.7813 14.5101 15.8724 14.4141L17.0467 13.1755L17.0923 13.1315C17.3323 12.9245 17.6947 12.9292 17.9297 13.1519C18.1802 13.3893 18.1907 13.7851 17.9533 14.0356L16.7798 15.2743C16.4797 15.5909 16.2114 15.8751 15.966 16.0726C15.7077 16.2805 15.3963 16.4583 15 16.4583C14.6037 16.4583 14.2923 16.2805 14.034 16.0726C13.7886 15.8751 13.5203 15.5909 13.2202 15.2743L12.0467 14.0356L12.0044 13.9868C11.8109 13.7361 11.8355 13.3744 12.0703 13.1519C12.3208 12.9146 12.7159 12.9251 12.9533 13.1755L14.1276 14.4141C14.2187 14.5101 14.3015 14.5948 14.375 14.6712V12.1151ZM7.70833 5.41667C7.70833 4.89589 7.70782 4.54264 7.68555 4.27002C7.66389 4.00517 7.62501 3.87144 7.57813 3.7793C7.46327 3.55389 7.27945 3.37006 7.05404 3.25521C6.9619 3.20833 6.82816 3.16944 6.56331 3.14779C6.29069 3.12551 5.93744 3.125 5.41667 3.125C4.89589 3.125 4.54264 3.12551 4.27002 3.14779C4.00517 3.16944 3.87144 3.20833 3.7793 3.25521C3.55389 3.37006 3.37006 3.55389 3.25521 3.7793C3.20833 3.87144 3.16944 4.00517 3.14779 4.27002C3.12551 4.54264 3.125 4.89589 3.125 5.41667C3.125 5.93744 3.12551 6.29069 3.14779 6.56331C3.16944 6.82816 3.20833 6.9619 3.25521 7.05404C3.37006 7.27945 3.55389 7.46327 3.7793 7.57813C3.87144 7.62501 4.00517 7.66389 4.27002 7.68555C4.54264 7.70782 4.89589 7.70833 5.41667 7.70833C5.93744 7.70833 6.29069 7.70782 6.56331 7.68555C6.82816 7.66389 6.9619 7.62501 7.05404 7.57813C7.27945 7.46327 7.46327 7.27945 7.57813 7.05404C7.62501 6.9619 7.66389 6.82816 7.68555 6.56331C7.70782 6.29069 7.70833 5.93744 7.70833 5.41667ZM8.95833 14.5833C8.95833 15.0835 8.95888 15.4964 8.93148 15.8317C8.90348 16.1743 8.84311 16.491 8.69141 16.7887C8.45678 17.249 8.08248 17.6234 7.62207 17.8581C7.32437 18.0097 7.00759 18.0701 6.66504 18.0981C6.32971 18.1255 5.91682 18.125 5.41667 18.125C4.91652 18.125 4.50362 18.1255 4.1683 18.0981C3.82575 18.0701 3.50897 18.0097 3.21126 17.8581C2.75085 17.6234 2.37655 17.249 2.14193 16.7887C1.99023 16.491 1.92986 16.1743 1.90186 15.8317C1.87446 15.4964 1.875 15.0835 1.875 14.5833C1.875 14.0832 1.87446 13.6703 1.90186 13.335C1.92986 12.9924 1.99023 12.6756 2.14193 12.3779C2.37655 11.9176 2.75085 11.5432 3.21126 11.3086C3.50897 11.1569 3.82575 11.0965 4.1683 11.0685C4.50362 11.0411 4.91652 11.0417 5.41667 11.0417C5.91682 11.0417 6.32971 11.0411 6.66504 11.0685C7.00759 11.0965 7.32437 11.1569 7.62207 11.3086C8.08248 11.5432 8.45678 11.9176 8.69141 12.3779C8.84311 12.6756 8.90348 12.9924 8.93148 13.335C8.95888 13.6703 8.95833 14.0832 8.95833 14.5833ZM8.95833 5.41667C8.95833 5.91682 8.95888 6.32971 8.93148 6.66504C8.90348 7.00759 8.8431 7.32436 8.69141 7.62207C8.45675 8.08244 8.08244 8.45675 7.62207 8.69141C7.32436 8.8431 7.00759 8.90348 6.66504 8.93148C6.32971 8.95888 5.91682 8.95833 5.41667 8.95833C4.91652 8.95833 4.50362 8.95888 4.1683 8.93148C3.82574 8.90348 3.50897 8.8431 3.21126 8.69141C2.7509 8.45675 2.37658 8.08244 2.14193 7.62207C1.99024 7.32436 1.92986 7.00759 1.90186 6.66504C1.87446 6.32971 1.875 5.91682 1.875 5.41667C1.875 4.91652 1.87446 4.50362 1.90186 4.1683C1.92986 3.82574 1.99024 3.50897 2.14193 3.21126C2.37658 2.7509 2.7509 2.37658 3.21126 2.14193C3.50897 1.99024 3.82574 1.92986 4.1683 1.90186C4.50362 1.87446 4.91652 1.875 5.41667 1.875C5.91682 1.875 6.32971 1.87446 6.66504 1.90186C7.00759 1.92986 7.32436 1.99024 7.62207 2.14193C8.08244 2.37658 8.45675 2.7509 8.69141 3.21126C8.8431 3.50897 8.90348 3.82574 8.93148 4.1683C8.95888 4.50362 8.95833 4.91652 8.95833 5.41667Z"
        fill="#4D4D4D"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <path
        d="M10 10.8a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M15.5 8.6c0 4.3-5.5 8-5.5 8s-5.5-3.7-5.5-8a5.5 5.5 0 1 1 11 0Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function RankIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <g clip-path="url(#clip0_1723_40757)">
        <path
          d="M13.5002 12.0001C13.5002 11.908 13.4256 11.8334 13.3335 11.8334H10.6668C10.5748 11.8334 10.5002 11.908 10.5002 12.0001V14.1668H13.5002V12.0001ZM7.27751 1.25466C7.56638 0.72841 8.31299 0.695215 8.65902 1.1557L8.72282 1.25466L9.37386 2.44086L10.8042 2.6531C11.4214 2.74437 11.7776 3.52164 11.2476 4.01508L10.245 4.94737L10.4644 6.24034C10.5222 6.58117 10.3522 6.86983 10.1232 7.02419C9.89625 7.17711 9.58462 7.22137 9.29834 7.08604L8.00016 6.47211L6.70199 7.08604C6.4157 7.22138 6.10406 7.17711 5.87712 7.02419C5.64813 6.86984 5.47815 6.58117 5.53597 6.24034L5.75472 4.94737L4.75277 4.01508C4.2227 3.52161 4.57897 2.74437 5.19613 2.6531L6.62581 2.44086L7.27751 1.25466ZM7.45719 3.00596C7.33073 3.23638 7.10317 3.3818 6.85824 3.41807L5.75472 3.58083L6.51969 4.29307L5.98519 4.86599L6.76058 4.99815L6.5848 6.03461L7.64144 5.53526C7.83945 5.44159 8.06698 5.42983 8.2723 5.5001L8.35889 5.53526L9.41488 6.03461L9.23975 4.99815C9.19454 4.73169 9.29106 4.46962 9.48063 4.29307L10.245 3.58083L9.14209 3.41807C8.89716 3.3818 8.6696 3.23637 8.54313 3.00596L8.00016 2.01638L7.45719 3.00596ZM6.51969 4.29307C6.70915 4.46952 6.80567 4.73109 6.76058 4.9975L6.26774 4.91417L5.98519 4.86599L6.51969 4.29307ZM9.50016 9.33344C9.50016 9.24138 9.42555 9.16677 9.3335 9.16677H6.66683C6.57478 9.16677 6.50016 9.24139 6.50016 9.33344V14.1668H9.50016V9.33344ZM2.50016 14.1668H5.50016V10.6668C5.50016 10.5747 5.42555 10.5001 5.3335 10.5001H2.66683C2.57478 10.5001 2.50016 10.5747 2.50016 10.6668V14.1668ZM10.5002 10.8465C10.5546 10.8387 10.6102 10.8334 10.6668 10.8334H13.3335C13.9778 10.8334 14.5002 11.3558 14.5002 12.0001V14.1668H14.6668C14.943 14.1668 15.1668 14.3906 15.1668 14.6668C15.1668 14.9429 14.943 15.1668 14.6668 15.1668H1.3335C1.05735 15.1668 0.833496 14.9429 0.833496 14.6668C0.833496 14.3906 1.05735 14.1668 1.3335 14.1668H1.50016V10.6668C1.50016 10.0224 2.02251 9.5001 2.66683 9.5001H5.3335C5.39014 9.5001 5.44567 9.50532 5.50016 9.51313V9.33344C5.50016 8.68909 6.02251 8.16677 6.66683 8.16677H9.3335C9.97784 8.16677 10.5002 8.6891 10.5002 9.33344V10.8465Z"
          fill="#4D4D4D"
        />
      </g>
      <defs>
        <clipPath id="clip0_1723_40757">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M6.9555 2.13464C7.39132 1.28845 8.60822 1.28845 9.04404 2.13464L10.516 4.99336C10.5401 5.03988 10.5866 5.07425 10.643 5.08321L13.8429 5.58777C14.7827 5.73589 15.1716 6.88595 14.4881 7.56433L12.197 9.83776C12.159 9.87558 12.1429 9.92753 12.1508 9.97774L12.6554 13.1503C12.8068 14.1016 11.81 14.7973 10.9666 14.3723L8.07985 12.9172C8.02967 12.892 7.96988 12.892 7.91969 12.9172L5.03298 14.3723C4.18958 14.7973 3.19276 14.1016 3.34417 13.1503L3.84873 9.97774C3.85663 9.92757 3.84053 9.87561 3.80251 9.83776L1.51149 7.56433C0.827921 6.88592 1.21691 5.73588 2.15667 5.58777L5.35654 5.08321C5.41296 5.07425 5.45948 5.03988 5.4835 4.99336L6.9555 2.13464ZM8.15472 2.59232C8.09115 2.46913 7.9084 2.46913 7.84482 2.59232L6.37282 5.45105C6.20142 5.78388 5.88062 6.0134 5.51214 6.07149L2.31227 6.5754C2.16735 6.59824 2.124 6.76349 2.21592 6.85469L4.50693 9.12748C4.77221 9.3907 4.89522 9.7654 4.83636 10.1353L4.3318 13.3072C4.3122 13.4303 4.44711 13.5482 4.58311 13.4797L7.46917 12.0246C7.80268 11.8565 8.19686 11.8565 8.53037 12.0246L11.4164 13.4797C11.5354 13.5396 11.6536 13.4573 11.6684 13.3534L11.6677 13.3078V13.3072L11.1632 10.1353C11.1043 9.76543 11.2273 9.39074 11.4926 9.12748L13.7836 6.85469C13.8756 6.76346 13.8321 6.59823 13.6873 6.5754L10.4874 6.07149C10.1189 6.0134 9.79813 5.78386 9.62673 5.45105L8.15472 2.59232Z"
        fill="#4D4D4D"
      />
    </svg>
  );
}

function MapLocationIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 5.5 9 3l6 2.5L20 3v15.5L15 21l-6-2.5L4 21V5.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path d="M9 3v15.5M15 5.5V21" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M17.5 8.5c0 2.4-3.5 6-3.5 6s-3.5-3.6-3.5-6a3.5 3.5 0 1 1 7 0Z"
        fill="#0048c4"
        stroke="white"
        strokeWidth="1.4"
      />
      <circle cx="14" cy="8.5" fill="white" r="1.1" />
    </svg>
  );
}

function FilterChip({
  active = false,
  icon,
  label,
  onClick,
  onRemove,
}: {
  active?: boolean;
  icon?: "chevron" | "location" | "sort";
  label: string;
  onClick?: () => void;
  onRemove?: () => void;
}) {
  const chipIcon =
    icon === "chevron" ? (
      <ChevronDownIcon />
    ) : icon === "location" ? (
      <LocationIcon />
    ) : icon === "sort" ? (
      <SortIcon />
    ) : null;

  const chipContent = (
    <>
      {icon !== "chevron" && chipIcon}
      <span className={onRemove ? "max-w-[92px] truncate" : undefined}>
        {label}
      </span>
      {icon === "chevron" && chipIcon}
    </>
  );

  const chipClassName = `inline-flex items-center justify-center gap-1 rounded-lg border p-2 text-sm! font-medium! transition-colors ${active
      ? "border-[#0048C4] bg-[#0048C416] text-[#0048c4]"
      : "border-[#cccccc] bg-white text-[#4d4d4d]"
    }`;

  if (onRemove) {
    return (
      <span className={`${chipClassName} overflow-hidden px-0`} dir="rtl">
        <button
          className="inline-flex h-full min-w-0 items-center justify-center gap-1.5 pr-2.5 text-inherit"
          onClick={onClick}
          type="button"
        >
          {chipContent}
        </button>

        <button
          aria-label={`حذف ${label}`}
          className="grid h-full w-8 shrink-0 place-items-center text-inherit active:bg-[#0048c414]"
          onClick={onRemove}
          type="button"
        >
          <CloseChipIcon />
        </button>
      </span>
    );
  }

  return (
    <button
      className={chipClassName}
      dir="rtl"
      onClick={onClick}
      type="button"
    >
      {chipContent}
    </button>
  );
}

function DirectoryCard({
  item,
  mode,
  onClick,
}: {
  item: DirectoryItem;
  mode: DirectoryMode;
  onClick?: () => void;
}) {
  const content = (
    <>
      {item.image ? (
        <img
          alt=""
          className={`${mode === "consultant" ? "rounded-full" : "rounded-xl"} h-[72px] w-[72px] shrink-0 object-cover shadow-[0_0_16px_0_rgba(77,77,77,0.1)]`}
          src={item.image}
        />
      ) : (
        <span
          aria-hidden="true"
          className={`${mode === "consultant" ? "rounded-full" : "rounded-xl"} grid h-[72px] w-[72px] shrink-0 place-items-center bg-[#e9f1ff] text-2xl font-bold text-[#0048c4] shadow-[0_0_16px_0_rgba(77,77,77,0.1)]`}
        >
          {item.name.trim().charAt(0) || "آ"}
        </span>
      )}

      <div className="flex h-full min-w-0 flex-1 flex-col text-right">
        <h2 className="mt-1 truncate text-base font-semibold leading-6 text-[#4d4d4d]">
          {item.name}
        </h2>

        {item.badge ? (
          <span className="mt-0.5 w-fit rounded-full bg-[#80808014] px-2 text-[9px] font-medium text-[#808080]">
            {item.badge}
          </span>
        ) : item.address ? (
          <span className="mt-0.5 max-w-full truncate text-[10px] font-normal leading-4 text-[#808080]">
            {item.address}
          </span>
        ) : null}

        <div className="mt-auto flex items-center justify-between [direction:ltr]">
          <div className="flex items-center [direction:rtl]">
            <RankIcon />
            <span className="mr-1 text-xs font-normal leading-4 text-[#1a1a1a]">
              رتبه
            </span>
            <span className="mr-2 text-sm font-semibold leading-4 text-[#00a66a]">
              {item.rank}
            </span>
          </div>

          <div className="flex items-center [direction:rtl]">
            <StarIcon />
            <span className="mr-1 text-xs font-normal leading-4 text-[#1a1a1a]">
              امتیاز
            </span>
            <span className="mr-2 text-sm font-semibold leading-6 text-[#00a66a]">
              {item.score}
            </span>
          </div>
        </div>
      </div>
    </>
  );
  const className =
    "mx-4 flex h-[104px] w-[calc(100%_-_2rem)] items-center gap-4 rounded-xl border border-[#d1d1d1] bg-white p-4 text-right shadow-[0_0_6px_rgba(26,26,26,0.04)]";

  return onClick ? (
    <button className={`${className} active:bg-[#fafafa]`} onClick={onClick} type="button">
      {content}
    </button>
  ) : (
    <article className={className}>{content}</article>
  );
}

function DirectoryCardSkeleton() {
  return (
    <div className="mx-4 flex h-[104px] items-center gap-4 rounded-xl border border-[#e5e5e5] bg-white p-4">
      <div className="h-[72px] w-[72px] shrink-0 animate-pulse rounded-xl bg-[#f0f0f0]" />
      <div className="min-w-0 flex-1">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-[#f0f0f0]" />
        <div className="mt-3 h-3 w-1/2 animate-pulse rounded-full bg-[#f0f0f0]" />
        <div className="mt-4 flex justify-between">
          <div className="h-4 w-20 animate-pulse rounded-full bg-[#f0f0f0]" />
          <div className="h-4 w-20 animate-pulse rounded-full bg-[#f0f0f0]" />
        </div>
      </div>
    </div>
  );
}

export function ConsultantsDirectoryPage() {
  const [mode, setMode] = useState<DirectoryMode>(getInitialMode);
  const [isModeSheetOpen, setIsModeSheetOpen] = useState(false);
  const [isNeighborhoodSheetOpen, setIsNeighborhoodSheetOpen] = useState(false);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
  const [neighborhoodQuery, setNeighborhoodQuery] = useState("");
  const [search, setSearch] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<NeighborhoodDto | null>(null);
  const [selectedSort, setSelectedSort] = useState<SortOptionId | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedMapAgencyId, setSelectedMapAgencyId] = useState<string | null>(
    null,
  );
  const loadMoreObserverRef = useRef<IntersectionObserver | null>(null);

  const selectedCity = readStoredSelectedCity();
  const cityId = selectedCity?.id ?? "";
  const debouncedSearch = useDebouncedValue(search.trim(), searchDebounceMs);
  const selectedNeighborhoodId = selectedNeighborhood
    ? getNeighborhoodId(selectedNeighborhood)
    : undefined;
  const searchPlaceholder = mode === "agency" ? "جستجوی آژانس" : "جستجوی مشاور";
  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: isNeighborhoodSheetOpen && mode === "agency" && Boolean(cityId),
    page: 1,
    perPage: 100,
    q: neighborhoodQuery,
  });
  const neighborhoods = neighborhoodsQuery.data ?? [];
  const agenciesQuery = useAgencyInfiniteQuery({
    enabled: mode === "agency",
    neighborhoodId: selectedNeighborhoodId,
    perPage: agencyPageSize,
    search: debouncedSearch,
    sort: selectedSort ?? undefined,
  });
  const agentsQuery = usePublicAgentsInfiniteQuery({
    enabled: mode === "consultant",
    perPage: agencyPageSize,
    search: debouncedSearch,
  });
  const agencyDirectoryItems = useMemo(
    () =>
      agenciesQuery.data?.pages.flatMap((page) =>
        page.data.map(mapAgencyToDirectoryItem),
      ) ?? [],
    [agenciesQuery.data],
  );
  const consultantDirectoryItems = useMemo(
    () =>
      agentsQuery.data?.pages.flatMap((page) =>
        page.data.map(mapAgentToDirectoryItem),
      ) ?? [],
    [agentsQuery.data],
  );
  const items =
    mode === "agency" ? agencyDirectoryItems : consultantDirectoryItems;
  const selectedSortOption = sortOptions.find(
    (option) => option.id === selectedSort,
  );
  const neighborhoodChipLabel = selectedNeighborhood?.name ?? "محله";
  const loadMoreTriggerIndex = Math.max(
    items.length - loadMoreRemainingItemCount - 1,
    0,
  );
  const activeQuery = mode === "agency" ? agenciesQuery : agentsQuery;
  const DirectoryErrorState = getRequestErrorState(activeQuery.error);

  const loadMoreSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      loadMoreObserverRef.current?.disconnect();
      loadMoreObserverRef.current = null;

      if (
        !node ||
        !activeQuery.hasNextPage ||
        activeQuery.isFetchingNextPage
      ) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (
            entries[0]?.isIntersecting &&
            activeQuery.hasNextPage &&
            !activeQuery.isFetchingNextPage
          ) {
            void activeQuery.fetchNextPage();
          }
        },
        { root: null, rootMargin: "0px", threshold: 0.1 },
      );

      observer.observe(node);
      loadMoreObserverRef.current = observer;
    },
    [
      activeQuery.fetchNextPage,
      activeQuery.hasNextPage,
      activeQuery.isFetchingNextPage,
    ],
  );

  useEffect(
    () => () => {
      loadMoreObserverRef.current?.disconnect();
    },
    [],
  );

  useEffect(() => {
    if (mode !== "consultant") return;

    setIsMapOpen(false);
    setSelectedMapAgencyId(null);
  }, [mode]);

  const handleModeChange = (nextMode: DirectoryMode) => {
    setMode(nextMode);
    setIsMapOpen(false);
    setSelectedMapAgencyId(null);
    setSearch("");
    setIsModeSheetOpen(false);
    setIsNeighborhoodSheetOpen(false);
    setIsSortSheetOpen(false);
    setRouteMode(nextMode);
  };

  const selectNeighborhood = (neighborhood: NeighborhoodDto) => {
    const neighborhoodId = getNeighborhoodId(neighborhood);

    setSelectedNeighborhood((current) =>
      current && getNeighborhoodId(current) === neighborhoodId
        ? null
        : neighborhood,
    );
    setIsNeighborhoodSheetOpen(false);
  };

  const clearNeighborhood = () => {
    setSelectedNeighborhood(null);
  };

  if (isMapOpen && mode === "agency") {
    const mapCenter =
      selectedCity?.latitude !== undefined &&
        selectedCity.longitude !== undefined
        ? {
          latitude: selectedCity.latitude,
          longitude: selectedCity.longitude,
        }
        : undefined;

    return (
      <PageFrame
        className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
        variant="flush"
      >
        <AgencyDirectoryMapView
          center={mapCenter}
          items={agencyDirectoryItems}
          onBack={() => {
            setSelectedMapAgencyId(null);
            setIsMapOpen(false);
          }}
          onOpenAgency={navigateToAgency}
          onOpenList={() => {
            setSelectedMapAgencyId(null);
            setIsMapOpen(false);
          }}
          onSelectAgency={setSelectedMapAgencyId}
          selectedAgencyId={selectedMapAgencyId}
        />
      </PageFrame>
    );
  }

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <header className="shrink-0 bg-[#f0f0f0]">
        <div className="flex items-center gap-2 p-4 [direction:rtl]">
          <button
            aria-label="بازگشت"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#1a1a1a] active:bg-[#1a1a1a0a]"
            onClick={navigateBack}
            type="button"
          >
            <BackIcon />
          </button>
          <h1 className="m-0 text-base font-semibold leading-6 text-[#1a1a1a]">
            مشاورین
          </h1>
        </div>

        <div className="px-4 pt-2">
          <label className="relative flex items-center rounded-xl border border-[#808080] bg-white text-[#808080]">
            <input
              className="h-full w-full rounded-[inherit] border-0 bg-transparent px-4 py-3 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              type="search"
              value={search}
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#808080]">
              <SearchIcon />
            </span>
          </label>
        </div>

        <HorizontalFilterBar
          ariaLabel="فیلتر مشاورین"
          className="h-[53px] py-0 pt-2"
        >
          <FilterChip
            active
            icon="chevron"
            label={mode === "agency" ? "آژانس" : "مشاور"}
            onClick={() => setIsModeSheetOpen(true)}
          />
          {mode === "agency" ? (
            <FilterChip
              active={Boolean(selectedNeighborhood)}
              icon="location"
              label={neighborhoodChipLabel}
              onClick={() => setIsNeighborhoodSheetOpen(true)}
              onRemove={selectedNeighborhood ? clearNeighborhood : undefined}
            />
          ) : null}
          <FilterChip
            active={Boolean(selectedSort)}
            icon="sort"
            label={selectedSortOption?.label ?? "مرتب سازی"}
            onClick={() => setIsSortSheetOpen(true)}
            onRemove={selectedSort ? () => setSelectedSort(null) : undefined}
          />
        </HorizontalFilterBar>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white py-4 [-webkit-overflow-scrolling:touch]">
        {activeQuery.isLoading ? (
          <div className="space-y-4 pb-20">
            {Array.from({ length: 5 }, (_, index) => (
              <DirectoryCardSkeleton key={index} />
            ))}
          </div>
        ) : activeQuery.isError && items.length === 0 ? (
          <DirectoryErrorState
            className="min-h-[420px]"
            onRetry={() => void activeQuery.refetch()}
          />
        ) : items.length > 0 ? (
          <div className="space-y-4 pb-20">
            {items.map((item, index) => {
              const shouldAttachLoadMoreRef =
                activeQuery.hasNextPage && index === loadMoreTriggerIndex;

              return (
                <div
                  key={item.id ?? `${item.name}-${index}`}
                  ref={shouldAttachLoadMoreRef ? loadMoreSentinelRef : undefined}
                >
                  <DirectoryCard
                    item={item}
                    mode={mode}
                    onClick={
                      item.id
                        ? mode === "agency"
                          ? () => navigateToAgency(item)
                          : () => navigateToAgent(item)
                        : undefined
                    }
                  />
                </div>
              );
            })}
            {activeQuery.isFetchingNextPage ? (
              <>
                <DirectoryCardSkeleton />
                <DirectoryCardSkeleton />
              </>
            ) : null}
          </div>
        ) : (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[#f0f0f0] text-[#808080]">
              <SearchIcon />
            </div>
            <h2 className="m-0 mt-4 text-base font-semibold leading-6 text-[#1a1a1a]">
              نتیجه‌ای پیدا نشد
            </h2>
            <p className="m-0 mt-2 text-sm font-normal leading-6 text-[#808080]">
              عبارت جستجو یا فیلترهای انتخاب‌شده را تغییر دهید.
            </p>
          </div>
        )}
      </main>

      {mode === "agency" ? (
        <button
          className="absolute bottom-[16px] left-1/2 z-10 inline-flex -translate-x-1/2 items-center justify-center gap-2 rounded-2xl bg-[#0048c4] px-4 py-2 leading-6 text-white shadow-[0_10px_26px_rgba(0,72,196,0.24)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          onClick={() => {
            setSelectedMapAgencyId(null);
            setIsMapOpen(true);
          }}
          type="button"
        >
          <LinearMapsLocation className="w-6 h-6 text-white" />
          <span className="font-medium">نقشه</span>
        </button>
      ) : null}


      <BottomSheet
        ariaLabel="انتخاب نوع نمایش"
        className="rounded-t-[20px]"
        contentClassName=""
        heightClassName=""
        isOpen={isModeSheetOpen}
        onClose={() => setIsModeSheetOpen(false)}
        title="نمایش مشاورین"
      >
        <div className="pt-2" dir="rtl">
          {([
            { id: "agency" as const, label: "آژانس" },
            { id: "consultant" as const, label: "مشاور" },
          ]).map((option) => {
            const checked = mode === option.id;

            return (
              <button
                aria-pressed={checked}
                className={`flex w-full px-4 py-6 items-center justify-between text-right font-medium leading-5 ${checked
                    ? "text-[#0048c4]"
                    : "bg-white text-[#1a1a1a]"
                  }`}
                key={option.id}
                onClick={() => handleModeChange(option.id)}
                type="button"
              >
                <span>{option.label}</span>
                <RadioIndicator checked={checked} />
              </button>
            );
          })}
        </div>
      </BottomSheet>

      <BottomSheet
        ariaLabel="انتخاب محله"
        className="rounded-t-[20px]"
        contentClassName="flex min-h-0 flex-1 flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3"
        heightClassName="h-[min(82dvh,560px)]"
        isOpen={isNeighborhoodSheetOpen}
        onClose={() => setIsNeighborhoodSheetOpen(false)}
        panelPaddingClassName="flex flex-col pt-4"
        showHeaderDivider={false}
        title="محله"
      >
        <label
          className="flex h-12 shrink-0 items-center gap-2 rounded-xl border border-[#808080] bg-white px-3 text-[#4d4d4d] focus-within:border-[#0048c4]"
          dir="rtl"
        >
          <SearchIcon />
          <input
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
            onChange={(event) => setNeighborhoodQuery(event.target.value)}
            placeholder="جستجوی محله"
            type="search"
            value={neighborhoodQuery}
          />
          {neighborhoodQuery ? (
            <button
              aria-label="پاک کردن جستجوی محله"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[#4d4d4d] active:bg-[#1a1a1a0a]"
              onClick={() => setNeighborhoodQuery("")}
              type="button"
            >
              <CloseChipIcon />
            </button>
          ) : null}
        </label>

        {selectedNeighborhood ? (
          <button
            className="mt-3 h-10 shrink-0 self-start rounded-lg px-2 text-sm font-medium leading-5 text-[#0048c4] active:bg-[#0048c40a]"
            onClick={clearNeighborhood}
            type="button"
          >
            پاک کردن انتخاب
          </button>
        ) : null}

        <div
          className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain"
          dir="rtl"
        >
          {!cityId ? (
            <p className="m-0 px-2 py-3 text-right text-sm font-normal leading-6 text-[#808080]">
              برای انتخاب محله، ابتدا شهر را انتخاب کنید.
            </p>
          ) : neighborhoodsQuery.isLoading ? (
            <div className="space-y-2">
              <div className="h-12 rounded-[10px] bg-[#f0f0f0]" />
              <div className="h-12 rounded-[10px] bg-[#f0f0f0]" />
              <div className="h-12 rounded-[10px] bg-[#f0f0f0]" />
            </div>
          ) : neighborhoods.length > 0 ? (
            <div className="space-y-1">
              {neighborhoods.map((neighborhood) => {
                const neighborhoodId = getNeighborhoodId(neighborhood);
                const isSelected = Boolean(
                  selectedNeighborhood &&
                  getNeighborhoodId(selectedNeighborhood) === neighborhoodId,
                );

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`flex h-14 w-full items-center justify-between gap-3 rounded-[10px] px-1 text-right text-base font-normal leading-6 transition-colors active:bg-[#0048c40a] ${isSelected ? "text-[#0048c4]" : "text-[#1a1a1a]"
                      }`}
                    key={neighborhoodId}
                    onClick={() => selectNeighborhood(neighborhood)}
                    type="button"
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {neighborhood.name}
                    </span>
                    <RadioIndicator checked={isSelected} />
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="m-0 px-2 py-3 text-right text-sm font-normal leading-6 text-[#808080]">
              محله‌ای با این عبارت پیدا نشد.
            </p>
          )}
        </div>
      </BottomSheet>

      <BottomSheet
        ariaLabel="مرتب سازی"
        className="rounded-t-[20px]"
        contentClassName="px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-2"
        heightClassName=""
        isOpen={isSortSheetOpen}
        onClose={() => setIsSortSheetOpen(false)}
        title="مرتب سازی بر اساس"
      >
        <div className="space-y-4 pt-2" dir="rtl">
          {sortOptions.map((option) => {
            const checked = selectedSort === option.id;

            return (
              <button
                aria-pressed={checked}
                className={`flex h-12 w-full items-center justify-between rounded-[10px] px-2 text-right text-sm font-medium leading-5 ${checked
                    ? "bg-[#0048c40a] text-[#0048c4]"
                    : "bg-white text-[#1a1a1a]"
                  }`}
                key={option.id}
                onClick={() => {
                  setSelectedSort(option.id);
                  setIsSortSheetOpen(false);
                }}
                type="button"
              >
                <span>{option.label}</span>
                <RadioIndicator checked={checked} />
              </button>
            );
          })}
        </div>
      </BottomSheet>
    </PageFrame>
  );
}
