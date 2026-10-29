import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";
import LinearUserConfirmation from "../../../../shared/icons/LinearUserConfirmation";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import { formatPersianMonthYear } from "./identityHelpers";

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
