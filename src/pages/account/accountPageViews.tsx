import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageFrame } from "../../app/layout/PageFrame";
import { getApiAssetUrl, getApiErrorMessage } from "../../core/api/api";
import { getStoredAuthSession } from "../../core/auth/auth-storage";
import { useMyAdsInfiniteQuery } from "../../core/hooks/account.hooks";
import { mapAdvertisementToAdCard, type AdvertisementItem } from "../../core/services/advertisement.service";
import type { BadgeItem, MyAdsType, NoteItem, WalletPayment } from "../../core/services/account.service";
import { AdCard } from "../../shared/components/AdCard";
import type { AdCardData } from "../../shared/components/AdCard";
import { AdCardSkeleton } from "../../shared/components/AdCardSkeleton";
import type { SnackbarVariant } from "../../shared/components/Snackbar";
import { getRequestErrorState } from "../../shared/components/ErrorState";
import { TopBar } from "../../shared/components/TopBar";
import { RouteLink } from "../../app/router/RouteLink";
import { AdCardTomanIcon } from "../../shared/components/AdCardIcons";
import { getMyAdStatusInfo } from "./myAdsStatus";
import LinearUserConfirmation from "../../shared/icons/LinearUserConfirmation";
import LinearInfoCircle from "../../shared/icons/LinearInfoCircle";
import LinearArrowLeft1 from "../../shared/icons/LinearArrowLeft1";
import LinearUserAccount from "../../shared/icons/LinearUserAccount";
import { RadioIndicator } from "../../shared/components/RadioIndicator";
import { HorizontalFilterBar } from "../../shared/components/HorizontalFilterBar";

import { Typography } from "../../shared/ui/Typography";
import { TextField } from "../../shared/ui/TextField";
import { Button } from "../../shared/ui/Button";
import { Chip } from "../../shared/ui/Chip";
import LinearDelete from "../../shared/icons/LinearDelete";
import LinearEdit from "../../shared/icons/LinearEdit";

type TopBarProps = {
  action?: React.ReactNode;
  onBack?: () => void;
  title: string;
};

export type IdentityPageStep = "pending" | "verified" | "ownership";

type SimCardOwnershipReason =
  | "selling"
  | "transferred"
  | "purchased";

const simCardOwnershipReasons: Array<{
  id: SimCardOwnershipReason;
  label: string;
}> = [
    { id: "selling", label: "می‌خواهم سیم‌کارتم را بفروشم" },
    { id: "transferred", label: "سیم‌کارتم را واگذار کرده‌ام" },
    { id: "purchased", label: "سیم‌کارتم را تازه خریده‌ام" },
  ];

const adFilters: Array<{ label: string; type: MyAdsType }> = [
  { label: "همه", type: "all" },
  { label: "فعال", type: "active" },
  { label: "در انتظار", type: "pending" },
  { label: "نیمه کاره", type: "pending" },
  { label: "غیر فعال", type: "deactive" },
];

