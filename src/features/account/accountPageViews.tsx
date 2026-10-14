import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageFrame } from "../../shared/layout/PageFrame";
import { getApiAssetUrl, getApiErrorMessage } from "../../shared/api/api";
import { getStoredAuthSession } from "../../shared/auth/auth-storage";
import { useMyAdsInfiniteQuery } from "./api/account.hooks";
import { useDeleteAdvertisementMutation } from "../advertisements/api/advertisement.hooks";
import {
  mapAdvertisementToAdCard,
  type AdvertisementItem,
} from "../advertisements/api/advertisement.service";
import type { BadgeItem, MyAdsType, NoteItem, WalletPayment } from "./api/account.service";
import { AdCard, truncateAdCardText, type AdCardData  } from "../advertisements/components/AdCard";

import { AdCardSkeleton } from "../advertisements/components/AdCardSkeleton";
import { getRequestErrorState } from "../../shared/components/ErrorState";
import { TopBar } from "../../shared/components/TopBar";
import { Link, useNavigate } from "react-router";
import { AdCardTomanIcon } from "../advertisements/components/AdCardIcons";
import { getMyAdStatusInfo } from "./myAdsStatus";
import { getAdEditPath } from "./adManagement/adManagementData";
import LinearUserConfirmation from "../../shared/icons/LinearUserConfirmation";
import LinearInfoCircle from "../../shared/icons/LinearInfoCircle";
import { useToast } from "../../shared/hooks/useToast";
import {
  validateImageDimensions,
  MAX_PROFILE_IMAGE_BYTES,
  MAX_PROFILE_IMAGE_DIMENSION,
} from "../../shared/utils/image-validation";
import LinearArrowLeft1 from "../../shared/icons/LinearArrowLeft1";
import LinearUserAccount from "../../shared/icons/LinearUserAccount";
import { RadioIndicator } from "../../shared/components/RadioIndicator";
import { HorizontalFilterBar } from "../../shared/components/HorizontalFilterBar";
import { DeleteAdBottomSheet } from "./components/DeleteAdBottomSheet";

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

type SimCardOwnershipReason = "selling" | "transferred" | "purchased";

const simCardOwnershipReasons: Array<{
  id: SimCardOwnershipReason;
  label: string;
}> = [
  { id: "selling", label: "می‌خواهم سیم‌کارتم را بفروشم" },
  { id: "transferred", label: "سیم‌کارتم را واگذار کرده‌ام" },
  { id: "purchased", label: "سیم‌کارتم را تازه خریده‌ام" },
];

const profileAvatarMimeTypes = new Set(["image/jpeg", "image/png", "image/gif"]);

