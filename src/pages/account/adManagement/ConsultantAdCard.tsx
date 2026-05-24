import { RouteLink } from "../../../routes/RouteLink";
import { CardSpriteIcon } from "./AdManagementIcons";
import type { AdManagementRouteState, ConsultantAd } from "./adManagementData";

type ConsultantAdCardProps = {
  ad: ConsultantAd;
  state?: AdManagementRouteState;
  to?: string;
};

export function ConsultantAdCard({ ad, state, to }: ConsultantAdCardProps) {
  const card = (
    <article className="bg-white px-4 py-4">
      <div className="relative aspect-[328/219.3] overflow-hidden rounded-2xl bg-[#ebebeb]">
        <img alt="" className="absolute inset-x-0 top-0 w-full max-w-none" src={ad.image} />
      </div>

      <div className="pt-3 text-right [direction:rtl]">
        <PriceRow prices={ad.prices} />

        <div className="mt-3 flex items-center justify-end gap-[22px] [direction:ltr]">
          <PropertyMetric icon="year" label={ad.year} />
          <PropertyMetric icon="rooms" label={ad.rooms} />
          <PropertyMetric icon="area" label={ad.area} />
        </div>

        <h2 className="m-0 mt-3 text-right text-sm font-medium leading-5 text-[#1a1a1a]">
          {ad.title}
        </h2>

        {ad.actions ? (
          <div className="mt-3 flex h-6 items-center justify-start gap-2 [direction:rtl]">
            <span className="text-sm font-normal leading-5 text-[#808080]">{ad.time}</span>
            <span className="h-6 w-px bg-[#cccccc]" aria-hidden="true" />
            <span className="h-6 rounded-lg border border-[#11a366] px-2 text-xs font-medium leading-4 text-[#11a366]">
              بروزرسانی
            </span>
            <span className="h-6 rounded-lg border border-[#ff6d00] px-2 text-xs font-medium leading-4 text-[#ff6d00]">
              فوری
            </span>
          </div>
        ) : (
          <p className="m-0 mt-3 flex h-6 items-center justify-start text-right text-sm font-normal leading-5 text-[#808080]">
            {ad.time}
          </p>
        )}
      </div>
    </article>
  );

  return to ? (
    <RouteLink aria-label={`انتشار آگهی ${ad.title}`} className="block text-inherit no-underline" state={state} to={to}>
      {card}
    </RouteLink>
  ) : (
    card
  );
}

function PriceRow({ prices }: { prices: ConsultantAd["prices"] }) {
  return (
    <div className="flex h-6 items-center justify-start gap-2 [direction:rtl]">
      {prices.map((price, index) => (
        <div className="contents" key={`${price.label ?? "price"}-${price.value}`}>
          {index > 0 ? <span className="h-6 w-px bg-[#cccccc]" aria-hidden="true" /> : null}
          <span className="inline-flex items-center gap-0.5 [direction:rtl]">
            {price.label ? <span className="text-sm font-medium leading-5 text-[#808080]">{price.label}</span> : null}
            <strong className="text-base font-semibold leading-6 text-[#0048c4]">{price.value}</strong>
            <CardSpriteIcon icon="tooman" />
          </span>
        </div>
      ))}
    </div>
  );
}

function PropertyMetric({
  icon,
  label,
}: {
  icon: "area" | "rooms" | "year";
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium leading-5 text-[#1a1a1a] [direction:ltr]">
      <span dir="rtl">{label}</span>
      <CardSpriteIcon icon={icon} />
    </span>
  );
}
