import { BottomSheet } from "../../../components/BottomSheet";
import LinearCity from "../../../components/(icons)/LinearCity";
import LinearUser from "../../../components/(icons)/LinearUserSolid";

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

function RequestSuccessIllustration() {
  return (
    <svg
      aria-hidden="true"
      className="h-[130px] w-[130px]"
      fill="none"
      viewBox="0 0 140 140"
    >
      <path
        d="M43 60.5v29.2c0 4.4 3.6 8 8 8h38c4.4 0 8-3.6 8-8V60.5"
        stroke="#0957C9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
      <path
        d="M36 59 64.7 34.9a8 8 0 0 1 10.3 0L84 42.4V34h11v17.6L104 59"
        stroke="#0957C9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
      <path
        d="M59 76c2.7 3.1 6.5 4.8 11 4.8S78.3 79.1 81 76"
        stroke="#0957C9"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M18 107.5c8.8 2.3 18.4 5.2 26.8 8.2 8.2 2.9 16.8 4.5 25.5 4.5h4.3c5.9 0 11.7-1.3 17-3.9l24.2-11.8c3.8-1.9 5.2-6.6 3-10.2-2.1-3.5-6.5-4.8-10.2-3L91 99.2"
        stroke="#8EAEE9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
      <path
        d="M18 91.4c6.9-.2 13.9 1.3 20.2 4.4l9.2 4.5h25.3c4.2 0 7.6 3.4 7.6 7.6s-3.4 7.6-7.6 7.6H55.5"
        stroke="#8EAEE9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
    </svg>
  );
}

function RequestSuccessContent({
  onClose,
  onOpenResults,
}: Pick<SearchRequestSenderBottomSheetProps, "onClose" | "onOpenResults">) {
  return (
    <div className="px-5 text-right [direction:rtl]">
      <button
        aria-label="بستن"
        className="mt-6 grid h-10 w-10 place-items-center rounded-full text-[#444444] transition hover:bg-[#f3f3f3] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
        onClick={onClose}
        type="button"
      >
        <ArrowRightIcon />
      </button>

      <div className="mt-8 flex justify-center">
        <RequestSuccessIllustration />
      </div>

      <h2 className="m-0 mt-5 text-center text-lg font-bold leading-7 text-[#00a66b]">
        شما یک قدم به یافتن ملک دلخواه نزدیک‌تر شدید!
      </h2>
      <p className="m-0 mt-2 text-center text-sm leading-6 text-[#4d4d4d]">
        یافته‌های جدید به محض ثبت، در بخش نتایج درخواست‌های من در مدیریت درخواست‌های پنل کاربری برایتان نمایش داده خواهد شد.
      </p>

      <button
        className="mx-auto mt-5 flex h-12 min-w-[198px] items-center justify-center rounded-xl bg-[#0756cc] px-5 text-sm font-bold text-white transition hover:bg-[#0048b8] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
        onClick={onOpenResults}
        type="button"
      >
        نتایج درخواست‌های من
      </button>
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
        contentClassName="pb-[max(1.75rem,env(safe-area-inset-bottom,0px))]"
        heightClassName="h-[480px] max-h-[100dvh]"
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
