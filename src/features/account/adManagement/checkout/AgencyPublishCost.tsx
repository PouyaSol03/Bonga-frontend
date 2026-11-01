import { ChoiceIndicator } from "../../../../shared/ui/Choice";
import { Typography } from "../../../../shared/ui/Typography";
export function AgencyPublishCost({ publishCostLabel }: { publishCostLabel: string }) {
  return (
    <>
      <div className="px-4 pt-5 pb-4" aria-label="هزینه ثبت آگهی">
        <div className="flex items-start justify-between gap-5 [direction:ltr]">
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-on-surface shrink-0 pt-1 text-sm leading-5 font-medium [direction:rtl]"
          >
            {publishCostLabel}
          </Typography>

          <Typography
            as="span"
            variant="label"
            size="large"
            weight="semibold"
            className="flex min-w-0 flex-1 items-center justify-start gap-2 text-right text-base leading-6 font-semibold [direction:rtl]"
          >
            <ChoiceIndicator checked className="h-5 w-5 rounded-[4px]" disabled />
            هزینه ثبت آگهی
          </Typography>
        </div>

        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="text-on-surface-var m-0 mt-3 text-right text-sm leading-6 font-normal"
        >
          برای ثبت آگهی، باید هزینه انتشار را پرداخت کنید.
        </Typography>
      </div>

      <div className="border-outline-var/40 mx-4 border-t" />
    </>
  );
}
