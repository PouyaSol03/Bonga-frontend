import { Typography } from "../../../shared/ui/Typography";

import type { ReactNode } from 'react'
import './AdCard.css'

import { RouteLink } from '../../../shared/navigation/RouteLink'
import LinearImage from '../../../shared/icons/LinearImage'
import LinearDelete from '../../../shared/icons/LinearDelete'
import LinearCity from '../../../shared/icons/LinearCity'
import LinearApartment from '../../../shared/icons/LinearApartment'
import LinearFloor from '../../../shared/icons/LinearFloor'
import LinearStar from '../../../shared/icons/LinearStar'
import LinearCalendar from '../../../shared/icons/LinearCalendar'
import LinearConstruction from '../../../shared/icons/LinearConstruction'
import LinearSettingBuilding from '../../../shared/icons/LinearSettingBuilding'
import {
  AdCardAlbumIcon,
  AdCardAreaIcon,
  AdCardCapacityIcon,
  AdCardDocumentIcon,
  AdCardLandAreaIcon,
  AdCardLocationIcon,
  AdCardOwnerIcon,
  AdCardRoomsIcon,
  AdCardTomanIcon,
  AdCardYearIcon,
} from './AdCardIcons'

export type AdCardPropertyItem = {
  icon: ReactNode
  value: string
}

export type AdCardData = {
  id: number | string
  title: string
  agency: string
  status: string
  imageCount: string
  priceLabelPrimary: string
  pricePrimary: string
  priceLabelSecondary: string
  priceSecondary: string
  area?: string
  rooms?: string
  year?: string
  landArea?: string
  documentType?: string
  commercialPosition?: string
  landPosition?: string
  floor?: string
  buildingArea?: string
  capacity?: string
  stars?: string
  rentalPeriod?: string
  projectType?: string
  totalFloors?: string
  totalUnits?: string
  builderShare?: string
  currentStatus?: string
  category?: string
  formCode?: string
  properties?: AdCardPropertyItem[]
  timeAndLocation: string
  imageClassName: string
  imageUrl?: string
  badges: string[]
  statusBadgeClassName?: string
}

type AdCardVariant = 'standard' | 'dashboard' | 'requestResult' | 'mapPreview' | 'carousel'

export const AD_CARD_TEXT_MAX_LENGTH = 50

export function truncateAdCardText(text: string) {
  if (text.length <= AD_CARD_TEXT_MAX_LENGTH) return text

  return `${text.slice(0, AD_CARD_TEXT_MAX_LENGTH - 1).trimEnd()}…`
}

type AdCardProps = {
  ad: AdCardData
  ariaLabel?: string
  className?: string
  imageAction?: ReactNode
  imageMeta?: ReactNode
  imageLoading?: 'eager' | 'lazy'
  isSelected?: boolean
  mapPreviewImages?: string[]
  mapSliderCardId?: number | string
  showBadges?: boolean
  showAgency?: boolean
  showImageCount?: boolean
  showStatusBadge?: boolean
  state?: unknown
  to?: string
  topBadge?: ReactNode
  variant?: AdCardVariant
  onDeleteIncomplete?: (event: React.MouseEvent) => void
}

function getAdNavigationState(to: string, state: unknown) {
  if (state !== undefined || !to.startsWith('/ads/')) {
    return state
  }

  const from = `${window.location.pathname}${window.location.search}`

  if (from === to) {
    return state
  }

  return { from }
}

