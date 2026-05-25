import { useState } from "react";
import { PageFrame } from "../../../app/PageFrame";
import { BottomSheet } from "../../../components/BottomSheet";
import { DemoNotice } from "../../../components/DemoNotice";
import { useDemoNotice } from "../../../hooks/useDemoNotice";
import { TopBar } from "../../../components/TopBar";
import { RouteLink } from "../../../routes/RouteLink";
import { ChevronLeftIcon, PublishedActionIcon } from "./AdManagementIcons";
import {
  adManagementPaths,
  getAdManagementRouteState,
  getSelectedConsultantAd,
} from "./adManagementData";

export function IndependentConsultantAdPublishedPage() {
  const ad = getSelectedConsultantAd();
  const [isSuccessOpen, setIsSuccessOpen] = useState(
    getAdManagementRouteState().showPaymentSuccess ?? false,
  );
  const [isDeleted, setIsDeleted] = useState(false);
  const { message, showNotice } = useDemoNotice();

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ tab: "status" }}
        backTo={adManagementPaths.root}
        className="[&_a]:text-[#1a1a1a]"
        title={isSuccessOpen ? "وضعیت آگهی" : "مدیریت آگهی"}
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <section className="shrink-0 bg-white px-4 pb-2 pt-4" aria-label={ad.title}>
          <div className="flex justify-start">
            <span className="inline-flex h-9 items-center rounded-lg bg-[#11a36614] px-3 text-sm font-medium leading-5 text-[#11a366]">
              منتشر شده
            </span>
          </div>

          <div className="mt-4 flex h-[68px] items-center justify-between gap-2 [direction:ltr]">
            <div className="min-w-0 flex-1 text-right [direction:rtl]">
              <h2 className="m-0 truncate text-base font-medium leading-6">{ad.title}</h2>
              <p className="m-0 mt-1 text-xs font-medium leading-4 text-[#808080]">{ad.time}</p>
            </div>
            <img
              alt=""
              className="h-[68px] w-[102px] shrink-0 rounded-lg object-cover"
              src="/figma/account/consultant-published-thumbnail.png"
            />
          </div>

          <div className="mt-4 flex h-10 items-center justify-between py-2 text-sm font-medium leading-5 [direction:ltr]">
            <span className="[direction:rtl]">12بهمن (12روز دیگر)</span>
            <span className="text-[#808080] [direction:rtl]">انقضا</span>
          </div>
        </section>

        <div className="h-2 shrink-0 bg-[#f0f0f0]" aria-hidden="true" />
        <div className="min-h-[300px] flex-1 bg-white">
          <PublishedAction icon="preview" label="پیش‌نمایش" to="/ads/1" />
          <PublishedActionDivider />
          <PublishedAction ad={ad} icon="edit" label="ویرایش" to={adManagementPaths.edit} />
          <PublishedActionDivider />
          <PublishedAction
            icon="delete"
            label={isDeleted ? "آگهی حذف شد" : "حذف"}
            onClick={() => {
              setIsDeleted(true);
              showNotice("آگهی از فهرست نمایشی حذف شد");
            }}
          />
          <PublishedActionDivider />
          <PublishedAction ad={ad} icon="upgrade" label="ارتقاء آگهی" to={adManagementPaths.payment} />
          <PublishedActionDivider />
          <PublishedAction icon="history" label="تاریخچه پرداخت" to="/account/credit/history" />
        </div>
      </main>

      <BottomSheet
        ariaLabel="نتیجه پرداخت"
        contentClassName="px-4 pt-5 text-center"
        heightClassName="h-[315px]"
        isOpen={isSuccessOpen}
        onBack={() => setIsSuccessOpen(false)}
        onClose={() => setIsSuccessOpen(false)}
        title="نتیجه پرداخت"
      >
        <img
          alt=""
          className="mx-auto h-[104px] w-[104px] object-contain"
          src="/figma/account/consultant-payment-success.png"
        />
        <h3 className="m-0 mt-3 text-base font-semibold leading-6 text-[#11a366]">
          پرداخت موفق
        </h3>
        <p className="m-0 mt-5 text-sm font-normal leading-5 text-[#4d4d4d]">
          پرداخت موفق و آگهی منتشر شد
        </p>
      </BottomSheet>
      <DemoNotice message={message} />
    </PageFrame>
  );
}

function PublishedAction({
  ad,
  icon,
  label,
  onClick,
  to,
}: {
  ad?: ReturnType<typeof getSelectedConsultantAd>;
  icon: "delete" | "edit" | "history" | "preview" | "upgrade";
  label: string;
  onClick?: () => void;
  to?: string;
}) {
  const content = (
    <>
      <ChevronLeftIcon className="h-6 w-6 text-[#4d4d4d]" />
      <span className="inline-flex items-center gap-2 text-base font-medium leading-6 [direction:rtl]">
        <PublishedActionIcon className="h-6 w-6 text-[#4d4d4d]" icon={icon} />
        {label}
      </span>
    </>
  );

  if (to) {
    return (
      <RouteLink
        className="flex h-14 w-full items-center justify-between px-4 text-[#1a1a1a] no-underline [direction:ltr]"
        state={{ ad }}
        to={to}
      >
        {content}
      </RouteLink>
    );
  }

  return (
    <button
      className="flex h-14 w-full items-center justify-between px-4 text-[#1a1a1a] [direction:ltr]"
      onClick={onClick}
      type="button"
    >
      {content}
    </button>
  );
}

function PublishedActionDivider() {
  return (
    <div className="flex h-[5px] items-center px-4" aria-hidden="true">
      <div className="h-px w-full bg-[#cccccc]" />
    </div>
  );
}
