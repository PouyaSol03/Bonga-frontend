import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";

import { getApiAssetUrl, getApiErrorMessage } from "../../api/api";
import { getActiveAuthRole, getStoredAuthSession } from "../../auth/auth-storage";
import { REAL_ESTATE_MANAGER } from "../../constants/roles.constants";
import { useMyAgencyProfileQuery, useUpdateMyAgencyProfileMutation } from "../../hooks/account.hooks";
import { useNeighborhoodListQuery } from "../../hooks/neighborhood.hooks";
import { readStoredSelectedCity } from "../../lib/selectedCityStorage";
import type { MyAgencyProfile } from "../../services/account.service";
import type { NeighborhoodDto } from "../../services/neighborhood.service";
import { RouteLink } from "../../routes/RouteLink";
import { searchMapTileConfig } from "../search/searchMapData";
import { Typography } from "../../components/ui/Typography";
import { Button } from "../../components/ui/Button";

type AgencyMapCenter = {
    lat: number;
    lng: number;
    zoom: number;
};

type SelectOption = {
    label: string;
    value: string;
};

const defaultAgencyCenter: AgencyMapCenter = {
    lat: 29.6179,
    lng: 52.5313,
    zoom: 15,
};
const agencyImageMaxBytes = 1024 * 1024;
const agencyImageMimeTypes = new Set(["image/jpeg", "image/png", "image/gif"]);

function normalizeText(value: string | null | undefined) {
    return value ?? "";
}

function normalizeOptionalText(value: string) {
    const trimmedValue = value.trim();
    return trimmedValue || null;
}

function normalizeCoordinate(value: MyAgencyProfile["lat"] | MyAgencyProfile["lng"]) {
    const coordinate = typeof value === "number" ? value : Number(value);
    return Number.isFinite(coordinate) ? coordinate : null;
}

function getNeighborhoodId(neighborhood: NeighborhoodDto) {
    return String(neighborhood.id ?? neighborhood._id ?? neighborhood.name);
}

function getProfileNeighborhoodIds(profile: MyAgencyProfile) {
    return Array.from(
        new Set(
            (profile.neighborhood_ids ?? [])
                .flatMap((value) => String(value).split(","))
                .map((value) => value.trim())
                .filter(Boolean),
        ),
    );
}

