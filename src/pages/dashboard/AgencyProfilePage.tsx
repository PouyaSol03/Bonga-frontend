import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";

import { PageFrame } from "../../app/layout/PageFrame";
import LinearAiContent from "../../shared/icons/LinearAiContent";
import LinearArrowDown1 from "../../shared/icons/LinearArrowDown1";
import LinearArrowLeft2 from "../../shared/icons/LinearArrowLeft2";
import LinearBuilding3 from "../../shared/icons/LinearBuilding3";
import LinearEdit2 from "../../shared/icons/LinearEdit2";
import LinearInfoCircle from "../../shared/icons/LinearInfoCircle";
import { BottomSheet } from "../../shared/components/BottomSheet";
import { FormChoiceChip } from "../../shared/form/FormControls";
import { RadioIndicator } from "../../shared/components/RadioIndicator";
import { SelectionCheckIndicator } from "../../shared/components/SelectionCheckIndicator";
import { TopBar } from "../../shared/components/TopBar";
import { Toast } from "../../shared/components/Toast";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import { RouteLink } from "../../app/router/RouteLink";
import { getApiAssetUrl, getApiErrorMessage } from "../../core/api/api";
import { getActiveAuthRole, getStoredAuthSession } from "../../core/auth/auth-storage";
import { REAL_ESTATE_MANAGER } from "../../shared/constants/roles.constants";
import { useMyAgencyProfileQuery, useUpdateMyAgencyProfileMutation } from "../../core/hooks/account.hooks";
import { useNeighborhoodListQuery } from "../../core/hooks/neighborhood.hooks";
import { readStoredSelectedCity, selectedCityStorageKeys } from "../../shared/lib/selectedCityStorage";
import type { MyAgencyProfile } from "../../core/services/account.service";
import { getNeighborhoodHierarchyDescription, type NeighborhoodDto } from "../../core/services/neighborhood.service";
import { searchMapCenter, searchMapTileConfig } from "../search/searchMapData";
import LinearArrowLeft1 from "../../shared/icons/LinearArrowLeft1";
import TonalTelegram from "../../shared/icons/TonalTelegram";
import TonalWhatsapp from "../../shared/icons/TonalWhatsapp";
import TonalInstagram from "../../shared/icons/TonalInstagram";
import LinearPreview from "../../shared/icons/LinearPreview";
import LinearX from "../../shared/icons/LinearX";
import LinearSearch from "../../shared/icons/LinearSearch";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

const neighborhoodSearchDebounceMs = 250;
const agencyImageMaxBytes = 1024 * 1024;
const agencyImageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

type SelectedNeighborhood = {
  id: string;
  name: string;
};

type AgencyProfileMapCenter = {
  lat: number;
  lng: number;
  zoom: number;
};

type AgencyProfileToast = {
  message: string;
  title: string;
  variant: "error" | "success" | "info" | "warning";
};

const selectedCityMapZoom = 12;

function readStoredCoordinate(key: string) {
  const value = window.localStorage.getItem(key);

  if (!value?.trim()) return null;

  const coordinate = Number(value);

  return Number.isFinite(coordinate) ? coordinate : null;
}

function getStoredSelectedCityCenter() {
  const lat = readStoredCoordinate(selectedCityStorageKeys.latitude);
  const lng = readStoredCoordinate(selectedCityStorageKeys.longitude);

  if (
    lat !== null &&
    Math.abs(lat) <= 90 &&
    lng !== null &&
    Math.abs(lng) <= 180
  ) {
    return { lat, lng };
  }

  const selectedCity = readStoredSelectedCity();

  if (
    selectedCity?.latitude !== undefined &&
    selectedCity.longitude !== undefined
  ) {
    return {
      lat: selectedCity.latitude,
      lng: selectedCity.longitude,
    };
  }

  return null;
}

