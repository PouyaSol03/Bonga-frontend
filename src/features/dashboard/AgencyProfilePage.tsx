import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";

import { PageFrame } from "../../shared/layout/PageFrame";
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
import { useDebouncedValue } from "../../shared/hooks/useDebouncedValue";
import { Link } from "react-router";
import { SearchInputBar } from "../../shared/ui/SearchBar";
import { getApiAssetUrl, getApiErrorMessage } from "../../shared/api/api";
import { getActiveAuthRole, getStoredAuthSession } from "../../shared/auth/auth-storage";
import { REAL_ESTATE_MANAGER } from "../../shared/constants/roles.constants";
import {
  useMyAgencyProfileQuery,
  useUpdateMyAgencyProfileMutation,
} from "../account/api/account.hooks";
import { useNeighborhoodListQuery } from "../locations/api/neighborhood.hooks";
import { readStoredSelectedCity } from "../../shared/lib/selectedCityStorage";
import { getStoredSelectedCityCenter } from "../../shared/lib/selectedCityCenter";
import type { MyAgencyProfile } from "../account/api/account.service";
import {
  getNeighborhoodHierarchyDescription,
  getNeighborhoodInfoWithLoc,
  type NeighborhoodDto,
} from "../locations/api/neighborhood.service";
import { searchMapCenter, searchMapTileConfig } from "../search/searchMapData";
import LinearArrowLeft1 from "../../shared/icons/LinearArrowLeft1";
import TonalTelegram from "../../shared/icons/TonalTelegram";
import TonalWhatsapp from "../../shared/icons/TonalWhatsapp";
import TonalInstagram from "../../shared/icons/TonalInstagram";
import LinearPreview from "../../shared/icons/LinearPreview";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";
import {
  validateImageDimensions,
  MAX_PROFILE_IMAGE_BYTES,
  MAX_PROFILE_IMAGE_DIMENSION,
} from "../../shared/utils/image-validation";

const neighborhoodSearchDebounceMs = 250;
const agencyImageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