export default function DashboardAgencyEditPage() {
    const isRealEstateManager =
        getActiveAuthRole(getStoredAuthSession()) === REAL_ESTATE_MANAGER;
    const selectedCity = readStoredSelectedCity();
    const agencyProfileQuery = useMyAgencyProfileQuery({ enabled: isRealEstateManager });
    const updateAgencyProfileMutation = useUpdateMyAgencyProfileMutation();
    const neighborhoodsQuery = useNeighborhoodListQuery({
        cityId: selectedCity?.id ?? "",
        enabled: isRealEstateManager && Boolean(selectedCity?.id),
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

    const [agencyName, setAgencyName] = useState("");
    const [mainNeighborhoodId, setMainNeighborhoodId] = useState("");
    const [activityAreaIds, setActivityAreaIds] = useState<string[]>([]);
    const [phone1, setPhone1] = useState("");
    const [phone2, setPhone2] = useState("");
    const [phone3, setPhone3] = useState("");
    const [workingHours, setWorkingHours] = useState("");
    const [address, setAddress] = useState("");
    const [aboutUs, setAboutUs] = useState("");
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState(defaultAgencyCenter);
    const [saveMessage, setSaveMessage] = useState("");

    const neighborhoodOptions = useMemo<SelectOption[]>(() => {
        const options = neighborhoods.map((item) => ({
            label: item.name,
            value: getNeighborhoodId(item),
        }));
        const missingIds = Array.from(new Set([mainNeighborhoodId, ...activityAreaIds]))
            .filter(Boolean)
            .filter((id) => !options.some((option) => option.value === id));

        return [
            ...options,
            ...missingIds.map((id) => ({ label: id, value: id })),
        ];
    }, [activityAreaIds, mainNeighborhoodId, neighborhoods]);

    useEffect(() => {
        if (!logoPreview) return undefined;
        return () => URL.revokeObjectURL(logoPreview);
    }, [logoPreview]);

    useEffect(() => {
        const profile = agencyProfileQuery.data;
        if (!profile) return;

        const neighborhoodIds = getProfileNeighborhoodIds(profile);
        const lat = normalizeCoordinate(profile.lat);
        const lng = normalizeCoordinate(profile.lng);

        setAgencyName(normalizeText(profile.name));
        setMainNeighborhoodId(
            profile.neighborhood_id ? String(profile.neighborhood_id) : neighborhoodIds[0] ?? "",
        );
        setActivityAreaIds(neighborhoodIds);
        setPhone1(normalizeText(profile.phone1));
        setPhone2(normalizeText(profile.phone2));
        setPhone3(normalizeText(profile.phone3));
        setWorkingHours(normalizeText(profile.working_hours));
        setAddress(normalizeText(profile.address));
        setAboutUs(normalizeText(profile.about_us));
        setLogoFile(null);
        setLogoPreview(null);
        setLogoUrl(profile.logo ? getApiAssetUrl(profile.logo) : null);

        if (lat !== null && lng !== null) {
            setMapCenter({ lat, lng, zoom: defaultAgencyCenter.zoom });
        }
    }, [agencyProfileQuery.data]);

    const handleLogoChange = (file: File | null) => {
        if (!file) return;

        if (!agencyImageMimeTypes.has(file.type)) {
            window.alert("فرمت لوگو باید JPG، PNG یا GIF باشد.");
            return;
        }

        if (file.size > agencyImageMaxBytes) {
            window.alert("حجم لوگو نباید بیشتر از ۱ مگابایت باشد.");
            return;
        }

        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaveMessage("");

        if (!isRealEstateManager) {
            setSaveMessage("ویرایش مشخصات آژانس فقط برای مدیر آژانس فعال است.");
            return;
        }

        const trimmedName = agencyName.trim();
        const neighborhoodIds = Array.from(
            new Set([
                ...(mainNeighborhoodId ? [mainNeighborhoodId] : []),
                ...activityAreaIds,
            ]),
        );

        if (!trimmedName || neighborhoodIds.length === 0) {
            setSaveMessage("نام آژانس و محدوده فعالیت الزامی است.");
            return;
        }

        try {
            await updateAgencyProfileMutation.mutateAsync({
                about_us: normalizeOptionalText(aboutUs),
                address: normalizeOptionalText(address),
                agency_type: agencyProfileQuery.data?.agency_type ?? 0,
                lat: mapCenter.lat,
                lng: mapCenter.lng,
                logo: logoFile,
                name: trimmedName,
                neighborhood_ids: neighborhoodIds,
                phone1: normalizeOptionalText(phone1),
                phone2: normalizeOptionalText(phone2),
                phone3: normalizeOptionalText(phone3),
                working_hours: normalizeOptionalText(workingHours),
            });
            setSaveMessage("اطلاعات آژانس ذخیره شد.");
        } catch (error) {
            setSaveMessage(getApiErrorMessage(error, "ذخیره اطلاعات آژانس با خطا مواجه شد."));
        }
    };

    const addActivityArea = (id: string) => {
        if (!id) return;
        setActivityAreaIds((current) => current.includes(id) ? current : [...current, id]);
    };

    return (
        <form
            className="min-h-full rounded-xl bg-white px-6 pb-12 pt-6 text-[#1a1a1a]"
            dir="rtl"
            onSubmit={handleSubmit}
        >
            <section>
                <SectionTitle icon={<InfoIcon />} title="مشخصات" />

                <div className="mt-7 flex flex-wrap items-center justify-start gap-8">
                    <AgencyLogoUploader
                        previewUrl={logoPreview ?? logoUrl}
                        onChange={handleLogoChange}
                    />

                    <div className="max-w-[430px] text-right text-xs font-normal leading-6 text-[#a6a6a6]">
                        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 inline-flex items-center gap-2 text-[#808080]">
                            <InfoIcon className="h-5 w-5" />
                            حجم عکس نباید از 1MB بیشتر باشد.
                        </Typography>
                        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">ابعاد نمایش بهتر تصاویر عکس 100x100 پیکسل باشد.</Typography>
                        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">فرمت‌های قابل استفاده png، jpg، gif</Typography>
                    </div>
                </div>

                <div className="mt-7 grid grid-cols-1 gap-7 lg:grid-cols-2">
                    <TextField label="نام آژانس" onChange={setAgencyName} placeholder="نام آژانس" value={agencyName} />
                    <SelectField label="محله" onChange={setMainNeighborhoodId} options={neighborhoodOptions} placeholder="محله" value={mainNeighborhoodId} />
                </div>
            </section>

            <section className="mt-14">
                <SectionTitle icon={<PhoneIcon />} title="اطلاعات تماس" />

                <div className="mt-7 grid grid-cols-1 gap-7 lg:grid-cols-3 items-end">
                    <TextField label="شماره تماس" onChange={setPhone1} placeholder="تلفن مدیریت" value={phone1} />
                    <TextField onChange={setPhone2} placeholder="شماره تماس دوم" value={phone2} />
                    <TextField onChange={setPhone3} placeholder="شماره همراه (مثال: 0915 111 0000)" value={phone3} />
                </div>

                <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0 mt-7 text-right text-base font-semibold leading-6 text-[#1a1a1a]">
                    شبکه‌های اجتماعی
                </Typography>
                <div className="mt-4 grid grid-cols-1 gap-7 lg:grid-cols-3">
                    <TextField icon={<SocialImageIcon name="telegram" />} placeholder="آیدی تلگرام خود را وارد کنید" />
                    <TextField icon={<SocialImageIcon name="whatsApp" />} placeholder="شماره واتساپ خود را بدون صفر وارد کنید" />
                    <TextField icon={<SocialImageIcon name="instagram" />} placeholder="آیدی اینستاگرام خود را وارد کنید" />
                </div>

                <TextField
                    className="mt-7"
                    label="ساعت کاری"
                    onChange={setWorkingHours}
                    placeholder="ساعت کاری آژانس را وارد کنید (مثال: از ۹ صبح تا ۸ شب)"
                    value={workingHours}
                />
                <TextField className="mt-7" label="نشانی" onChange={setAddress} placeholder="نشانی آژانس را وارد کنید" value={address} />
            </section>

            <section className="mt-20">
                <SectionTitle icon={<LocationPinSmallIcon />} title="محدوده فعالیت" />
                <div className="mt-7 grid grid-cols-1 lg:grid-cols-2">
                    <SelectField onChange={addActivityArea} options={neighborhoodOptions} placeholder="انتخاب کنید" value="" />
                </div>
                <div className="mt-7 flex flex-wrap justify-start gap-3">
                    {activityAreaIds.map((id) => (
                        <ActivityChip
                            key={id}
                            label={neighborhoodNameById.get(id) ?? id}
                            onRemove={() => setActivityAreaIds((current) => current.filter((item) => item !== id))}
                        />
                    ))}
                </div>
            </section>

            <section className="mt-20">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <SectionTitle icon={<InfoIcon />} title="درباره ما" />
                    <Button unstyled
                        className="inline-flex h-8 items-center gap-2 rounded-lg border border-[#cccccc] bg-white px-3 text-xs font-semibold leading-4 text-[#1a1a1a] transition hover:border-[#0048c4] hover:text-[#0048c4]"
                        type="button"
                    >
                        <AiTextIcon />
                        تولید متن با هوش مصنوعی
                    </Button>
                </div>

                <textarea
                    className="mt-6 h-[172px] w-full resize-none rounded-xl border border-[#cccccc] bg-white px-5 py-5 text-right text-sm font-normal leading-7 text-[#1a1a1a] outline-none transition placeholder:text-[#a6a6a6] focus:border-[#0048c4] focus:shadow-[0_0_0_3px_rgba(0,72,196,0.12)]"
                    onChange={(event) => setAboutUs(event.target.value)}
                    placeholder="شناسی آژانس را وارد کنید"
                    value={aboutUs}
                />
            </section>

            <section className="mt-16">
                <Typography as="p" variant="body" size="large" weight="medium" className="m-0 mb-4 text-right text-base font-semibold leading-6 text-[#1a1a1a]">
                    موقعیت دقیق خود را بر روی نقشه مشخص کنید.
                </Typography>
                <AgencyLocationMap center={mapCenter} onCenterChange={setMapCenter} />
            </section>

            <Typography as="span" variant="body" size="medium" weight="regular" aria-live="polite" className="sr-only">{saveMessage}</Typography>
            <div className="mt-14 flex justify-start gap-5 [direction:ltr]">
                <Button unstyled
                    className="h-14 rounded-xl bg-[#0048c4] px-7 text-base font-semibold leading-6 text-white transition hover:bg-[#003ba1]"
                    disabled={updateAgencyProfileMutation.isPending}
                    type="submit"
                >
                    ذخیره اطلاعات
                </Button>
                <RouteLink
                    className="inline-flex h-14 items-center gap-3 rounded-xl border border-[#0048c4] bg-white px-7 text-base font-semibold leading-[56px] text-[#0048c4] no-underline transition hover:bg-[#0048c40a]"
                    to="/account/dashboard/agency/preview"
                >
                    <PreviewIcon />
                    پیش نمایش
                </RouteLink>
            </div>
        </form>
    );
}

function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
    return (
        <div className="flex items-center gap-2 text-[#0048c4]">
            <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#4d4d4d]">{icon}</Typography>
            <Typography as="h2" variant="title" size="large" weight="semibold" className="m-0 text-[22px] font-bold leading-8">{title}</Typography>
        </div>
    );
}

function AgencyLogoUploader({
    onChange,
    previewUrl,
}: {
    onChange: (file: File | null) => void;
    previewUrl: string | null;
}) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.files?.[0] ?? null);
        event.target.value = "";
    };

    return (
        <div className="w-[122px] shrink-0 text-right">
            <Typography as="p" variant="body" size="large" weight="medium" className="m-0 mb-4 text-base font-semibold leading-6 text-[#1a1a1a]">لوگوی آژانس</Typography>
            <Button unstyled
                aria-label="بارگذاری لوگوی آژانس"
                className="relative grid h-[96px] w-[96px] place-items-center rounded-full border border-[#cccccc] bg-white"
                onClick={() => inputRef.current?.click()}
                type="button"
            >
                {previewUrl ? (
                    <img
                        alt="لوگوی آژانس"
                        className="h-full w-full rounded-full object-cover"
                        src={previewUrl}
                    />
                ) : (
                    <DefaultAgencyLogo />
                )}
                <Typography as="span" variant="body" size="medium" weight="regular" className="absolute bottom-1 left-0 grid h-9 w-9 place-items-center rounded-full bg-[#0048c4] text-white shadow-[0_4px_14px_rgba(0,72,196,0.24)]">
                    <PencilIcon />
                </Typography>
            </Button>
            <input
                ref={inputRef}
                accept="image/png,image/jpeg,image/jpg,image/gif"
                className="hidden"
                onChange={handleChange}
                type="file"
            />
        </div>
    );
}

