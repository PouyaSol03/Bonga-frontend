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
    <article className="flex flex-col overflow-hidden border-b-8 border-[#f0f0f0] bg-white p-4">
      <div className="shrink-0">
        <div className={`ad-card__image relative min-h-[219px] overflow-hidden rounded-2xl bg-[#dbe5ff] bg-cover ${ad.imageClassName}`}>
          <div className="absolute right-2 top-2 z-2 inline-flex h-7 min-w-[52px] items-center justify-center gap-[7px] rounded-lg bg-[#1a1a1a85] px-2 py-1 font-[DanaFaNum,Tahoma,sans-serif] text-sm font-semibold leading-5 text-white" aria-hidden="true">
            <span>{ad.statusCount}</span>
            <span className="ad-card__action-icon" />
          </div>
          {ad.agency && <div className="ad-card__agency-name absolute bottom-2 right-2 z-[1] inline-flex max-w-[calc(100%-16px)] items-center gap-2 whitespace-nowrap rounded-lg bg-[#1a1a1a9e] px-2.5 py-2 text-[13px] font-medium leading-[18px] text-white">{ad.agency}</div>}
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-3.5">
        <div className="flex items-center justify-start gap-2 [direction:rtl]">
          <div className="ad-card__price-item inline-flex min-w-0 items-center gap-1">
            {ad.priceLabelPrimary && <span className="text-sm font-medium leading-5 text-[#808080]">{ad.priceLabelPrimary}</span>}
            <strong className="whitespace-nowrap text-base font-bold leading-6 text-[#0048c4]">{ad.pricePrimary}</strong>
          </div>
          {hasSecondaryPrice && <span className="h-6 w-px bg-[#cccccc]" aria-hidden="true" />}
          {hasSecondaryPrice && (
            <div className="ad-card__price-item inline-flex min-w-0 items-center gap-1">
              <span className="text-sm font-medium leading-5 text-[#808080]">{ad.priceLabelSecondary}</span>
              <strong className="whitespace-nowrap text-base font-bold leading-6 text-[#0048c4]">{ad.priceSecondary}</strong>
            </div>
          )}
        </div>

        <div className="flex items-center justify-start gap-[22px] text-sm font-medium leading-5 text-[#1a1a1a] [direction:rtl]">
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
          <span className="min-w-0 whitespace-nowrap text-right text-sm font-normal leading-5 text-[#808080]">{ad.timeAndLocation}</span>
        </div>
      </div>
    </article>
  )
}
