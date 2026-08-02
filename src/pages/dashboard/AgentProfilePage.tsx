import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

import { PageFrame } from "../../app/layout/PageFrame";
import { getApiAssetUrl, getApiErrorMessage } from "../../core/api/api";
import LinearArrowLeft1 from "../../shared/icons/LinearArrowLeft1";
import LinearArrowLeft2 from "../../shared/icons/LinearArrowLeft2";
import LinearEdit2 from "../../shared/icons/LinearEdit2";
import LinearInfoCircle from "../../shared/icons/LinearInfoCircle";
import LinearSearch from "../../shared/icons/LinearSearch";
import LinearUserSolid from "../../shared/icons/LinearUserSolid";
import LinearX from "../../shared/icons/LinearX";
import TonalInstagram from "../../shared/icons/TonalInstagram";
import TonalTelegram from "../../shared/icons/TonalTelegram";
import TonalWhatsapp from "../../shared/icons/TonalWhatsapp";
import { BottomSheet } from "../../shared/components/BottomSheet";
import { FormChoiceChip } from "../../shared/form/FormControls";
import { SelectionCheckIndicator } from "../../shared/components/SelectionCheckIndicator";
import { Snackbar, type SnackbarVariant } from "../../shared/components/Snackbar";
import { TopBar } from "../../shared/components/TopBar";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import {
  useMyProfileQuery,
  useUpdateMyProfileMutation,
} from "../../core/hooks/account.hooks";
import { useNeighborhoodListQuery } from "../../core/hooks/neighborhood.hooks";
import { useDebouncedValue } from "../../core/hooks/useDebouncedValue";
import { readStoredSelectedCity } from "../../shared/lib/selectedCityStorage";
import type { UserProfile } from "../../core/services/account.service";
import type { NeighborhoodDto } from "../../core/services/neighborhood.service";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

const profileImageMaxBytes = 1024 * 1024;
const profileImageMimeTypes = new Set(["image/jpeg", "image/png", "image/gif"]);
const neighborhoodSearchDebounceMs = 250;

type SelectedNeighborhood = {
  id: string;
  name: string;
};

type AgentProfileToast = {
  message: string;
  title: string;
  variant: SnackbarVariant;
};

function isDesktopDashboard() {
  return false;
}

function normalizeOptionalText(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : null;
}

