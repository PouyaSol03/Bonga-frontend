import { BottomSheet } from "../../../components/BottomSheet";
import LinearCity from "../../../components/(icons)/LinearCity";
import LinearUser from "../../../components/(icons)/LinearUserSolid";
import LinearArrowRight2 from "../../../components/(icons)/LinearArrowRight2";

export type SearchRequestSenderOption = {
  description: string;
  icon: "user" | "building" | "agency";
  id: string;
  senderRole: string;
  title: string;
};

type SearchRequestSenderBottomSheetProps = {
  isOpen: boolean;
  isSuccess: boolean;
  onClose: () => void;
  onOpenResults: () => void;
  onSelect: (id: string) => void;
  options: SearchRequestSenderOption[];
};

function RequestSenderIcon({ type }: { type: SearchRequestSenderOption["icon"] }) {
  if (type === "user") {
    return <LinearUser aria-hidden="true" className="h-6 w-6" />;
  }

  return <LinearCity aria-hidden="true" className="h-6 w-6" />;
}

function ChevronLeftIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="m15 6-6 6 6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}


function RequestSuccessContent({
  onClose,
  onOpenResults,
}: Pick<SearchRequestSenderBottomSheetProps, "onClose" | "onOpenResults">) {
  return (
    <div className="text-right [direction:rtl]">
      <button
        aria-label="بستن"
        className="grid h-6 w-6 place-items-center rounded-full text-[#444444] transition hover:bg-[#f3f3f3] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
        onClick={onClose}
        type="button"
      >
        <LinearArrowRight2 />
      </button>

      <div className="flex flex-col items-center">
      <div className="mt-10 flex justify-center">
        <img src="/vectors/SavedRequest.svg" alt="" />
      </div>

      <h2 className="m-0 mt-8 text-center font-semibold text-[#00a66b]">
        شما یک قدم به یافتن ملک دلخواه نزدیک‌تر شدید!
      </h2>
      <p className="m-0 mt-2 text-center text-sm text-[#4d4d4d]">
        یافته‌های جدید به محض ثبت، در بخش نتایج درخواست‌های من در مدیریت درخواست‌های پنل کاربری برایتان نمایش داده خواهد شد.
      </p>

      <button
        className="mt-4 flex items-center justify-center rounded-xl bg-[#0756cc] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0048b8] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
        onClick={onOpenResults}
        type="button"
        >
        نتایج درخواست‌های من
      </button>
        </div>
    </div>
  );
}

export function SearchRequestSenderBottomSheet({
  isOpen,
  isSuccess,
  onClose,
  onOpenResults,
  onSelect,
  options,
}: SearchRequestSenderBottomSheetProps) {
  return (
    <>
      <BottomSheet
        ariaLabel="ثبت درخواست"
        contentClassName="mt-5 min-h-0 overflow-y-auto overscroll-contain pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]"
        heightClassName="max-h-[min(88dvh,560px)]"
        isOpen={isOpen && !isSuccess}
        onClose={onClose}
        title="ثبت درخواست"
        zIndexClassName="z-[2000]"
      >
        {options.map((option) => (
          <button
            className="flex w-full items-center gap-4 border-b border-[#cccccc] bg-white px-4 py-3 text-right last:border-b-0 focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
            key={option.id}
            onClick={() => onSelect(option.id)}
            tabIndex={isOpen && !isSuccess ? 0 : -1}
            type="button"
          >
            <span className="block size-6 shrink-0 text-[#4d4d4d]">
              <RequestSenderIcon type={option.icon} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-normal leading-6 text-[#1a1a1a]">{option.title}</span>
              <span className="mt-0.5 block text-sm font-normal leading-5 text-[#808080]">{option.description}</span>
            </span>
            <span className="block size-6 shrink-0 text-[#4d4d4d]">
              <ChevronLeftIcon />
            </span>
          </button>
        ))}
      </BottomSheet>

      <BottomSheet
        ariaLabel="ثبت موفق درخواست"
        contentClassName="px-4 pt-4 pb-6"
        heightClassName=""
        isOpen={isOpen && isSuccess}
        onClose={onClose}
        showHeader={false}
        zIndexClassName="z-[2000]"
      >
        <RequestSuccessContent onClose={onClose} onOpenResults={onOpenResults} />
      </BottomSheet>
    </>
  );
}