const adFilters: Array<{ label: string; type: MyAdsType }> = [
  { label: "همه", type: "all" },
  { label: "در انتظار", type: "pending" },
  { label: "فعال", type: "active" },
  { label: "غیر فعال", type: "deactive" },
  { label: "نیمه کاره", type: "incomplete" },
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
  const { showToast } = useToast();
  const initialNationalNumber =
    profile?.nationalnumber ??
    ((profile as Record<string, unknown> | undefined)?.national_number as string) ??
    "";

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [form, setForm] = useState({
    email: profile?.email ?? "",
    family: profile?.family ?? "",
    name: profile?.name ?? "",
    nationalnumber: initialNationalNumber,
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
        <div className="text-outline relative grid h-[100px] w-[100px] place-items-center overflow-visible">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="bg-surface-container grid h-full w-full place-items-center overflow-hidden rounded-full"
          >
            {avatarSrc ? (
              <img alt="تصویر پروفایل" className="h-full w-full object-cover" src={avatarSrc} />
            ) : (
              <UserIcon className="text-outline h-10 w-10" />
            )}
          </Typography>

          <label
            aria-label="ویرایش تصویر"
            className="border-surface-container-lowest bg-primary text-on-primary absolute -bottom-1 -left-1 z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-full border-4"
            htmlFor="profile-avatar-upload"
          >
            <EditIcon className="h-4 w-4" />
          </label>

          <input
            accept="image/*"
            className="hidden"
            id="profile-avatar-upload"
            type="file"
            onChange={async (event) => {
              const file = event.target.files?.[0] ?? null;
              if (!file) {
                setAvatarFile(null);
                return;
              }
              if (!profileAvatarMimeTypes.has(file.type)) {
                showToast("فرمت تصویر باید jpg، png یا gif باشد.", "خطا", "error");
                event.target.value = "";
                return;
              }
              if (file.size > MAX_PROFILE_IMAGE_BYTES) {
                showToast("حجم تصویر نباید بیشتر از 1MB باشد.", "خطا", "error");
                event.target.value = "";
                return;
              }
              const { valid } = await validateImageDimensions(
                file,
                MAX_PROFILE_IMAGE_DIMENSION,
                MAX_PROFILE_IMAGE_DIMENSION,
              );
              if (!valid) {
                showToast("ابعاد تصویر نباید بیشتر از ۱۰۰۰ در ۱۰۰۰ پیکسل باشد.", "خطا", "error");
                event.target.value = "";
                return;
              }
              setAvatarFile(file);
            }}
          />
        </div>
      </section>

      <section className="mt-4 space-y-6 px-4">
        <ReadonlyField label="شماره همراه" value={profile?.mobile ?? profile?.phone ?? mobile} />
        <ReadonlyField label="کد ملی" value={form.nationalnumber || initialNationalNumber || "-"} />
      </section>

      <div className="bg-surface-container mt-4 h-4" />

      <section className="space-y-6 px-4 pt-4">
        <TextField
          className={`placeholder:text-outline text-sm ${form.name ? "text-on-surface" : "text-outline"}`}
          label="نام خود را وارد کنید"
          placeholder="نام خود را وارد کنید"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        />
        <TextField
          className={`placeholder:text-outline text-sm ${form.family ? "text-on-surface" : "text-outline"}`}
          label="نام خانوادگی خود را وارد کنید"
          placeholder="نام خانوادگی خود را وارد کنید"
          value={form.family}
          onChange={(event) => setForm((current) => ({ ...current, family: event.target.value }))}
        />
        <TextField
          className={`placeholder:text-outline text-sm ${form.email ? "text-on-surface" : "text-outline"}`}
          label="پست الکترونیکی"
          placeholder="پست الکترونیکی"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        />
      </section>

      <div className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-4 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <Button
          unstyled
          className="bg-primary text-on-primary h-10 w-full rounded-lg text-sm leading-5 font-medium disabled:opacity-50"
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

export function AccountMyAdsEmptyState({
  description: customDescription,
  filterLabel,
  mode,
  showAction,
  title: customTitle,
}: {
  description?: string;
  filterLabel?: string;
  mode?: "compact" | "full";
  showAction?: boolean;
  title?: string;
}) {
  const isAllFilter = filterLabel === "همه";
  const title =
    customTitle ??
    (isAllFilter
      ? "هیچ آگهی‌ای برای نمایش وجود ندارد!"
      : `هیچ آگهی‌ای در وضعیت ${filterLabel} وجود ندارد!`);
  const description =
    customDescription ??
    (isAllFilter
      ? "می‌توانید همین حالا آگهی جدید ثبت کنید و وضعیت آن را از این بخش پیگیری نمایید."
      : "وقتی آگهی‌ای در این وضعیت داشته باشید، همین‌جا نمایش داده می‌شود.");
  const heightClass = mode === "full" ? "h-full min-h-0 flex-1" : "h-full min-h-0 flex-1";
  const shouldShowAction = showAction ?? (customTitle ? false : isAllFilter);

  return (
    <section
      className={`mx-auto flex ${heightClass} w-full flex-col items-center justify-center px-10 text-center`}
    >
      <img
        alt=""
        aria-hidden="true"
        className="mb-4 h-[66px] w-[66px] object-contain"
        src="/vectors/NoAdd.svg"
      />
      <Typography
        as="p"
        variant="title"
        size="medium"
        weight="semibold"
        className="text-on-surface m-0"
      >
        {title}
      </Typography>
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface-var m-0 mt-2"
      >
        {description}
      </Typography>
      {shouldShowAction ? (
        <Link
          className="bg-primary text-on-primary mt-4 inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm leading-5 font-medium"
          to="/new-ad/category"
        >
          <PlusIcon className="h-5 w-5" />
          ثبت آگهی
        </Link>
      ) : null}
    </section>
  );
}

export function AccountMyAdsContent({ emptyMode }: { emptyMode: "compact" | "full" }) {
  const availableFilters = adFilters;
  const [activeFilter, setActiveFilter] = useState(availableFilters[0]);
  const [deletingAdId, setDeletingAdId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();
  const loadMoreObserverRef = useRef<IntersectionObserver | null>(null);
  const deleteMutation = useDeleteAdvertisementMutation();

  const handleOpenDelete = useCallback((targetAdId: string, event?: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    setDeletingAdId(targetAdId);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingAdId) return;
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync({
        advertiseId: deletingAdId,
        deleteReasonId: "other",
        description: "حذف آگهی نیمه کاره",
      });
      showToast("آگهی با موفقیت حذف شد.", undefined, "success");
      setDeletingAdId(null);
    } catch (err) {
      showToast(getApiErrorMessage(err, "حذف آگهی با خطا مواجه شد."), "خطا", "error");
    } finally {
      setIsDeleting(false);
    }
  }, [deletingAdId, deleteMutation, showToast]);
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
  const ads = useMemo(() => {
    const rawAds =
      adsPages?.pages.flatMap((page, pageIndex) =>
        page.data.map((ad, adIndex) => ({
          ad,
          card: mapAdvertisementToAdCard(ad, pageIndex * page.perPage + adIndex),
        })),
      ) ?? [];

    if (!activeFilter || activeFilter.type === "all") {
      return rawAds;
    }

    return rawAds.filter(({ ad }) => {
      const statusKey = getMyAdStatusInfo(ad).key;
      if (activeFilter.type === "pending") {
        return (
          statusKey === "pending" ||
          statusKey === "wait_for_payment" ||
          statusKey === "wait_for_agency" ||
          statusKey === "wait_for_repost" ||
          statusKey === "wait_for_stop" ||
          statusKey === "wait_for_deal_confirmation"
        );
      }
      if (activeFilter.type === "active") {
        return statusKey === "published" || statusKey === "deal_success";
      }
      if (activeFilter.type === "deactive") {
        return (
          statusKey === "expired" ||
          statusKey === "deleted" ||
          statusKey === "deal_unsuccessful" ||
          statusKey === "rejected_by_agency" ||
          statusKey === "archived" ||
          statusKey === "incomplete_deleted"
        );
      }
      if (activeFilter.type === "incomplete") {
        return statusKey === "incomplete";
      }
      return true;
    });
  }, [adsPages, activeFilter]);
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
    <main
      className={`flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto ${showEmptyState ? "bg-surface-container-lowest" : "bg-surface-container"}`}
    >
      <AdFilterTabs
        activeFilter={activeFilter}
        filters={availableFilters}
        onSelect={setActiveFilter}
      />
      <div
        className={`${showEmptyState ? "bg-surface-container-lowest flex min-h-0 flex-1 flex-col" : "bg-surface-container space-y-2"}`}
      >
        {isLoading ? <MyAdsAdCardsSkeleton /> : null}
        {isError ? (
          <AccountRetryState
            error={error}
            message={getApiErrorMessage(error, "دریافت آگهی‌ها با خطا مواجه شد.")}
            onRetry={() => void refetch()}
          />
        ) : null}
        {!isLoading &&
          !isError &&
          ads.map(({ ad, card }, index) => {
            const shouldAttachLoadMoreRef =
              index === loadMoreTriggerIndex && hasNextPage && !isFetchingNextPage;
            const statusInfo = getMyAdStatusInfo(ad);
            const adId = String(ad.id ?? ad._id ?? card.id);
            const cardWithStatus: AdCardData = {
              ...card,
              status: statusInfo.label,
              statusBadgeClassName: statusInfo.badgeClassName,
            };
            const isIncomplete = statusInfo.key === "incomplete";
            const destination = isIncomplete
              ? getAdEditPath(adId, "/account/my-ads")
              : `/account/my-ads/${encodeURIComponent(adId)}/state-ad`;
            const destinationState = isIncomplete
              ? {
                  ad,
                  card: cardWithStatus,
                  editReturnTo: "/account/my-ads",
                  isEditMode: true,
                  status: statusInfo.key,
                  tab: "status",
                }
              : { ad, card: cardWithStatus, status: statusInfo.key };

            return (
              <div key={adId} ref={shouldAttachLoadMoreRef ? loadMoreSentinelRef : undefined}>
                <AdCard
                  ad={cardWithStatus}
                  onDeleteIncomplete={isIncomplete ? (e) => handleOpenDelete(adId, e) : undefined}
                  showStatusBadge
                  state={destinationState}
                  to={destination}
                />
              </div>
            );
          })}
        {isFetchingNextPage ? <MyAdsAdCardsSkeleton count={2} /> : null}
        {showEmptyState ? (
          <AccountMyAdsEmptyState filterLabel={activeFilter.label} mode={emptyMode} />
        ) : null}
      </div>
      <DeleteAdBottomSheet
        isDeleting={isDeleting}
        isOpen={Boolean(deletingAdId)}
        onClose={() => !isDeleting && setDeletingAdId(null)}
        onConfirm={handleConfirmDelete}
      />
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
  variant: "error" | "success" | "info" | "warning";
};

export function AccountPageShell({
  action,
  children,
  onBack,
  title,
}: React.PropsWithChildren<TopBarProps>) {
  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account"
        onBack={onBack}
        startSlot={
          <div className="flex h-12 w-12 shrink-0 items-center justify-center">{action}</div>
        }
        title={title}
      />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </PageFrame>
  );
}

function AdFilterTabs({
  activeFilter,
  filters = adFilters,
  onSelect,
}: {
  activeFilter: { label: string; type: MyAdsType };
  filters?: Array<{ label: string; type: MyAdsType }>;
  onSelect: (filter: { label: string; type: MyAdsType }) => void;
}) {
  return (
    <HorizontalFilterBar
      ariaLabel="فیلتر آگهی‌های من"
      className="bg-surface-container h-[52px]"
      contentClassName="h-9"
    >
      {filters.map((filter) => {
        const isActive = activeFilter.label === filter.label;

        return (
          <Chip key={filter.label} onClick={() => onSelect(filter)} selected={isActive}>
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
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="text-on-surface m-0 text-base leading-6 font-bold"
      >
        {title}
      </Typography>
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface-var m-0 mt-2 max-w-[290px] text-sm leading-6 font-normal"
      >
        {description}
      </Typography>
    </section>
  );
}

function getBadgeAdvertiseSource(badge: BadgeItem): AdvertisementItem {
  return badge.ad ?? badge.advertise ?? badge.advertisement ?? (badge as AdvertisementItem);
}

export function getBadgeAdvertiseId(badge: BadgeItem) {
  const ad = getBadgeAdvertiseSource(badge);
  const id = badge.advertiseId ?? badge.advertise_id ?? ad.id ?? ad._id ?? badge.id ?? badge._id;

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
    <div className="bg-surface-container-lowest relative">
      <AdCard ad={card} />

      <Button
        unstyled
        aria-label="حذف نشان"
        className="bg-surface-container-lowest text-on-surface absolute top-6 left-6 z-10 grid h-10 w-10 place-items-center rounded-xl shadow-[0_2px_8px_rgba(26,26,26,0.16)] disabled:opacity-50"
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
        <LinearDelete className="text-on-surface-var h-6 w-6" />
      </Button>
    </div>
  );
}

function getNoteAdvertiseSource(note: NoteItem): AdvertisementItem {
  return note.ad ?? note.advertise ?? note.advertisement ?? (note as AdvertisementItem);
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
  const navigate = useNavigate();
  const didDrag = useRef(false);
  const noteId = getNoteId(note);
  const advertiseId = getNoteAdvertiseId(note);
  const mappedAd = mapAdvertisementToAdCard(getNoteAdvertiseSource(note), 0);
  const noteText = truncateAdCardText(readNoteText(note) || "یادداشت");
  const adTitle = truncateAdCardText(mappedAd.title);
  const dateText = truncateAdCardText(mappedAd.timeAndLocation || readNoteDate(note, ""));
  const maxDragOffset = 59;

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (dragStartX.current === null || disabled || !noteId) return;

    const deltaX = event.clientX - dragStartX.current;
    if (Math.abs(deltaX) > 6) didDrag.current = true;
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
    <article className="border-outline-var bg-surface-container-lowest relative h-[137px] overflow-hidden border-b text-right [direction:rtl]">
      <Button
        unstyled
        data-note-action
        aria-label="حذف یادداشت"
        className="bg-error-container text-error absolute top-0 left-0 flex h-[136px] w-[59px] flex-col items-center justify-center gap-2 disabled:opacity-50"
        disabled={disabled || !noteId}
        onClick={() => noteId && onDelete(noteId)}
        type="button"
      >
        <LinearDelete className="h-6 w-6" />
        <Typography as="span" variant="label" size="medium" weight="medium" className="text-error">
          حذف
        </Typography>
      </Button>

      <div
        className="bg-surface-container-lowest relative z-10 h-[136px] touch-pan-y px-4 py-4 transition-transform duration-150 ease-out"
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest("button, a, [data-note-action]")) return;

          if (didDrag.current) {
            didDrag.current = false;
            return;
          }

          if (!advertiseId) return;

          navigate(`/ads/${encodeURIComponent(advertiseId)}`);
        }}
        onKeyDown={(event) => {
          if (!advertiseId || event.target !== event.currentTarget) return;
          if (event.key !== "Enter" && event.key !== " ") return;

          event.preventDefault();
          navigate(`/ads/${encodeURIComponent(advertiseId)}`);
        }}
        onPointerCancel={handlePointerEnd}
        onPointerDown={(event) => {
          didDrag.current = false;
          dragStartX.current = event.clientX;
          dragStartOffset.current = dragOffset;
          event.currentTarget.setPointerCapture?.(event.pointerId);
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        role={advertiseId ? "link" : undefined}
        style={{ transform: `translateX(${dragOffset}px)` }}
        tabIndex={advertiseId ? 0 : undefined}
      >
        <div className="flex items-center justify-end gap-4 py-2 [direction:ltr]">
          <Button
            unstyled
            data-note-action
            aria-label="ویرایش یادداشت"
            className="text-on-surface-var grid h-6 w-6 shrink-0 place-items-center disabled:opacity-50"
            disabled={!noteId || disabled}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onPointerUp={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
              onEdit(note);
            }}
            type="button"
          >
            <LinearEdit className="h-5 w-5" />
          </Button>
          <Typography
            as="h2"
            variant="body"
            size="large"
            weight="regular"
            className="text-on-surface m-0 min-w-0 text-right [direction:rtl]"
          >
            {noteText}
          </Typography>
        </div>

        <div className="mt-2 flex min-w-0 items-center gap-x-2 py-2 [direction:rtl]">
          <Link
            aria-label={`مشاهده آگهی ${mappedAd.title}`}
            className={`bg-surface-container relative h-10 w-[60px] shrink-0 overflow-hidden rounded-lg bg-cover bg-center ${mappedAd.imageClassName}`}
            style={mappedAd.imageUrl ? { backgroundImage: `url(${mappedAd.imageUrl})` } : undefined}
            to={advertiseId ? `/ads/${advertiseId}` : "/search"}
          />

          <div className="min-w-0 flex-1 text-right">
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="medium"
              className="text-on-surface m-0"
            >
              {adTitle}
            </Typography>
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="text-outline m-0 mt-2"
            >
              {dateText}
            </Typography>
          </div>
        </div>
      </div>
    </article>
  );
}

export function IdentityPendingState({
  initialNationalnumber = "",
  isPending,
  isAuthenticated = true,
  isVerifying = false,
  isRejected = false,
  showRequiredNotice = false,
  onVerify,
}: {
  initialNationalnumber?: string;
  isPending: boolean;
  isAuthenticated?: boolean;
  isVerifying?: boolean;
  isRejected?: boolean;
  showRequiredNotice?: boolean;
  onVerify: (nationalnumber: string) => void;
}) {
  const mobile = getStoredAuthSession()?.mobile ?? "-";
  const [nationalnumber, setNationalnumber] = useState(initialNationalnumber);

  useEffect(() => {
    if (initialNationalnumber && !nationalnumber) {
      setNationalnumber(initialNationalnumber);
    }
  }, [initialNationalnumber]);

  const normalizedNationalnumber = nationalnumber.trim();
  const isNationalnumberComplete = normalizedNationalnumber.length === 10;

  return (
    <>
      {showRequiredNotice ? (
        <section className="px-2 pt-3">
          <div className="border-warning bg-warning-container text-warning rounded-xl border px-4 py-3 text-right">
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="medium"
              className="m-0 text-sm leading-6 font-semibold"
            >
              احراز هویت مورد نیاز است!
            </Typography>
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="m-0 mt-1 text-xs leading-5 font-normal"
            >
              برای ادامه استفاده از حساب، ابتدا کد ملی مالک شماره همراه را تایید کنید.
            </Typography>
          </div>
        </section>
      ) : null}

      {!isAuthenticated ? (
        <section className="px-4 pt-3">
          <div className="border-primary bg-primary-container rounded-xl border p-4 text-right">
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="medium"
              className="text-primary m-0 text-sm font-semibold"
            >
              برای تایید هویت، ابتدا وارد شوید
            </Typography>
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="text-on-surface-var m-0 mt-1 text-xs leading-5"
            >
              برای ثبت و اعتبارسنجی کد ملی، لازم است ابتدا با شماره همراه خود وارد حساب کاربری شوید.
            </Typography>
            <div className="mt-3">
              <Button
                onClick={() => {
                  window.location.assign(
                    `/login/phone?returnTo=${encodeURIComponent("/account/identity")}`,
                  );
                }}
                size="sm"
                type="button"
                variant="primary"
              >
                ورود با شماره همراه
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {isRejected && !isPending ? (
        <section className="px-4 pt-3">
          <div className="border-error bg-error-container rounded-xl border p-4 text-right">
            <div className="text-error flex items-center gap-2">
              <LinearInfoCircle className="h-5 w-5 shrink-0" />
              <Typography
                as="p"
                variant="body"
                size="medium"
                weight="medium"
                className="m-0 text-sm font-semibold"
              >
                احراز هویت شما تایید نشد
              </Typography>
            </div>
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="text-on-error-container m-0 mt-1.5 text-xs leading-5"
            >
              اطلاعات احراز هویت قبلی شما تایید نشد. لطفاً کد ملی صحیح متعلق به مالک این شماره همراه
              را وارد و مجدداً ارسال فرمایید.
            </Typography>
          </div>
        </section>
      ) : null}

      {isVerifying && !isRejected && !isPending ? (
        <section className="px-4 pt-3">
          <div className="border-warning bg-warning-container rounded-xl border p-4 text-right">
            <div className="text-on-warning-container flex items-center gap-2">
              <LinearInfoCircle className="h-5 w-5 shrink-0" />
              <Typography
                as="p"
                variant="body"
                size="medium"
                weight="medium"
                className="m-0 text-sm font-semibold"
              >
                در انتظار تایید ادمین
              </Typography>
            </div>
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="text-on-surface-var m-0 mt-1.5 text-xs leading-5"
            >
              کد ملی شما ({initialNationalnumber}) با موفقیت ثبت شده و در انتظار بررسی و تایید توسط
              ادمین است.
            </Typography>
          </div>
        </section>
      ) : null}

      {isPending ? (
        <section className="px-4 pt-3">
          <div className="border-primary bg-primary-container text-primary flex items-center gap-2.5 rounded-xl border p-4">
            <div className="border-primary h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-t-transparent" />
            <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 text-sm">
              در حال اعتبارسنجی شما هستیم...
            </Typography>
          </div>
        </section>
      ) : null}

      <section className="p-4 pb-0">
        <div className="border-primary bg-primary-container rounded-xl border p-6">
          <div className="text-primary flex items-center justify-start gap-2.5">
            <LinearUserAccount className="h-6 w-6" />
            <Typography as="p" variant="body" size="large" className="m-0 font-medium">
              ملاحظات در تایید هویت
            </Typography>
          </div>

          <Typography
            as="p"
            variant="body"
            size="large"
            weight="regular"
            className="text-on-surface m-0 mt-4"
          >
            برای افزایش امنیت حساب و جلوگیری از سوءاستفاده، هویت شما با کد ملی و مالکیت شماره همراه
            بررسی می‌شود.
          </Typography>

          <Typography
            as="p"
            variant="body"
            size="large"
            weight="regular"
            className="text-on-surface m-0 mt-4"
          >
            شماره همراه فعال:{" "}
            <Typography
              as="span"
              variant="body"
              size="large"
              weight="medium"
              dir="ltr"
              className="text-tertiary"
            >
              {mobile}
            </Typography>
          </Typography>
        </div>
      </section>

      <section className="p-4">
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="medium"
          className="text-on-surface m-0"
        >
          تایید با کد ملی
        </Typography>

        <div className="text-outline mt-2 flex gap-1">
          <LinearInfoCircle className="h-4.5 w-4.5 shrink-0" />
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 text-xs">
            کد ملی باید متعلق به مالک همین شماره همراه باشد.
          </Typography>
        </div>

        <TextField
          className="text-on-surface text-sm"
          containerClassName="mt-4"
          disabled={isPending}
          inputMode="numeric"
          label="کد ملی مالک شماره همراه"
          maxLength={10}
          placeholder="کد ملی مالک شماره همراه"
          value={nationalnumber}
          onChange={(event) =>
            setNationalnumber(normalizeNumericInput(event.target.value).slice(0, 10))
          }
        />
      </section>

      <div className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <Button
          disabled={!isAuthenticated || !isNationalnumberComplete || isPending}
          fullWidth
          loading={isPending}
          onClick={() => onVerify(normalizedNationalnumber)}
          radius="small"
          size="x-medium"
          type="button"
          variant="primary"
        >
          {isPending
            ? "در حال اعتبارسنجی شما هستیم..."
            : isRejected
              ? "ثبت مجدد کد ملی"
              : isVerifying
                ? "ویرایش و ثبت مجدد کد ملی"
                : "بررسی و تایید هویت"}
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

export function formatPersianMonthYear(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      month: "long",
      year: "numeric",
    });
    const parts = formatter.formatToParts(date);
    const month = parts.find((p) => p.type === "month")?.value;
    const year = parts.find((p) => p.type === "year")?.value;
    if (month && year) {
      return `${month} ${year}`;
    }
    return formatter.format(date);
  } catch {
    return "";
  }
}

export function IdentityVerifiedState({
  authorizeDate,
  onChangeOwner,
}: {
  authorizeDate?: string | null;
  onChangeOwner: () => void;
}) {
  const formattedDate = formatPersianMonthYear(authorizeDate);

  return (
    <>
      <section className="p-4">
        <div className="border-tertiary bg-tertiary-container rounded-xl border p-5">
          <div className="text-tertiary flex gap-2">
            <LinearUserConfirmation className="h-6 w-6" />
            <Typography as="p" variant="body" size="large" className="m-0">
              هویت شما تایید شده است
            </Typography>
          </div>

          <Typography
            as="p"
            variant="body"
            size="large"
            weight="regular"
            className="text-on-surface-var mt-4"
          >
            احراز هویت شما
            {formattedDate ? (
              <>
                {" "}
                در{" "}
                <Typography as="span" variant="body" size="large" weight="medium" className="">
                  {formattedDate}
                </Typography>
              </>
            ) : (
              ""
            )}{" "}
            با موفقیت انجام شده است.
          </Typography>
        </div>
      </section>

      <div className="bg-outline-var mt-3 h-px" />

      <section className="p-4">
        <Typography as="h2" variant="title" size="medium" className="text-on-surface m-0">
          مالکیت سیم‌کارت
        </Typography>

        <div className="text-outline mt-2 flex items-start gap-1">
          <LinearInfoCircle className="text-on-surface-var h-4.5 w-4.5 shrink-0" />
          <Typography as="p" variant="body" size="small" weight="regular" className="">
            در صورتی که سیم‌کارت را تازه خریده‌اید و یا قصد فروش دارید، حتماً تغییر مالکیت آن را
            اعلام کنید.
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
          <Typography as="span" variant="label" size="large" weight="medium">
            ثبت تغییر مالکیت سیم‌کارت
          </Typography>
          <LinearArrowLeft1 className="h-6 w-6" />
        </Button>
      </section>
    </>
  );
}

export function SimCardOwnershipChangeState({ onSubmit }: { onSubmit: () => void }) {
  const [selectedReason, setSelectedReason] = useState<SimCardOwnershipReason>("selling");

  return (
    <>
      <section className="px-9 pt-8">
        <div aria-label="دلیل تغییر مالکیت سیم‌کارت" className="space-y-12" role="radiogroup">
          {simCardOwnershipReasons.map((reason) => {
            const isSelected = selectedReason === reason.id;

            return (
              <label
                className="flex min-h-6 w-full cursor-pointer items-center justify-between gap-3 border-0 text-right ring-0 outline-none focus:ring-0 focus:outline-none focus-visible:outline-none"
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

                <Typography
                  as="span"
                  variant="body"
                  size="large"
                  weight="regular"
                  className="text-on-surface"
                >
                  {reason.label}
                </Typography>

                <RadioIndicator checked={isSelected} />
              </label>
            );
          })}
        </div>
      </section>

      <div className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_16px_rgba(77,77,77,0.08)]">
        <Button fullWidth onClick={onSubmit} size="x-medium" type="button" variant="primary">
          ثبت
        </Button>
      </div>
    </>
  );
}

export function EmptyMessage({ text }: { text: string }) {
  return (
    <Typography
      as="p"
      variant="body"
      size="medium"
      weight="medium"
      className="bg-surface-container-lowest text-outline m-0 mx-auto flex min-h-0 w-full flex-1 items-center justify-center px-4 text-center text-sm font-medium"
    >
      {text}
    </Typography>
  );
}

export function AccountProfileSkeleton() {
  return (
    <div aria-label="در حال دریافت مشخصات" className="bg-surface-container-lowest pb-24">
      <section className="flex flex-col items-center px-4 pt-4">
        <AccountSkeletonBlock className="h-[100px] w-[100px] rounded-full" />
        <AccountSkeletonBlock className="mt-3 h-4 w-28" />
      </section>

      <section className="mt-6 space-y-6 px-4">
        <ProfileFieldSkeleton />
        <ProfileFieldSkeleton />
      </section>

      <div className="bg-surface-container mt-4 h-4" />

      <section className="space-y-6 px-4 pt-4">
        <ProfileFieldSkeleton />
        <ProfileFieldSkeleton />
        <ProfileFieldSkeleton />
      </section>

      <div className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-4 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <AccountSkeletonBlock className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

function ProfileFieldSkeleton() {
  return (
    <div className="relative">
      <AccountSkeletonBlock className="h-14 w-full rounded-xl" />
    </div>
  );
}

export function AccountLoadingState({ text }: { text: string }) {
  return (
    <div className="bg-surface-container-lowest space-y-3 px-4 py-5" aria-label={text}>
      <AccountSkeletonBlock className="ml-auto h-5 w-32" />
      <AccountSkeletonBlock className="h-14 w-full" />
      <AccountSkeletonBlock className="h-14 w-full" />
    </div>
  );
}

function AccountSkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-skeleton rounded-lg ${className}`} />;
}

export function AccountAdCardsSkeleton({
  count = 3,
  showDeleteButton = false,
}: {
  count?: number;
  showDeleteButton?: boolean;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <AdCardSkeleton key={index} showDeleteButton={showDeleteButton} />
      ))}
    </>
  );
}

export function WalletPageSkeleton() {
  return (
    <section className="space-y-5 px-3 pt-4 text-right" aria-label="در حال بارگذاری کیف پول">
      {/* Credit Card */}
      <div className="border-primary/8 bg-primary-container flex items-center justify-between rounded-xl border p-4 [direction:rtl]">
        <div className="space-y-2">
          <AccountSkeletonBlock className="h-4 w-28" />
          <AccountSkeletonBlock className="h-7 w-36" />
        </div>
        <AccountSkeletonBlock className="h-14 w-14 rounded-full" />
      </div>

      <div className="border-outline-var -mx-3 border-t" />

      {/* Increase credit header */}
      <div className="flex items-center gap-2">
        <AccountSkeletonBlock className="h-5 w-5 rounded-full" />
        <AccountSkeletonBlock className="h-5 w-24" />
      </div>

      {/* Input box */}
      <AccountSkeletonBlock className="h-14 w-full rounded-xl" />

      {/* Suggested amounts header */}
      <AccountSkeletonBlock className="h-4 w-28" />

      {/* 6 buttons grid */}
      <div className="grid grid-cols-3 gap-3 [direction:rtl]">
        {Array.from({ length: 6 }).map((_, index) => (
          <AccountSkeletonBlock key={index} className="h-10 w-full rounded-lg" />
        ))}
      </div>

      {/* History button */}
      <AccountSkeletonBlock className="mt-8 h-14 w-full rounded-xl" />
    </section>
  );
}

export function PaymentHistorySkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2" aria-label="در حال دریافت تاریخچه پرداخت">
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          className="border-outline-var bg-surface-container-lowest flex flex-col gap-y-3 border-b p-4 text-right"
        >
          {Array.from({ length: 4 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center justify-between gap-4 py-1.5">
              <AccountSkeletonBlock className="h-4 w-20" />
              <AccountSkeletonBlock className="h-4 w-28" />
            </div>
          ))}
        </article>
      ))}
    </div>
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
        <article
          className="border-outline-var bg-surface-container-lowest h-[137px] border-b px-4 py-4"
          key={index}
        >
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
      <div className="bg-surface-container-lowest fixed inset-0 z-[999]">
        <ErrorState className="h-full" onRetry={onRetry ?? reloadPage} />
      </div>
      <Typography as="p" variant="body" size="medium" weight="regular" className="sr-only">
        {message}
      </Typography>
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

  if (["1", "success", "paid", "ok"].includes(status)) {
    return "var(--tertiary)";
  }

  if (["0", "failed", "error"].includes(status)) {
    return "var(--error)";
  }

  return "var(--on-surface)";
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
      className="text-on-surface cursor-default text-sm select-text"
      readOnly
      forceLabel
      highlightWhenFilled={false}
      label={label}
      value={value}
    />
  );
}

export function PaymentHistoryCard({ payment }: { payment: WalletPayment }) {
  return (
    <article className="border-outline-var bg-surface-container-lowest flex flex-col gap-y-2 border-b p-4 text-right">
      <PaymentHistoryRow
        label="وضعیت"
        value={readPaymentStatus(payment)}
        valueColor={readPaymentStatusColor(payment)}
      />

      <PaymentHistoryRow
        icon={<AdCardTomanIcon className="text-on-surface-var h-6 w-6" />}
        label="هزینه"
        value={formatMoney(payment.price ?? 0)}
      />

      <PaymentHistoryRow label="زمان پرداخت" value={formatPaymentDate(payment.created_at)} />

      <PaymentHistoryRow label="شناسه پرداخت" value={String(payment.ref_id ?? "-")} isLast />
    </article>
  );
}

function PaymentHistoryRow({
  icon,
  label,
  value,
  valueColor = "var(--on-surface)",
}: {
  icon?: React.ReactNode;
  isLast?: boolean;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 py-2`}>
      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="medium"
        className="text-outline shrink-0 leading-5 font-medium"
      >
        {label}
      </Typography>

      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="medium"
        className="flex min-w-0 items-center gap-1 text-left font-medium"
        style={{ color: valueColor }}
      >
        {value}
        {icon}
      </Typography>
    </div>
  );
}

function EditIcon({ className = "" }: { className?: string }) {
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}

export function PlusIcon({ className = "" }: { className?: string }) {
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
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function UserIcon({ className = "" }: { className?: string }) {
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
