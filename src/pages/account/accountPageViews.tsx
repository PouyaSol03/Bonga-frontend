import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageFrame } from "../../app/PageFrame";
import { getApiAssetUrl, getApiErrorMessage } from "../../api/api";
import { getStoredAuthSession } from "../../auth/auth-storage";
import { useMyAdsInfiniteQuery } from "../../hooks/account.hooks";
import { mapAdvertisementToAdCard, type AdvertisementItem } from "../../services/advertisement.service";
import type { BadgeItem, MyAdsType, NoteItem, WalletPayment } from "../../services/account.service";
import { AdCard } from "../../components/AdCard";
import type { AdCardData } from "../../components/AdCard";
import { AdCardSkeleton } from "../../components/AdCardSkeleton";
import type { SnackbarVariant } from "../../components/Snackbar";
import { getRequestErrorState } from "../../components/ErrorState";
import { TopBar } from "../../components/TopBar";
import { RouteLink } from "../../routes/RouteLink";
import { AdCardTomanIcon } from "../../components/AdCardIcons";
import { getMyAdStatusInfo } from "./myAdsStatus";


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
          <span className="grid h-full w-full place-items-center overflow-hidden rounded-full bg-[#e0e0e0]">
            {avatarSrc ? (
              <img alt="تصویر پروفایل" className="h-full w-full object-cover" src={avatarSrc} />
            ) : (
              <UserIcon className="h-10 w-10" />
            )}
          </span>

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
          placeholder="نام خود را وارد کنید"
          value={form.name}
          onChange={(value) => setForm((current) => ({ ...current, name: value }))}
        />
        <TextField
          placeholder="نام خانوادگی خود را وارد کنید"
          value={form.family}
          onChange={(value) => setForm((current) => ({ ...current, family: value }))}
        />
        <TextField
          placeholder="پست الکترونیکی"
          value={form.email}
          onChange={(value) => setForm((current) => ({ ...current, email: value }))}
        />
      </section>

      <div className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-4 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <button
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
        </button>
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
  const heightClass = mode === "full" ? "h-[calc(100dvh-204px)]" : "min-h-[360px]";

  return (
    <section className={`flex ${heightClass} flex-col items-center justify-center px-10 text-center`}>
      <img
        alt=""
        aria-hidden="true"
        className="mb-4 h-[66px] w-[66px] object-contain"
        src="/vectors/NoAdd.svg"
      />
      <h2 className="m-0 font-semibold text-[#1a1a1a]">
        {title}
      </h2>
      <p className="m-0 mt-2 text-sm font-normal text-[#4d4d4d]">
        {description}
      </p>
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
    <main className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden ${showEmptyState ? "bg-white" : "bg-[#f0f0f0]"}`}>
      <AdFilterTabs activeFilter={activeFilter} onSelect={setActiveFilter} />
      <div className={`${showEmptyState ? "bg-white" : "space-y-2 bg-[#f0f0f0] pt-4"}`}>
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
          const statusInfo = getMyAdStatusInfo(ad, index, { useDemoFallback: true });
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
    <section className="h-[52px] overflow-hidden bg-[#f0f0f0] px-4 py-2">
      <div className="flex h-9 gap-2 overflow-x-auto [direction:rtl] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {adFilters.map((filter) => (
          <button
            className={`relative h-9 shrink-0 overflow-hidden rounded-lg border px-3 text-sm font-medium leading-5 ${activeFilter.label === filter.label
              ? "border-[#0048c4] bg-[#0048c414] text-[#0048c4]"
              : "border-[#cccccc] bg-white text-[#1a1a1a]"
              }`}
            key={filter.label}
            onClick={() => onSelect(filter)}
            type="button"
          >
            {activeFilter.label === filter.label ? (
              <span className="absolute inset-0 rounded-lg bg-[#0048c414]" />
            ) : null}
            <span className="relative z-10">{filter.label}</span>
          </button>
        ))}
      </div>
    </section>
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
    <section className="flex min-h-[560px] flex-col items-center justify-center px-9 text-center">
      <img alt="" aria-hidden="true" className="mb-5 h-[66px] w-[66px]" src={iconSrc} />
      <h2 className="m-0 text-base font-bold leading-6 text-[#1a1a1a]">
        {title}
      </h2>
      <p className="m-0 mt-2 max-w-[290px] text-sm font-normal leading-6 text-[#4d4d4d]">
        {description}
      </p>
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

      <button
        aria-label="حذف نشان"
        className="absolute left-6 top-6 z-10 grid h-10 w-10 place-items-center rounded-xl bg-white/90 text-[#1a1a1a] shadow-[0_2px_8px_rgba(26,26,26,0.16)] disabled:opacity-50"
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
        <img alt="" aria-hidden="true" className="h-6 w-6" src="/icons/trash.svg" />
      </button>
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
  const noteId = getNoteId(note);
  const advertiseId = getNoteAdvertiseId(note);
  const mappedAd = mapAdvertisementToAdCard(getNoteAdvertiseSource(note), 0);
  const noteText = readNoteText(note) || "یادداشت";
  const dateText = readNoteDate(note, mappedAd.timeAndLocation);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (dragStartX.current === null || disabled || !noteId) return;

    const deltaX = Math.max(0, event.clientX - dragStartX.current);
    setDragOffset(Math.min(deltaX, 88));
  };

  const handlePointerEnd = () => {
    const shouldDelete = dragOffset > 64;
    setDragOffset(0);
    dragStartX.current = null;

    if (shouldDelete && noteId) {
      onDelete(noteId);
    }
  };

  return (
    <article className="relative overflow-hidden border-b border-[#f0f0f0] bg-white text-right [direction:rtl]">
      <button
        aria-label="حذف یادداشت"
        className="absolute inset-y-0 left-0 flex w-[88px] flex-col items-center justify-center gap-1 bg-[#fff1f1] text-xs font-medium leading-4 text-[#e5231a] disabled:opacity-50"
        disabled={disabled || !noteId}
        onClick={() => noteId && onDelete(noteId)}
        type="button"
      >
        <TrashIcon className="h-5 w-5" />
        حذف
      </button>

      <div
        className="relative z-10 flex min-h-[92px] touch-pan-y items-center gap-3 bg-white px-4 py-3 transition-transform duration-150 ease-out"
        onPointerCancel={handlePointerEnd}
        onPointerDown={(event) => {
          dragStartX.current = event.clientX;
        }}
        onPointerLeave={handlePointerEnd}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        style={{ transform: `translateX(${dragOffset}px)` }}
      >
        <RouteLink
          aria-label={`مشاهده آگهی ${mappedAd.title}`}
          className={`relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-[#ebebeb] bg-cover ${mappedAd.imageClassName}`}
          style={mappedAd.imageUrl ? { backgroundImage: `url(${mappedAd.imageUrl})` } : undefined}
          to={advertiseId ? `/ads/${advertiseId}` : "/search"}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-end gap-2">
            <button
              aria-label="ویرایش یادداشت"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#4d4d4d] disabled:opacity-50"
              disabled={!advertiseId || disabled}
              onClick={() => onEdit(note)}
              type="button"
            >
              <EditIcon className="h-4 w-4" />
            </button>
            <h2 className="m-0 min-w-0 flex-1 truncate text-right text-sm font-medium leading-5 text-[#1a1a1a]">
              {noteText}
            </h2>
          </div>

          <p className="m-0 mt-1 truncate text-right text-xs font-medium leading-5 text-[#1a1a1a]">
            {mappedAd.title}
          </p>
          <p className="m-0 mt-0.5 truncate text-right text-xs font-normal leading-4 text-[#808080]">
            {dateText}
          </p>
        </div>
      </div>
    </article>
  );
}

