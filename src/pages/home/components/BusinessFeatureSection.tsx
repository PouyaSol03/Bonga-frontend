import { pushRoute } from "../../../app/router/navigation";
import LinearArrowLeft2 from "../../../shared/icons/LinearArrowLeft2";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";

function CrmBadgeIcon() {
  return (
    <div
      aria-hidden="true"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#4B507014] text-[#4B5070]"
    >
      <svg
        className="h-8 w-8"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.375 20.833 21.25 25M16 25v-5M16 20v-5h3.5a2.5 2.5 0 0 1 0 5H16Zm19 5V15l-4 5.667L27 15v10M11 17c-.556-1.196-1.595-2-2.785-2C6.44 15 5 16.79 5 19v2c0 2.21 1.44 4 3.215 4 1.19 0 2.229-.804 2.785-2M10 31.18A14.93 14.93 0 0 0 20 35a14.93 14.93 0 0 0 10-3.82L26.667 30M30 8.82A14.93 14.93 0 0 0 20 5a14.93 14.93 0 0 0-10 3.82L13.333 10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
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
