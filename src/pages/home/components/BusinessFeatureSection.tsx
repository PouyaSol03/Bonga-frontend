import { pushRoute } from "../../../app/router/navigation";
import LinearArrowLeft2 from "../../../shared/icons/LinearArrowLeft2";
import LinearCrm from "../../../shared/icons/LinearCrm";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";

function CrmBadgeIcon() {
  return (
    <div
      aria-hidden="true"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary/8 text-secondary"
    >
      <LinearCrm className="w-8 h-8"/>
    </div>
  );
}

export function BusinessFeatureSection() {
  return (
    <section
      className="border-t-[16px] border-[#f0f0f0] bg-white px-4 pb-4 pt-4"
      aria-labelledby="business-feature-title"
    >
      <div className="flex items-start gap-2">
        <CrmBadgeIcon />

        <div className="min-w-0 flex-1 text-right">
          <Typography
            as="p"
            variant="title"
            size="medium"
            weight="semibold"
            id="business-feature-title"
            className="m-0 text-on-surface"
          >
            سامانه هوشمند کسب‌وکار املاک
          </Typography>

          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="m-0 text-on-surface-var"
          >
            مدیریت آگهی‌ها، مشتریان و معاملات در یک پنل اختصاصی برای آژانس‌ها و مشاوران املاک.
          </Typography>
        </div>
      </div>

      <img
        src='./images/home/business-feature.png'
        alt="نمایی از پنل مدیریت کسب‌وکار املاک"
        className="mt-4 aspect-328/173 w-full rounded-2xl object-cover"
        draggable={false}
      />

      <div className="mt-4 grid grid-cols-2 gap-4 [direction:ltr]">
        <Button
          className="w-full [direction:rtl]"
          size="x-medium"
          trailingIcon={<LinearArrowLeft2 className="h-5 w-5" />}
          onClick={() => pushRoute("/account/business/create")}
        >
          ایجاد کسب‌وکار
        </Button>

        <Button
          className="w-full [direction:rtl]"
          size="x-medium"
          variant="secondary"
          trailingIcon={<LinearArrowLeft2 className="h-5 w-5" />}
          onClick={() => pushRoute("/account/about")}
        >
          مشاهده امکانات
        </Button>
      </div>
    </section>
  );
}