export function AboutSection({
  isLast = false,
  text,
  title,
}: {
  isLast?: boolean;
  text: string;
  title: string;
}) {
  return (
    <section className={`${isLast ? "pb-0" : "border-b border-[#cccccc] pb-6"} pt-6 text-right`}>
      <div className="flex items-center justify-end gap-1.5">
        <h2 className="m-0 min-w-0 flex-1 text-right text-base font-semibold leading-6 text-[#0048c4]">
          {title}
        </h2>
        <span className="h-3 w-3 shrink-0 rounded-full bg-[#11a366]" aria-hidden="true" />
      </div>
      <p className="m-0 mt-2 whitespace-pre-line text-right text-sm font-normal leading-7 text-[#4d4d4d]">
        {text}
      </p>
    </section>
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
            <p className="m-0 text-sm font-semibold leading-6">
              احراز هویت مورد نیاز است!
            </p>
            <p className="m-0 mt-1 text-xs font-normal leading-5">
              برای ادامه استفاده از حساب، ابتدا کد ملی مالک شماره همراه را تایید کنید.
            </p>
          </div>
        </section>
      ) : null}

      <section className="px-2 pt-3">
        <div className="rounded-xl border border-[#0048C4] bg-[#0048C414] p-6">
          <div className="flex items-center justify-start gap-2 text-[#0048C4]">
            <IdentityCheckIcon className="h-6 w-6" />
            <h2 className="m-0 font-semibold leading-5">
              ملاحظات در تایید هویت
            </h2>
          </div>

          <p className="m-0 mt-3 font-normal leading-7 text-[#1a1a1a]">
            برای افزایش امنیت حساب و جلوگیری از سوءاستفاده، هویت شما با کد ملی و مالکیت شماره همراه بررسی می‌شود.
          </p>

          <p className="m-0 mt-2 font-medium leading-6 text-[#1a1a1a]">
            شماره همراه فعال:{" "}
            <span dir="ltr" className="font-semibold text-[#11A366]">
              {mobile}
            </span>
          </p>
        </div>
      </section>

      <section className="px-2 pt-4 text-center">
        <h2 className="m-0 text-sm font-semibold leading-5 text-[#1a1a1a]">
          تایید با کد ملی
        </h2>

        <div className="mt-1 flex items-center justify-center gap-1 text-[#808080]">
          <InfoCircleIcon className="h-3.5 w-3.5 shrink-0" />
          <p className="m-0 text-[11px] font-normal leading-5">
            کد ملی باید متعلق به مالک همین شماره همراه باشد.
          </p>
        </div>

        <label className="relative mt-4 block">
          <span className="absolute -top-2 right-4 bg-white px-1.5 text-xs font-normal leading-4 text-[#808080]">
            کد ملی مالک شماره همراه
          </span>

          <input
            className="h-11 w-full rounded-xl border border-[#cccccc] bg-white px-4 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none focus:border-[#0048c4] focus:shadow-[0_0_0_3px_rgba(0,72,196,0.12)]"
            inputMode="numeric"
            maxLength={10}
            value={nationalnumber}
            onChange={(event) => setNationalnumber(normalizeNumericInput(event.target.value).slice(0, 10))}
          />
        </label>
      </section>

      <div className="absolute inset-x-0 bottom-0 bg-white px-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-2 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <button
          className="h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white disabled:opacity-50"
          disabled={!isNationalnumberComplete || isPending}
          onClick={() => onVerify(normalizedNationalnumber)}
          type="button"
        >
          {isPending ? "در حال بررسی..." : "بررسی و تایید هویت"}
        </button>
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
      <section className="px-2 pt-2">
        <div className="rounded-xl border border-[#11A366] bg-[#11A36614] px-4 pb-5 pt-4 text-center">
          <div className="flex items-center justify-center gap-2 text-[#11A366]">
            <IdentityCheckIcon className="h-4 w-4" />
            <h2 className="m-0 text-sm font-semibold leading-5">
              هویت شما تایید شده است
            </h2>
          </div>

          <p className="m-0 mt-4 text-sm font-normal leading-7 text-[#4d4d4d]">
            احراز هویت شما در بهمن ۱۴۰۱ با موفقیت انجام شده است.
          </p>
        </div>
      </section>

      <div className="mt-3 h-0.5 bg-[#f0f0f0]" />

      <section className="px-2 pt-4 text-center">
        <h2 className="m-0 text-sm font-semibold leading-5 text-[#1a1a1a]">
          مالکیت سیم‌کارت
        </h2>

        <div className="mt-2 flex items-start justify-center gap-1 text-[#808080]">
          <InfoCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p className="m-0 max-w-[240px] text-[11px] font-normal leading-5">
            در صورتی که سیم‌کارت را تازه خریده‌اید و یا قصد فروش دارید، حتماً تغییر مالکیت آن را اعلام کنید.
            <br />
            در غیر این صورت، عواقب هرگونه تخلف مالک قبلی یا جدید، بر عهدهٔ شما است.
          </p>
        </div>

        <button
          className="relative mt-6 flex h-12 w-full items-center justify-center rounded-xl border border-[#0048c4] bg-white px-4 text-sm font-semibold leading-5 text-[#0048c4]"
          onClick={onChangeOwner}
          type="button"
        >
          <ChevronLeftIcon className="absolute left-4 h-4 w-4" />
          <span>ثبت تغییر مالکیت سیم‌کارت</span>
        </button>
      </section>
    </>
  );
}

