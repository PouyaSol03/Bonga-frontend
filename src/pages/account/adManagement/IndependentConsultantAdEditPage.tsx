import type { ReactNode } from "react";
import { PageFrame } from "../../../app/PageFrame";
import { TopBar } from "../../../components/TopBar";
import { RouteLink } from "../../../routes/RouteLink";
import { adManagementPaths, getSelectedConsultantAd } from "./adManagementData";

const galleryImages = [
  "/figma/account/consultant-stat-thumbnail-1.png",
  "/figma/account/consultant-stat-thumbnail-2.png",
  "/figma/account/consultant-stat-thumbnail-3.png",
] as const;

export function IndependentConsultantAdEditPage() {
  const ad = getSelectedConsultantAd();

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ ad }}
        backTo={adManagementPaths.published}
        className="[&_a]:text-[#1a1a1a]"
        title="ثبت آگهی"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-[76px]">
        <MediaFields />
        <div className="h-2 bg-[#f0f0f0]" aria-hidden="true" />
        <AdInformationFields />
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-white px-4 py-[14px] shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-2 gap-4 [direction:ltr]">
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#0048c4] text-sm font-medium leading-5 text-white"
            type="button"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            ثبت اطلاعات
          </button>
          <RouteLink
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#0048c4] bg-white text-sm font-medium leading-5 text-[#0048c4] no-underline"
            state={{ ad }}
            to={adManagementPaths.published}
          >
            مرحله قبل
            <ArrowRightIcon className="h-5 w-5" />
          </RouteLink>
        </div>
      </footer>
    </PageFrame>
  );
}

function MediaFields() {
  return (
    <section className="bg-white px-4 pb-4 pt-4">
      <SectionHeading icon={<ImageIcon className="h-6 w-6" />} title="عکس آگهی" />

      <h2 className="m-0 mt-5 text-right text-base font-medium leading-6">
        انتخاب عکس <span className="text-[#ee3623]">*</span>
      </h2>

      <div className="mt-4 flex gap-3 overflow-hidden [direction:rtl]">
        <button
          className="flex h-[98px] w-[98px] shrink-0 flex-col items-center justify-center gap-3 rounded-xl border-2 border-[#0048c4] bg-white text-[#0048c4]"
          type="button"
        >
          <PlusIcon className="h-7 w-7" />
          <span className="text-sm font-medium leading-5">افزودن عکس</span>
        </button>
        {galleryImages.map((image) => (
          <img
            alt=""
            className="h-[98px] w-[98px] shrink-0 rounded-xl object-cover"
            key={image}
            src={image}
          />
        ))}
      </div>

      <DashedDivider className="mt-6" />

      <div className="mt-6 flex items-center justify-between [direction:ltr]">
        <Toggle />
        <h2 className="m-0 text-base font-medium leading-6 [direction:rtl]">فیلم</h2>
      </div>

      <div className="mt-6 flex h-[86px] items-center justify-between rounded-2xl border border-[#cccccc] px-4 [direction:ltr]">
        <button aria-label="حذف فیلم" className="grid h-8 w-8 place-items-center text-[#ee3623]" type="button">
          <CloseCircleIcon className="h-6 w-6" />
        </button>
        <div className="text-right [direction:ltr]">
          <p className="m-0 text-base font-medium leading-6 text-[#1a1a1a]">my video.mp4</p>
          <p className="m-0 text-sm font-normal leading-5 text-[#808080]">5.3MB</p>
        </div>
        <button aria-label="پخش فیلم" className="grid h-12 w-12 place-items-center rounded-full bg-[#e7eefc] text-[#0048c4]" type="button">
          <PlayIcon className="h-6 w-6" />
        </button>
      </div>

      <DashedDivider className="mt-6" />

      <div className="mt-6 flex items-center justify-between [direction:ltr]">
        <Toggle />
        <h2 className="m-0 text-base font-medium leading-6 [direction:rtl]">تور مجازی</h2>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 [direction:ltr]">
        <InfoCircleIcon className="h-6 w-6 shrink-0 text-[#808080]" />
        <div className="flex h-14 min-w-0 flex-1 items-center justify-between rounded-xl border border-[#cccccc] px-4 text-[#808080] [direction:ltr]">
          <LinkIcon className="h-6 w-6 shrink-0 text-[#4d4d4d]" />
          <span className="truncate text-right text-sm font-normal leading-5 [direction:rtl]">
            لینک تور مجازی را وارد کنید
          </span>
        </div>
      </div>
    </section>
  );
}

