import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapContainer, Polygon, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import L from "leaflet";

import {
  createCrmAgency,
  getCrmRecordId,
  listCrmUsers,
  type CrmRecord,
} from "../api/crm.service";
import {
  getNeighborhoodInfo,
  getNeighborhoodList,
  getNeighborhoodPolygonPoints,
  type NeighborhoodDto,
} from "../../locations/api/neighborhood.service";
import { readStoredSelectedCity } from "../../../shared/lib/selectedCityStorage";
import { searchMapTileConfig } from "../../search/searchMapData";
import { getApiErrorMessage } from "../../../shared/api/api";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { ModalShell } from "./ModalShell";
import { MapPickerPinIcon } from "./CityPointEditor";
import { LoadingSpinner } from "./LoadingSpinner";
import { fullName } from "./recordFormatters";
import { DEFAULT_CENTER, ghostButtonClassName, primaryButtonClassName } from "./constants";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  notify: (message: string, tone?: "error" | "success") => void;
};

function AgencyMapController({
  location,
  onLocationChange,
  neighborhoodId,
  polygonPoints,
}: {
  location: LatLngTuple;
  onLocationChange: (loc: LatLngTuple) => void;
  neighborhoodId?: string | number | null;
  polygonPoints: LatLngTuple[];
}) {
  const map = useMap();
  const isProgrammaticMoveRef = useRef(false);
  const lastCenteredNeighborhoodRef = useRef<string | number | null>(null);

  useMapEvents({
    moveend: () => {
      if (isProgrammaticMoveRef.current) {
        isProgrammaticMoveRef.current = false;
        return;
      }
      const center = map.getCenter();
      onLocationChange([Number(center.lat.toFixed(7)), Number(center.lng.toFixed(7))]);
    },
    zoomend: () => {
      if (isProgrammaticMoveRef.current) {
        isProgrammaticMoveRef.current = false;
        return;
      }
      const center = map.getCenter();
      onLocationChange([Number(center.lat.toFixed(7)), Number(center.lng.toFixed(7))]);
    },
  });

  useEffect(() => {
    map.invalidateSize();
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 120);
    return () => window.clearTimeout(timer);
  }, [map]);

  // When a new neighborhood is selected, pan/fit the map to that neighborhood once
  useEffect(() => {
    if (!neighborhoodId || lastCenteredNeighborhoodRef.current === neighborhoodId) {
      return;
    }
    lastCenteredNeighborhoodRef.current = neighborhoodId;

    if (polygonPoints.length >= 3) {
      try {
        const bounds = L.latLngBounds(polygonPoints.map(([lat, lng]) => [lat, lng]));
        isProgrammaticMoveRef.current = true;
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 16 });
        const center = bounds.getCenter();
        onLocationChange([Number(center.lat.toFixed(7)), Number(center.lng.toFixed(7))]);
        return;
      } catch {
        // fallback
      }
    }

    if (location[0] && location[1]) {
      isProgrammaticMoveRef.current = true;
      map.setView(location, 15, { animate: true });
    }
  }, [location, map, neighborhoodId, onLocationChange, polygonPoints]);

  return null;
}

