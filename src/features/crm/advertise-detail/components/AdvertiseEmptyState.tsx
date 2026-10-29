import { useNavigate } from "react-router";
import LinearArrowRight1 from "../../../../shared/icons/LinearArrowRight1";
import LinearInformation from "../../../../shared/icons/LinearInformation";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";

export function AdvertiseEmptyState() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto grid min-h-[420px] w-full place-items-center rounded-xl bg-white p-8 text-center">
      <div className="mx-auto w-full max-w-[520px]">
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]"
        >
          <LinearInformation className="h-7 w-7" />
        </Typography>
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="m-0 mt-4 text-lg font-bold text-[#1a1a1a]"
        >
          اطلاعات آگهی دریافت نشد
        </Typography>
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="m-0 mt-2 text-sm text-[#808080]"
        >
          پاسخ قابل نمایشی از سرویس جزئیات آگهی دریافت نشد.
        </Typography>
        <Button
          unstyled
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#0048c4] px-4 text-sm font-bold text-white no-underline"
          onClick={() =>
            window.history.state?.idx > 0
              ? navigate(-1)
              : navigate("/crm/advertises", { replace: true })
          }
          type="button"
        >
          <LinearArrowRight1 className="h-5 w-5" />
          بازگشت به آگهی‌ها
        </Button>
      </div>
    </section>
  );
}