function AdInformationFields() {
  return (
    <section className="bg-white px-4 pb-6 pt-4">
      <SectionHeading icon={<DocumentInfoIcon className="h-6 w-6" />} title="اطلاعات آگهی" />

      <h2 className="m-0 mt-7 text-right text-base font-medium leading-6">ثبت کننده آگهی</h2>
      <div className="mt-4 flex h-[88px] items-center gap-4 rounded-2xl bg-[#0048c414] px-4 [direction:rtl]">
        <img
          alt=""
          className="h-14 w-14 shrink-0 rounded-full object-cover"
          src="/figma/account/consultant-profile.png"
        />
        <div className="min-w-0 text-right">
          <p className="m-0 text-[22px] font-medium leading-7 text-[#4d4d4d]">ناصر اشرفی</p>
          <p className="m-0 mt-1 text-xs font-medium leading-4 text-[#808080]">مشاور مستقل</p>
        </div>
      </div>

      <DashedDivider className="mt-6" />

      <FormField
        className="mt-6"
        label="عنوان آگهی"
        placeholder="مثال: آپارتمان ۱۲۰ متری، ۲ خوابه، طبقه اول"
        required
      />
      <FormField
        className="mt-6"
        label="توضیحات آگهی"
        multiline
        placeholder="اطلاعات بیشتر را وارد کنید..."
        required
      />
    </section>
  );
}

function SectionHeading({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex h-10 items-center justify-between [direction:ltr]">
      <InfoCircleIcon className="h-6 w-6 text-[#808080]" />
      <h2 className="m-0 inline-flex items-center gap-2 text-base font-medium leading-6 [direction:rtl]">
        {icon}
        {title}
      </h2>
    </div>
  );
}

function FormField({
  className = "",
  label,
  multiline = false,
  placeholder,
  required = false,
}: {
  className?: string;
  label: string;
  multiline?: boolean;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-right text-base font-medium leading-6">
        {label} {required ? <span className="text-[#ee3623]">*</span> : null}
      </span>
      {multiline ? (
        <textarea
          className="mt-4 h-[98px] w-full resize-none rounded-xl border border-[#cccccc] bg-white px-4 py-4 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
          placeholder={placeholder}
        />
      ) : (
        <input
          className="mt-4 h-14 w-full rounded-xl border border-[#cccccc] bg-white px-4 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
          placeholder={placeholder}
          type="text"
        />
      )}
    </label>
  );
}

function Toggle() {
  return (
    <button aria-pressed="true" className="flex h-6 w-11 items-center justify-end rounded-full bg-[#0048c4] px-1" type="button">
      <span className="h-4 w-4 rounded-full bg-white" />
    </button>
  );
}

function DashedDivider({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`border-t border-dashed border-[#cccccc] ${className}`} />;
}

function InfoCircleIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.5v6M12 7.5v.25" strokeLinecap="round" />
    </svg>
  );
}

function ImageIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <rect height="18" rx="1.5" width="18" x="3" y="3" />
      <circle cx="15.5" cy="8" r="2" />
      <path d="m5.5 18 4.5-5 3.25 3.25 2-2L18.5 18" />
    </svg>
  );
}

function DocumentInfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <rect height="18" rx="1.5" width="15" x="5" y="3" />
      <path d="M12.5 10.5v6M12.5 7.5v.25" />
    </svg>
  );
}

function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CloseCircleIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6m0-6-6 6" />
    </svg>
  );
}

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5.75v12.5c0 1 1.13 1.58 1.95 1l9.4-6.25a1.2 1.2 0 0 0 0-2l-9.4-6.25c-.82-.58-1.95 0-1.95 1Z" />
    </svg>
  );
}

function LinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="m10 13-2 2a3.5 3.5 0 0 0 5 5l3-3a3.5 3.5 0 0 0 0-5" />
      <path d="m14 11 2-2a3.5 3.5 0 0 0-5-5L8 7a3.5 3.5 0 0 0 0 5" />
      <path d="m9.5 14.5 5-5" />
    </svg>
  );
}

function ArrowLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="m9 7-5 5 5 5M4 12h16" />
    </svg>
  );
}

function ArrowRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="m15 7 5 5-5 5M20 12H4" />
    </svg>
  );
}