export function AdCard({
  ad,
  ariaLabel,
  className = '',
  imageAction,
  imageMeta,
  imageLoading = 'eager',
  isSelected = false,
  mapPreviewImages = [],
  mapSliderCardId,
  showAgency = true,
  showBadges = true,
  showImageCount = true,
  showStatusBadge = false,
  state,
  to = `/ads/${ad.id}`,
  topBadge,
  variant = 'standard',
  onDeleteIncomplete,
}: AdCardProps) {
  const hasSecondaryPrice = Boolean(ad.priceLabelSecondary && ad.priceSecondary)
  const linkState = getAdNavigationState(to, state)

  if (variant === 'mapPreview') {
    const images = mapPreviewImages.length > 0
      ? mapPreviewImages
      : ad.imageUrl
        ? [ad.imageUrl]
        : []

    return (
      <RouteLink
        aria-current={isSelected ? 'true' : undefined}
        className={`flex h-[216px] w-[min(360px,calc(100vw-28px))] shrink-0 snap-center flex-col overflow-hidden rounded-2xl bg-surface-container-lowest p-3 text-right no-underline shadow-[0_4px_16px_rgba(0,0,0,0.10)] ${className}`}
        data-map-slider-card={mapSliderCardId === undefined ? undefined : String(mapSliderCardId)}
        dir="rtl"
        state={linkState}
        to={to}
      >
        <MapPreviewImages
          images={images}
          title={ad.title}
        />

        <div className="mt-2 flex min-h-5 items-baseline justify-start [direction:rtl]">
          <strong className="truncate text-base font-semibold leading-6 text-primary">
            {resolveAdCategory(ad) === 'project-partnership'
              ? `درصد مشارکت: ${ad.builderShare ? (ad.builderShare.includes('٪') || ad.builderShare.includes('%') ? ad.builderShare : `${ad.builderShare}٪`) : (ad.pricePrimary && ad.pricePrimary !== 'توافقی' ? ad.pricePrimary : 'توافقی')}`
              : resolveAdCategory(ad) === 'project-presale'
                ? (ad.priceSecondary
                    ? `قیمت متری: ${ad.pricePrimary} تا ${ad.priceSecondary}`
                    : `قیمت متری: ${ad.pricePrimary}`)
                : isDailyRentCategory(resolveAdCategory(ad)) && ad.priceSecondary
                  ? `${ad.pricePrimary} تا ${ad.priceSecondary}`
                  : ad.pricePrimary}
          </strong>
        </div>

        <PropertyRow className="mt-1.5 min-h-6 flex-wrap gap-3 text-[13px]" ad={ad} />

        <Typography as="p" variant="body" size="medium" weight="medium" className="mt-1.5 text-right text-on-surface">
          {truncateAdCardText(ad.title)}
        </Typography>
      </RouteLink>
    )
  }

  if (variant === 'requestResult') {
    return (
      <article className={`relative bg-surface-container-lowest px-4 pb-4 pt-3 text-right [direction:rtl] ${className}`}>
        {topBadge}

        <div className="relative">
          <RouteLink
            aria-label={ariaLabel ?? `مشاهده آگهی ${ad.title}`}
            className="block text-inherit no-underline focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-primary/25"
            state={linkState}
            to={to}
          >
            <AdCardImage
              ad={ad}
              imageMeta={imageMeta}
              imageLoading={imageLoading}
              showAgency={showAgency}
              showImageCount={false}
              showStatusBadge={false}
            />
          </RouteLink>

          {imageAction}
        </div>

        <RouteLink
          aria-label={ariaLabel ?? `مشاهده آگهی ${ad.title}`}
          className="block text-inherit no-underline focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-primary/25"
          state={linkState}
          to={to}
        >
          <AdCardBody
            ad={ad}
            hasSecondaryPrice={hasSecondaryPrice}
            showBadges={showBadges}
          />
        </RouteLink>
      </article>
    )
  }

  const isDashboard = variant === 'dashboard'
  const isCarousel = variant === 'carousel'

  return (
    <RouteLink
      aria-label={ariaLabel ?? `مشاهده آگهی ${ad.title}`}
      className={`block text-inherit no-underline focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-primary/25 ${isDashboard ? 'min-w-0' : ''} ${className}`}
      state={linkState}
      to={to}
    >
      <article
        className={
          isDashboard
            ? 'flex min-w-0 flex-col gap-4 text-right'
            : isCarousel
              ? 'flex min-w-0 flex-col text-right [direction:rtl]'
              : 'flex flex-col bg-surface-container-lowest px-4 py-4 text-right [direction:rtl]'
        }
      >
        <AdCardImage
          ad={ad}
          className={isDashboard ? 'h-[224px] w-auto' : undefined}
          imageLoading={imageLoading}
          showAgency={showAgency}
          showImageCount={showImageCount}
          showStatusBadge={showStatusBadge}
          onDeleteIncomplete={onDeleteIncomplete}
        />

        <AdCardBody
          ad={ad}
          className={isDashboard ? 'gap-2.5 pt-0' : undefined}
          hasSecondaryPrice={hasSecondaryPrice}
          showBadges={showBadges}
        />
      </article>
    </RouteLink>
  )
}

