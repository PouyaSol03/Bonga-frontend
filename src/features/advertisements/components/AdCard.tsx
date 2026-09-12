import { Typography } from "../../../shared/ui/Typography";

import type { ReactNode } from 'react'
import './AdCard.css'

import { RouteLink } from '../../../shared/navigation/RouteLink'
import LinearImage from '../../../shared/icons/LinearImage'
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
            {ad.pricePrimary}
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
}: {
  ad: AdCardData
  className?: string
  imageMeta?: ReactNode
  imageLoading?: 'eager' | 'lazy'
  showAgency?: boolean
  showImageCount: boolean
  showStatusBadge: boolean
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
        {hasSecondaryPrice ? <Typography as="span" variant="body" size="medium" weight="regular" className="h-6 w-px bg-outline-var" aria-hidden="true" /> : null}
        {hasSecondaryPrice ? (
          <PriceItem label={ad.priceLabelSecondary} price={ad.priceSecondary} />
        ) : null}
      </div>

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

function PriceItem({ label, price }: { label: string; price: string }) {
  return (
    <Typography as="span" variant="body" size="medium" weight="regular" className="inline-flex min-w-0 items-center gap-0.5">
      {label ? <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium leading-5 text-outline">{label}</Typography> : null}
      <Typography as="p" variant="title" size="medium" weight="semibold" className="whitespace-nowrap text-primary">{price}</Typography>
      <AdCardTomanIcon className="h-5 w-5 shrink-0 text-primary" />
    </Typography>
  )
}

function PropertyRow({ ad, className = '' }: { ad: AdCardData; className?: string }) {
  const items = [
    { icon: <AdCardAreaIcon className="h-5 w-5" />, value: ad.area },
    { icon: <AdCardRoomsIcon className="h-5 w-5" />, value: ad.rooms },
    { icon: <AdCardYearIcon className="h-5 w-5" />, value: ad.year },
  ].filter((item) => item.value && item.value.trim() && item.value.trim() !== '-')

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
