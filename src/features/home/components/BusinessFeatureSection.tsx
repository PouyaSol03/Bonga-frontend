import { useState } from "react";
import { useNavigate } from "react-router";
import { getStoredAuthSession } from "../../../shared/auth/auth-storage";
import LinearArrowLeft2 from "../../../shared/icons/LinearArrowLeft2";
import LinearCrm from "../../../shared/icons/LinearCrm";
import { DASHBOARD_ROLES } from "../../../shared/constants/roles.constants";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";

function CrmBadgeIcon() {
  return (
    <div
      aria-hidden="true"
      className="bg-secondary/8 text-secondary grid h-10 w-10 shrink-0 place-items-center rounded-lg"
    >
      <LinearCrm className="h-8 w-8" />
    </div>
  );
}

export function BusinessFeatureSection() {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleBusinessClick = () => {
    const authSession = getStoredAuthSession();
    const hasBusinessRole = authSession?.roles.some((role) => DASHBOARD_ROLES.includes(role.slug));

    navigate(hasBusinessRole ? "/account" : "/account/business/create");
  };

  return (
    <section
      className="border-surface-container bg-surface-container-lowest border-t-[16px] px-4 pt-4 pb-4"
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
            className="text-on-surface m-0"
          >
            سامانه هوشمند کسب‌وکار املاک
          </Typography>

          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-on-surface-var m-0"
          >
            مدیریت آگهی‌ها، مشتریان و معاملات در یک پنل اختصاصی برای آژانس‌ها و مشاوران املاک.
          </Typography>
        </div>
      </div>

      <div className="bg-surface-container relative mt-4 aspect-328/173 w-full overflow-hidden rounded-2xl">
        {!imageLoaded && (
          <div className="bg-surface-container absolute inset-0 animate-pulse rounded-2xl" />
        )}
        <img
          src="/images/home/business-feature.webp"
          alt="نمایی از پنل مدیریت کسب‌وکار املاک"
          width={1312}
          height={692}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`aspect-328/173 w-full rounded-2xl object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          draggable={false}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 [direction:ltr]">
        <Button
          className="w-full [direction:rtl]"
          size="x-medium"
          trailingIcon={<LinearArrowLeft2 className="h-5 w-5" />}
          onClick={handleBusinessClick}
        >
          ایجاد کسب‌وکار
        </Button>

        <Button
          className="w-full [direction:rtl]"
          size="x-medium"
          variant="secondary"
          trailingIcon={<LinearArrowLeft2 className="h-5 w-5" />}
          onClick={() => navigate("/account/business/create/info?type=agency")}
        >
          مشاهده امکانات
        </Button>
      </div>
    </section>
  );
}
