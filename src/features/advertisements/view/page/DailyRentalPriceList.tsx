import type { ViewAdDetails } from ".././viewAdTypes";
import { AdCardTomanIcon } from "../../components/AdCardIcons";
import { Typography } from "../../../../shared/ui/Typography";

export function DailyRentalPriceList({ details }: { details: ViewAdDetails }) {
  const items = [
    { label: "روزهای عادی:", value: details.normalDailyPrice || details.totalPrice },
    { label: "آخر هفته:", value: details.weekendDailyPrice },
    { label: "روزهای خاص:", value: details.specialDailyPrice },
    { label: "هزینه هر نفر اضافه:", value: details.extraPersonPrice },
  ].filter((item) => Boolean(item.value && item.value !== "-"));

  if (!items.length) return null;

  return (
    <div className="w-full">
      <div className="bg-outline-var my-4 h-px w-full" />
      <div>
        {items.map((item, index) => (
          <div key={item.label}>
            {index > 0 ? <div className="border-outline-var my-4 border-t border-dashed" /> : null}
            <div className="flex items-center gap-x-9 [direction:rtl]">
              <Typography
                as="span"
                variant="label"
                size="medium"
                weight="medium"
                className="text-outline w-38"
              >
                {item.label}
              </Typography>
              <div className="flex items-center gap-1 [direction:rtl]">
                <Typography
                  as="span"
                  variant="label"
                  size="large"
                  weight="semibold"
                  className="text-on-surface flex items-center gap-x-1"
                >
                  {item.value}
                  <AdCardTomanIcon className="text-on-surface-var h-5 w-5" />
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