function TextField({
    className = "",
    icon,
    label,
    onChange,
    placeholder,
    type = "text",
    value,
}: {
    className?: string;
    icon?: ReactNode;
    label?: string;
    onChange?: (value: string) => void;
    placeholder: string;
    type?: string;
    value?: string;
}) {
    return (
        <label className={`block min-w-0 ${className}`}>
            {label ? (
                <Typography as="span" variant="label" size="large" weight="semibold" className="mb-3 block text-right text-base font-semibold leading-6 text-[#1a1a1a]">
                    {label}
                </Typography>
            ) : null}
            <Typography as="span" variant="body" size="medium" weight="regular" className="relative block">
                <input
                    className={`h-[60px] w-full rounded-xl border border-[#cccccc] bg-white py-0 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none transition placeholder:text-[#a6a6a6] focus:border-[#0048c4] focus:shadow-[0_0_0_3px_rgba(0,72,196,0.12)] ${icon ? "pl-12 pr-5" : "px-5"}`}
                    onChange={(event) => onChange?.(event.target.value)}
                    placeholder={placeholder}
                    type={type}
                    value={value}
                />
                {icon ? (
                    <Typography as="span" variant="body" size="medium" weight="regular" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                        {icon}
                    </Typography>
                ) : null}
            </Typography>
        </label>
    );
}

