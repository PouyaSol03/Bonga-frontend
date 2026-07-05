import { useEffect, useMemo, useState, type ReactNode } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";

import { PageFrame } from "../../app/PageFrame";
import LinearAiContent from "../../components/(icons)/LinearAiContent";
import LinearArrowDown1 from "../../components/(icons)/LinearArrowDown1";
import LinearArrowLeft2 from "../../components/(icons)/LinearArrowLeft2";
import LinearBuilding3 from "../../components/(icons)/LinearBuilding3";
import LinearEdit2 from "../../components/(icons)/LinearEdit2";
import LinearInfoCircle from "../../components/(icons)/LinearInfoCircle";
import { BottomSheet } from "../../components/BottomSheet";
import { FormChoiceChip } from "../../components/form/FormControls";
import { RadioIndicator } from "../../components/RadioIndicator";
import { SelectionCheckIndicator } from "../../components/SelectionCheckIndicator";
import { TopBar } from "../../components/TopBar";
import { RouteLink } from "../../routes/RouteLink";
import { useNeighborhoodListQuery } from "../../hooks/neighborhood.hooks";
import { readStoredSelectedCity } from "../../lib/selectedCityStorage";
import type { NeighborhoodDto } from "../../services/neighborhood.service";
import { searchMapCenter, searchMapTileConfig } from "../search/searchMapData";
import LinearArrowLeft1 from "../../components/(icons)/LinearArrowLeft1";
import TonalTelegram from "../../components/(icons)/TonalTelegram";
import TonalWhatsapp from "../../components/(icons)/TonalWhatsapp";
import TonalInstagram from "../../components/(icons)/TonalInstagram";
import LinearPreview from "../../components/(icons)/LinearPreview";
import LinearX from "../../components/(icons)/LinearX";
import LinearSearch from "../../components/(icons)/LinearSearch";
import LinearLocation from "../../components/(icons)/LinearLocation";

const neighborhoodSearchDebounceMs = 250;

type SelectedNeighborhood = {
  id: string;
  name: string;
};

type AgencyProfileMapCenter = {
  lat: number;
  lng: number;
  zoom: number;
};

const selectedCityMapZoom = 12;

function getInitialAgencyProfileMapCenter(): AgencyProfileMapCenter {
  const selectedCity = readStoredSelectedCity();

  if (
    selectedCity?.latitude !== undefined &&
    selectedCity.longitude !== undefined
  ) {
    return {
      lat: selectedCity.latitude,
      lng: selectedCity.longitude,
      zoom: selectedCityMapZoom,
    };
  }

  return {
    lat: searchMapCenter.latitude,
    lng: searchMapCenter.longitude,
    zoom: selectedCityMapZoom,
  };
}

function getNeighborhoodId(neighborhood: NeighborhoodDto) {
  return String(neighborhood.id ?? neighborhood._id ?? neighborhood.name);
}

function toSelectedNeighborhood(neighborhood: NeighborhoodDto): SelectedNeighborhood {
  return {
    id: getNeighborhoodId(neighborhood),
    name: neighborhood.name,
  };
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
}

export function AgencyProfilePage() {
  const [agencyName, setAgencyName] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<SelectedNeighborhood | null>(null);
  const [selectedActivityAreas, setSelectedActivityAreas] = useState<SelectedNeighborhood[]>([]);
  const [activePicker, setActivePicker] = useState<"neighborhood" | "activity" | null>(null);

  const removeActivityArea = (id: string) => {
    setSelectedActivityAreas((current) => current.filter((item) => item.id !== id));
  };

  return (
    <PageFrame
      className="relative mx-auto flex min-h-0 max-w-[500px] flex-col overflow-hidden bg-[#f5f5f5] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account/dashboard"
        centerClassName="px-0"
        reserveStartSpace
        title="مشخصات آژانس"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <main className="min-h-0 flex-1 space-y-2 overflow-y-auto overflow-x-hidden pb-24">
        <OwnerInfoSection
          agencyName={agencyName}
          neighborhood={selectedNeighborhood}
          onAgencyNameChange={setAgencyName}
          onOpenNeighborhoodPicker={() => setActivePicker("neighborhood")}
        />
        <ContactInfoSection />
        <ActivityAreaSection
          activityAreas={selectedActivityAreas}
          onOpenPicker={() => setActivePicker("activity")}
          onRemoveActivityArea={removeActivityArea}
        />
        <AboutSection />
        <LocationSection />
      </main>

      <AgencyFooterActions />

      <NeighborhoodSelectionSheet
        mode="single"
        onChange={(neighborhood) => setSelectedNeighborhood(neighborhood)}
        onClose={() => setActivePicker(null)}
        selectedNeighborhood={selectedNeighborhood}
        title="محله"
        isOpen={activePicker === "neighborhood"}
      />

      <NeighborhoodSelectionSheet
        mode="multiple"
        onChange={setSelectedActivityAreas}
        onClose={() => setActivePicker(null)}
        selectedNeighborhoods={selectedActivityAreas}
        title="محدوده فعالیت"
        isOpen={activePicker === "activity"}
      />
    </PageFrame>
  );
}

