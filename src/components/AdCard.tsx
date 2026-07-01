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

type AdCardProps = {
  ad: AdCardData
  showStatusBadge?: boolean
  state?: unknown
  to?: string
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

export function AdCard({ ad, showStatusBadge = false, state, to = `/ads/${ad.id}` }: AdCardProps) {
  const hasSecondaryPrice = Boolean(ad.priceLabelSecondary && ad.priceSecondary)
  const linkState = getAdNavigationState(to, state)

  return (
    <RouteLink
      aria-label={`مشاهده آگهی ${ad.title}`}
      className="block text-inherit no-underline focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
      state={linkState}
      to={to}
    >
      <article className="flex flex-col bg-white px-4 py-4 text-right [direction:rtl]">
        <div
          className={`ad-card__image relative aspect-[328/219.3] shrink-0 overflow-hidden rounded-2xl bg-[#dbe5ff] bg-cover ${ad.imageClassName}`}
          style={ad.imageUrl ? { backgroundImage: `url(${ad.imageUrl})` } : undefined}
        >
          <div className="absolute right-2 top-2 z-2 inline-flex h-7 items-center gap-1.5 rounded-lg bg-[#1a1a1a99] px-2 text-sm font-medium leading-5 text-[#fafafa]" aria-label={`${ad.imageCount} تصویر`}>
            <AdCardAlbumIcon className="h-5 w-5 shrink-0" />
            <span>{ad.imageCount}</span>
          </div>
          {showStatusBadge && ad.status ? (
            <span className={`absolute left-2 top-2 z-2 inline-flex h-7 max-w-[calc(100%-92px)] items-center rounded-lg px-2 text-xs font-medium leading-4 ${getStatusBadgeClassName(ad.status)}`}>
              <span className="truncate">{ad.status}</span>
            </span>
          ) : null}
          {ad.agency && (
            <div className="absolute bottom-2 right-2 z-[1] inline-flex h-7 max-w-[calc(100%-16px)] items-center gap-2 rounded-lg bg-[#1a1a1a99] px-2 text-sm font-medium leading-5 text-[#fafafa]">
              <AdCardOwnerIcon className="h-5 w-5 shrink-0" />
              <span className="truncate">{ad.agency}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col pt-3">
          <div className="flex h-6 items-center justify-start gap-2">
            <PriceItem label={ad.priceLabelPrimary} price={ad.pricePrimary} />
            {hasSecondaryPrice && <span className="h-6 w-px bg-[#cccccc]" aria-hidden="true" />}
            {hasSecondaryPrice && (
              <PriceItem label={ad.priceLabelSecondary} price={ad.priceSecondary} />
            )}
          </div>

          <div className="mt-3 flex h-5 items-center justify-start gap-[22px] text-sm font-medium leading-5 text-[#1a1a1a]">
            <PropertyItem icon={<AdCardAreaIcon className="h-5 w-5" />} value={ad.area} />
            <PropertyItem icon={<AdCardRoomsIcon className="h-5 w-5" />} value={ad.rooms} />
            <PropertyItem icon={<AdCardYearIcon className="h-5 w-5" />} value={ad.year} />
          </div>

          <h3 className="m-0 mt-3 truncate text-right text-sm font-medium leading-5 text-[#1a1a1a]">
            {ad.title}
          </h3>

          <div className="mt-3 flex h-6 items-center justify-start gap-2">
            {ad.badges.map((badge) => (
              <span className={`h-6 whitespace-nowrap rounded-lg border px-2 py-[3px] text-xs font-medium leading-4 ${badge === 'فوری' ? 'border-[#FF6D00] bg-[#FFF8E1] text-[#FF6D00]' : 'border-[#11A366] bg-[#E6F6ED] text-[#11a366]'}`} key={badge}>
                  {badge}
              </span>
            ))}
            {ad.badges.length > 0 && <span className="h-6 w-px bg-[#cccccc]" aria-hidden="true" />}
            <span className="min-w-0 truncate text-sm font-normal leading-5 text-[#808080]">{ad.timeAndLocation}</span>
          </div>
        </div>
      </article>
    </RouteLink>
  )
}

function PriceItem({ label, price }: { label: string; price: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-0.5">
      {label && <span className="text-sm font-medium leading-5 text-[#808080]">{label}</span>}
      <strong className="whitespace-nowrap text-base font-semibold leading-6 text-[#0048c4]">{price}</strong>
      <AdCardTomanIcon className="h-5 w-5 shrink-0 text-[#0048c4]" />
    </span>
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

function getStatusBadgeClassName(status: string) {
  const normalizedStatus = status
    .trim()
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/‌/g, ' ')

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