export function AccountProfileForm({
  isSubmitting,
  mobile,
  onSubmit,
  profile,
}: {
  isSubmitting: boolean;
  mobile: string;
  onSubmit: (form: {
    avatar: File | null;
    email: string | null;
    family: string | null;
    name: string | null;
  }) => void;
  profile?: {
    avatar?: string | null;
    email?: string | null;
    family?: string | null;
    mobile?: string;
    name?: string | null;
    nationalnumber?: string | null;
    phone?: string;
  };
}) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [form, setForm] = useState({
    email: profile?.email ?? "",
    family: profile?.family ?? "",
    name: profile?.name ?? "",
    nationalnumber: profile?.nationalnumber ?? "",
  });

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [avatarFile]);

  const avatarSrc = avatarPreview || (profile?.avatar ? getApiAssetUrl(profile.avatar) : "");

  return (
    <>
      <section className="flex flex-col items-center px-4 pt-4">
        <div className="relative grid h-[100px] w-[100px] place-items-center overflow-visible text-[#808080]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-full w-full place-items-center overflow-hidden rounded-full bg-[#e0e0e0]">
            {avatarSrc ? (
              <img alt="تصویر پروفایل" className="h-full w-full object-cover" src={avatarSrc} />
            ) : (
              <UserIcon className="h-10 w-10" />
            )}
          </Typography>

          <label
            aria-label="ویرایش تصویر"
            className="absolute -bottom-1 -left-1 z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-full border-4 border-white bg-[#0048c4] text-white"
            htmlFor="profile-avatar-upload"
          >
            <EditIcon className="h-4 w-4" />
          </label>

          <input
            accept="image/*"
            className="hidden"
            id="profile-avatar-upload"
            type="file"
            onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)}
          />
        </div>
      </section>

      <section className="mt-4 space-y-6 px-4">
        <ReadonlyField label="شماره همراه" value={profile?.mobile ?? profile?.phone ?? mobile} />
        <ReadonlyField label="کد ملی" value={form.nationalnumber || "-"} />
      </section>

      <div className="mt-4 h-4 bg-[#f0f0f0]" />

      <section className="space-y-6 px-4 pt-4">
        <TextField
          className="text-sm text-[#808080] placeholder:text-[#808080]"
          label="نام خود را وارد کنید"
          placeholder="نام خود را وارد کنید"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        />
        <TextField
          className="text-sm text-[#808080] placeholder:text-[#808080]"
          label="نام خانوادگی خود را وارد کنید"
          placeholder="نام خانوادگی خود را وارد کنید"
          value={form.family}
          onChange={(event) => setForm((current) => ({ ...current, family: event.target.value }))}
        />
        <TextField
          className="text-sm text-[#808080] placeholder:text-[#808080]"
          label="پست الکترونیکی"
          placeholder="پست الکترونیکی"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        />
      </section>

      <div className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-4 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <Button unstyled
          className="h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white disabled:opacity-50"
          disabled={isSubmitting}
          type="button"
          onClick={() => {
            const emptyToNull = (value: string) => {
              const trimmedValue = value.trim();
              return trimmedValue.length > 0 ? trimmedValue : null;
            };

            onSubmit({
              avatar: avatarFile,
              email: emptyToNull(form.email),
              family: emptyToNull(form.family),
              name: emptyToNull(form.name),
            });
          }}
        >
          {isSubmitting ? "در حال ثبت..." : "ثبت"}
        </Button>
      </div>
    </>
  );
}