function splitProfileName(value: string) {
  const [name, ...familyParts] = value.trim().split(/\s+/);

  return {
    family: familyParts.length ? familyParts.join(" ") : null,
    name: name || null,
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

function getProfileNeighborhoodIds(profile?: UserProfile) {
  if (!profile) return [];

  const rawValues = Array.isArray(profile.neighborhood_ids)
    ? profile.neighborhood_ids
    : profile.neighborhood_ids
      ? [profile.neighborhood_ids]
      : profile.neighborhood_id
        ? [profile.neighborhood_id]
        : [];

  return Array.from(
    new Set(
      rawValues
        .flatMap((value) => String(value).split(","))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

function readNestedText(value: unknown, key: string) {
  if (!value || typeof value !== "object") return "";

  const candidate = (value as Record<string, unknown>)[key];
  return typeof candidate === "string" ? candidate : "";
}

function readSocialValue(
  profile: UserProfile | undefined,
  key: "instagram" | "telegram" | "whatsapp",
) {
  if (!profile) return "";

  const directValue = profile[key];
  if (typeof directValue === "string" && directValue.trim()) return directValue;

  for (const source of [profile.social, profile.contact_social, profile.contacts]) {
    const value = readNestedText(source, key);
    if (value.trim()) return value;
  }

  return "";
}

export function AgentProfilePage() {
  const desktop = isDesktopDashboard();
  const selectedCity = readStoredSelectedCity();
  const profileQuery = useMyProfileQuery();
  const updateProfileMutation = useUpdateMyProfileMutation();
  const cityId = selectedCity?.id ?? profileQuery.data?.city_id ?? "";
  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: Boolean(cityId),
    page: 1,
    perPage: 200,
    q: "",
  });
  const neighborhoods = useMemo(
    () => neighborhoodsQuery.data ?? [],
    [neighborhoodsQuery.data],
  );
  const neighborhoodNameById = useMemo(
    () => new Map(neighborhoods.map((item) => [getNeighborhoodId(item), item.name])),
    [neighborhoods],
  );
  const initializedProfileIdRef = useRef<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [selectedActivityAreas, setSelectedActivityAreas] = useState<SelectedNeighborhood[]>([]);
  const [isNeighborhoodPickerOpen, setIsNeighborhoodPickerOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [toast, setToast] = useState<AgentProfileToast | null>(null);

  const trimmedName = name.trim();
  const nameError = hasSubmitted && !trimmedName ? "نام مشاور الزامی است." : null;
  const activityAreasError =
    hasSubmitted && selectedActivityAreas.length === 0
      ? "انتخاب محدوده فعالیت الزامی است."
      : null;

  useEffect(() => {
    if (!avatarPreviewUrl) return undefined;
    return () => URL.revokeObjectURL(avatarPreviewUrl);
  }, [avatarPreviewUrl]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!profileQuery.isError) return;

    setToast({
      message: getApiErrorMessage(
        profileQuery.error,
        "دریافت اطلاعات مشاور با خطا مواجه شد.",
      ),
      title: "خطا",
      variant: "error",
    });
  }, [profileQuery.error, profileQuery.isError]);

  useEffect(() => {
    const profile = profileQuery.data;
    if (!profile) return;

    const profileId = String(profile.id ?? profile._id ?? profile.mobile ?? "current-user");
    if (initializedProfileIdRef.current === profileId) return;
    initializedProfileIdRef.current = profileId;

    setName([profile.name, profile.family].filter(Boolean).join(" ").trim());
    setPhone(profile.phone ?? profile.mobile ?? "");
    setTelegram(readSocialValue(profile, "telegram"));
    setWhatsapp(readSocialValue(profile, "whatsapp"));
    setInstagram(readSocialValue(profile, "instagram"));
    setAvatarFile(null);
    setAvatarPreviewUrl(null);
    setAvatarUrl(profile.avatar ? getApiAssetUrl(profile.avatar) : null);
    setSelectedActivityAreas(
      getProfileNeighborhoodIds(profile).map((id) => ({
        id,
        name: neighborhoodNameById.get(id) ?? id,
      })),
    );
  }, [neighborhoodNameById, profileQuery.data]);

  useEffect(() => {
    if (!neighborhoods.length) return;

    setSelectedActivityAreas((current) =>
      current.map((area) => ({
        ...area,
        name: neighborhoodNameById.get(area.id) ?? area.name,
      })),
    );
  }, [neighborhoodNameById, neighborhoods.length]);

  const showToast = (
    message: string,
    title = "موفقیت",
    variant: SnackbarVariant = "success",
  ) => setToast({ message, title, variant });

  const handleAvatarChange = (file: File | null) => {
    if (!file) return;

    if (!profileImageMimeTypes.has(file.type)) {
      showToast("فرمت تصویر باید jpg، png یا gif باشد.", "خطا", "error");
      return;
    }

    if (file.size > profileImageMaxBytes) {
      showToast("حجم تصویر نباید بیشتر از 1MB باشد.", "خطا", "error");
      return;
    }

    setAvatarFile(file);
    setAvatarPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
  };

  const handleSave = async () => {
    setHasSubmitted(true);

    if (!trimmedName) {
      showToast("نام مشاور الزامی است.", "خطا", "error");
      return;
    }

    if (selectedActivityAreas.length === 0) {
      showToast("انتخاب محدوده فعالیت الزامی است.", "خطا", "error");
      return;
    }

    try {
      const profileName = splitProfileName(trimmedName);

      await updateProfileMutation.mutateAsync({
        avatar: avatarFile,
        ...profileName,
        instagram: normalizeOptionalText(instagram),
        neighborhood_ids: selectedActivityAreas.map((area) => area.id),
        phone: normalizeOptionalText(phone),
        telegram: normalizeOptionalText(telegram),
        whatsapp: normalizeOptionalText(whatsapp),
      });
      showToast("اطلاعات مشاور ذخیره شد.");
    } catch (error) {
      showToast(
        getApiErrorMessage(error, "ذخیره اطلاعات مشاور با خطا مواجه شد."),
        "خطا",
        "error",
      );
    }
  };

  const formContent = (
    <AgentProfileForm
      activityAreas={selectedActivityAreas}
      activityAreasError={activityAreasError}
      avatarPreviewUrl={avatarPreviewUrl}
      avatarUrl={avatarUrl}
      desktop={desktop}
      instagram={instagram}
      isLoading={profileQuery.isLoading}
      isSaving={updateProfileMutation.isPending}
      name={name}
      nameError={nameError}
      onActivityAreaRemove={(id) =>
        setSelectedActivityAreas((current) => current.filter((area) => area.id !== id))
      }
      onAvatarChange={handleAvatarChange}
      onInstagramChange={setInstagram}
      onNameChange={setName}
      onOpenActivityAreaPicker={() => setIsNeighborhoodPickerOpen(true)}
      onPhoneChange={setPhone}
      onSave={handleSave}
      onTelegramChange={setTelegram}
      onWhatsappChange={setWhatsapp}
      phone={phone}
      telegram={telegram}
      whatsapp={whatsapp}
    />
  );

  return (
    <>
      {desktop ? (
        <div className="min-h-full rounded-xl bg-white px-6 pb-12 pt-6 text-[#1a1a1a] [direction:rtl]">
          {formContent}
        </div>
      ) : (
        <PageFrame
          className="relative mx-auto flex min-h-0 max-w-[500px] flex-col overflow-hidden bg-[#f5f5f5] text-[#1a1a1a] [direction:rtl]"
          variant="flush"
        >
          <TopBar
            backTo="/account"
            centerClassName="px-0"
            reserveStartSpace
            title="مشخصات مشاور"
            titleClassName="text-center text-sm font-semibold leading-5"
          />
          {formContent}
        </PageFrame>
      )}

      {toast ? (
        <Snackbar
          className={desktop ? "top-6" : "top-[72px]"}
          message={toast.message}
          onDismiss={() => setToast(null)}
          title={toast.title}
          variant={toast.variant}
        />
      ) : null}

      <NeighborhoodSelectionSheet
        cityId={cityId}
        cityName={selectedCity?.name ?? ""}
        isOpen={isNeighborhoodPickerOpen}
        onChange={setSelectedActivityAreas}
        onClose={() => setIsNeighborhoodPickerOpen(false)}
        selectedNeighborhoods={selectedActivityAreas}
      />
    </>
  );
}

function AgentProfileForm({
  activityAreas,
  activityAreasError,
  avatarPreviewUrl,
  avatarUrl,
  desktop,
  instagram,
  isLoading,
  isSaving,
  name,
  nameError,
  onActivityAreaRemove,
  onAvatarChange,
  onInstagramChange,
  onNameChange,
  onOpenActivityAreaPicker,
  onPhoneChange,
  onSave,
  onTelegramChange,
  onWhatsappChange,
  phone,
  telegram,
  whatsapp,
}: {
  activityAreas: SelectedNeighborhood[];
  activityAreasError: string | null;
  avatarPreviewUrl: string | null;
  avatarUrl: string | null;
  desktop: boolean;
  instagram: string;
  isLoading: boolean;
  isSaving: boolean;
  name: string;
  nameError: string | null;
  onActivityAreaRemove: (id: string) => void;
  onAvatarChange: (file: File | null) => void;
  onInstagramChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onOpenActivityAreaPicker: () => void;
  onPhoneChange: (value: string) => void;
  onSave: () => void;
  onTelegramChange: (value: string) => void;
  onWhatsappChange: (value: string) => void;
  phone: string;
  telegram: string;
  whatsapp: string;
}) {
  if (desktop) {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void onSave();
        }}
      >
        <DesktopSectionTitle icon={<LinearInfoCircle className="h-5 w-5" />} title="مشخصات" />
        {isLoading ? (
          <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 mt-5 text-right text-sm font-medium text-[#808080]">
            در حال دریافت اطلاعات مشاور...
          </Typography>
        ) : null}

        <div className="mt-7 flex flex-wrap items-end gap-8">
          <ProfileImageUploader
            avatarPreviewUrl={avatarPreviewUrl}
            avatarUrl={avatarUrl}
            desktop
            onChange={onAvatarChange}
          />
          <div className="min-w-[280px] max-w-[520px] flex-1">
            <DesktopField label="نام مشاور" onChange={onNameChange} placeholder="نام مشاور" value={name} />
            {nameError ? <FieldError message={nameError} /> : null}
          </div>
        </div>

        <section className="mt-14">
          <DesktopSectionTitle title="اطلاعات تماس" />
          <div className="mt-7 grid grid-cols-1 gap-7 lg:grid-cols-2">
            <DesktopField label="شماره تماس" onChange={onPhoneChange} placeholder="شماره تماس" value={phone} />
          </div>

          <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0 mt-7 text-right text-base font-semibold leading-6 text-[#1a1a1a]">
            شبکه‌های اجتماعی
          </Typography>
          <div className="mt-4 grid grid-cols-1 gap-7 lg:grid-cols-3">
            <DesktopField icon={<TonalTelegram className="h-6 w-6" />} onChange={onTelegramChange} placeholder="آیدی تلگرام بدون @" value={telegram} />
            <DesktopField icon={<TonalWhatsapp className="h-6 w-6" />} onChange={onWhatsappChange} placeholder="شماره واتساپ بدون صفر" value={whatsapp} />
            <DesktopField icon={<TonalInstagram className="h-6 w-6" />} onChange={onInstagramChange} placeholder="آیدی اینستاگرام بدون @" value={instagram} />
          </div>
        </section>

        <section className="mt-14">
          <ActivityAreaSection
            activityAreas={activityAreas}
            error={activityAreasError}
            onOpenPicker={onOpenActivityAreaPicker}
            onRemoveActivityArea={onActivityAreaRemove}
          />
        </section>

        <div className="mt-14 flex justify-start">
          <Button unstyled
            className="h-14 rounded-xl bg-[#0048c4] px-7 text-base font-semibold leading-6 text-white disabled:opacity-60"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? "در حال ذخیره..." : "ذخیره اطلاعات"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <>
      <main className="min-h-0 flex-1 space-y-2 overflow-y-auto overflow-x-hidden pb-24">
        {isLoading ? (
          <div className="bg-white px-4 py-3 text-center text-sm font-medium text-[#808080]">
            در حال دریافت اطلاعات مشاور...
          </div>
        ) : null}

        <Section title="اطلاعات مشاور">
          <div className="flex items-end justify-between gap-4">
            <ProfileImageUploader
              avatarPreviewUrl={avatarPreviewUrl}
              avatarUrl={avatarUrl}
              onChange={onAvatarChange}
            />
            <ProfileImageHelpText />
          </div>
          <div className="mt-4">
            <Field onChange={onNameChange} placeholder="نام مشاور" value={name} />
            {nameError ? <FieldError message={nameError} /> : null}
          </div>
        </Section>

        <Section title="اطلاعات تماس">
          <div className="mt-4 grid gap-3">
            <Field onChange={onPhoneChange} placeholder="شماره تماس" value={phone} />
          </div>
          <Separator />
          <div className="grid gap-3">
            <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0 text-right text-base font-semibold leading-6">شبکه‌های اجتماعی</Typography>
            <Field icon={<TonalTelegram className="h-6 w-6" />} onChange={onTelegramChange} placeholder="آیدی تلگرام بدون @" value={telegram} />
            <Field icon={<TonalWhatsapp className="h-6 w-6" />} onChange={onWhatsappChange} placeholder="شماره واتساپ بدون صفر" value={whatsapp} />
            <Field icon={<TonalInstagram className="h-6 w-6" />} onChange={onInstagramChange} placeholder="آیدی اینستاگرام بدون @" value={instagram} />
          </div>
        </Section>

        <ActivityAreaSection
          activityAreas={activityAreas}
          error={activityAreasError}
          onOpenPicker={onOpenActivityAreaPicker}
          onRemoveActivityArea={onActivityAreaRemove}
        />
      </main>

      <footer className="absolute inset-x-0 bottom-0 z-10 bg-white px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
        <Button unstyled
          className="h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium text-white disabled:opacity-60"
          disabled={isSaving}
          onClick={() => void onSave()}
          type="button"
        >
          {isSaving ? "در حال ذخیره..." : "ذخیره اطلاعات"}
        </Button>
      </footer>
    </>
  );
}

function ProfileImageUploader({
  avatarPreviewUrl,
  avatarUrl,
  desktop = false,
  onChange,
}: {
  avatarPreviewUrl: string | null;
  avatarUrl: string | null;
  desktop?: boolean;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const imageUrl = avatarPreviewUrl ?? avatarUrl;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.files?.[0] ?? null);
    event.target.value = "";
  };

  return (
    <div className={desktop ? "w-[122px] shrink-0 text-right" : "mt-4 shrink-0 text-right font-medium"}>
      <Typography as="p" variant="body" size="large" weight="medium" className={desktop ? "m-0 mb-4 text-base font-semibold leading-6" : "m-0 mb-3 text-sm font-semibold leading-5"}>
        تصویر مشاور
      </Typography>
      <Button unstyled
        aria-label="بارگذاری تصویر مشاور"
        className={`relative grid place-items-center overflow-visible rounded-full text-[#4d4d4d] ${desktop ? "h-[96px] w-[96px] border border-[#cccccc]" : "mx-auto mr-3 h-22 w-22"}`}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-full w-full place-items-center overflow-hidden rounded-full bg-[#f0f0f0]">
          {imageUrl ? (
            <img alt="تصویر مشاور" className="h-full w-full object-cover" src={imageUrl} />
          ) : (
            <LinearUserSolid className="h-8 w-8" />
          )}
        </Typography>
        <Typography as="span" variant="body" size="medium" weight="regular" className="absolute -bottom-0.5 -left-0.5 z-10 grid h-8 w-8 place-items-center rounded-full border-4 border-white bg-[#0048c4] text-white">
          <LinearEdit2 className="h-4 w-4" />
        </Typography>
      </Button>
      <input
        ref={inputRef}
        accept="image/png,image/jpeg,image/jpg,image/gif"
        className="hidden"
        onChange={handleInputChange}
        type="file"
      />
    </div>
  );
}

function ProfileImageHelpText() {
  return (
    <div className="flex gap-1 text-right text-xs font-normal text-[#808080]">
      <LinearInfoCircle className="h-4.5 w-4.5 shrink-0 text-[#4d4d4d]" />
      <div>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">حجم عکس کمتر از 1MB باشد</Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">بهترین ابعاد نمایش 100×100 پیکسل</Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">فرمت‌های قابل استفاده jpg, png, gif</Typography>
      </div>
    </div>
  );
}

function ActivityAreaSection({
  activityAreas,
  error,
  onOpenPicker,
  onRemoveActivityArea,
}: {
  activityAreas: SelectedNeighborhood[];
  error: string | null;
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
          <LinearArrowLeft1 className="h-5 w-5 text-[#4d4d4d]" />
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
          محله‌های محدوده فعالیت مشاور را انتخاب کنید.
        </Typography>
      )}
      {error ? <FieldError message={error} /> : null}
    </Section>
  );
}