function OwnerInfoSection({
  agencyName,
  neighborhood,
  onAgencyNameChange,
  onOpenNeighborhoodPicker,
}: {
  agencyName: string;
  neighborhood: SelectedNeighborhood | null;
  onAgencyNameChange: (value: string) => void;
  onOpenNeighborhoodPicker: () => void;
}) {
  return (
    <Section title="اطلاعات ملک">
      <div className="flex items-end justify-between gap-4">
        <AgencyLogoUpload />
        <LogoHelpText />
      </div>

      <div className="mt-4 grid gap-3">
        <Field onChange={onAgencyNameChange} placeholder="نام آژانس" value={agencyName} />
        <SelectField
          onClick={onOpenNeighborhoodPicker}
          placeholder="محله"
          value={neighborhood?.name}
        />
      </div>
    </Section>
  );
}

function LogoHelpText() {
  return (
    <div className="flex gap-1 text-right text-xs font-normal text-[#808080]">
      <div className="flex">
        <LinearInfoCircle className="h-4.5 w-4.5 text-[#4d4d4d]" />
      </div>
      <div>
        <p className="m-0 flex items-center gap-1.5">حجم عکس کمتر از 1MB باشد</p>
        <p className="m-0">بهترین ابعاد نمایش 100×100 پیکسل</p>
        <p className="m-0">فرمت‌های قابل استفاده jpg, png, gif</p>
      </div>
    </div>
  );
}

function AgencyLogoUpload() {
  return (
    <div className="mt-4 shrink-0 text-right font-medium">
      <p className="m-0 mb-3 text-sm font-semibold leading-5">لوگوی آژانس</p>
      <button
        aria-label="بارگذاری لوگوی آژانس"
        className="relative mx-auto mr-3 grid h-22 w-22 place-items-center rounded-full bg-[#f0f0f0] text-[#4d4d4d]"
        type="button"
      >
        <LinearBuilding3 className="h-8 w-8" />
        <span className="absolute -bottom-0.5 -left-0.5 grid h-8 w-8 place-items-center rounded-full border-4 border-white bg-[#0048c4] text-white">
          <LinearEdit2 className="h-4 w-4" />
        </span>
      </button>
    </div>
  );
}

function ContactInfoSection() {
  return (
    <Section title="اطلاعات تماس">
      <div className="grid gap-3">
        <p className="mt-4 text-right font-medium leading-5 text-[#1a1a1a]">شماره تماس</p>
        <Field placeholder="شماره تماس اول" />
        <Field placeholder="شماره تماس دوم" />
        <Field placeholder="شماره همراه" />
      </div>

      <Separator />

      <div className="grid gap-3">
        <h3 className="m-0 text-right text-base font-semibold leading-6">شبکه‌های اجتماعی</h3>
        <Field icon={<TonalTelegram className="w-6 h-6" />} placeholder="آیدی تلگرام بدون @" />
        <Field icon={<TonalWhatsapp className="w-6 h-6" />} placeholder="شماره واتساپ بدون صفر" />
        <Field icon={<TonalInstagram className="w-6 h-6" />} placeholder="آیدی اینستاگرام بدون @" />
      </div>

      <Separator />

      <div className="grid gap-3">
        <h3 className="m-0 text-right text-base font-semibold leading-6">نشانی</h3>
        <Field
          className="h-[122px] items-start py-3"
          multiline
          placeholder="نشانی آژانس را وارد کنید"
        />
      </div>
    </Section>
  );
}