function AccountMyAdsEmptyState({
  filterLabel,
  mode,
}: {
  filterLabel: string;
  mode: "compact" | "full";
}) {
  const isAllFilter = filterLabel === "همه";
  const title = isAllFilter
    ? "هیچ آگهی‌ای برای نمایش وجود ندارد!"
    : `هیچ آگهی‌ای در وضعیت ${filterLabel} وجود ندارد!`;
  const description = isAllFilter
    ? "می‌توانید همین حالا آگهی جدید ثبت کنید و وضعیت آن را از این بخش پیگیری نمایید."
    : "وقتی آگهی‌ای در این وضعیت داشته باشید، همین‌جا نمایش داده می‌شود.";
  const heightClass = mode === "full" ? "h-full min-h-0 flex-1" : "h-full min-h-0 flex-1";

  return (
    <section className={`mx-auto flex ${heightClass} w-full flex-col items-center justify-center px-10 text-center`}>
      <img
        alt=""
        aria-hidden="true"
        className="mb-4 h-[66px] w-[66px] object-contain"
        src="/vectors/NoAdd.svg"
      />
      <Typography as="p" variant="title" size="medium" weight="semibold" className="m-0 text-[#1a1a1a]">
        {title}
      </Typography>
      <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 text-[#4d4d4d]">
        {description}
      </Typography>
      {isAllFilter ? (
        <RouteLink
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[#0048c4] px-4 text-sm font-medium leading-5 text-white"
          to="/new-ad/category"
        >
          <PlusIcon className="h-5 w-5" />
          ثبت آگهی
        </RouteLink>
      ) : null}
    </section>
  );
}

export function AccountMyAdsContent({ emptyMode }: { emptyMode: "compact" | "full" }) {
  const [activeFilter, setActiveFilter] = useState(adFilters[0]);
  const loadMoreObserverRef = useRef<IntersectionObserver | null>(null);
  const {
    data: adsPages,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useMyAdsInfiniteQuery({
    type: activeFilter.type,
  });
  const ads = useMemo(
    () =>
      adsPages?.pages.flatMap((page, pageIndex) =>
        page.data.map((ad, adIndex) => ({
          ad,
          card: mapAdvertisementToAdCard(ad, pageIndex * page.perPage + adIndex),
        })),
      ) ?? [],
    [adsPages],
  );
  const loadMoreTriggerIndex = Math.max(ads.length - 3, 0);
  const loadMoreSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      loadMoreObserverRef.current?.disconnect();
      loadMoreObserverRef.current = null;

      if (!node || !hasNextPage || isFetchingNextPage) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
          }
        },
        { root: null, rootMargin: "240px 0px", threshold: 0 },
      );

      observer.observe(node);
      loadMoreObserverRef.current = observer;
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );
  const hasAds = ads.length > 0;
  const showEmptyState = !isLoading && !isError && !hasAds;

  return (
    <main className={`flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden ${showEmptyState ? "bg-white" : "bg-[#f0f0f0]"}`}>
      <AdFilterTabs activeFilter={activeFilter} onSelect={setActiveFilter} />
      <div className={`${showEmptyState ? "flex min-h-0 flex-1 flex-col bg-white" : "space-y-2 bg-[#f0f0f0]"}`}>
        {isLoading ? <MyAdsAdCardsSkeleton /> : null}
        {isError ? (
          <AccountRetryState
            error={error}
            message={getApiErrorMessage(error, "دریافت آگهی‌ها با خطا مواجه شد.")}
            onRetry={() => void refetch()}
          />
        ) : null}
        {!isLoading && !isError && ads.map(({ ad, card }, index) => {
          const shouldAttachLoadMoreRef =
            index === loadMoreTriggerIndex &&
            hasNextPage &&
            !isFetchingNextPage;
          const statusInfo = getMyAdStatusInfo(ad);
          const adId = String(ad.id ?? ad._id ?? card.id);
          const cardWithStatus: AdCardData = {
            ...card,
            status: statusInfo.label,
          };

          return (
            <div
              key={adId}
              ref={shouldAttachLoadMoreRef ? loadMoreSentinelRef : undefined}
            >
              <AdCard
                ad={cardWithStatus}
                showStatusBadge
                state={{ ad, card: cardWithStatus, status: statusInfo.key }}
                to={`/account/my-ads/${encodeURIComponent(adId)}/state-ad`}
              />
            </div>
          );
        })}
        {isFetchingNextPage ? <MyAdsAdCardsSkeleton count={2} /> : null}
        {showEmptyState ? (
          <AccountMyAdsEmptyState filterLabel={activeFilter.label} mode={emptyMode} />
        ) : null}
      </div>
    </main>
  );
}

export function normalizeWalletAmount(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[^0-9]/g, "")
    .replace(/^0+(?=\d)/, "");
}

export type AccountToast = {
  message: string;
  title: string;
  variant: SnackbarVariant;
};

export function AccountPageShell({ action, children, onBack, title }: React.PropsWithChildren<TopBarProps>) {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account"
        onBack={onBack}
        startSlot={
          <div className="flex h-12 w-12 shrink-0 items-center justify-center">
            {action}
          </div>
        }
        title={title}
      />
      <div className="min-h-0 flex flex-1 flex-col">
        {children}
      </div>
    </PageFrame>
  );
}

function AdFilterTabs({
  activeFilter,
  onSelect,
}: {
  activeFilter: { label: string; type: MyAdsType };
  onSelect: (filter: { label: string; type: MyAdsType }) => void;
}) {
  return (
    <HorizontalFilterBar
      ariaLabel="فیلتر آگهی‌های من"
      className="h-[52px] bg-[#f0f0f0]"
      contentClassName="h-9"
    >
      {adFilters.map((filter) => {
        const isActive = activeFilter.label === filter.label;

        return (
          <Chip
            key={filter.label}
            onClick={() => onSelect(filter)}
            selected={isActive}
          >
            {filter.label}
          </Chip>
        );
      })}
    </HorizontalFilterBar>
  );
}