function AdCardImage({
  ad,
  className = '',
  imageMeta,
  imageLoading,
  showAgency = true,
  showImageCount,
  showStatusBadge,
  onDeleteIncomplete,
}: {
  ad: AdCardData
  className?: string
  imageMeta?: ReactNode
  imageLoading?: 'eager' | 'lazy'
  showAgency?: boolean
  showImageCount: boolean
  showStatusBadge: boolean
  onDeleteIncomplete?: (event: React.MouseEvent) => void
}) {
  return (
    <div
      className={`ad-card__image relative aspect-[328/219.3] shrink-0 overflow-hidden rounded-2xl bg-primary-container bg-cover bg-center ${ad.imageClassName} ${className}`}
    >
      <div className="absolute inset-0 grid place-items-center text-outline" aria-hidden="true">
        <LinearImage className="h-12 w-12" />
      </div>
      {ad.imageUrl ? (
        <img
          src={ad.imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          draggable={false}
          loading={imageLoading}
          decoding="async"
          fetchPriority={imageLoading === 'lazy' ? 'low' : undefined}
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
      ) : null}
      {imageMeta}
      {showImageCount ? (
        <div className="absolute right-2 top-2 z-2 inline-flex h-7 items-center gap-1.5 rounded-lg bg-black/60 px-2 text-sm font-medium leading-5 text-white" aria-label={`${ad.imageCount} تصویر`}>
          <AdCardAlbumIcon className="h-5 w-5 shrink-0" />
          <Typography as="span" variant="body" size="medium" weight="regular">{ad.imageCount}</Typography>
        </div>
      ) : null}
      {showStatusBadge && ad.status ? (
        <Typography as="span" variant="label" size="small" weight="medium" className={`absolute left-2 top-2 z-2 inline-flex h-7 items-center rounded-lg py-1.5 px-4 text-xs font-medium ${ad.statusBadgeClassName ?? getStatusBadgeClassName(ad.status)}`}>
          <Typography as="span" variant="label" size="small" weight="medium" className="">{ad.status}</Typography>
        </Typography>
      ) : null}
      {showAgency && ad.agency && ad.agency.trim() !== 'شخصی' ? (
        <div className="absolute bottom-2 right-2 z-[1] inline-flex h-7 max-w-[calc(100%-16px)] items-center gap-2 rounded-lg bg-black/60 px-2 text-sm font-medium leading-5 text-white">
          <AdCardOwnerIcon className="h-5 w-5 shrink-0" />
          <Typography as="span" variant="body" size="medium" weight="regular" className="truncate">{ad.agency}</Typography>
        </div>
      ) : null}
      {onDeleteIncomplete ? (
        <button
          type="button"
          aria-label="حذف آگهی نیمه کاره"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDeleteIncomplete(event);
          }}
          className="absolute bottom-2 left-2 z-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-on-primary text-on-surface-var transition-colors"
        >
          <LinearDelete className="h-6 w-6" />
        </button>
      ) : null}
    </div>
  )
}

function AdCardBody({
  ad,
  className = '',
  hasSecondaryPrice,
  showBadges,
}: {
  ad: AdCardData
  className?: string
  hasSecondaryPrice: boolean
  showBadges: boolean
}) {
  const category = resolveAdCategory(ad)

  return (
    <div className={`flex flex-col pt-3 ${className}`}>
      <AdCardPriceRow ad={ad} hasSecondaryPrice={hasSecondaryPrice} category={category} />

      <PropertyRow className="mt-3 h-5 gap-[22px] text-sm" ad={ad} />

      <Typography as="p" variant="body" size="medium" weight="medium" className="mt-3 text-on-surface">
        {truncateAdCardText(ad.title)}
      </Typography>

      <div className="mt-3 flex h-6 items-center justify-start gap-2">
        {showBadges ? ad.badges.map((badge) => (
          <Typography as="span" variant="label" size="small" weight="medium" className={`h-6 whitespace-nowrap rounded-lg border px-2 py-[3px] text-xs font-medium leading-4 ${badge === 'فوری' ? 'border-warning bg-warning-container text-warning' : 'border-tertiary bg-tertiary-container text-tertiary'}`} key={badge}>
            {badge}
          </Typography>
        )) : null}
        {showBadges && ad.badges.length > 0 ? <Typography as="span" variant="body" size="medium" weight="regular" className="h-6 w-px bg-outline-var" aria-hidden="true" /> : null}
        <Typography as="span" variant="body" size="medium" weight="regular" className="text-outline">{ad.timeAndLocation}</Typography>
      </div>
    </div>
  )
}