export function SimCardOwnershipChangeState({ onSubmit }: { onSubmit: () => void }) {
  const [selectedReason, setSelectedReason] =
    useState<SimCardOwnershipReason>("selling");

  return (
    <>
      <section className="px-4 pt-5">
        <div className="space-y-7">
          {simCardOwnershipReasons.map((reason) => {
            const isSelected = selectedReason === reason.id;

            return (
              <label
                className="flex cursor-pointer items-center justify-start gap-3 text-right"
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

                <span
                  aria-hidden="true"
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${
                    isSelected
                      ? "border-[#0048c4]"
                      : "border-[#808080]"
                  }`}
                >
                  {isSelected ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-[#0048c4]" />
                  ) : null}
                </span>

                <span className="text-sm font-normal leading-6 text-[#1a1a1a]">
                  {reason.label}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <div className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-2 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <button
          className="h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white"
          onClick={onSubmit}
          type="button"
        >
          ثبت
        </button>
      </div>
    </>
  );
}

export function EmptyMessage({ text }: { text: string }) {
  return (
    <p className="m-0 bg-white px-4 py-16 text-center text-sm font-medium text-[#808080]">
      {text}
    </p>
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
        <article className="bg-white px-4 py-4" key={index}>
          <div className="flex gap-3 [direction:rtl]">
            <AccountSkeletonBlock className="h-[104px] w-[136px] shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-3">
              <AccountSkeletonBlock className="ml-auto h-5 w-3/4" />
              <AccountSkeletonBlock className="ml-auto h-4 w-1/2" />
            </div>
          </div>
          <AccountSkeletonBlock className="mt-4 h-20 w-full rounded-xl" />
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
      <p className="sr-only">{message}</p>
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
    <label className="block">
      <span className="mb-1 block pr-4 text-right text-xs font-normal leading-4 text-[#b3b3b3]">
        {label}
      </span>
      <input
        className="h-14 w-full rounded-xl border border-[#e0e0e0] bg-white px-4 text-right text-sm font-normal leading-5 text-[#b3b3b3] outline-none"
        readOnly
        value={value}
      />
    </label>
  );
}

function TextField({
  onChange,
  placeholder,
  value,
}: {
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <input
      className="h-14 w-full rounded-xl border border-[#cccccc] bg-white px-4 text-right text-sm font-normal leading-5 text-[#808080] outline-none placeholder:text-[#808080]"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
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
      <span className="shrink-0 font-medium leading-5 text-[#808080]">
        {label}
      </span>

      <span
        className="flex min-w-0 items-center gap-1 text-left font-medium"
        style={{ color: valueColor }}
      >
        {value}{icon}
      </span>
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

function TrashIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M4 6h16M9 6V4h6v2M7 6l.8 13a2 2 0 0 0 2 2h4.4a2 2 0 0 0 2-2L17 6M10 11v5M14 11v5" />
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

function IdentityCheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect height="14" rx="2" width="18" x="3" y="5" />
      <path d="M8.5 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM5.5 16a3 3 0 0 1 6 0M14 12l2 2 4-5" />
    </svg>
  );
}

export function BuildingClusterIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <path d="M3 21V8l6-3 6 3v13" />
      <path d="M15 12h6v9" />
      <path d="M7 10h2M7 14h2M7 18h2M13 10h.01M13 14h.01M18 15h.01M18 18h.01" />
    </svg>
  );
}

function InfoCircleIcon({ className = "" }: { className?: string }) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
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