function ActivityAreaSection({
  activityAreas,
  onOpenPicker,
  onRemoveActivityArea,
}: {
  activityAreas: SelectedNeighborhood[];
  onOpenPicker: () => void;
  onRemoveActivityArea: (id: string) => void;
}) {
  return (
    <Section>
      <div className="flex items-center justify-between gap-3">
        <h2 className="m-0 text-right text-base font-semibold leading-6">محدوده فعالیت</h2>
        <button
          className="inline-flex h-8 shrink-0 items-center gap-1.5 text-sm font-semibold leading-5 text-[#0048c4]"
          onClick={onOpenPicker}
          type="button"
        >
          {activityAreas.length ? `${activityAreas.length} انتخاب` : "انتخاب"}
          <LinearArrowLeft1 className="h-5 w-5 text-[#4D4D4D]" />
        </button>
      </div>

      {activityAreas.length > 0 ? (
        <div className="mt-3 flex flex-wrap justify-start gap-2" dir="rtl">
          {activityAreas.map((area) => (
            <FormChoiceChip
              key={area.id}
              label={area.name}
              onClick={() => onRemoveActivityArea(area.id)}
              removable
              selected
            />
          ))}
        </div>
      ) : (
        <p className="m-0 mt-3 text-right text-sm font-normal leading-6 text-[#808080]">
          برای نمایش محدوده فعالیت آژانس، محله‌ها را انتخاب کنید.
        </p>
      )}
    </Section>
  );
}

function AboutSection() {
  return (
    <Section title="درباره ما">
      <button
        className="mr-auto mt-3 inline-flex px-4 py-1.5 items-center gap-2 rounded-lg bg-[#e7e8ed] text-xs! font-medium! leading-5 text-[#2E2D3E]"
        type="button"
      >
        <LinearAiContent className="h-4 w-4 text-[#4D4D4D]" />
        تولید با هوش مصنوعی
      </button>
      <textarea
        className="mt-3 h-24 w-full resize-none rounded-xl border border-[#cccccc] bg-white px-3 py-3 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c41a]"
        placeholder="یک توضیح درباره آژانس خود بنویس"
      />
    </Section>
  );
}