export function EmptyAccountState({
  description,
  iconSrc,
  title,
}: {
  description: string;
  iconSrc: string;
  title: string;
}) {
  return (
    <section className="mx-auto flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center px-9 text-center">
      <img alt="" aria-hidden="true" className="mb-5 h-[66px] w-[66px]" src={iconSrc} />
      <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-bold leading-6 text-[#1a1a1a]">
        {title}
      </Typography>
      <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 max-w-[290px] text-sm font-normal leading-6 text-[#4d4d4d]">
        {description}
      </Typography>
    </section>
  );
}

function getBadgeAdvertiseSource(badge: BadgeItem): AdvertisementItem {
  return (
    badge.ad ??
    badge.advertise ??
    badge.advertisement ??
    (badge as AdvertisementItem)
  );
}

export function getBadgeAdvertiseId(badge: BadgeItem) {
  const ad = getBadgeAdvertiseSource(badge);
  const id =
    badge.advertiseId ??
    badge.advertise_id ??
    ad.id ??
    ad._id ??
    badge.id ??
    badge._id;

  return id === undefined || id === null ? "" : String(id);
}

export function BookmarkAdCard({
  badge,
  disabled,
  onDelete,
}: {
  badge: BadgeItem;
  disabled: boolean;
  onDelete: (advertiseId: string) => void;
}) {
  const advertiseId = getBadgeAdvertiseId(badge);
  const mappedAd = mapAdvertisementToAdCard(getBadgeAdvertiseSource(badge), 0);
  const card = {
    ...mappedAd,
    id: advertiseId || mappedAd.id,
  } satisfies AdCardData;

  return (
    <div className="relative bg-white">
      <AdCard ad={card} />

      <Button unstyled
        aria-label="حذف نشان"
        className="absolute left-6 top-6 z-10 grid h-10 w-10 place-items-center rounded-xl bg-white text-[#1a1a1a] shadow-[0_2px_8px_rgba(26,26,26,0.16)] disabled:opacity-50"
        disabled={disabled || !advertiseId}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (advertiseId) {
            onDelete(advertiseId);
          }
        }}
        type="button"
      >
        <LinearDelete className="text-on-surface-var w-6 h-6" />
      </Button>
    </div>
  );
}

function getNoteAdvertiseSource(note: NoteItem): AdvertisementItem {
  return (
    note.ad ??
    note.advertise ??
    note.advertisement ??
    (note as AdvertisementItem)
  );
}

export function getNoteId(note: NoteItem) {
  const id = note.id ?? note._id ?? note.noteId;

  return id === undefined || id === null ? "" : String(id);
}

export function getNoteAdvertiseId(note: NoteItem) {
  const ad = getNoteAdvertiseSource(note);
  const id = note.advertiseId ?? note.advertise_id ?? ad.id ?? ad._id;

  return id === undefined || id === null ? "" : String(id);
}

export function readNoteText(note: NoteItem) {
  if (typeof note.note === "string") return note.note;
  if (typeof note.text === "string") return note.text;
  if (typeof note.description === "string") return note.description;

  return "";
}

function readNoteDate(note: NoteItem, fallback: string) {
  const createdAt = note.created_at ?? note.updated_at;

  if (typeof createdAt === "string" && createdAt.trim()) return createdAt;

  return fallback || "";
}