function getInitialAgencyProfileMapCenter(): AgencyProfileMapCenter {
  const selectedCityCenter = getStoredSelectedCityCenter();

  if (selectedCityCenter) {
    return {
      lat: selectedCityCenter.lat,
      lng: selectedCityCenter.lng,
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

function normalizeOptionalText(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : null;
}

function normalizeProfileText(value: string | null | undefined) {
  return value ?? "";
}

function normalizeProfileCoordinate(value: MyAgencyProfile["lat"] | MyAgencyProfile["lng"]) {
  const numberValue = typeof value === "number" ? value : Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
}

function resolveNeighborhoodById(
  id: string | null | undefined,
  neighborhoods: NeighborhoodDto[],
): SelectedNeighborhood | null {
  if (!id) return null;

  const normalizedId = String(id);
  const neighborhood = neighborhoods.find((item) => getNeighborhoodId(item) === normalizedId);

  return neighborhood ? toSelectedNeighborhood(neighborhood) : { id: normalizedId, name: normalizedId };
}

function resolveProfileNeighborhoodIds(profile: MyAgencyProfile) {
  return Array.from(
    new Set(
      (profile.neighborhood_ids ?? [])
        .flatMap((value) => String(value).split(","))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
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

export function AgencyProfilePage() {
  const [agencyName, setAgencyName] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<SelectedNeighborhood | null>(null);
  const [selectedActivityAreas, setSelectedActivityAreas] = useState<SelectedNeighborhood[]>([]);
  const [activePicker, setActivePicker] = useState<"neighborhood" | "activity" | null>(null);
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [telegram, setTelegram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [address, setAddress] = useState("");
  const [aboutUs, setAboutUs] = useState("");
  const [mapCenter, setMapCenter] = useState<AgencyProfileMapCenter>(
    getInitialAgencyProfileMapCenter,
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [toast, setToast] = useState<AgencyProfileToast | null>(null);
  const selectedCity = readStoredSelectedCity();
  const cityId = selectedCity?.id ?? "";
  const isRealEstateManager =
    getActiveAuthRole(getStoredAuthSession()) === REAL_ESTATE_MANAGER;
  const agencyProfileQuery = useMyAgencyProfileQuery({ enabled: isRealEstateManager });
  const updateAgencyProfileMutation = useUpdateMyAgencyProfileMutation();
  const neighborhoodListQuery = useNeighborhoodListQuery({
    cityId,
    enabled: Boolean(cityId),
    page: 1,
    perPage: 200,
    q: "",
  });
  const neighborhoods = useMemo(
    () => neighborhoodListQuery.data ?? [],
    [neighborhoodListQuery.data],
  );
  const selectedActivityAreaIds = useMemo(
    () => selectedActivityAreas.map((area) => area.id).filter(Boolean),
    [selectedActivityAreas],
  );
  const trimmedAgencyName = agencyName.trim();
  const agencyNameError = hasSubmitted && !trimmedAgencyName ? "نام آژانس الزامی است." : null;
  const activityAreasError =
    hasSubmitted && selectedActivityAreaIds.length === 0
      ? "انتخاب محدوده فعالیت الزامی است."
      : null;
  useEffect(() => {
    if (!logoPreviewUrl) return undefined;

    return () => URL.revokeObjectURL(logoPreviewUrl);
  }, [logoPreviewUrl]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (
    message: string,
    title = "موفقیت",
    variant: "error" | "success" | "info" | "warning" = "success",
  ) => setToast({ message, title, variant });

  useEffect(() => {
    if (!agencyProfileQuery.isError) return;

    setToast({
      message: getApiErrorMessage(
        agencyProfileQuery.error,
        "دریافت اطلاعات آژانس با خطا مواجه شد.",
      ),
      title: "خطا",
      variant: "error",
    });
  }, [agencyProfileQuery.error, agencyProfileQuery.isError]);

  useEffect(() => {
    const profile = agencyProfileQuery.data;

    if (!profile) return;

    setAgencyName(normalizeProfileText(profile.name));
    setPhone1(normalizeProfileText(profile.phone1));
    setPhone2(normalizeProfileText(profile.phone2));
    setPhone3(normalizeProfileText(profile.phone3));
    setTelegram(normalizeProfileText(profile.telegram));
    setWhatsapp(normalizeProfileText(profile.whatsapp));
    setInstagram(normalizeProfileText(profile.instagram));
    setWorkingHours(normalizeProfileText(profile.working_hours));
    setAddress(normalizeProfileText(profile.address));
    setAboutUs(normalizeProfileText(profile.about_us));
    setLogoFile(null);
    setLogoPreviewUrl(null);
    setLogoUrl(profile.logo ? getApiAssetUrl(profile.logo) : null);

    const profileNeighborhoodIds = resolveProfileNeighborhoodIds(profile);
    const neighborhoodId = profile.neighborhood_id
      ? String(profile.neighborhood_id)
      : profileNeighborhoodIds[0] ?? null;
    setSelectedNeighborhood(resolveNeighborhoodById(neighborhoodId, neighborhoods));
    setSelectedActivityAreas(
      profileNeighborhoodIds
        .map((id) => resolveNeighborhoodById(id, neighborhoods))
        .filter((item): item is SelectedNeighborhood => Boolean(item)),
    );

    const lat = normalizeProfileCoordinate(profile.lat);
    const lng = normalizeProfileCoordinate(profile.lng);

    if (lat !== null && lng !== null) {
      setMapCenter({ lat, lng, zoom: selectedCityMapZoom });
    } else {
      setMapCenter(getInitialAgencyProfileMapCenter());
    }
  }, [agencyProfileQuery.data, neighborhoods]);

  const removeActivityArea = (id: string) => {
    setSelectedActivityAreas((current) => current.filter((item) => item.id !== id));
  };

  const handleLogoChange = (file: File | null) => {
    if (file && !agencyImageMimeTypes.has(file.type)) {
      showToast("فرمت لوگو باید JPG، JPEG، PNG یا WEBP باشد.", "خطا", "error");
      return;
    }

    if (file && file.size > agencyImageMaxBytes) {
      showToast("حجم لوگو نباید بیشتر از ۱ مگابایت باشد.", "خطا", "error");
      return;
    }

    setLogoFile(file);
    setLogoPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleSave = async () => {
    if (!isRealEstateManager) {
      showToast("ویرایش مشخصات آژانس فقط برای نقش مدیر آژانس فعال است.", "خطا", "error");
      return;
    }

    setHasSubmitted(true);
    updateAgencyProfileMutation.reset();

    const validationError = !trimmedAgencyName
      ? "نام آژانس الزامی است."
      : selectedActivityAreaIds.length === 0
        ? "انتخاب محدوده فعالیت الزامی است."
        : null;

    if (validationError) {
      showToast(validationError, "خطا", "error");
      return;
    }

    const neighborhoodIds = Array.from(
      new Set([
        ...(selectedNeighborhood?.id ? [selectedNeighborhood.id] : []),
        ...selectedActivityAreaIds,
      ]),
    );

    try {
      await updateAgencyProfileMutation.mutateAsync({
        about_us: normalizeOptionalText(aboutUs),
        address: normalizeOptionalText(address),
        agency_type: agencyProfileQuery.data?.agency_type ?? 0,
        lat: mapCenter.lat,
        lng: mapCenter.lng,
        logo: logoFile,
        name: trimmedAgencyName,
        neighborhood_ids: neighborhoodIds,
        phone1: normalizeOptionalText(phone1),
        phone2: normalizeOptionalText(phone2),
        phone3: normalizeOptionalText(phone3),
        telegram: normalizeOptionalText(telegram),
        whatsapp: normalizeOptionalText(whatsapp),
        instagram: normalizeOptionalText(instagram),
        working_hours: normalizeOptionalText(workingHours),
      });
      showToast("اطلاعات آژانس ذخیره شد.");
    } catch (error) {
      showToast(
        getApiErrorMessage(error, "ذخیره اطلاعات آژانس با خطا مواجه شد."),
        "خطا",
        "error",
      );
    }
  };

  return (
    <PageFrame
      className="relative mx-auto flex min-h-0 max-w-[500px] flex-col overflow-hidden bg-[#f5f5f5] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account"
        centerClassName="px-0"
        reserveStartSpace
        title="مشخصات آژانس"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <Toast onDismiss={() => setToast(null)} toast={toast} />

      <main className="min-h-0 flex-1 space-y-2 overflow-y-auto overflow-x-hidden pb-28">
        {agencyProfileQuery.isLoading ? (
          <div className="bg-white px-4 py-3 text-center text-sm font-medium text-[#808080]">
            در حال دریافت اطلاعات آژانس...
          </div>
        ) : null}
        <OwnerInfoSection
          agencyName={agencyName}
          agencyNameError={agencyNameError}
          logoPreviewUrl={logoPreviewUrl}
          logoUrl={logoUrl}
          neighborhood={selectedNeighborhood}
          onAgencyNameChange={setAgencyName}
          onLogoChange={handleLogoChange}
          onOpenNeighborhoodPicker={() => setActivePicker("neighborhood")}
        />
        <ContactInfoSection
          address={address}
          onAddressChange={setAddress}
          onPhone1Change={setPhone1}
          onPhone2Change={setPhone2}
          onPhone3Change={setPhone3}
          onTelegramChange={setTelegram}
          onWhatsappChange={setWhatsapp}
          onInstagramChange={setInstagram}
          phone1={phone1}
          phone2={phone2}
          phone3={phone3}
          telegram={telegram}
          whatsapp={whatsapp}
          instagram={instagram}
        />
        <ActivityAreaSection
          activityAreas={selectedActivityAreas}
          error={activityAreasError}
          onOpenPicker={() => setActivePicker("activity")}
          onRemoveActivityArea={removeActivityArea}
        />
        <AboutSection aboutUs={aboutUs} onAboutUsChange={setAboutUs} />
        <LocationSection mapCenter={mapCenter} onMapCenterChange={setMapCenter} />
      </main>

      <AgencyFooterActions
        isSaving={updateAgencyProfileMutation.isPending}
        onSave={handleSave}
      />


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
  agencyNameError,
  logoPreviewUrl,
  logoUrl,
  neighborhood,
  onAgencyNameChange,
  onLogoChange,
  onOpenNeighborhoodPicker,
}: {
  agencyName: string;
  agencyNameError?: string | null;
  logoPreviewUrl: string | null;
  logoUrl: string | null;
  neighborhood: SelectedNeighborhood | null;
  onAgencyNameChange: (value: string) => void;
  onLogoChange: (file: File | null) => void;
  onOpenNeighborhoodPicker: () => void;
}) {
  return (
    <Section title="اطلاعات ملک">
      <div className="flex items-end justify-between gap-4">
        <AgencyLogoUpload
          logoPreviewUrl={logoPreviewUrl}
          logoUrl={logoUrl}
          onLogoChange={onLogoChange}
        />
        <LogoHelpText />
      </div>

      <div className="mt-4 grid gap-3">
        <Field onChange={onAgencyNameChange} placeholder="نام آژانس" value={agencyName} />
        {agencyNameError ? (
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 -mt-1 text-right text-xs font-normal leading-5 text-[#c11004]">
            {agencyNameError}
          </Typography>
        ) : null}
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
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 flex items-center gap-1.5">حجم عکس کمتر از 1MB باشد</Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">بهترین ابعاد نمایش 100×100 پیکسل</Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">فرمت‌های قابل استفاده jpg, jpeg, png, webp</Typography>
      </div>
    </div>
  );
}

function AgencyLogoUpload({
  logoPreviewUrl,
  logoUrl,
  onLogoChange,
}: {
  logoPreviewUrl: string | null;
  logoUrl: string | null;
  onLogoChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const imageUrl = logoPreviewUrl ?? logoUrl;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onLogoChange(event.target.files?.[0] ?? null);
    event.target.value = "";
  };

  return (
    <div className="mt-4 shrink-0 text-right font-medium">
      <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 mb-3 text-sm font-semibold leading-5">لوگوی آژانس</Typography>
      <Button unstyled
        aria-label="بارگذاری لوگوی آژانس"
        className="relative mx-auto mr-3 grid h-22 w-22 place-items-center overflow-visible rounded-full text-[#4d4d4d]"
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-full w-full place-items-center overflow-hidden rounded-full bg-[#f0f0f0]">
          {imageUrl ? (
            <img alt="لوگوی آژانس" className="h-full w-full object-cover" src={imageUrl} />
          ) : (
            <LinearBuilding3 className="h-8 w-8" />
          )}
        </Typography>

        <Typography as="span" variant="body" size="medium" weight="regular" className="absolute -bottom-0.5 -left-0.5 z-10 grid h-8 w-8 place-items-center rounded-full border-4 border-white bg-[#0048c4] text-white">
          <LinearEdit2 className="h-4 w-4" />
        </Typography>
      </Button>
      <input
        ref={inputRef}
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleInputChange}
        type="file"
      />
    </div>
  );
}

function ContactInfoSection({
  address,
  onAddressChange,
  onPhone1Change,
  onPhone2Change,
  onPhone3Change,
  onTelegramChange,
  onWhatsappChange,
  onInstagramChange,
  phone1,
  phone2,
  phone3,
  telegram,
  whatsapp,
  instagram,
}: {
  address: string;
  onAddressChange: (value: string) => void;
  onPhone1Change: (value: string) => void;
  onPhone2Change: (value: string) => void;
  onPhone3Change: (value: string) => void;
  onTelegramChange: (value: string) => void;
  onWhatsappChange: (value: string) => void;
  onInstagramChange: (value: string) => void;
  phone1: string;
  phone2: string;
  phone3: string;
  telegram: string;
  whatsapp: string;
  instagram: string;
}) {
  return (
    <Section title="اطلاعات تماس">
      <div className="grid gap-3">
        <Typography as="p" variant="body" size="medium" weight="medium" className="mt-4 text-right font-medium leading-5 text-[#1a1a1a]">شماره تماس</Typography>
        <Field onChange={onPhone1Change} placeholder="شماره تماس اول" value={phone1} />
        <Field onChange={onPhone2Change} placeholder="شماره تماس دوم" value={phone2} />
        <Field onChange={onPhone3Change} placeholder="شماره همراه" value={phone3} />
      </div>

      <Separator />

      <div className="grid gap-3">
        <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0 text-right text-base font-semibold leading-6">شبکه‌های اجتماعی</Typography>
        <Field icon={<TonalTelegram className="w-6 h-6" />} onChange={onTelegramChange} placeholder="آیدی تلگرام بدون @" value={telegram} />
        <Field icon={<TonalWhatsapp className="w-6 h-6" />} onChange={onWhatsappChange} placeholder="شماره واتساپ بدون صفر" value={whatsapp} />
        <Field icon={<TonalInstagram className="w-6 h-6" />} onChange={onInstagramChange} placeholder="آیدی اینستاگرام بدون @" value={instagram} />
      </div>

      <Separator />

      <div className="grid gap-3">
        <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0 text-right text-base font-semibold leading-6">نشانی</Typography>
        <Field
          className="h-[122px] items-start py-3"
          multiline
          onChange={onAddressChange}
          placeholder="نشانی آژانس را وارد کنید"
          value={address}
        />
      </div>
    </Section>
  );
}

function ActivityAreaSection({
  activityAreas,
  error,
  onOpenPicker,
  onRemoveActivityArea,
}: {
  activityAreas: SelectedNeighborhood[];
  error?: string | null;
  onOpenPicker: () => void;
  onRemoveActivityArea: (id: string) => void;
}) {
  return (
    <Section>
      <div className="flex items-center justify-between gap-3">
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-right text-base font-semibold leading-6">محدوده فعالیت</Typography>
        <Button unstyled
          className="inline-flex h-8 shrink-0 items-center gap-1.5 text-sm font-semibold leading-5 text-[#0048c4]"
          onClick={onOpenPicker}
          type="button"
        >
          {activityAreas.length ? `${activityAreas.length} انتخاب` : "انتخاب"}
          <LinearArrowLeft1 className="h-5 w-5 text-[#4D4D4D]" />
        </Button>
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
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-3 text-right text-sm font-normal leading-6 text-[#808080]">
          برای نمایش محدوده فعالیت آژانس، محله‌ها را انتخاب کنید.
        </Typography>
      )}
      {error ? (
        <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-right text-xs font-normal leading-5 text-[#c11004]">
          {error}
        </Typography>
      ) : null}
    </Section>
  );
}

function AboutSection({
  aboutUs,
  onAboutUsChange,
}: {
  aboutUs: string;
  onAboutUsChange: (value: string) => void;
}) {
  return (
    <Section title="درباره ما">
      <Button unstyled
        className="mr-auto mt-3 inline-flex px-4 py-1.5 items-center gap-2 rounded-lg bg-[#e7e8ed] text-xs! font-medium! leading-5 text-[#2E2D3E]"
        type="button"
      >
        <LinearAiContent className="h-4 w-4 text-[#4D4D4D]" />
        تولید با هوش مصنوعی
      </Button>
      <textarea
        className="mt-3 h-24 w-full resize-none rounded-xl border border-[#cccccc] bg-white px-3 py-3 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c41a]"
        onChange={(event) => onAboutUsChange(event.target.value)}
        placeholder="یک توضیح درباره آژانس خود بنویس"
        value={aboutUs}
      />
    </Section>
  );
}

function LocationSection({
  mapCenter,
  onMapCenterChange,
}: {
  mapCenter: AgencyProfileMapCenter;
  onMapCenterChange: (center: AgencyProfileMapCenter) => void;
}) {
  return (
    <Section title="موقعیت">
      <Typography as="p" variant="body" size="medium" weight="medium" className="mt-4 text-right text-sm font-medium text-[#1a1a1a]">
        برای تعیین موقعیت بر روی نقشه لمس کنید:
      </Typography>
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
          <AgencyProfileMapController center={mapCenter} onCenterChange={onMapCenterChange} />
        </MapContainer>

        <Typography as="span" variant="body" size="medium" weight="regular" className="pointer-events-none absolute left-1/2 top-1/2 z-[450] -translate-x-1/2 -translate-y-full">
          <MapPickerPinIcon />
        </Typography>

        <div className="pointer-events-none absolute inset-x-3 bottom-3 z-[450] flex justify-end">
          <Typography as="span" variant="label" size="small" weight="medium" className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-medium leading-5 text-[#4d4d4d] shadow-[0_4px_14px_rgba(26,26,26,0.12)]">
            {mapCenter.lat.toFixed(5)}, {mapCenter.lng.toFixed(5)}
          </Typography>
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
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-right text-base font-semibold text-[#1a1a1a]">
          {title}
        </Typography>
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
      <Typography as="span" variant="body" size="medium" weight="regular"
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
        {icon ? <Typography as="span" variant="body" size="medium" weight="regular" className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</Typography> : null}
      </Typography>
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
    <Button unstyled
      className={`relative flex w-full items-center rounded-xl border bg-white px-3 py-4.5 text-right focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] ${value ? "border-[#0048c4]" : "border-[#cccccc]"
        }`}
      onClick={onClick}
      type="button"
    >
      <Typography as="span" variant="body" size="medium" weight="regular"
        className={`min-w-0 flex-1 truncate text-right text-sm font-normal leading-5 ${value ? "text-[#1a1a1a]" : "text-[#a6a6a6]"
          }`}
      >
        {value ?? placeholder}
      </Typography>
      <LinearArrowDown1 className="h-5 w-5 text-[#4d4d4d]" />
    </Button>
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
              <Button unstyled
                aria-label="پاک کردن جستجو"
                className="grid h-6 w-6 shrink-0 place-items-center text-[#4d4d4d]"
                onClick={() => setQuery("")}
                type="button"
              >
                <LinearX />
              </Button>
            ) : null}
          </label>

          <Button unstyled
            aria-label="بازگشت"
            className="grid h-10 w-10 shrink-0 place-items-center text-[#4d4d4d]"
            onClick={onClose}
            type="button"
          >
            <LinearArrowLeft2 className="h-6 w-6 rotate-180" />
          </Button>
        </div>

        <div className="mt-3 flex items-center justify-between px-1">
          <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6 text-[#1a1a1a]">{title}</Typography>
          {selectedItems.length > 0 ? (
            <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium leading-5 text-[#0048c4]">
              {mode === "single" ? selectedItems[0]?.name : `${selectedItems.length} انتخاب`}
            </Typography>
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
          <Typography as="p" variant="body" size="medium" weight="regular" className="mx-auto m-0 w-full px-2 py-3 text-center text-sm font-normal leading-6 text-[#808080]">
            برای انتخاب محله، ابتدا شهر را انتخاب کنید.
          </Typography>
        ) : neighborhoodsQuery.isLoading ? (
          <NeighborhoodSkeleton />
        ) : neighborhoods.length > 0 ? (
          <div className="space-y-1">
            {neighborhoods.map((neighborhood) => {
              const neighborhoodId = getNeighborhoodId(neighborhood);
              const isSelected = selectedIds.has(neighborhoodId);

              return (
                <Button unstyled
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
                  <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1 [direction:rtl]">
                    <Typography as="span" variant="label" size="medium" weight="medium" className="block truncate text-sm font-medium leading-5">
                      {neighborhood.name}
                    </Typography>
                    <Typography as="span" variant="body" size="small" weight="regular" className="mt-1 block line-clamp-2 text-xs font-normal leading-5 text-[#808080]">
                      {getNeighborhoodHierarchyDescription(neighborhood) || selectedCity?.name || "شهر انتخاب‌شده"}
                    </Typography>
                  </Typography>
                </Button>
              );
            })}
          </div>
        ) : query.trim() ? (
          <SearchEmptyState compact />
        ) : (
          <Typography as="p" variant="body" size="medium" weight="regular" className="mx-auto m-0 w-full px-2 py-3 text-center text-sm font-normal leading-6 text-[#808080]">
            محله‌ای برای این شهر ثبت نشده است.
          </Typography>
        )}
      </div>

      {mode === "multiple" ? (
        <footer className="shrink-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-6px_16px_rgba(26,26,26,0.06)]">
          <Button unstyled
            className="flex h-10 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white"
            onClick={onClose}
            type="button"
          >
            تایید
          </Button>
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

function MapPickerPinIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[42px] w-[31px] drop-shadow-[0_8px_14px_rgba(26,26,26,0.18)]"
      fill="none"
      viewBox="0 0 31 42"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="15" cy="40.5" fill="#1A1A1A" fillOpacity="0.12" rx="6" ry="1.5" />
      <path
        d="M20.7379 30.0613C26.7208 27.9158 31 22.199 31 15.4839C31 6.93237 24.0604 0 15.5 0C6.93959 0 0 6.93237 0 15.4839C0 22.1987 4.27872 27.9152 10.2612 30.061C12.3965 30.9288 14.2083 32.6522 14.2083 34.8387V38.7097C14.2083 39.4223 14.7866 40 15.5 40C16.2133 40 16.7916 39.4223 16.7916 38.7097V34.8387C16.7916 32.6525 18.6029 30.9292 20.7379 30.0613Z"
        fill="#11A366"
      />
      <path
        d="M15.5 21C17.16 21 18.575 20.415 19.745 19.245C20.915 18.075 21.5 16.66 21.5 15C21.5 13.34 20.915 11.925 19.745 10.755C18.575 9.585 17.16 9 15.5 9C13.84 9 12.425 9.585 11.255 10.755C10.085 11.925 9.5 13.34 9.5 15C9.5 16.66 10.085 18.075 11.255 19.245C12.425 20.415 13.84 21 15.5 21Z"
        fill="white"
      />
    </svg>
  );
}

function Separator() {
  return <div className="my-4 h-px bg-[#e6e6e6]" />;
}

function AgencyFooterActions({
  isSaving,
  onSave,
}: {
  isSaving: boolean;
  onSave: () => void;
}) {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-10 bg-white px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
      <div className="grid h-10 grid-cols-2 gap-3 [direction:ltr]">
        <Button unstyled
          className="rounded-lg bg-[#0048c4] text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSaving}
          onClick={onSave}
          type="button"
        >
          {isSaving ? "در حال ذخیره..." : "ذخیره اطلاعات"}
        </Button>
        <RouteLink
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#0048c4] bg-white text-xs font-semibold leading-5 text-[#0048c4] no-underline"
          to="/account/dashboard/agency/preview"
        >
          پیش نمایش
          <LinearPreview className="w-5 h-5" />
        </RouteLink>
      </div>
    </footer>
  );
}