function AdCardPriceRow({
  ad,
  hasSecondaryPrice,
  category,
}: {
  ad: AdCardData
  hasSecondaryPrice: boolean
  category: AdCategoryType
}) {
  if (category === 'project-partnership') {
    const shareText = ad.builderShare
      ? (ad.builderShare.includes('٪') || ad.builderShare.includes('%') ? ad.builderShare : `${ad.builderShare}٪`)
      : (ad.pricePrimary && ad.pricePrimary !== 'توافقی' ? ad.pricePrimary : 'توافقی')

    return (
      <div className="flex h-6 items-center justify-start gap-1 [direction:rtl]">
        <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium leading-5 text-outline">
          درصد مشارکت:
        </Typography>
        <Typography as="p" variant="title" size="medium" weight="semibold" className="whitespace-nowrap text-primary">
          {shareText}
        </Typography>
      </div>
    )
  }

  if (category === 'project-presale') {
    return (
      <div className="flex h-6 items-center justify-start gap-1 [direction:rtl]">
        <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium leading-5 text-outline">
          {ad.priceLabelPrimary || 'قیمت متری:'}
        </Typography>
        <Typography as="p" variant="title" size="medium" weight="semibold" className="whitespace-nowrap text-primary">
          {ad.pricePrimary}
        </Typography>
        {hasSecondaryPrice ? (
          <>
            <Typography as="span" variant="body" size="medium" weight="medium" className="text-outline text-sm">
              تا
            </Typography>
            <Typography as="p" variant="title" size="medium" weight="semibold" className="whitespace-nowrap text-primary">
              {ad.priceSecondary}
            </Typography>
          </>
        ) : null}
        <AdCardTomanIcon className="h-5 w-5 shrink-0 text-primary" />
      </div>
    )
  }

  const isDaily = isDailyRentCategory(category)

  if (isDaily) {
    return (
      <div className="flex h-6 items-center justify-start gap-1 [direction:rtl]">
        <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium leading-5 text-outline">
          {ad.priceLabelPrimary || 'قیمت'}
        </Typography>
        <Typography as="p" variant="title" size="medium" weight="semibold" className="whitespace-nowrap text-primary">
          {ad.pricePrimary}
        </Typography>
        {hasSecondaryPrice ? (
          <>
            <Typography as="span" variant="body" size="medium" weight="medium" className="text-outline text-sm">
              تا
            </Typography>
            <Typography as="p" variant="title" size="medium" weight="semibold" className="whitespace-nowrap text-primary">
              {ad.priceSecondary}
            </Typography>
          </>
        ) : null}
        <AdCardTomanIcon className="h-5 w-5 shrink-0 text-primary" />
      </div>
    )
  }

  const isRentApartment = category === 'rent-apartment'
  const primaryLabel = ad.priceLabelPrimary || (isRentApartment && hasSecondaryPrice ? 'اجاره:' : '')
  const secondaryLabel = ad.priceLabelSecondary || (isRentApartment ? 'رهن:' : '')

  return (
    <div className="flex h-6 items-center justify-start gap-2 [direction:rtl]">
      <PriceItem label={primaryLabel} price={ad.pricePrimary} />
      {hasSecondaryPrice ? <Typography as="span" variant="body" size="medium" weight="regular" className="h-6 w-px bg-outline-var" aria-hidden="true" /> : null}
      {hasSecondaryPrice ? (
        <PriceItem label={secondaryLabel} price={ad.priceSecondary} />
      ) : null}
    </div>
  )
}