export function NoteCard({
  disabled,
  note,
  onDelete,
  onEdit,
}: {
  disabled: boolean;
  note: NoteItem;
  onDelete: (noteId: string) => void;
  onEdit: (note: NoteItem) => void;
}) {
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const dragStartOffset = useRef(0);
  const noteId = getNoteId(note);
  const advertiseId = getNoteAdvertiseId(note);
  const mappedAd = mapAdvertisementToAdCard(getNoteAdvertiseSource(note), 0);
  const noteText = readNoteText(note) || "یادداشت";
  const dateText = mappedAd.timeAndLocation || readNoteDate(note, "");
  const maxDragOffset = 59;

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (dragStartX.current === null || disabled || !noteId) return;

    const deltaX = event.clientX - dragStartX.current;
    setDragOffset(Math.min(maxDragOffset, Math.max(0, dragStartOffset.current + deltaX)));
  };

  const handlePointerEnd = () => {
    const shouldDelete = dragOffset >= maxDragOffset / 2;

    setDragOffset(0);
    dragStartX.current = null;
    dragStartOffset.current = 0;

    if (shouldDelete && noteId && !disabled) {
      onDelete(noteId);
    }
  };

  return (
    <article className="relative h-[137px] overflow-hidden border-b border-[#f0f0f0] bg-white text-right [direction:rtl]">
      <Button unstyled
        aria-label="حذف یادداشت"
        className="absolute left-0 top-0 flex h-[136px] w-[59px] flex-col items-center justify-center gap-2 bg-[#ecdddd] text-[#c11004] disabled:opacity-50"
        disabled={disabled || !noteId}
        onClick={() => noteId && onDelete(noteId)}
        type="button"
      >
        <LinearDelete className="h-6 w-6" />
        <Typography as="span" variant="label" size="medium" weight="medium" className="text-[#c11004]">
          حذف
        </Typography>
      </Button>

      <div
        className="relative z-10 h-[136px] touch-pan-y bg-white px-4 py-4 transition-transform duration-150 ease-out"
        onPointerCancel={handlePointerEnd}
        onPointerDown={(event) => {
          dragStartX.current = event.clientX;
          dragStartOffset.current = dragOffset;
          event.currentTarget.setPointerCapture?.(event.pointerId);
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        style={{ transform: `translateX(${dragOffset}px)` }}
      >
        <div className="flex items-center justify-end gap-4 py-2 [direction:ltr]">
          <Button unstyled
            aria-label="ویرایش یادداشت"
            className="grid h-6 w-6 shrink-0 place-items-center text-[#4d4d4d] disabled:opacity-50"
            disabled={!advertiseId || disabled}
            onClick={() => onEdit(note)}
            type="button"
          >
            <LinearEdit className="h-5 w-5" />
          </Button>
          <Typography as="h2" variant="body" size="large" weight="regular" className="m-0 min-w-0 text-right text-[#1a1a1a] [direction:rtl]">
            {noteText}
          </Typography>
        </div>

        <div className="mt-2 py-2 gap-x-2 flex min-w-0 items-center [direction:rtl]">
          <RouteLink
            aria-label={`مشاهده آگهی ${mappedAd.title}`}
            className={`relative h-10 w-[60px] shrink-0 overflow-hidden rounded-lg bg-[#ebebeb] bg-cover bg-center ${mappedAd.imageClassName}`}
            style={mappedAd.imageUrl ? { backgroundImage: `url(${mappedAd.imageUrl})` } : undefined}
            to={advertiseId ? `/ads/${advertiseId}` : "/search"}
          />

          <div className="min-w-0 flex-1 text-right">
            <Typography as="p" variant="body" size="small" weight="medium" className="m-0 text-[#1a1a1a]">
              {mappedAd.title}
            </Typography>
            <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-[#808080]">
              {dateText}
            </Typography>
          </div>
        </div>
      </div>
    </article>
  );
}

export function IdentityPendingState({
  isPending,
  showRequiredNotice = false,
  onVerify,
}: {
  isPending: boolean;
  showRequiredNotice?: boolean;
  onVerify: (nationalnumber: string) => void;
}) {
  const mobile = getStoredAuthSession()?.mobile ?? "-";
  const [nationalnumber, setNationalnumber] = useState("");
  const normalizedNationalnumber = nationalnumber.trim();
  const isNationalnumberComplete = normalizedNationalnumber.length === 10;

  return (
    <>
      {showRequiredNotice ? (
        <section className="px-2 pt-3">
          <div className="rounded-xl border border-[#ff6d00] bg-[#fff7f0] px-4 py-3 text-right text-[#ff6d00]">
            <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 text-sm font-semibold leading-6">
              احراز هویت مورد نیاز است!
            </Typography>
            <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-1 text-xs font-normal leading-5">
              برای ادامه استفاده از حساب، ابتدا کد ملی مالک شماره همراه را تایید کنید.
            </Typography>
          </div>
        </section>
      ) : null}

      <section className="p-4 pb-0">
        <div className="rounded-xl border border-[#0048C4] bg-[#0048C414] p-6">
          <div className="flex items-center justify-start gap-2.5 text-[#0048C4]">
            <LinearUserAccount className="h-6 w-6" />
            <Typography as="p" variant="body" size="large" className="m-0 font-medium">
              ملاحظات در تایید هویت
            </Typography>
          </div>

          <Typography as="p" variant="body" size="large" weight="regular" className="m-0 mt-4 text-[#1a1a1a]">
            برای افزایش امنیت حساب و جلوگیری از سوءاستفاده، هویت شما با کد ملی و مالکیت شماره همراه بررسی می‌شود.
          </Typography>

          <Typography as="p" variant="body" size="large" weight="regular" className="m-0 mt-4 text-[#1a1a1a]">
            شماره همراه فعال:{" "}
            <Typography as="span" variant="body" size="large" weight="medium" dir="ltr" className="text-[#11A366]">
              {mobile}
            </Typography>
          </Typography>
        </div>
      </section>

      <section className="p-4">
        <Typography as="h2" variant="title" size="medium" weight="medium" className="m-0 text-[#1a1a1a]">
          تایید با کد ملی
        </Typography>

        <div className="mt-2 flex gap-1 text-[#808080]">
          <LinearInfoCircle className="h-4.5 w-4.5 shrink-0" />
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 text-xs">
            کد ملی باید متعلق به مالک همین شماره همراه باشد.
          </Typography>
        </div>

        <TextField
          className="text-sm text-[#1a1a1a]"
          containerClassName="mt-4"
          inputMode="numeric"
          label="کد ملی مالک شماره همراه"
          maxLength={10}
          placeholder="کد ملی مالک شماره همراه"
          value={nationalnumber}
          onChange={(event) => setNationalnumber(normalizeNumericInput(event.target.value).slice(0, 10))}
        />
      </section>

      <div className="absolute inset-x-0 bottom-0 bg-white px-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-2 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <Button
          disabled={!isNationalnumberComplete}
          fullWidth
          loading={isPending}
          onClick={() => onVerify(normalizedNationalnumber)}
          radius="small"
          size="x-medium"
          type="button"
          variant="primary"
        >
          {isPending ? "در حال بررسی..." : "بررسی و تایید هویت"}
        </Button>
      </div>
    </>
  );
}

function normalizeNumericInput(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/\D/g, "");
}

export function IdentityVerifiedState({ onChangeOwner }: { onChangeOwner: () => void }) {
  return (
    <>
      <section className="p-4">
        <div className="rounded-xl border border-[#11A366] bg-[#11A36614] p-5">
          <div className="flex gap-2 text-[#11A366]">
            <LinearUserConfirmation className="h-6 w-6" />
            <Typography as="p" variant="body" size="large" className="m-0">
              هویت شما تایید شده است
            </Typography>
          </div>

          <Typography as="p" variant="body" size="large" weight="regular" className="mt-4 text-[#4d4d4d]">
            احراز هویت شما در
            {" "}<Typography as="span" variant="body" size="large" weight="medium" className="">بهمن 1401</Typography> {" "}
            با موفقیت انجام شده است.
          </Typography>
        </div>
      </section>

      <div className="mt-3 h-0.5 bg-[#f0f0f0]" />

      <section className="p-4">
        <Typography as="h2" variant="title" size="medium" className="m-0 text-[#1a1a1a]">
          مالکیت سیم‌کارت
        </Typography>

        <div className="mt-2 flex items-start gap-1 text-[#808080]">
          <LinearInfoCircle className="h-4.5 w-4.5 shrink-0 text-[#4D4D4D]" />
          <Typography as="p" variant="body" size="small" weight="regular" className="">
            در صورتی که سیم‌کارت را تازه خریده‌اید و یا قصد فروش دارید، حتماً تغییر مالکیت آن را اعلام کنید.
            <br />
            در غیر این صورت، عواقب هرگونه تخلف مالک قبلی یا جدید، بر عهدهٔ شما است.
          </Typography>
        </div>

        <Button
          className="mt-6 justify-between"
          fullWidth
          onClick={onChangeOwner}
          size="medium"
          type="button"
          variant="secondary"
        >
          <Typography as="span" variant="label" size="large" weight="medium">ثبت تغییر مالکیت سیم‌کارت</Typography>
          <LinearArrowLeft1 className="h-6 w-6" />
        </Button>
      </section>
    </>
  );
}

export function SimCardOwnershipChangeState({ onSubmit }: { onSubmit: () => void }) {
  const [selectedReason, setSelectedReason] =
    useState<SimCardOwnershipReason>("selling");

  return (
    <>
      <section className="px-9 pt-8">
        <div
          aria-label="دلیل تغییر مالکیت سیم‌کارت"
          className="space-y-12"
          role="radiogroup"
        >
          {simCardOwnershipReasons.map((reason) => {
            const isSelected = selectedReason === reason.id;

            return (
              <label
                className="flex min-h-6 w-full cursor-pointer items-center justify-between gap-3 text-right focus-within:outline-3 focus-within:outline-offset-4 focus-within:outline-[#0048c440]"
                key={reason.id}
              >
                <input
                  checked={isSelected}
                  className="sr-only"
                  name="sim-card-ownership-reason"
                  onChange={() => setSelectedReason(reason.id)}
                  type="radio"
                  value={reason.id}
                />

                <Typography as="span" variant="body" size="large" weight="regular" className="text-[#1a1a1a]">
                  {reason.label}
                </Typography>

                <RadioIndicator checked={isSelected} />
              </label>
            );
          })}
        </div>
      </section>

      <div className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-4px_16px_rgba(77,77,77,0.08)]">
        <Button
          fullWidth
          onClick={onSubmit}
          size="x-medium"
          type="button"
          variant="primary"
        >
          ثبت
        </Button>
      </div>
    </>
  );
}

