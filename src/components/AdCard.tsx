import type { ReactNode } from 'react'

import { RouteLink } from '../routes/RouteLink'
import {
  AdCardAlbumIcon,
  AdCardAreaIcon,
  AdCardOwnerIcon,
  AdCardRoomsIcon,
  AdCardTomanIcon,
  AdCardYearIcon,
} from './AdCardIcons'

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
  area: string
  rooms: string
  year: string
  timeAndLocation: string
  imageClassName: string
  imageUrl?: string
  badges: string[]
}

type AdCardVariant = 'standard' | 'dashboard' | 'requestResult' | 'mapPreview'

type AdCardProps = {
  ad: AdCardData
  ariaLabel?: string
  className?: string
  imageAction?: ReactNode
  imageMeta?: ReactNode
  isSelected?: boolean
  mapPreviewFallbackImage?: string
  mapPreviewImages?: string[]
  mapSliderCardId?: number | string
  showBadges?: boolean
  showImageCount?: boolean
  showStatusBadge?: boolean
  state?: unknown
  to?: string
  topBadge?: ReactNode
  variant?: AdCardVariant
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
  isSelected = false,
  mapPreviewFallbackImage,
  mapPreviewImages = [],
  mapSliderCardId,
  showBadges = true,
  showImageCount = true,
  showStatusBadge = false,
  state,
  to = `/ads/${ad.id}`,
  topBadge,
  variant = 'standard',
}: AdCardProps) {
  const hasSecondaryPrice = Boolean(ad.priceLabelSecondary && ad.priceSecondary)
  const linkState = getAdNavigationState(to, state)

  if (variant === 'mapPreview') {
    const images = mapPreviewImages.length > 0
      ? mapPreviewImages
      : ad.imageUrl
        ? [ad.imageUrl]
        : mapPreviewFallbackImage
          ? [mapPreviewFallbackImage]
          : []

    return (
      <RouteLink
        aria-current={isSelected ? 'true' : undefined}
        className={`flex h-[216px] w-[min(360px,calc(100vw-28px))] shrink-0 snap-center flex-col overflow-hidden rounded-2xl bg-white p-3 text-right no-underline shadow-[0_4px_16px_rgba(0,0,0,0.10)] ${className}`}
        data-map-slider-card={mapSliderCardId === undefined ? undefined : String(mapSliderCardId)}
        dir="rtl"
        state={linkState}
        to={to}
      >
        <MapPreviewImages
          fallbackImage={mapPreviewFallbackImage}
          images={images}
          title={ad.title}
        />

        <div className="mt-2 flex min-h-5 items-baseline justify-start [direction:rtl]">
          <strong className="truncate text-base font-semibold leading-6 text-[#0048c4]">
            {ad.pricePrimary}
          </strong>
        </div>

        <PropertyRow className="mt-1.5 min-h-6 flex-wrap gap-3 text-[13px]" ad={ad} />

        <h3 className="mt-1.5 truncate text-right text-[15px] font-medium leading-6 text-[#1a1a1a]">
          {ad.title}
        </h3>
      </RouteLink>
    )
  }

  if (variant === 'requestResult') {
    return (
      <article className={`relative bg-white px-4 pb-4 pt-3 text-right [direction:rtl] ${className}`}>
        {topBadge}

        <div className="relative">
          <RouteLink
            aria-label={ariaLabel ?? `مشاهده آگهی ${ad.title}`}
            className="block text-inherit no-underline focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
            state={linkState}
            to={to}
          >
            <AdCardImage
              ad={ad}
              imageMeta={imageMeta}
              showImageCount={false}
              showStatusBadge={false}
            />
          </RouteLink>

          {imageAction}
        </div>

        <RouteLink
          aria-label={ariaLabel ?? `مشاهده آگهی ${ad.title}`}
          className="block text-inherit no-underline focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
          state={linkState}
          to={to}
        >
          <AdCardBody
            ad={ad}
            hasSecondaryPrice={hasSecondaryPrice}
            showBadges={false}
          />
        </RouteLink>
      </article>
    )
  }

  const isDashboard = variant === 'dashboard'

  return (
    <RouteLink
      aria-label={ariaLabel ?? `مشاهده آگهی ${ad.title}`}
      className={`block text-inherit no-underline focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440] ${isDashboard ? 'min-w-0' : ''} ${className}`}
      state={linkState}
      to={to}
    >
      <article className={isDashboard ? 'flex min-w-0 flex-col gap-4 text-right' : 'flex flex-col bg-white px-4 py-4 text-right [direction:rtl]'}>
        <AdCardImage
          ad={ad}
          className={isDashboard ? 'h-[224px] w-auto' : undefined}
          showImageCount={showImageCount}
          showStatusBadge={showStatusBadge}
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
  showImageCount,
  showStatusBadge,
}: {
  ad: AdCardData
  className?: string
  imageMeta?: ReactNode
  showImageCount: boolean
  showStatusBadge: boolean
}) {
  return (
    <div
      className={`ad-card__image relative aspect-[328/219.3] shrink-0 overflow-hidden rounded-2xl bg-[#dbe5ff] bg-cover bg-center ${ad.imageClassName} ${className}`}
      style={ad.imageUrl ? { backgroundImage: `url(${ad.imageUrl})` } : undefined}
    >
      {imageMeta}
      {showImageCount ? (
        <div className="absolute right-2 top-2 z-2 inline-flex h-7 items-center gap-1.5 rounded-lg bg-[#1a1a1a99] px-2 text-sm font-medium leading-5 text-[#fafafa]" aria-label={`${ad.imageCount} تصویر`}>
          <AdCardAlbumIcon className="h-5 w-5 shrink-0" />
          <span>{ad.imageCount}</span>
        </div>
      ) : null}
      {showStatusBadge && ad.status ? (
        <span className={`absolute left-2 top-2 z-2 inline-flex h-7 max-w-[calc(100%-92px)] items-center rounded-lg px-2 text-xs font-medium leading-4 ${getStatusBadgeClassName(ad.status)}`}>
          <span className="truncate">{ad.status}</span>
        </span>
      ) : null}
      {ad.agency ? (
        <div className="absolute bottom-2 right-2 z-[1] inline-flex h-7 max-w-[calc(100%-16px)] items-center gap-2 rounded-lg bg-[#1a1a1a99] px-2 text-sm font-medium leading-5 text-[#fafafa]">
          <AdCardOwnerIcon className="h-5 w-5 shrink-0" />
          <span className="truncate">{ad.agency}</span>
        </div>
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
  return (
    <div className={`flex flex-col pt-3 ${className}`}>
      <div className="flex h-6 items-center justify-start gap-2">
        <PriceItem label={ad.priceLabelPrimary} price={ad.pricePrimary} />
        {hasSecondaryPrice ? <span className="h-6 w-px bg-[#cccccc]" aria-hidden="true" /> : null}
        {hasSecondaryPrice ? (
          <PriceItem label={ad.priceLabelSecondary} price={ad.priceSecondary} />
        ) : null}
      </div>

      <PropertyRow className="mt-3 h-5 gap-[22px] text-sm" ad={ad} />

      <h3 className="m-0 mt-3 truncate text-right text-sm font-medium leading-5 text-[#1a1a1a]">
        {ad.title}
      </h3>

      <div className="mt-3 flex h-6 items-center justify-start gap-2">
        {showBadges ? ad.badges.map((badge) => (
          <span className={`h-6 whitespace-nowrap rounded-lg border px-2 py-[3px] text-xs font-medium leading-4 ${badge === 'فوری' ? 'border-[#FF6D00] bg-[#FFF8E1] text-[#FF6D00]' : 'border-[#11A366] bg-[#E6F6ED] text-[#11a366]'}`} key={badge}>
            {badge}
          </span>
        )) : null}
        {showBadges && ad.badges.length > 0 ? <span className="h-6 w-px bg-[#cccccc]" aria-hidden="true" /> : null}
        <span className="min-w-0 truncate text-sm font-normal leading-5 text-[#808080]">{ad.timeAndLocation}</span>
      </div>
    </div>
  )
}

function PriceItem({ label, price }: { label: string; price: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-0.5">
      {label ? <span className="text-sm font-medium leading-5 text-[#808080]">{label}</span> : null}
      <strong className="whitespace-nowrap text-base font-semibold leading-6 text-[#0048c4]">{price}</strong>
      <AdCardTomanIcon className="h-5 w-5 shrink-0 text-[#0048c4]" />
    </span>
  )
}

function PropertyRow({ ad, className = '' }: { ad: AdCardData; className?: string }) {
  return (
    <div className={`flex items-center justify-start font-medium leading-5 text-[#1a1a1a] [direction:rtl] ${className}`}>
      <PropertyItem icon={<AdCardAreaIcon className="h-5 w-5" />} value={ad.area} />
      <PropertyItem icon={<AdCardRoomsIcon className="h-5 w-5" />} value={ad.rooms} />
      <PropertyItem icon={<AdCardYearIcon className="h-5 w-5" />} value={ad.year} />
    </div>
  )
}

function PropertyItem({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[#4d4d4d]">
      {icon}
      <span className="text-[#1a1a1a]">{value}</span>
    </span>
  )
}

function MapPreviewImages({
  fallbackImage,
  images,
  title,
}: {
  fallbackImage?: string
  images: string[]
  title: string
}) {
  return (
    <div className="flex h-[92px] w-full gap-3 overflow-hidden rounded-xl" dir="rtl">
      {images.map((src, index) => (
        <img
          key={`${src}-${index}`}
          className="h-[92px] w-[140px] shrink-0 rounded-xl object-cover"
          src={src}
          alt={index === 0 ? title : ''}
          draggable={false}
          loading={index === 0 ? 'eager' : 'lazy'}
          onError={(event) => {
            if (!fallbackImage) return

            const target = event.currentTarget

            if (target.dataset.fallback === '1') return

            target.dataset.fallback = '1'
            target.src = fallbackImage
          }}
        />
      ))}
    </div>
  )
}

function getStatusBadgeClassName(status: string) {
  const normalizedStatus = status
    .trim()
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\u200c/g, ' ')

  if (
    normalizedStatus.includes('حذف') ||
    normalizedStatus.includes('انقضا') ||
    normalizedStatus.includes('منقض') ||
    normalizedStatus.includes('غیر فعال') ||
    normalizedStatus.includes('غیرفعال')
  ) {
    return 'bg-[#FFEBED] text-[#EE3623]'
  }

  if (
    normalizedStatus.includes('انتظار') ||
    normalizedStatus.includes('بررسی') ||
    normalizedStatus.includes('ویرایش') ||
    normalizedStatus.includes('اصلاح')
  ) {
    return 'bg-[#FFF8E1] text-[#FF6D00]'
  }

  if (
    normalizedStatus.includes('منتشر') ||
    normalizedStatus.includes('فعال') ||
    normalizedStatus.includes('تایید شده')
  ) {
    return 'bg-[#E6F6ED] text-[#11A366]'
  }

  return 'bg-[#4d4d4d] text-white'
}