type SelectedNeighborhood = {
  id: string;
  lat?: number;
  lng?: number;
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
    lat: Number.isFinite(Number(neighborhood.lat)) ? Number(neighborhood.lat) : undefined,
    lng: Number.isFinite(Number(neighborhood.lng)) ? Number(neighborhood.lng) : undefined,
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

function findNearestNeighborhood(
  lat: number,
  lng: number,
  neighborhoods: NeighborhoodDto[],
): SelectedNeighborhood | null {
  let nearest: NeighborhoodDto | null = null;
  let minDistance = Infinity;

  for (const n of neighborhoods) {
    const nLat = Number(n.lat);
    const nLng = Number(n.lng);
    if (Number.isFinite(nLat) && Number.isFinite(nLng)) {
      const d = (lat - nLat) ** 2 + (lng - nLng) ** 2;
      if (d < minDistance) {
        minDistance = d;
        nearest = n;
      }
    }
  }

  return nearest ? toSelectedNeighborhood(nearest) : null;
}

function resolveNeighborhoodById(
  id: string | null | undefined,
  neighborhoods: NeighborhoodDto[],
): SelectedNeighborhood | null {
  if (!id) return null;

  const normalizedId = String(id);
  const neighborhood = neighborhoods.find((item) => getNeighborhoodId(item) === normalizedId);

  return neighborhood ? toSelectedNeighborhood(neighborhood) : null;
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

export function AgencyProfilePage() {
  const [agencyName, setAgencyName] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<SelectedNeighborhood | null>(
    null,
  );
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
  const isRealEstateManager = getActiveAuthRole(getStoredAuthSession()) === REAL_ESTATE_MANAGER;
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
      : (profileNeighborhoodIds[0] ?? null);
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

  const handleLogoChange = async (file: File | null) => {
    if (!file) {
      setLogoFile(null);
      setLogoPreviewUrl(null);
      return;
    }

    if (!agencyImageMimeTypes.has(file.type)) {
      showToast("فرمت لوگو باید JPG، JPEG، PNG یا WEBP باشد.", "خطا", "error");
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_BYTES) {
      showToast("حجم لوگو نباید بیشتر از ۱ مگابایت باشد.", "خطا", "error");
      return;
    }

    const { valid } = await validateImageDimensions(
      file,
      MAX_PROFILE_IMAGE_DIMENSION,
      MAX_PROFILE_IMAGE_DIMENSION,
    );
    if (!valid) {
      showToast("ابعاد لوگو نباید بیشتر از ۱۰۰۰ در ۱۰۰۰ پیکسل باشد.", "خطا", "error");
      return;
    }

    setLogoFile(file);
    setLogoPreviewUrl(URL.createObjectURL(file));
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

    const validNeighborhoodIds = new Set(neighborhoods.map((n) => getNeighborhoodId(n)));
    if (selectedNeighborhood?.id && !validNeighborhoodIds.has(selectedNeighborhood.id)) {
      showToast("محله انتخاب‌شده معتبر نیست.", "خطا", "error");
      return;
    }

    const invalidArea = selectedActivityAreas.find((area) => !validNeighborhoodIds.has(area.id));
    if (invalidArea) {
      showToast(`محدوده فعالیت "${invalidArea.name}" معتبر نیست.`, "خطا", "error");
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
        neighborhood_id: selectedNeighborhood?.id ?? null,
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
      showToast(getApiErrorMessage(error, "ذخیره اطلاعات آژانس با خطا مواجه شد."), "خطا", "error");
    }
  };

  const handleNeighborhoodChange = (neighborhood: SelectedNeighborhood | null) => {
    setSelectedNeighborhood(neighborhood);
    if (neighborhood?.lat !== undefined && neighborhood.lng !== undefined) {
      setMapCenter({ lat: neighborhood.lat, lng: neighborhood.lng, zoom: selectedCityMapZoom });
    }
  };

  const handleMapCenterChange = (center: AgencyProfileMapCenter) => {
    setMapCenter(center);
    if (!cityId) return;
    void getNeighborhoodInfoWithLoc({ cityId, lat: center.lat, lng: center.lng })
      .then((neighborhood) => {
        if (neighborhood) {
          setSelectedNeighborhood(toSelectedNeighborhood(neighborhood));
        } else if (neighborhoods.length > 0) {
          const nearest = findNearestNeighborhood(center.lat, center.lng, neighborhoods);
          if (nearest && nearest.lat !== undefined && nearest.lng !== undefined) {
            setSelectedNeighborhood(nearest);
            setMapCenter((cur) => ({ ...cur, lat: nearest.lat!, lng: nearest.lng! }));
          }
        }
      })
      .catch(() => {
        if (neighborhoods.length > 0) {
          const nearest = findNearestNeighborhood(center.lat, center.lng, neighborhoods);
          if (nearest && nearest.lat !== undefined && nearest.lng !== undefined) {
            setSelectedNeighborhood(nearest);
            setMapCenter((cur) => ({ ...cur, lat: nearest.lat!, lng: nearest.lng! }));
          }
        }
      });
  };

  const isNeighborhoodResolving =
    Boolean(
      agencyProfileQuery.data?.neighborhood_id ||
      resolveProfileNeighborhoodIds(agencyProfileQuery.data ?? {}).length,
    ) && neighborhoodListQuery.isLoading;

  return (
    <PageFrame
      className="bg-surface-container-low text-on-surface relative mx-auto flex min-h-0 max-w-[500px] flex-col overflow-hidden [direction:rtl]"
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

      <main className="min-h-0 flex-1 space-y-2 overflow-x-hidden overflow-y-auto pb-28">
        {agencyProfileQuery.isLoading ? (
          <div className="bg-surface-container-lowest text-outline px-4 py-3 text-center text-sm font-medium">
            در حال دریافت اطلاعات آژانس...
          </div>
        ) : null}
        <OwnerInfoSection
          agencyName={agencyName}
          agencyNameError={agencyNameError}
          isNeighborhoodLoading={isNeighborhoodResolving}
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
        <LocationSection mapCenter={mapCenter} onMapCenterChange={handleMapCenterChange} />
      </main>

      <AgencyFooterActions isSaving={updateAgencyProfileMutation.isPending} onSave={handleSave} />

      <NeighborhoodSelectionSheet
        mode="single"
        onChange={handleNeighborhoodChange}
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
  isNeighborhoodLoading,
  logoPreviewUrl,
  logoUrl,
  neighborhood,
  onAgencyNameChange,
  onLogoChange,
  onOpenNeighborhoodPicker,
}: {
  agencyName: string;
  agencyNameError?: string | null;
  isNeighborhoodLoading?: boolean;
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
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-error m-0 -mt-1 text-right text-xs leading-5 font-normal"
          >
            {agencyNameError}
          </Typography>
        ) : null}
        <SelectField
          isLoading={isNeighborhoodLoading}
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
    <div className="text-outline flex gap-1 text-right text-xs font-normal">
      <div className="flex">
        <LinearInfoCircle className="text-on-surface-var h-4.5 w-4.5" />
      </div>
      <div>
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="m-0 flex items-center gap-1.5"
        >
          حجم عکس کمتر از 1MB باشد
        </Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">
          بهترین ابعاد نمایش 100×100 پیکسل
        </Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">
          فرمت‌های قابل استفاده jpg, jpeg, png, webp
        </Typography>
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
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="medium"
        className="m-0 mb-3 text-sm leading-5 font-semibold"
      >
        لوگوی آژانس
      </Typography>
      <Button
        unstyled
        aria-label="بارگذاری لوگوی آژانس"
        className="text-on-surface-var relative mx-auto mr-3 grid h-22 w-22 place-items-center overflow-visible rounded-full"
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="bg-surface-container grid h-full w-full place-items-center overflow-hidden rounded-full"
        >
          {imageUrl ? (
            <img alt="لوگوی آژانس" className="h-full w-full object-cover" src={imageUrl} />
          ) : (
            <LinearBuilding3 className="h-8 w-8" />
          )}
        </Typography>

        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="border-surface-container-lowest bg-primary text-on-primary absolute -bottom-0.5 -left-0.5 z-10 grid h-8 w-8 place-items-center rounded-full border-4"
        >
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
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="medium"
          className="text-on-surface mt-4 text-right leading-5 font-medium"
        >
          شماره تماس
        </Typography>
        <Field onChange={onPhone1Change} placeholder="شماره تماس اول" value={phone1} />
        <Field onChange={onPhone2Change} placeholder="شماره تماس دوم" value={phone2} />
        <Field onChange={onPhone3Change} placeholder="شماره همراه" value={phone3} />
      </div>

      <Separator />

      <div className="grid gap-3">
        <Typography
          as="h3"
          variant="title"
          size="medium"
          weight="semibold"
          className="m-0 text-right text-base leading-6 font-semibold"
        >
          شبکه‌های اجتماعی
        </Typography>
        <Field
          icon={<TonalTelegram className="h-6 w-6" />}
          onChange={onTelegramChange}
          placeholder="آیدی تلگرام بدون @"
          value={telegram}
        />
        <Field
          icon={<TonalWhatsapp className="h-6 w-6" />}
          onChange={onWhatsappChange}
          placeholder="شماره واتساپ بدون صفر"
          value={whatsapp}
        />
        <Field
          icon={<TonalInstagram className="h-6 w-6" />}
          onChange={onInstagramChange}
          placeholder="آیدی اینستاگرام بدون @"
          value={instagram}
        />
      </div>

      <Separator />

      <div className="grid gap-3">
        <Typography
          as="h3"
          variant="title"
          size="medium"
          weight="semibold"
          className="m-0 text-right text-base leading-6 font-semibold"
        >
          نشانی
        </Typography>
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
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="m-0 text-right text-base leading-6 font-semibold"
        >
          محدوده فعالیت
        </Typography>
        <Button
          unstyled
          className="text-primary inline-flex h-8 shrink-0 items-center gap-1.5 text-sm leading-5 font-semibold"
          onClick={onOpenPicker}
          type="button"
        >
          {activityAreas.length ? `${activityAreas.length} انتخاب` : "انتخاب"}
          <LinearArrowLeft1 className="text-on-surface-var h-5 w-5" />
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
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="text-outline m-0 mt-3 text-right text-sm leading-6 font-normal"
        >
          برای نمایش محدوده فعالیت آژانس، محله‌ها را انتخاب کنید.
        </Typography>
      )}
      {error ? (
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-error m-0 mt-2 text-right text-xs leading-5 font-normal"
        >
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
      <Button
        unstyled
        className="bg-surface-container-high text-on-surface mt-3 mr-auto inline-flex cursor-not-allowed items-center gap-2 rounded-lg px-4 py-1.5 text-xs! leading-5 font-medium! opacity-50"
        type="button"
        disabled
      >
        <LinearAiContent className="text-on-surface-var h-4 w-4" />
        تولید با هوش مصنوعی
      </Button>
      <textarea
        className="border-outline-var bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary focus:ring-primary/10 mt-3 h-24 w-full resize-none rounded-xl border px-3 py-3 text-right text-sm leading-5 font-normal outline-none focus:ring-2"
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
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="medium"
        className="text-on-surface mt-4 text-right text-sm font-medium"
      >
        برای تعیین موقعیت بر روی نقشه لمس کنید:
      </Typography>
      <div className="bg-surface-container-low relative mt-3 h-[220px] w-full overflow-hidden rounded-xl">
        <MapContainer
          attributionControl={false}
          center={[mapCenter.lat, mapCenter.lng]}
          className="bg-surface-container-low z-0 h-full w-full"
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
            className={searchMapTileConfig.className}
            maxZoom={searchMapTileConfig.maxZoom}
            tms={searchMapTileConfig.isTms}
            url={searchMapTileConfig.urlTemplate}
          />
          <AgencyProfileMapController center={mapCenter} onCenterChange={onMapCenterChange} />
        </MapContainer>

        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="pointer-events-none absolute top-1/2 left-1/2 z-[450] -translate-x-1/2 -translate-y-full"
        >
          <MapPickerPinIcon />
        </Typography>

        <div className="pointer-events-none absolute inset-x-3 bottom-3 z-[450] flex justify-end">
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="bg-surface-container-lowest/95 text-on-surface-var rounded-lg px-2.5 py-1 text-xs leading-5 font-medium shadow-sm"
          >
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

function Section({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <section className="bg-surface-container-lowest px-4 py-4">
      {title ? (
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-on-surface m-0 text-right text-base font-semibold"
        >
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
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={`border-outline-var bg-surface-container-lowest focus-within:border-primary focus-within:ring-primary/10 relative flex w-full items-center rounded-xl border px-3 py-4.5 focus-within:ring-2 ${className}`}
      >
        {multiline ? (
          <textarea
            className="text-on-surface placeholder:text-outline h-full min-w-0 flex-1 resize-none border-0 bg-transparent py-0 text-right text-sm leading-5 font-normal outline-none placeholder:text-sm"
            onChange={(event) => onChange?.(event.target.value)}
            placeholder={placeholder}
            value={value}
          />
        ) : (
          <input
            className="text-on-surface placeholder:text-outline h-full min-w-0 flex-1 border-0 bg-transparent py-0 text-right text-sm leading-5 font-normal outline-none placeholder:text-sm"
            onChange={(event) => onChange?.(event.target.value)}
            placeholder={placeholder}
            type="text"
            value={value}
          />
        )}
        {icon ? (
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="absolute top-1/2 left-3 -translate-y-1/2"
          >
            {icon}
          </Typography>
        ) : null}
      </Typography>
    </label>
  );
}

function SelectField({
  isLoading,
  onClick,
  placeholder,
  value,
}: {
  isLoading?: boolean;
  onClick: () => void;
  placeholder: string;
  value?: string;
}) {
  if (isLoading) {
    return (
      <div className="border-outline-var bg-surface-container-lowest relative flex w-full items-center rounded-xl border px-3 py-4.5">
        <div className="bg-surface-container-high h-4 w-32 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <Button
      unstyled
      className={`bg-surface-container-lowest focus-visible:outline-primary/25 relative flex w-full items-center rounded-xl border px-3 py-4.5 text-right focus-visible:outline-3 focus-visible:outline-offset-[-3px] ${
        value ? "border-primary" : "border-outline-var"
      }`}
      onClick={onClick}
      type="button"
    >
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={`min-w-0 flex-1 truncate text-right text-sm leading-5 font-normal ${
          value ? "text-on-surface" : "text-outline"
        }`}
      >
        {value ?? placeholder}
      </Typography>
      <LinearArrowDown1 className="text-on-surface-var h-5 w-5" />
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
      <div className="shrink-0 px-3 pt-3 pb-2">
        <div className="flex h-11 items-center gap-2 [direction:ltr]">
          <SearchInputBar
            containerClassName="flex-1 border-outline"
            debounceMs={300}
            onClear={() => setQuery("")}
            onDebouncedChange={setQuery}
            onValueChange={setQuery}
            placeholder="جستجوی محله"
            size="dense"
            value={query}
          />

          <Button
            unstyled
            aria-label="بازگشت"
            className="text-on-surface-var grid h-10 w-10 shrink-0 place-items-center"
            onClick={onClose}
            type="button"
          >
            <LinearArrowLeft2 className="h-6 w-6 rotate-180" />
          </Button>
        </div>

        <div className="mt-3 flex items-center justify-between px-1">
          <Typography
            as="h2"
            variant="title"
            size="medium"
            weight="semibold"
            className="text-on-surface m-0 text-base leading-6 font-semibold"
          >
            {title}
          </Typography>
          {selectedItems.length > 0 ? (
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-primary text-sm leading-5 font-medium"
            >
              {mode === "single" ? selectedItems[0]?.name : `${selectedItems.length} انتخاب`}
            </Typography>
          ) : null}
        </div>

        {selectedItems.length > 0 ? (
          <div className="-mx-3 mt-2 flex [scrollbar-width:none] gap-2 overflow-x-auto px-3 pb-1 [direction:rtl] [&::-webkit-scrollbar]:hidden">
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

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-2 pb-3" dir="rtl">
        {!cityId ? (
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="text-outline m-0 mx-auto w-full px-2 py-3 text-center text-sm leading-6 font-normal"
          >
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
                <Button
                  unstyled
                  aria-pressed={isSelected}
                  className={`bg-surface-container-lowest active:bg-primary/5 flex min-h-[64px] w-full items-center justify-between gap-4 rounded-[10px] py-2 pr-0 pl-3 text-right transition-colors [direction:ltr] ${
                    isSelected ? "text-primary" : "text-on-surface"
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
                  <Typography
                    as="span"
                    variant="body"
                    size="medium"
                    weight="regular"
                    className="min-w-0 flex-1 [direction:rtl]"
                  >
                    <Typography
                      as="span"
                      variant="label"
                      size="medium"
                      weight="medium"
                      className="block truncate text-sm leading-5 font-medium"
                    >
                      {neighborhood.name}
                    </Typography>
                    <Typography
                      as="span"
                      variant="body"
                      size="small"
                      weight="regular"
                      className="text-outline mt-1 line-clamp-2 block text-xs leading-5 font-normal"
                    >
                      {getNeighborhoodHierarchyDescription(neighborhood) ||
                        selectedCity?.name ||
                        "شهر انتخاب‌شده"}
                    </Typography>
                  </Typography>
                </Button>
              );
            })}
          </div>
        ) : query.trim() ? (
          <SearchEmptyState compact />
        ) : (
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="text-outline m-0 mx-auto w-full px-2 py-3 text-center text-sm leading-6 font-normal"
          >
            محله‌ای برای این شهر ثبت نشده است.
          </Typography>
        )}
      </div>

      {mode === "multiple" ? (
        <footer className="border-outline-var bg-surface-container-lowest shrink-0 border-t px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
          <Button
            unstyled
            className="bg-primary text-on-primary flex h-10 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium"
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
      <div className="bg-surface-container-high h-12 rounded-[10px]" />
      <div className="bg-surface-container-high h-12 rounded-[10px]" />
      <div className="bg-surface-container-high h-12 rounded-[10px]" />
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
      <ellipse
        cx="15"
        cy="40.5"
        fill="currentColor"
        className="text-on-surface"
        fillOpacity="0.12"
        rx="6"
        ry="1.5"
      />
      <path
        d="M20.7379 30.0613C26.7208 27.9158 31 22.199 31 15.4839C31 6.93237 24.0604 0 15.5 0C6.93959 0 0 6.93237 0 15.4839C0 22.1987 4.27872 27.9152 10.2612 30.061C12.3965 30.9288 14.2083 32.6522 14.2083 34.8387V38.7097C14.2083 39.4223 14.7866 40 15.5 40C16.2133 40 16.7916 39.4223 16.7916 38.7097V34.8387C16.7916 32.6525 18.6029 30.9292 20.7379 30.0613Z"
        className="fill-tertiary"
      />
      <path
        d="M15.5 21C17.16 21 18.575 20.415 19.745 19.245C20.915 18.075 21.5 16.66 21.5 15C21.5 13.34 20.915 11.925 19.745 10.755C18.575 9.585 17.16 9 15.5 9C13.84 9 12.425 9.585 11.255 10.755C10.085 11.925 9.5 13.34 9.5 15C9.5 16.66 10.085 18.075 11.255 19.245C12.425 20.415 13.84 21 15.5 21Z"
        className="fill-on-tertiary"
      />
    </svg>
  );
}

function Separator() {
  return <div className="bg-outline-var my-4 h-px" />;
}

function AgencyFooterActions({ isSaving, onSave }: { isSaving: boolean; onSave: () => void }) {
  return (
    <footer className="border-outline-var bg-surface-container-lowest absolute inset-x-0 bottom-0 z-[600] border-t px-4 pt-3 pb-[max(8px,env(safe-area-inset-bottom))]">
      <div className="grid h-10 grid-cols-2 gap-3 [direction:ltr]">
        <Button
          unstyled
          className="bg-primary text-on-primary rounded-lg text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSaving}
          onClick={onSave}
          type="button"
        >
          {isSaving ? "در حال ذخیره..." : "ذخیره اطلاعات"}
        </Button>
        <Link
          className="border-primary bg-surface-container-lowest text-primary inline-flex items-center justify-center gap-2 rounded-lg border text-xs leading-5 font-semibold no-underline"
          to="/account/dashboard/agency/preview"
        >
          پیش نمایش
          <LinearPreview className="h-5 w-5" />
        </Link>
      </div>
    </footer>
  );
}