export function CrmAgencyCreateModal({ isOpen, onClose, notify }: Props) {
  const queryClient = useQueryClient();
  const selectedCity = readStoredSelectedCity();
  const cityId = selectedCity?.id ? String(selectedCity.id) : "1";

  // Form inputs
  const [name, setName] = useState("");
  const [phone1, setPhone1] = useState("");
  const [address, setAddress] = useState("");

  // User search by phone
  const [userQuery, setUserQuery] = useState("");
  const [debouncedUserPhone, setDebouncedUserPhone] = useState("");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<CrmRecord | null>(null);

  // Neighborhood search by name
  const [neighborhoodQuery, setNeighborhoodQuery] = useState("");
  const [debouncedNeighborhoodQuery, setDebouncedNeighborhoodQuery] = useState("");
  const [isNeighborhoodDropdownOpen, setIsNeighborhoodDropdownOpen] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodDto | null>(null);

  // Location on map
  const [mapLocation, setMapLocation] = useState<LatLngTuple>(DEFAULT_CENTER);

  // Dropdown click outside ref
  const userSearchRef = useRef<HTMLDivElement>(null);
  const neighborhoodSearchRef = useRef<HTMLDivElement>(null);

  // Debounce user phone input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUserPhone(userQuery.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [userQuery]);

  // Debounce neighborhood query input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNeighborhoodQuery(neighborhoodQuery.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [neighborhoodQuery]);

  // Query users by mobile
  const userSearchQuery = useQuery({
    queryKey: ["crm", "users", "search-by-phone", debouncedUserPhone],
    queryFn: () => listCrmUsers({ mobile: debouncedUserPhone }),
    enabled: Boolean(debouncedUserPhone.length >= 2 && !selectedUser && isUserDropdownOpen),
  });

  // Query neighborhoods by name
  const neighborhoodListQuery = useQuery({
    queryKey: ["crm", "neighborhoods", "search-by-name", cityId, debouncedNeighborhoodQuery],
    queryFn: () =>
      getNeighborhoodList({
        cityId,
        q: debouncedNeighborhoodQuery,
        perPage: 20,
      }),
    enabled: Boolean(
      debouncedNeighborhoodQuery.length >= 2 && !selectedNeighborhood && isNeighborhoodDropdownOpen,
    ),
  });

  // Query full neighborhood info to get complete geofence/polygon
  const fullNeighborhoodInfoQuery = useQuery({
    queryKey: ["locations", "neighborhood", selectedNeighborhood?.id],
    queryFn: () => getNeighborhoodInfo(selectedNeighborhood!.id!),
    enabled: Boolean(selectedNeighborhood?.id),
  });

  // Extract polygon coordinates
  const polygonPoints = useMemo<LatLngTuple[]>(() => {
    const neighborhood = fullNeighborhoodInfoQuery.data || selectedNeighborhood;
    if (!neighborhood) return [];

    const rawPoints = getNeighborhoodPolygonPoints(neighborhood.geofence ?? neighborhood.polygon);
    return rawPoints.map((p) => [p[0], p[1]] as LatLngTuple);
  }, [fullNeighborhoodInfoQuery.data, selectedNeighborhood]);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userSearchRef.current && !userSearchRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (
        neighborhoodSearchRef.current &&
        !neighborhoodSearchRef.current.contains(event.target as Node)
      ) {
        setIsNeighborhoodDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset state when closed
  const resetForm = () => {
    setName("");
    setPhone1("");
    setAddress("");
    setUserQuery("");
    setDebouncedUserPhone("");
    setSelectedUser(null);
    setNeighborhoodQuery("");
    setDebouncedNeighborhoodQuery("");
    setSelectedNeighborhood(null);
    setMapLocation(DEFAULT_CENTER);
  };

  const createMutation = useMutation({
    mutationFn: createCrmAgency,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["crm", "agencies"] }),
        queryClient.invalidateQueries({ queryKey: ["crm", "overview", "agencies"] }),
      ]);
      notify("آژانس جدید با موفقیت ثبت شد.", "success");
      resetForm();
      onClose();
    },
  });

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedPhone = phone1.trim();
    const trimmedAddress = address.trim();
    const ownerUserId = selectedUser ? Number(getCrmRecordId(selectedUser)) : NaN;
    const neighborhoodId = selectedNeighborhood?.id ? Number(selectedNeighborhood.id) : NaN;

    if (!trimmedName) {
      notify("لطفاً نام آژانس را وارد کنید.", "error");
      return;
    }
    if (!trimmedPhone) {
      notify("لطفاً شماره تماس آژانس را وارد کنید.", "error");
      return;
    }
    if (!ownerUserId || isNaN(ownerUserId)) {
      notify("لطفاً کاربر مالک (مدیر آژانس) را با جستجوی شماره موبایل انتخاب کنید.", "error");
      return;
    }
    if (!neighborhoodId || isNaN(neighborhoodId)) {
      notify("لطفاً محله آژانس را با جستجو انتخاب کنید.", "error");
      return;
    }
    if (!trimmedAddress) {
      notify("لطفاً نشانی دقیق آژانس را وارد کنید.", "error");
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: trimmedName,
        phone1: trimmedPhone,
        address: trimmedAddress,
        owner_user_id: ownerUserId,
        neighborhood_id: neighborhoodId,
        lat: Number(mapLocation[0].toFixed(7)),
        lng: Number(mapLocation[1].toFixed(7)),
      });
    } catch (error) {
      notify(getApiErrorMessage(error, "ثبت آژانس با خطا مواجه شد."), "error");
    }
  };

  return (
    <ModalShell onClose={createMutation.isPending ? undefined : onClose}>
      <form
        className="max-h-[calc(100vh-48px)] w-[min(840px,calc(100vw-48px))] overflow-y-auto rounded-2xl bg-white shadow-[0_24px_70px_rgba(14,34,68,0.18)]"
        dir="rtl"
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#f0f0f0] bg-white px-6">
          <div>
            <Typography
              as="h2"
              variant="title"
              size="medium"
              weight="semibold"
              className="m-0 text-base font-bold text-[#1a1a1a]"
            >
              ثبت آژانس جدید
            </Typography>
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="m-0 mt-0.5 text-xs text-[#919aa8]"
            >
              اطلاعات آژانس، کاربر مالک و محله را مشخص کرده و موقعیت آن را روی نقشه تایید کنید.
            </Typography>
          </div>
          <Button
            unstyled
            aria-label="بستن"
            className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3f5f8] text-[#596477] transition hover:bg-[#e9edf3]"
            disabled={createMutation.isPending}
            onClick={onClose}
            type="button"
          >
            ✕
          </Button>
        </div>

        {/* Form Body */}
        <div className="space-y-5 p-6">
          {/* Row 1: Agency Name & Phone */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#4d4d4d]">
                نام آژانس <span className="text-[#cc3342]">*</span>
              </label>
              <input
                className="h-11 w-full rounded-xl border border-[#cccccc] bg-white px-3 text-sm font-medium text-[#303030] outline-none transition placeholder:text-[#999999] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10"
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: املاک مهر"
                required
                value={name}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#4d4d4d]">
                شماره تماس آژانس <span className="text-[#cc3342]">*</span>
              </label>
              <input
                className="h-11 w-full rounded-xl border border-[#cccccc] bg-white px-3 text-sm font-medium text-[#303030] outline-none transition placeholder:text-[#999999] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10"
                dir="ltr"
                onChange={(e) => setPhone1(e.target.value)}
                placeholder="۰۲۱۸۸۸۸۸۸۸۸"
                required
                type="tel"
                value={phone1}
              />
            </div>
          </div>

          {/* Row 2: Owner User Search by Phone */}
          <div className="relative" ref={userSearchRef}>
            <label className="mb-1.5 block text-xs font-bold text-[#4d4d4d]">
              کاربر مالک / مدیر آژانس <span className="text-[#cc3342]">*</span>
            </label>

            {selectedUser ? (
              <div className="flex items-center justify-between rounded-xl border border-[#b2ccf8] bg-[#f0f5ff] p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-[#0048c4]">{fullName(selectedUser)}</span>
                  <span className="font-mono text-xs text-[#555]" dir="ltr">
                    {String(selectedUser.mobile ?? "")}
                  </span>
                  <span className="rounded bg-white px-2 py-0.5 text-xs text-[#666]">
                    شناسه کاربر: {getCrmRecordId(selectedUser)}
                  </span>
                </div>
                <Button
                  unstyled
                  className="text-xs font-semibold text-[#cc3342] transition hover:underline"
                  onClick={() => {
                    setSelectedUser(null);
                    setUserQuery("");
                  }}
                  type="button"
                >
                  تغییر کاربر
                </Button>
              </div>
            ) : (
              <div>
                <input
                  className="h-11 w-full rounded-xl border border-[#cccccc] bg-white px-3 text-sm font-medium text-[#303030] outline-none transition placeholder:text-[#999999] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10"
                  dir="ltr"
                  onChange={(e) => {
                    setUserQuery(e.target.value);
                    setIsUserDropdownOpen(true);
                  }}
                  onFocus={() => setIsUserDropdownOpen(true)}
                  placeholder="جستجوی کاربر با شماره موبایل (مثال: 0912...)"
                  type="search"
                  value={userQuery}
                />

                {isUserDropdownOpen && userQuery.trim().length >= 2 && (
                  <ul className="absolute z-30 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-[#cbd8ed] bg-white py-1 shadow-xl">
                    {userSearchQuery.isLoading ? (
                      <li className="px-4 py-3 text-center text-xs text-[#888]">
                        در حال جستجوی کاربران...
                      </li>
                    ) : userSearchQuery.data && userSearchQuery.data.length > 0 ? (
                      userSearchQuery.data.map((user) => {
                        const id = getCrmRecordId(user);
                        const userFullName = fullName(user);
                        return (
                          <li
                            key={id}
                            className="flex cursor-pointer items-center justify-between border-b border-[#f0f0f0] px-4 py-2.5 text-sm transition hover:bg-[#f6f9ff] last:border-0"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsUserDropdownOpen(false);
                            }}
                          >
                            <span className="font-medium text-[#1a1a1a]">
                              {userFullName || "کاربر بدون نام"}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-[#555]" dir="ltr">
                                {String(user.mobile ?? "")}
                              </span>
                              <span className="rounded bg-[#f0f0f0] px-1.5 py-0.5 text-xs text-[#777]">
                                کد: {id}
                              </span>
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <li className="px-4 py-3 text-center text-xs text-[#999]">
                        کاربری با این شماره پیدا نشد.
                      </li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Row 3: Neighborhood Search by Name */}
          <div className="relative" ref={neighborhoodSearchRef}>
            <label className="mb-1.5 block text-xs font-bold text-[#4d4d4d]">
              محله آژانس (شناسه محله) <span className="text-[#cc3342]">*</span>
            </label>

            {selectedNeighborhood ? (
              <div className="flex items-center justify-between rounded-xl border border-[#b2ccf8] bg-[#f0f5ff] p-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0048c4]">{selectedNeighborhood.name}</span>
                  <span className="rounded bg-white px-2 py-0.5 text-xs text-[#666]">
                    شناسه محله: {selectedNeighborhood.id}
                  </span>
                  {polygonPoints.length >= 3 && (
                    <span className="rounded bg-[#e9f8f0] px-2 py-0.5 text-xs text-[#0b8b55]">
                      ✓ دارای محدوده نقشه
                    </span>
                  )}
                </div>
                <Button
                  unstyled
                  className="text-xs font-semibold text-[#cc3342] transition hover:underline"
                  onClick={() => {
                    setSelectedNeighborhood(null);
                    setNeighborhoodQuery("");
                  }}
                  type="button"
                >
                  تغییر محله
                </Button>
              </div>
            ) : (
              <div>
                <input
                  className="h-11 w-full rounded-xl border border-[#cccccc] bg-white px-3 text-sm font-medium text-[#303030] outline-none transition placeholder:text-[#999999] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10"
                  onChange={(e) => {
                    setNeighborhoodQuery(e.target.value);
                    setIsNeighborhoodDropdownOpen(true);
                  }}
                  onFocus={() => setIsNeighborhoodDropdownOpen(true)}
                  placeholder="جستجوی نام محله (مثال: سعادت آباد، نیاوران...)"
                  type="search"
                  value={neighborhoodQuery}
                />

                {isNeighborhoodDropdownOpen && neighborhoodQuery.trim().length >= 2 && (
                  <ul className="absolute z-30 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-[#cbd8ed] bg-white py-1 shadow-xl">
                    {neighborhoodListQuery.isLoading ? (
                      <li className="px-4 py-3 text-center text-xs text-[#888]">
                        در حال جستجوی محله‌ها...
                      </li>
                    ) : neighborhoodListQuery.data && neighborhoodListQuery.data.length > 0 ? (
                      neighborhoodListQuery.data.map((neighborhood) => (
                        <li
                          key={neighborhood.id}
                          className="flex cursor-pointer items-center justify-between border-b border-[#f0f0f0] px-4 py-2.5 text-sm transition hover:bg-[#f6f9ff] last:border-0"
                          onClick={() => {
                            setSelectedNeighborhood(neighborhood);
                            setIsNeighborhoodDropdownOpen(false);
                          }}
                        >
                          <span className="font-bold text-[#1a1a1a]">{neighborhood.name}</span>
                          <span className="rounded bg-[#f0f0f0] px-1.5 py-0.5 text-xs text-[#777]">
                            شناسه: {neighborhood.id}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-3 text-center text-xs text-[#999]">
                        محله‌ای با این نام پیدا نشد.
                      </li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Row 4: Map Location with Neighborhood Geofence */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-xs font-bold text-[#4d4d4d]">
                موقعیت آژانس روی نقشه <span className="text-[#cc3342]">*</span>
              </label>
              {polygonPoints.length >= 3 && (
                <span className="text-xs text-[#0048c4]">
                  محدوده ژئوفنس محله با رنگ آبی روی نقشه مشخص شده است
                </span>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#cccccc] bg-white">
              <div className="relative h-[290px] w-full overflow-hidden">
                <MapContainer
                  attributionControl={false}
                  center={mapLocation}
                  className="h-full w-full"
                  scrollWheelZoom
                  zoom={15}
                  zoomControl={false}
                >
                  <TileLayer
                    attribution={searchMapTileConfig.attribution}
                    className={searchMapTileConfig.className}
                    maxZoom={searchMapTileConfig.maxZoom}
                    tms={searchMapTileConfig.isTms}
                    url={searchMapTileConfig.urlTemplate}
                  />
                  <AgencyMapController
                    location={mapLocation}
                    onLocationChange={(pt) => setMapLocation(pt)}
                    neighborhoodId={selectedNeighborhood?.id}
                    polygonPoints={polygonPoints}
                  />

                  {polygonPoints.length >= 3 && (
                    <Polygon
                      interactive={false}
                      pathOptions={{
                        color: "#0048c4",
                        fillColor: "#0048c4",
                        fillOpacity: 0.16,
                        opacity: 0.85,
                        weight: 2.5,
                      }}
                      positions={polygonPoints}
                    />
                  )}
                </MapContainer>

                <div className="pointer-events-none absolute top-1/2 left-1/2 z-[500] -translate-x-1/2 -translate-y-full">
                  <MapPickerPinIcon />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e5e5] bg-[#fafafa] px-4 py-2.5 text-xs">
                <span className="text-[#666]">
                  نقشه را جابه‌جا کنید تا نشانگر روی موقعیت دقیق دفتر آژانس قرار گیرد.
                </span>
                <span className="font-mono text-[#0048c4]" dir="ltr">
                  {mapLocation[0].toFixed(6)}, {mapLocation[1].toFixed(6)}
                </span>
              </div>
            </div>
          </div>

          {/* Row 5: Exact Address */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#4d4d4d]">
              نشانی دقیق <span className="text-[#cc3342]">*</span>
            </label>
            <textarea
              className="w-full rounded-xl border border-[#cccccc] bg-white p-3 text-sm font-medium text-[#303030] outline-none transition placeholder:text-[#999999] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10"
              onChange={(e) => setAddress(e.target.value)}
              placeholder="خیابان، کوچه، پلاک، طبقه و واحد..."
              required
              rows={2}
              value={address}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 z-20 flex items-center justify-end gap-3 border-t border-[#f0f0f0] bg-[#fafafa] px-6 py-4">
          <Button
            unstyled
            className={ghostButtonClassName}
            disabled={createMutation.isPending}
            onClick={onClose}
            type="button"
          >
            انصراف
          </Button>
          <Button
            unstyled
            className={primaryButtonClassName}
            disabled={createMutation.isPending}
            type="submit"
          >
            {createMutation.isPending ? <LoadingSpinner /> : "ثبت آژانس"}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}
