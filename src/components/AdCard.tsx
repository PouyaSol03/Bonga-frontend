export type AdCardData = {
  id: number
  title: string
  agency: string
  status: string
  statusCount: string
  priceLabelPrimary: string
  pricePrimary: string
  priceLabelSecondary: string
  priceSecondary: string
  area: string
  rooms: string
  year: string
  timeAndLocation: string
  imageClassName: string
  badges: string[]
}

export function AdCard({ ad }: { ad: AdCardData }) {
  const hasSecondaryPrice = ad.priceLabelSecondary && ad.priceSecondary

  return (
    <article className="flex flex-col overflow-hidden border-b-8 border-[#f0f0f0] bg-white p-3 min-[390px]:p-4">
      <div className="shrink-0">
        <div className={`ad-card__image relative min-h-[184px] overflow-hidden rounded-2xl bg-[#dbe5ff] bg-cover min-[390px]:min-h-[219px] ${ad.imageClassName}`}>
          <div className="absolute right-2 top-2 z-2 inline-flex h-6 min-w-11 items-center justify-center gap-1.5 rounded-lg bg-[#1a1a1a85] px-2 py-1 font-[DanaFaNum,Tahoma,sans-serif] text-xs font-semibold leading-4 text-white min-[390px]:h-7 min-[390px]:min-w-[52px] min-[390px]:gap-[7px] min-[390px]:text-sm min-[390px]:leading-5" aria-hidden="true">
            <span>{ad.statusCount}</span>
            <span className="ad-card__action-icon" />
          </div>
          {ad.agency && <div className="ad-card__agency-name absolute bottom-2 right-2 z-[1] inline-flex max-w-[calc(100%-16px)] items-center gap-2 whitespace-nowrap rounded-lg bg-[#1a1a1a9e] px-2 py-1.5 text-xs font-medium leading-4 text-white min-[390px]:px-2.5 min-[390px]:py-2 min-[390px]:text-[13px] min-[390px]:leading-[18px]">{ad.agency}</div>}
        </div>
      </div>
      <div className="flex flex-col gap-2.5 pt-3 min-[390px]:gap-3 min-[390px]:pt-3.5">
        <div className="flex items-center justify-start gap-2 [direction:rtl]">
          <div className="ad-card__price-item inline-flex min-w-0 items-center gap-1">
            {ad.priceLabelPrimary && <span className="text-sm font-medium leading-5 text-[#808080]">{ad.priceLabelPrimary}</span>}
            <strong className="whitespace-nowrap text-sm font-bold leading-5 text-[#0048c4] min-[390px]:text-base min-[390px]:leading-6">{ad.pricePrimary}</strong>
          </div>
          {hasSecondaryPrice && <span className="h-6 w-px bg-[#cccccc]" aria-hidden="true" />}
          {hasSecondaryPrice && (
            <div className="ad-card__price-item inline-flex min-w-0 items-center gap-1">
              <span className="text-sm font-medium leading-5 text-[#808080]">{ad.priceLabelSecondary}</span>
              <strong className="whitespace-nowrap text-sm font-bold leading-5 text-[#0048c4] min-[390px]:text-base min-[390px]:leading-6">{ad.priceSecondary}</strong>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-start gap-3 text-sm font-medium leading-5 text-[#1a1a1a] [direction:rtl] min-[390px]:gap-[22px]">
          <span className="ad-card__property ad-card__property--area">{ad.area}</span>
          <span className="ad-card__property ad-card__property--rooms">{ad.rooms}</span>
          <span className="ad-card__property ad-card__property--year">{ad.year}</span>
        </div>

        <h3 className="m-0 text-right text-sm font-medium leading-5 text-[#1a1a1a]">{ad.title}</h3>

        <div className="flex min-h-6 flex-row items-center justify-start gap-2 [direction:rtl]">
          <div className="ad-card__badges inline-flex items-center gap-1">
            {ad.badges.map((badge) => (
              <span className={`whitespace-nowrap rounded-lg border px-2 py-[3px] text-xs leading-4 ${badge === 'فوری' ? 'border-[#ff6d00] text-[#ff6d00]' : 'border-[#11a366] text-[#11a366]'}`} key={badge}>
                {badge}
              </span>
            ))}
          </div>
          <span className="min-w-0 whitespace-nowrap text-right text-xs font-normal leading-4 text-[#808080] min-[390px]:text-sm min-[390px]:leading-5">{ad.timeAndLocation}</span>
        </div>
      </div>
    </article>
  )
}