export function EmptyMessage({ text }: { text: string }) {
  return (
    <Typography as="p" variant="body" size="medium" weight="medium" className="mx-auto m-0 flex min-h-0 w-full flex-1 items-center justify-center bg-white px-4 text-center text-sm font-medium text-[#808080]">
      {text}
    </Typography>
  );
}

export function AccountProfileSkeleton() {
  return (
    <div aria-label="در حال دریافت مشخصات" className="bg-white pb-24">
      <section className="flex flex-col items-center px-4 pt-4">
        <AccountSkeletonBlock className="h-[100px] w-[100px] rounded-full" />
        <AccountSkeletonBlock className="mt-3 h-4 w-28" />
      </section>

      <section className="mt-6 space-y-6 px-4">
        <ProfileFieldSkeleton />
        <ProfileFieldSkeleton />
      </section>

      <div className="mt-4 h-4 bg-[#f0f0f0]" />

      <section className="space-y-6 px-4 pt-4">
        <ProfileFieldSkeleton />
        <ProfileFieldSkeleton />
        <ProfileFieldSkeleton />
      </section>

      <div className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-4 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <AccountSkeletonBlock className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

function ProfileFieldSkeleton() {
  return (
    <div className="space-y-2">
      <AccountSkeletonBlock className="ml-auto h-4 w-20" />
      <AccountSkeletonBlock className="h-12 w-full" />
    </div>
  );
}

export function AccountLoadingState({ text }: { text: string }) {
  return (
    <div className="space-y-3 bg-white px-4 py-5" aria-label={text}>
      <AccountSkeletonBlock className="ml-auto h-5 w-32" />
      <AccountSkeletonBlock className="h-14 w-full" />
      <AccountSkeletonBlock className="h-14 w-full" />
    </div>
  );
}

function AccountSkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[#e8e8e8] ${className}`} />;
}

export function AccountAdCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <article className="bg-white px-4 py-4" key={index}>
          <div className="flex gap-3 [direction:rtl]">
            <AccountSkeletonBlock className="h-[104px] w-[136px] shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-3">
              <AccountSkeletonBlock className="ml-auto h-5 w-3/4" />
              <AccountSkeletonBlock className="ml-auto h-4 w-1/2" />
              <AccountSkeletonBlock className="ml-auto h-4 w-full" />
              <AccountSkeletonBlock className="ml-auto h-4 w-2/3" />
            </div>
          </div>
        </article>
      ))}
    </>
  );
}

function MyAdsAdCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <AdCardSkeleton key={index} />
      ))}
    </>
  );
}

export function AccountNotesSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <article className="h-[137px] border-b border-[#f0f0f0] bg-white px-4 py-4" key={index}>
          <div className="flex h-10 items-center justify-end gap-3">
            <AccountSkeletonBlock className="h-5 w-5 shrink-0" />
            <AccountSkeletonBlock className="h-5 w-36" />
          </div>
          <div className="mt-4 flex h-10 items-center gap-3 [direction:rtl]">
            <AccountSkeletonBlock className="h-10 w-[60px] shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <AccountSkeletonBlock className="ml-auto h-3 w-3/4" />
              <AccountSkeletonBlock className="ml-auto h-3 w-1/2" />
            </div>
          </div>
        </article>
      ))}
    </>
  );
}

export function AccountRetryState({
  error,
  message,
  onRetry,
}: {
  error?: unknown;
  message: string;
  onRetry?: () => void;
}) {
  const ErrorState = getRequestErrorState(error);
  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="fixed inset-0 z-[999] bg-white">
        <ErrorState className="h-full" onRetry={onRetry ?? reloadPage} />
      </div>
      <Typography as="p" variant="body" size="medium" weight="regular" className="sr-only">{message}</Typography>
    </>
  );
}