function LocationSection() {
  const [mapCenter, setMapCenter] = useState<AgencyProfileMapCenter>(
    getInitialAgencyProfileMapCenter,
  );

  return (
    <Section title="موقعیت">
      <p className="mt-4 text-right text-sm font-medium text-[#1a1a1a]">
        برای تعیین موقعیت بر روی نقشه لمس کنید:
      </p>
      <div className="relative mt-3 h-[220px] w-full overflow-hidden rounded-xl bg-[#e8edf2]">
        <MapContainer
          attributionControl={false}
          center={[mapCenter.lat, mapCenter.lng]}
          className="z-0 h-full w-full bg-[#e8edf2]"
          maxZoom={searchMapTileConfig.maxZoom}
          minZoom={searchMapTileConfig.minZoom}
          preferCanvas
          scrollWheelZoom
          touchZoom
          zoom={mapCenter.zoom}
          zoomControl={false}
        >
          <TileLayer
            attribution={searchMapTileConfig.attribution}
            tms={searchMapTileConfig.isTms}
            url={searchMapTileConfig.urlTemplate}
          />
          <AgencyProfileMapController center={mapCenter} onCenterChange={setMapCenter} />
        </MapContainer>

        <span className="pointer-events-none absolute left-1/2 top-1/2 z-[450] -translate-x-1/2 -translate-y-full">
          <LinearLocation className="w-7.75 h-10"/>
        </span>

        <div className="pointer-events-none absolute inset-x-3 bottom-3 z-[450] flex justify-end">
          <span className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-medium leading-5 text-[#4d4d4d] shadow-[0_4px_14px_rgba(26,26,26,0.12)]">
            {mapCenter.lat.toFixed(5)}, {mapCenter.lng.toFixed(5)}
          </span>
        </div>
      </div>
    </Section>
  );
}

function AgencyProfileMapController({
  center,
  onCenterChange,
}: {
  center: AgencyProfileMapCenter;
  onCenterChange: (center: AgencyProfileMapCenter) => void;
}) {
  const map = useMap();

  useMapEvents({
    moveend: () => {
      const nextCenter = map.getCenter();
      onCenterChange({ lat: nextCenter.lat, lng: nextCenter.lng, zoom: map.getZoom() });
    },
    zoomend: () => {
      const nextCenter = map.getCenter();
      onCenterChange({ lat: nextCenter.lat, lng: nextCenter.lng, zoom: map.getZoom() });
    },
  });

  useEffect(() => {
    map.setView([center.lat, center.lng], center.zoom, { animate: true });
  }, [center.lat, center.lng, center.zoom, map]);

  useEffect(() => {
    map.invalidateSize();

    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [map]);

  return null;
}

function Section({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <section className="bg-white px-4 py-4">
      {title ? (
        <h2 className="m-0 text-right text-base font-semibold text-[#1a1a1a]">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

function Field({
  className = "",
  icon,
  multiline = false,
  onChange,
  placeholder,
  value,
}: {
  className?: string;
  icon?: ReactNode;
  multiline?: boolean;
  onChange?: (value: string) => void;
  placeholder: string;
  value?: string;
}) {
  return (
    <label className="block text-right">
      <span
        className={`relative flex w-full items-center rounded-xl border border-[#cccccc] bg-white px-3 py-4.5 focus-within:border-[#0048c4] focus-within:ring-2 focus-within:ring-[#0048c41a] ${className}`}
      >
        {multiline ? (
          <textarea
            className="h-full min-w-0 flex-1 resize-none border-0 bg-transparent py-0 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-sm placeholder:text-[#a6a6a6]"
            onChange={(event) => onChange?.(event.target.value)}
            placeholder={placeholder}
            value={value}
          />
        ) : (
          <input
            className="h-full min-w-0 flex-1 border-0 bg-transparent py-0 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-sm placeholder:text-[#a6a6a6]"
            onChange={(event) => onChange?.(event.target.value)}
            placeholder={placeholder}
            type="text"
            value={value}
          />
        )}
        {icon ? <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span> : null}
      </span>
    </label>
  );
}

function SelectField({
  onClick,
  placeholder,
  value,
}: {
  onClick: () => void;
  placeholder: string;
  value?: string;
}) {
  return (
    <button
      className={`relative flex w-full items-center rounded-xl border bg-white px-3 py-4.5 text-right focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] ${value ? "border-[#0048c4]" : "border-[#cccccc]"
        }`}
      onClick={onClick}
      type="button"
    >
      <span
        className={`min-w-0 flex-1 truncate text-right text-sm font-normal leading-5 ${value ? "text-[#1a1a1a]" : "text-[#a6a6a6]"
          }`}
      >
        {value ?? placeholder}
      </span>
      <LinearArrowDown1 className="h-5 w-5 text-[#4d4d4d]" />
    </button>
  );
}

type NeighborhoodSelectionSheetProps =
  | {
    isOpen: boolean;
    mode: "single";
    onChange: (neighborhood: SelectedNeighborhood | null) => void;
    onClose: () => void;
    selectedNeighborhood: SelectedNeighborhood | null;
    title: string;
  }
  | {
    isOpen: boolean;
    mode: "multiple";
    onChange: (neighborhoods: SelectedNeighborhood[]) => void;
    onClose: () => void;
    selectedNeighborhoods: SelectedNeighborhood[];
    title: string;
  };

function NeighborhoodSelectionSheet(props: NeighborhoodSelectionSheetProps) {
  const { isOpen, mode, onClose, title } = props;
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), neighborhoodSearchDebounceMs);
  const selectedCity = readStoredSelectedCity();
  const cityId = selectedCity?.id ?? "";
  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: isOpen && Boolean(cityId),
    page: 1,
    perPage: 100,
    q: debouncedQuery,
  });
  const neighborhoods = neighborhoodsQuery.data ?? [];
  const selectedItems =
    mode === "single"
      ? props.selectedNeighborhood
        ? [props.selectedNeighborhood]
        : []
      : props.selectedNeighborhoods;
  const selectedIds = useMemo(
    () => new Set(selectedItems.map((neighborhood) => neighborhood.id)),
    [selectedItems],
  );

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  const toggleNeighborhood = (neighborhood: NeighborhoodDto) => {
    const selectedNeighborhood = toSelectedNeighborhood(neighborhood);
    const isSelected = selectedIds.has(selectedNeighborhood.id);

    if (mode === "single") {
      props.onChange(isSelected ? null : selectedNeighborhood);
      onClose();
      return;
    }

    props.onChange(
      isSelected
        ? props.selectedNeighborhoods.filter((item) => item.id !== selectedNeighborhood.id)
        : [...props.selectedNeighborhoods, selectedNeighborhood],
    );
  };

  const removeSelectedItem = (id: string) => {
    if (mode === "single") {
      props.onChange(null);
      return;
    }

    props.onChange(props.selectedNeighborhoods.filter((item) => item.id !== id));
  };

  return (
    <BottomSheet
      ariaLabel={title}
      contentClassName="flex min-h-0 flex-1 flex-col"
      heightClassName="h-[min(100dvh,640px)]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="flex flex-col"
      showHandle={false}
      showHeader={false}
    >
      <div className="shrink-0 px-3 pb-2 pt-3">
        <div className="flex h-11 items-center gap-2 [direction:ltr]">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-[10px] border border-[#a6a6a6] bg-white px-3 focus-within:border-[#0048c4]" dir="rtl">
            <LinearSearch className="h-5 w-5 shrink-0 text-[#a6a6a6]" />
            <input
              className="h-9 min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجوی محله"
              type="search"
              value={query}
            />
            {query ? (
              <button
                aria-label="پاک کردن جستجو"
                className="grid h-6 w-6 shrink-0 place-items-center text-[#4d4d4d]"
                onClick={() => setQuery("")}
                type="button"
              >
                <LinearX />
              </button>
            ) : null}
          </label>

          <button
            aria-label="بازگشت"
            className="grid h-10 w-10 shrink-0 place-items-center text-[#4d4d4d]"
            onClick={onClose}
            type="button"
          >
            <LinearArrowLeft2 className="h-6 w-6 rotate-180" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between px-1">
          <h2 className="m-0 text-base font-semibold leading-6 text-[#1a1a1a]">{title}</h2>
          {selectedItems.length > 0 ? (
            <span className="text-sm font-medium leading-5 text-[#0048c4]">
              {mode === "single" ? selectedItems[0]?.name : `${selectedItems.length} انتخاب`}
            </span>
          ) : null}
        </div>

        {selectedItems.length > 0 ? (
          <div className="-mx-3 mt-2 flex gap-2 overflow-x-auto px-3 pb-1 [direction:rtl] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {selectedItems.map((neighborhood) => (
              <FormChoiceChip
                key={neighborhood.id}
                label={neighborhood.name}
                onClick={() => removeSelectedItem(neighborhood.id)}
                removable
                selected
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 pt-2" dir="rtl">
        {!cityId ? (
          <p className="m-0 px-2 py-3 text-right text-sm font-normal leading-6 text-[#808080]">
            برای انتخاب محله، ابتدا شهر را انتخاب کنید.
          </p>
        ) : neighborhoodsQuery.isLoading ? (
          <NeighborhoodSkeleton />
        ) : neighborhoods.length > 0 ? (
          <div className="space-y-1">
            {neighborhoods.map((neighborhood) => {
              const neighborhoodId = getNeighborhoodId(neighborhood);
              const isSelected = selectedIds.has(neighborhoodId);

              return (
                <button
                  aria-pressed={isSelected}
                  className={`flex min-h-[64px] w-full items-center justify-between gap-4 rounded-[10px] bg-white py-2 pl-3 pr-0 text-right transition-colors active:bg-[#0048c40a] [direction:ltr] ${isSelected ? "text-[#0048c4]" : "text-[#1a1a1a]"
                    }`}
                  key={neighborhoodId}
                  onClick={() => toggleNeighborhood(neighborhood)}
                  type="button"
                >
                  {mode === "single" ? (
                    <RadioIndicator checked={isSelected} />
                  ) : (
                    <SelectionCheckIndicator checked={isSelected} />
                  )}
                  <span className="min-w-0 flex-1 [direction:rtl]">
                    <span className="block truncate text-sm font-medium leading-5">
                      {neighborhood.name}
                    </span>
                    <span className="mt-1 block line-clamp-2 text-xs font-normal leading-5 text-[#808080]">
                      {selectedCity?.name ?? "شهر انتخاب‌شده"}
                    </span>
                  </span>
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

      {mode === "multiple" ? (
        <footer className="shrink-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-6px_16px_rgba(26,26,26,0.06)]">
          <button
            className="flex h-10 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white"
            onClick={onClose}
            type="button"
          >
            تایید
          </button>
        </footer>
      ) : null}
    </BottomSheet>
  );
}

function NeighborhoodSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-12 rounded-[10px] bg-[#f0f0f0]" />
      <div className="h-12 rounded-[10px] bg-[#f0f0f0]" />
      <div className="h-12 rounded-[10px] bg-[#f0f0f0]" />
    </div>
  );
}

function Separator() {
  return <div className="my-4 h-px bg-[#e6e6e6]" />;
}

function AgencyFooterActions() {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-10 bg-white px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
      <div className="grid h-10 grid-cols-2 gap-3 [direction:ltr]">
        <button
          className="rounded-lg bg-[#0048c4] text-sm font-medium text-white"
          type="button"
        >
          ذخیره اطلاعات
        </button>
        <RouteLink
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#0048c4] bg-white text-xs font-semibold leading-5 text-[#0048c4] no-underline"
          to="/account/dashboard/agency/preview"
        >
          پیش نمایش
          <LinearPreview className="w-5 h-5"/>
        </RouteLink>
      </div>
    </footer>
  );
}