function NeighborhoodSelectionSheet({
  cityId,
  cityName,
  isOpen,
  onChange,
  onClose,
  selectedNeighborhoods,
}: {
  cityId: string;
  cityName: string;
  isOpen: boolean;
  onChange: (neighborhoods: SelectedNeighborhood[]) => void;
  onClose: () => void;
  selectedNeighborhoods: SelectedNeighborhood[];
}) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), neighborhoodSearchDebounceMs);
  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: isOpen && Boolean(cityId),
    page: 1,
    perPage: 100,
    q: debouncedQuery,
  });
  const neighborhoods = neighborhoodsQuery.data ?? [];
  const selectedIds = useMemo(
    () => new Set(selectedNeighborhoods.map((item) => item.id)),
    [selectedNeighborhoods],
  );

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  const toggleNeighborhood = (neighborhood: NeighborhoodDto) => {
    const selectedNeighborhood = toSelectedNeighborhood(neighborhood);
    const isSelected = selectedIds.has(selectedNeighborhood.id);

    onChange(
      isSelected
        ? selectedNeighborhoods.filter((item) => item.id !== selectedNeighborhood.id)
        : [...selectedNeighborhoods, selectedNeighborhood],
    );
  };

  return (
    <BottomSheet
      ariaLabel="محدوده فعالیت"
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
          <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6 text-[#1a1a1a]">محدوده فعالیت</Typography>
          {selectedNeighborhoods.length > 0 ? (
            <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium leading-5 text-[#0048c4]">
              {selectedNeighborhoods.length} انتخاب
            </Typography>
          ) : null}
        </div>

        {selectedNeighborhoods.length > 0 ? (
          <div className="-mx-3 mt-2 flex gap-2 overflow-x-auto px-3 pb-1 [direction:rtl] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {selectedNeighborhoods.map((neighborhood) => (
              <FormChoiceChip
                key={neighborhood.id}
                label={neighborhood.name}
                onClick={() =>
                  onChange(selectedNeighborhoods.filter((item) => item.id !== neighborhood.id))
                }
                removable
                selected
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 pt-2" dir="rtl">
        {!cityId ? (
          <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 px-2 py-3 text-right text-sm font-normal leading-6 text-[#808080]">
            برای انتخاب محله، ابتدا شهر را انتخاب کنید.
          </Typography>
        ) : neighborhoodsQuery.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="h-12 rounded-[10px] bg-[#f0f0f0]" key={index} />
            ))}
          </div>
        ) : neighborhoods.length > 0 ? (
          <div className="space-y-1">
            {neighborhoods.map((neighborhood) => {
              const neighborhoodId = getNeighborhoodId(neighborhood);
              const isSelected = selectedIds.has(neighborhoodId);

              return (
                <Button unstyled
                  aria-pressed={isSelected}
                  className={`flex min-h-[64px] w-full items-center justify-between gap-4 rounded-[10px] bg-white py-2 pl-3 pr-0 text-right transition-colors active:bg-[#0048c40a] [direction:ltr] ${isSelected ? "text-[#0048c4]" : "text-[#1a1a1a]"}`}
                  key={neighborhoodId}
                  onClick={() => toggleNeighborhood(neighborhood)}
                  type="button"
                >
                  <SelectionCheckIndicator checked={isSelected} />
                  <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1 [direction:rtl]">
                    <Typography as="span" variant="label" size="medium" weight="medium" className="block truncate text-sm font-medium leading-5">
                      {neighborhood.name}
                    </Typography>
                    <Typography as="span" variant="body" size="small" weight="regular" className="mt-1 block text-xs font-normal leading-5 text-[#808080]">
                      {cityName || "شهر انتخاب‌شده"}
                    </Typography>
                  </Typography>
                </Button>
              );
            })}
          </div>
        ) : query.trim() ? (
          <SearchEmptyState compact />
        ) : (
          <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 px-2 py-3 text-right text-sm font-normal leading-6 text-[#808080]">
            محله‌ای برای این شهر ثبت نشده است.
          </Typography>
        )}
      </div>

      <footer className="shrink-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-6px_16px_rgba(26,26,26,0.06)]">
        <Button unstyled
          className="flex h-10 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white"
          onClick={onClose}
          type="button"
        >
          تایید
        </Button>
      </footer>
    </BottomSheet>
  );
}

function Section({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <section className="bg-white px-4 py-4">
      {title ? (
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-right text-base font-semibold text-[#1a1a1a]">{title}</Typography>
      ) : null}
      {children}
    </section>
  );
}

function Field({
  icon,
  onChange,
  placeholder,
  value,
}: {
  icon?: ReactNode;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="block text-right">
      <Typography as="span" variant="body" size="medium" weight="regular" className="relative flex w-full items-center rounded-xl border border-[#cccccc] bg-white px-3 py-4.5 focus-within:border-[#0048c4] focus-within:ring-2 focus-within:ring-[#0048c41a]">
        <input
          className={`h-full min-w-0 flex-1 border-0 bg-transparent py-0 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-sm placeholder:text-[#a6a6a6] ${icon ? "pl-9" : ""}`}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type="text"
          value={value}
        />
        {icon ? <Typography as="span" variant="body" size="medium" weight="regular" className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</Typography> : null}
      </Typography>
    </label>
  );
}

function DesktopField({
  icon,
  label,
  onChange,
  placeholder,
  value,
}: {
  icon?: ReactNode;
  label?: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="block min-w-0">
      {label ? (
        <Typography as="span" variant="label" size="large" weight="semibold" className="mb-3 block text-right text-base font-semibold leading-6 text-[#1a1a1a]">
          {label}
        </Typography>
      ) : null}
      <Typography as="span" variant="body" size="medium" weight="regular" className="relative block">
        <input
          className={`h-[60px] w-full rounded-xl border border-[#cccccc] bg-white py-0 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none transition placeholder:text-[#a6a6a6] focus:border-[#0048c4] focus:shadow-[0_0_0_3px_rgba(0,72,196,0.12)] ${icon ? "pl-12 pr-5" : "px-5"}`}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type="text"
          value={value}
        />
        {icon ? <Typography as="span" variant="body" size="medium" weight="regular" className="absolute left-4 top-1/2 -translate-y-1/2">{icon}</Typography> : null}
      </Typography>
    </label>
  );
}

function DesktopSectionTitle({ icon, title }: { icon?: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-[#0048c4]">
      {icon ? <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#4d4d4d]">{icon}</Typography> : null}
      <Typography as="h2" variant="title" size="large" weight="semibold" className="m-0 text-[22px] font-bold leading-8">{title}</Typography>
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-right text-xs font-normal leading-5 text-[#c11004]">
      {message}
    </Typography>
  );
}

function Separator() {
  return <div className="my-4 h-px bg-[#e6e6e6]" />;
}