export function formatMoney(value: unknown) {
  const amount =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value.replace(/,/g, ""))
        : 0;

  if (!Number.isFinite(amount)) {
    return String(value || "۰");
  }

  return new Intl.NumberFormat("fa-IR").format(amount);
}

function readPaymentStatus(payment: WalletPayment) {
  const status = String(payment.status ?? "0").toLowerCase();

  switch (status) {
    case "1":
    case "paid":
    case "success":
      return "پرداخت شده";

    case "0":
    case "failed":
    case "error":
      return "نا‌موفق";

    default:
      return status;
  }
}

function readPaymentStatusColor(payment: WalletPayment) {
  const status = String(payment.status ?? "");

  if (["1", "paid", "success"].includes(status)) {
    return "#11a366";
  }

  if (["0", "failed", "error"].includes(status)) {
    return "#EE3623";
  }

  return "#1a1a1a";
}

function formatPaymentDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <TextField
      className="text-sm text-[#b3b3b3] disabled:cursor-default"
      disabled
      forceLabel
      highlightWhenFilled={false}
      label={label}
      value={value}
    />
  );
}

export function PaymentHistoryCard({ payment }: { payment: WalletPayment }) {
  return (
    <article className="border-b border-[#f0f0f0] bg-white p-4 flex flex-col gap-y-2 text-right">
      <PaymentHistoryRow
        label="وضعیت"
        value={readPaymentStatus(payment)}
        valueColor={readPaymentStatusColor(payment)}
      />

      <PaymentHistoryRow
        icon={<AdCardTomanIcon className="h-6 w-6 text-[#4D4D4D]" />}
        label="هزینه"
        value={formatMoney(payment.price ?? 0)}
      />

      <PaymentHistoryRow
        label="زمان پرداخت"
        value={formatPaymentDate(payment.created_at)}
      />

      <PaymentHistoryRow
        label="شناسه پرداخت"
        value={String(payment.ref_id ?? "-")}
        isLast
      />
    </article>
  );
}

function PaymentHistoryRow({
  icon,
  label,
  value,
  valueColor = "#1a1a1a",
}: {
  icon?: React.ReactNode;
  isLast?: boolean;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className={`flex items-center justify-between py-2 gap-4`}>
      <Typography as="span" variant="label" size="medium" weight="medium" className="shrink-0 font-medium leading-5 text-[#808080]">
        {label}
      </Typography>

      <Typography as="span" variant="label" size="medium" weight="medium"
        className="flex min-w-0 items-center gap-1 text-left font-medium"
        style={{ color: valueColor }}
      >
        {value}{icon}
      </Typography>
    </div>
  );
}

function EditIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}

export function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

export function WarningTriangleIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M10.3 4.2 2.6 17.5A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.5L13.7 4.2a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

export function ChevronLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