function SelectField({
    className = "",
    label,
    onChange,
    options,
    placeholder,
    value = "",
}: {
    className?: string;
    label?: string;
    onChange?: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    value?: string;
}) {
    return (
        <label className={`block min-w-0 ${className}`}>
            {label ? (
                <Typography as="span" variant="label" size="large" weight="semibold" className="mb-3 block text-right text-base font-semibold leading-6 text-[#1a1a1a]">
                    {label}
                </Typography>
            ) : null}
            <Typography as="span" variant="body" size="medium" weight="regular" className="relative block">
                <select
                    className="h-[60px] w-full appearance-none rounded-xl border border-[#cccccc] bg-white px-5 pl-12 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none transition focus:border-[#0048c4] focus:shadow-[0_0_0_3px_rgba(0,72,196,0.12)]"
                    onChange={(event) => onChange?.(event.target.value)}
                    value={value}
                >
                    {placeholder ? (
                        <option disabled value="">
                            {placeholder}
                        </option>
                    ) : null}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#808080]" />
            </Typography>
        </label>
    );
}

function ActivityChip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <Typography as="span" variant="label" size="medium" weight="semibold" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#0048c4] bg-[#0048c414] px-4 text-sm font-semibold leading-5 text-[#0048c4]">
            <Button unstyled aria-label={`حذف ${label}`} className="grid h-4 w-4 place-items-center" onClick={onRemove} type="button">
                ×
            </Button>
            {label}
        </Typography>
    );
}