function PriceItem({ label, price }: { label: string; price: string }) {
  return (
    <Typography as="span" variant="body" size="medium" weight="regular" className="inline-flex min-w-0 items-center gap-0.5">
      {label ? <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium leading-5 text-outline">{label}</Typography> : null}
      <Typography as="p" variant="title" size="medium" weight="semibold" className="whitespace-nowrap text-primary">{price}</Typography>
      <AdCardTomanIcon className="h-5 w-5 shrink-0 text-primary" />
    </Typography>
  )
}

export type AdCategoryType =
  // فروش
  | 'sale-apartment'
  | 'sale-land'
  | 'sale-garden-villa'
  | 'sale-office'
  | 'sale-commercial'
  | 'sale-factory'
  | 'sale-hotel'
  // اجاره
  | 'rent-apartment'
  | 'rent-villa-house'
  | 'rent-hotel'
  | 'rent-office'
  | 'rent-commercial'
  | 'rent-factory'
  // اجاره روزانه
  | 'daily-apartment-suite'
  | 'daily-garden-villa'
  | 'daily-hotel'
  | 'daily-office-booth'
  // پیش‌فروش و مشارکت
  | 'project-presale'
  | 'project-partnership'
  | 'default'

export function isDailyRentCategory(category: AdCategoryType): boolean {
  return (
    category === 'daily-apartment-suite' ||
    category === 'daily-garden-villa' ||
    category === 'daily-hotel' ||
    category === 'daily-office-booth'
  )
}

export function resolveAdCategory(ad: AdCardData): AdCategoryType {
  const formCode = (ad.formCode ?? '').toLowerCase().trim()
  const category = (ad.category ?? '').toLowerCase().trim()
  const title = (ad.title ?? '').toLowerCase().trim()

  if (
    formCode.includes('partnership') ||
    category.includes('مشارکت') ||
    category.includes('project-partnership') ||
    title.includes('مشارکت')
  ) {
    return 'project-partnership'
  }

  if (
    formCode.includes('presale') ||
    category.includes('پیش فروش') ||
    category.includes('پیشفروش') ||
    category.includes('project-presale') ||
    title.includes('پیش فروش') ||
    title.includes('پیشفروش')
  ) {
    return 'project-presale'
  }

  const isDaily =
    formCode.startsWith('daily') ||
    category.includes('روزانه') ||
    title.includes('روزانه')

  if (isDaily) {
    if (
      formCode.includes('hotel') ||
      category.includes('هتل') ||
      category.includes('اقامتگاه') ||
      title.includes('هتل') ||
      title.includes('اقامتگاه')
    ) {
      return 'daily-hotel'
    }

    if (
      formCode.includes('garden') ||
      formCode.includes('villa') ||
      category.includes('ویلا') ||
      category.includes('باغ') ||
      title.includes('ویلا') ||
      title.includes('باغ')
    ) {
      return 'daily-garden-villa'
    }

    if (
      formCode.includes('office') ||
      formCode.includes('booth') ||
      formCode.includes('workspace') ||
      category.includes('دفتر') ||
      category.includes('غرفه') ||
      category.includes('اتاق کار') ||
      category.includes('فضای کار') ||
      title.includes('دفتر') ||
      title.includes('غرفه') ||
      title.includes('اتاق کار') ||
      title.includes('فضای کار')
    ) {
      return 'daily-office-booth'
    }

    return 'daily-apartment-suite'
  }

  const isRent =
    formCode.startsWith('rent') ||
    category.includes('اجاره') ||
    title.includes('اجاره') ||
    category.includes('رهن') ||
    title.includes('رهن')

  if (isRent) {
    if (
      formCode.includes('hotel') ||
      category.includes('هتل') ||
      category.includes('اقامتگاه') ||
      title.includes('هتل') ||
      title.includes('اقامتگاه')
    ) {
      return 'rent-hotel'
    }

    if (
      formCode.includes('office') ||
      category.includes('اداری') ||
      category.includes('دفتر') ||
      title.includes('اداری') ||
      title.includes('دفتر')
    ) {
      return 'rent-office'
    }

    if (
      formCode.includes('commercial') ||
      category.includes('تجاری') ||
      category.includes('مغازه') ||
      title.includes('تجاری') ||
      title.includes('مغازه')
    ) {
      return 'rent-commercial'
    }

    if (
      formCode.includes('factory') ||
      formCode.includes('warehouse') ||
      category.includes('صنعتی') ||
      category.includes('سوله') ||
      category.includes('کارخانه') ||
      category.includes('کارگاه') ||
      category.includes('انبار') ||
      title.includes('صنعتی') ||
      title.includes('سوله') ||
      title.includes('کارخانه') ||
      title.includes('کارگاه') ||
      title.includes('انبار')
    ) {
      return 'rent-factory'
    }

    if (
      formCode.includes('villa') ||
      formCode.includes('house') ||
      formCode.includes('garden') ||
      category.includes('ویلا') ||
      category.includes('باغ') ||
      category.includes('خانه') ||
      title.includes('ویلا') ||
      title.includes('باغ') ||
      title.includes('خانه')
    ) {
      return 'rent-villa-house'
    }

    return 'rent-apartment'
  }

  // فروش (Sale)
  if (
    formCode.includes('hotel') ||
    category.includes('hotel') ||
    category.includes('هتل') ||
    category.includes('اقامتگاه') ||
    title.includes('هتل') ||
    title.includes('اقامتگاه')
  ) {
    return 'sale-hotel'
  }

  if (
    formCode.includes('commercial') ||
    category.includes('commercial') ||
    category.includes('تجاری') ||
    category.includes('مغازه') ||
    title.includes('تجاری') ||
    title.includes('مغازه')
  ) {
    return 'sale-commercial'
  }

  if (
    formCode.includes('factory') ||
    formCode.includes('warehouse') ||
    category.includes('factory') ||
    category.includes('warehouse') ||
    category.includes('صنعتی') ||
    category.includes('سوله') ||
    category.includes('کارخانه') ||
    category.includes('کارگاه') ||
    category.includes('انبار') ||
    title.includes('صنعتی') ||
    title.includes('سوله') ||
    title.includes('کارخانه') ||
    title.includes('کارگاه') ||
    title.includes('انبار')
  ) {
    return 'sale-factory'
  }

  if (
    formCode.includes('land') ||
    category.includes('land') ||
    category.includes('زمین') ||
    category.includes('کلنگی') ||
    title.includes('زمین') ||
    title.includes('کلنگی')
  ) {
    return 'sale-land'
  }

  if (
    formCode.includes('office') ||
    category.includes('office') ||
    category.includes('اداری') ||
    category.includes('دفتر') ||
    title.includes('اداری') ||
    title.includes('دفتر')
  ) {
    return 'sale-office'
  }

  if (
    formCode.includes('garden') ||
    formCode.includes('villa') ||
    category.includes('garden') ||
    category.includes('villa') ||
    category.includes('ویلا') ||
    category.includes('باغ') ||
    title.includes('ویلا') ||
    title.includes('باغ')
  ) {
    return 'sale-garden-villa'
  }

  if (
    formCode.includes('apartment') ||
    category.includes('apartment') ||
    category.includes('آپارتمان') ||
    title.includes('آپارتمان')
  ) {
    return 'sale-apartment'
  }

  if (ad.commercialPosition) return 'sale-commercial'
  if (ad.landPosition) return 'sale-factory'
  if (ad.landArea && !ad.rooms) return 'sale-land'

  return 'default'
}

export function getAdCardProperties(ad: AdCardData): AdCardPropertyItem[] {
  if (ad.properties && ad.properties.length > 0) {
    return ad.properties.filter((item) => item.value && item.value.trim() && item.value.trim() !== '-')
  }

  const category = resolveAdCategory(ad)

  let items: Array<{ icon: ReactNode; value?: string }> = []

  switch (category) {
    // === فروش ===
    case 'sale-apartment':
      items = [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: ad.area },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <AdCardYearIcon className="h-5 w-5" />, value: ad.year },
      ]
      break

    case 'sale-land':
      items = [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: ad.area },
        { icon: <AdCardLandAreaIcon className="h-5 w-5" />, value: ad.landArea },
        { icon: <AdCardDocumentIcon className="h-5 w-5" />, value: ad.documentType },
      ]
      break

    case 'sale-garden-villa':
      items = [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: ad.area },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <AdCardYearIcon className="h-5 w-5" />, value: ad.year },
      ]
      break

    case 'sale-office':
      items = [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: ad.area },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <AdCardYearIcon className="h-5 w-5" />, value: ad.year },
      ]
      break

    case 'sale-commercial':
      items = [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: ad.area },
        { icon: <AdCardDocumentIcon className="h-5 w-5" />, value: ad.documentType },
        { icon: <AdCardLocationIcon className="h-5 w-5" />, value: ad.commercialPosition },
      ]
      break

    case 'sale-factory':
      items = [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: ad.area },
        { icon: <AdCardDocumentIcon className="h-5 w-5" />, value: ad.documentType },
        { icon: <AdCardLocationIcon className="h-5 w-5" />, value: ad.landPosition },
      ]
      break

    case 'sale-hotel':
      items = [
        { icon: <LinearCity className="h-5 w-5" />, value: 'هتل' },
        { icon: <AdCardLandAreaIcon className="h-5 w-5" />, value: ad.landArea || ad.area },
        { icon: <AdCardDocumentIcon className="h-5 w-5" />, value: ad.documentType },
      ]
      break

    // === اجاره ===
    case 'rent-apartment':
      items = [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: ad.area },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <AdCardYearIcon className="h-5 w-5" />, value: ad.year },
      ]
      break

    case 'rent-villa-house':
      items = [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: ad.area },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <AdCardYearIcon className="h-5 w-5" />, value: ad.year },
      ]
      break

    case 'rent-hotel':
      items = [
        { icon: <LinearCity className="h-5 w-5" />, value: 'هتل' },
        { icon: <AdCardLandAreaIcon className="h-5 w-5" />, value: ad.landArea || ad.area },
        { icon: <AdCardDocumentIcon className="h-5 w-5" />, value: ad.documentType },
      ]
      break

    case 'rent-office':
      items = [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: ad.area },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <LinearFloor className="h-5 w-5" />, value: ad.floor },
      ]
      break

    case 'rent-commercial':
      items = [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: ad.area },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <LinearFloor className="h-5 w-5" />, value: ad.floor },
      ]
      break

    case 'rent-factory':
      items = [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: ad.area },
        { icon: <AdCardLandAreaIcon className="h-5 w-5" />, value: ad.buildingArea || ad.landArea },
        { icon: <AdCardLocationIcon className="h-5 w-5" />, value: ad.landPosition },
      ]
      break

    // === اجاره روزانه ===
    case 'daily-apartment-suite':
      items = [
        { icon: <LinearApartment className="h-5 w-5" />, value: 'آپارتمان' },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: ad.area },
      ]
      break

    case 'daily-garden-villa':
      items = [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: ad.area },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <AdCardCapacityIcon className="h-5 w-5" />, value: ad.capacity },
      ]
      break

    case 'daily-hotel':
      items = [
        { icon: <LinearCity className="h-5 w-5" />, value: 'هتل' },
        { icon: <LinearStar className="h-5 w-5 text-warning fill-warning" />, value: ad.stars },
        { icon: <LinearCalendar className="h-5 w-5" />, value: ad.rentalPeriod },
      ]
      break

    case 'daily-office-booth':
      items = [
        { icon: <LinearCity className="h-5 w-5" />, value: 'اتاق کار خصوصی' },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: ad.area },
      ]
      break

    // === پیش‌فروش و مشارکت ===
    case 'project-presale':
      items = [
        { icon: <LinearConstruction className="h-5 w-5" />, value: ad.projectType || 'مسکونی' },
        { icon: <LinearFloor className="h-5 w-5" />, value: ad.totalFloors },
        { icon: <LinearApartment className="h-5 w-5" />, value: ad.totalUnits },
      ]
      break

    case 'project-partnership':
      items = [
        { icon: <AdCardLandAreaIcon className="h-5 w-5" />, value: ad.landArea || ad.area },
        { icon: <AdCardLocationIcon className="h-5 w-5" />, value: ad.landPosition },
        { icon: <LinearSettingBuilding className="h-5 w-5" />, value: ad.currentStatus },
      ]
      break

    default:
      items = [
        { icon: <AdCardAreaIcon className="h-5 w-5" />, value: ad.area },
        { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
        { icon: <AdCardYearIcon className="h-5 w-5" />, value: ad.year },
      ]
      break
  }

  return items.filter(
    (item): item is AdCardPropertyItem => Boolean(item.value && item.value.trim() && item.value.trim() !== '-'),
  )
}

