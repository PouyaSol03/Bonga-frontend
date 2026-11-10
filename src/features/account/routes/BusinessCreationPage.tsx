import { useNavigate } from "react-router";
import { useState } from "react";
import {
  BusinessCreationShell,
  BusinessHero,
  BusinessTypeCard,
  getBusinessTypePath, type BusinessType 
} from "../businessCreationShared";

import { useMyProfileQuery } from "../api/account.hooks";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import LinearBuilding from "../../../shared/icons/LinearBuilding";
import LinearUserSolid from "../../../shared/icons/LinearUserSolid";
import LinearInformation from "../../../shared/icons/LinearInformation";

export function BusinessCreationPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<BusinessType>("agency");
  const { data: profile } = useMyProfileQuery();
  const isAgencyPending = Boolean(
    profile?.agency_id &&
    (profile?.agency_status === 0 ||
      profile?.agency_status === "0" ||
      profile?.agency_status === "wait" ||
      String(profile?.agency_status).toLowerCase() === "wait"),
  );

  const handleNext = () => {
    if (isAgencyPending) return;
    navigate(getBusinessTypePath(selectedType));
  };

  return (
    <BusinessCreationShell
      bottomBar={
        <div className="flex items-center justify-end px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
          <Button
            unstyled
            className="bg-primary text-on-primary inline-flex h-10 min-w-[156px] items-center justify-center gap-2 rounded-[10px] px-5 text-sm leading-5 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isAgencyPending}
            onClick={handleNext}
            type="button"
          >
            <Typography as="span" variant="label" size="medium" weight="medium">
              مرحله بعد
            </Typography>
            <LinearArrowLeft1 aria-hidden="true" className="h-5 w-5" />
          </Button>
        </div>
      }
    >
      <BusinessHero infoType={selectedType} showInfoButton />

      {isAgencyPending ? (
        <div className="border-warning-container bg-warning-container/20 mx-4 mt-4 flex items-start gap-3 rounded-2xl border p-4 text-right">
          <LinearInformation className="text-warning mt-0.5 h-6 w-6 shrink-0" />
          <div className="min-w-0 flex-1">
            <Typography
              as="p"
              variant="title"
              size="small"
              weight="semibold"
              className="text-warning m-0 text-sm font-semibold"
            >
              در انتظار ادمین برای تایید کسب و کار شما
            </Typography>
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="text-on-surface-var m-0 mt-1 text-xs leading-5"
            >
              درخواست قبلی شما برای ثبت کسب‌وکار ثبت شده و در صف بررسی ادمین قرار دارد. تا زمان
              بررسی و تایید آن، امکان ایجاد کسب‌وکار جدید وجود ندارد.
            </Typography>
          </div>
        </div>
      ) : null}

      <section className="mt-14 px-4">
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-on-surface m-0 text-right text-base leading-6 font-semibold"
        >
          انتخاب کسب و کار
        </Typography>

        <div className="mt-6 space-y-6">
          <BusinessTypeCard
            badge="رایگان"
            icon={<LinearBuilding aria-hidden="true" className="h-6 w-6 shrink-0" />}
            isSelected={selectedType === "agency"}
            label="آژانس املاک"
            onClick={() => setSelectedType("agency")}
          />
          <BusinessTypeCard
            icon={<LinearUserSolid aria-hidden="true" className="h-6 w-6 shrink-0" />}
            isSelected={selectedType === "independent-consultant"}
            label="مشاور مستقل"
            onClick={() => setSelectedType("independent-consultant")}
          />
        </div>
      </section>
    </BusinessCreationShell>
  );
}