function SocialImageIcon({ name }: { name: "instagram" | "telegram" | "whatsApp" }) {
    return (
        <img
            alt=""
            aria-hidden="true"
            className="h-6 w-6 object-contain"
            src={`/icons/socials/${name}.svg`}
        />
    );
}

function AgencyLocationMap({
    center,
    onCenterChange,
}: {
    center: AgencyMapCenter;
    onCenterChange: (center: AgencyMapCenter) => void;
}) {
    return (
        <div className="relative h-[300px] overflow-hidden rounded-2xl bg-[#e8edf2]">
            <MapContainer
                attributionControl={false}
                center={[center.lat, center.lng]}
                className="z-0 h-full w-full bg-[#e8edf2]"
                maxZoom={searchMapTileConfig.maxZoom}
                minZoom={searchMapTileConfig.minZoom}
                preferCanvas
                zoom={center.zoom}
                zoomControl={false}
            >
                <TileLayer
                    attribution={searchMapTileConfig.attribution}
                    tms={searchMapTileConfig.isTms}
                    url={searchMapTileConfig.urlTemplate}
                />
                <AgencyMapController center={center} onCenterChange={onCenterChange} />
                <AgencyMapControls />
            </MapContainer>

            <div className="pointer-events-none absolute left-1/2 top-1/2 z-[450] -translate-x-1/2 -translate-y-full">
                <MapPickerPinIcon />
            </div>
        </div>
    );
}