function PropertyRow({ ad, className = '' }: { ad: AdCardData; className?: string }) {
  const items = getAdCardProperties(ad)

  if (items.length === 0) return null

  return (
    <div className={`flex items-center justify-start font-medium leading-5 text-on-surface [direction:rtl] ${className}`}>
      {items.map((item, index) => (
        <PropertyItem key={index} icon={item.icon} value={item.value} />
      ))}
    </div>
  )
}

function PropertyItem({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <Typography as="span" variant="body" size="medium" weight="medium" className="inline-flex items-center gap-1.5 whitespace-nowrap text-on-surface-var">
      {icon}
      <Typography as="span" variant="body" size="medium" weight="medium" className="text-on-surface">{value}</Typography>
    </Typography>
  )
}

function MapPreviewImages({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const visibleImages = images.length > 0 ? images : [null]

  return (
    <div className="flex h-[92px] w-full gap-3 overflow-hidden rounded-xl" dir="rtl">
      {visibleImages.map((src, index) => (
        <div
          key={src ? `${src}-${index}` : `no-image-${index}`}
          className="relative h-[92px] w-[140px] shrink-0 overflow-hidden rounded-xl bg-primary-container"
        >
          <div className="absolute inset-0 grid place-items-center text-outline" aria-hidden="true">
            <LinearImage className="h-8 w-8" />
          </div>
          {src ? (
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src={src}
              alt={index === 0 ? title : ''}
              draggable={false}
              loading={index === 0 ? 'eager' : 'lazy'}
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  )
}

function getStatusBadgeClassName(status: string) {
  const normalizedStatus = status
    .trim()
    .toLowerCase()
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\u200c/g, ' ')

  // 1. قرمز (رد شده، حذف شده، منقضی شده، غیرفعال) - مطمئن می‌شویم شامل پرداخت نیست
  if (
    !normalizedStatus.includes('پرداخت') &&
    !normalizedStatus.includes('payment') &&
    (
      normalizedStatus.includes('رد') ||
      normalizedStatus.includes('حذف') ||
      normalizedStatus.includes('انقضا') ||
      normalizedStatus.includes('منقض') ||
      normalizedStatus.includes('غیر فعال') ||
      normalizedStatus.includes('غیرفعال') ||
      normalizedStatus.includes('reject') ||
      normalizedStatus.includes('delete') ||
      normalizedStatus.includes('expire') ||
      normalizedStatus === '-1' ||
      normalizedStatus === '-2' ||
      normalizedStatus === '-3'
    )
  ) {
    return 'bg-error-container text-error'
  }

  // 2. نارنجی (در انتظار پرداخت، در انتظار تایید، بررسی، ویرایش، اصلاح)
  if (
    normalizedStatus.includes('پرداخت') ||
    normalizedStatus.includes('payment') ||
    normalizedStatus.includes('نیمه') ||
    normalizedStatus.includes('incomplete') ||
    normalizedStatus.includes('انتظار') ||
    normalizedStatus.includes('بررسی') ||
    normalizedStatus.includes('ویرایش') ||
    normalizedStatus.includes('اصلاح') ||
    normalizedStatus.includes('pending') ||
    normalizedStatus.includes('wait') ||
    normalizedStatus === '0' ||
    normalizedStatus === '1' ||
    normalizedStatus === '2'
  ) {
    return 'bg-warning-container text-warning'
  }

  // 3. سبز (تایید شده، تایید، منتشر شده، فعال)
  if (
    normalizedStatus.includes('منتشر') ||
    normalizedStatus.includes('فعال') ||
    normalizedStatus.includes('تایید') ||
    normalizedStatus.includes('publish') ||
    normalizedStatus.includes('approved') ||
    normalizedStatus === 'accepted' ||
    normalizedStatus === '3'
  ) {
    return 'bg-tertiary-container text-tertiary'
  }

  return 'bg-surface-container-high text-on-surface'
}