function AgencyMapController({
    center,
    onCenterChange,
}: {
    center: AgencyMapCenter;
    onCenterChange: (center: AgencyMapCenter) => void;
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

function AgencyMapControls() {
    const map = useMap();

    return (
        <div className="absolute left-4 top-1/2 z-[500] flex -translate-y-1/2 flex-col items-center gap-3">
            <Button unstyled
                aria-label="نمایش تمام صفحه"
                className="grid h-10 w-10 place-items-center rounded-lg bg-white text-[#4d4d4d] shadow-[0_4px_14px_rgba(26,26,26,0.12)]"
                onClick={() => void map.getContainer().requestFullscreen?.()}
                type="button"
            >
                <FullscreenIcon />
            </Button>

            <div className="overflow-hidden rounded-lg bg-white shadow-[0_4px_14px_rgba(26,26,26,0.12)]">
                <Button unstyled
                    aria-label="بزرگنمایی"
                    className="grid h-10 w-10 place-items-center border-b border-[#e6e6e6] text-xl font-semibold leading-none text-[#4d4d4d]"
                    onClick={() => map.zoomIn()}
                    type="button"
                >
                    +
                </Button>
                <Button unstyled
                    aria-label="کوچک‌نمایی"
                    className="grid h-10 w-10 place-items-center text-xl font-semibold leading-none text-[#4d4d4d]"
                    onClick={() => map.zoomOut()}
                    type="button"
                >
                    −
                </Button>
            </div>

            <Button unstyled
                aria-label="موقعیت فعلی"
                className="grid h-10 w-10 place-items-center rounded-lg bg-white text-[#4d4d4d] shadow-[0_4px_14px_rgba(26,26,26,0.12)]"
                onClick={() => map.locate({ maxZoom: 16, setView: true })}
                type="button"
            >
                <LocateIcon />
            </Button>
        </div>
    );
}

function DefaultAgencyLogo() {
    return (
        <svg width="48" height="48" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.834 11.6667H9.16732C5.94566 11.6667 3.33398 14.2783 3.33398 17.5H16.6673C16.6673 14.2783 14.0557 11.6667 10.834 11.6667Z" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.0007 9.16667C11.8416 9.16667 13.334 7.67428 13.334 5.83333C13.334 3.99238 11.8416 2.5 10.0007 2.5C8.1597 2.5 6.66732 3.99238 6.66732 5.83333C6.66732 7.67428 8.1597 9.16667 10.0007 9.16667Z" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
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

function InfoIcon({ className = "h-6 w-6" }: { className?: string }) {
    return (
        <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
            <path d="M12 10.5v6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
            <path d="M12 7.5h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path
                d="M7.4 4.5 9.2 8c.2.4.1.9-.2 1.2l-1.1 1.1c.9 1.9 2.4 3.4 4.3 4.3l1.1-1.1c.3-.3.8-.4 1.2-.2l3.5 1.8c.5.3.8.8.7 1.4l-.4 2.1c-.1.6-.7 1-1.3 1C10.4 19.6 4.4 13.6 4.4 7c0-.6.4-1.2 1-1.3l2-.4c.6-.1 1.1.2 1.4.7Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
            />
        </svg>
    );
}

function LocationPinSmallIcon() {
    return (
        <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path
                d="M12 21s6-5.2 6-11a6 6 0 0 0-12 0c0 5.8 6 11 6 11Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
            />
            <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.7" />
        </svg>
    );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
    return (
        <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
            <path d="m8 10 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
    );
}

function PencilIcon() {
    return (
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 20 20">
            <path
                d="M11.6 4.3 15.7 8.4 7.2 16.9H3.1v-4.1l8.5-8.5Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
            />
            <path d="m10.4 5.5 4.1 4.1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        </svg>
    );
}

function AiTextIcon() {
    return (
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 20 20">
            <path d="M3.2 4.6h9.6v9.2H3.2z" stroke="#4d4d4d" strokeLinejoin="round" strokeWidth="1.3" />
            <path d="M5.4 7.2h5.2M5.4 10h3.8" stroke="#4d4d4d" strokeLinecap="round" strokeWidth="1.3" />
            <path d="m13.8 11.8 1 2.1 2.1 1-2.1 1-1 2.1-1-2.1-2.1-1 2.1-1 1-2.1Z" stroke="#4d4d4d" strokeLinejoin="round" strokeWidth="1.2" />
        </svg>
    );
}

function PreviewIcon() {
    return (
        <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
            <rect height="13" rx="1.5" stroke="currentColor" strokeWidth="1.7" width="18" x="3" y="4" />
            <path d="M9 20h6M12 17v3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
            <path d="m9.5 10.8 1.7 1.7 3.3-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
    );
}

function FullscreenIcon() {
    return (
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
            <path d="M7.5 3.5h-4v4M12.5 3.5h4v4M7.5 16.5h-4v-4M12.5 16.5h4v-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
    );
}

function LocateIcon() {
    return (
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
            <path d="M10 16.5A6.5 6.5 0 1 0 10 3.5a6.5 6.5 0 0 0 0 13ZM10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
            <circle cx="10" cy="10" fill="currentColor" r="2" />
        </svg>
    );
}
