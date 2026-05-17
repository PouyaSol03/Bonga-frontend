type CreateAdOption = {
  id: string;
  title: string;
  description: string;
  icon: "user" | "building" | "agency";
};

type CreateAdBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (option: CreateAdOption) => void;
};

const createAdOptions: CreateAdOption[] = [
  {
    id: "personal",
    title: "آگهی شخصی",
    description: "انتشار در آگهی های شخصی",
    icon: "user",
  },
  {
    id: "independent-consultant",
    title: "مشاور مستقل",
    description: "انتشار آگهی در صفحه مشاور مستقل",
    icon: "building",
  },
  {
    id: "jaliliyan-agency",
    title: "مشاور آژانس جلیلیان",
    description: "انتشار آگهی در صفحه مشاور آژانس جلیلیان",
    icon: "agency",
  },
];

function CreateAdIcon({ type }: { type: CreateAdOption["icon"] }) {
  if (type === "user") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M4 21a8 8 0 0 1 16 0"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 21V4l10 3v14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M15 11h4v10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8 8h3M8 12h3M8 16h3" stroke="currentColor" strokeWidth="1.8" />
      {type === "agency" && (
        <path
          d="M3 21h18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CreateAdBottomSheet({
  isOpen,
  onClose,
  onSelect,
}: CreateAdBottomSheetProps) {
  return (
    <div
      className={`absolute inset-0 z-2000 flex items-end justify-center overflow-hidden transition-[opacity,visibility] duration-200 ease-out ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
      aria-hidden={!isOpen}
      dir="rtl"
    >
      <button
        className="absolute inset-0 cursor-default bg-black/60"
        type="button"
        aria-label="بستن ثبت آگهی"
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
      />

      <section
        className={`relative z-10 flex w-full max-w-[500px] max-h-[min(88dvh,560px)] flex-col overflow-hidden rounded-t-[24px] bg-white shadow-[0_-16px_32px_rgba(26,26,26,0.16)] transition-transform duration-300 ease-out min-[390px]:rounded-t-[28px] ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="ثبت آگهی"
      >
        <span
          className="absolute left-1/2 top-2 h-1 w-12 -translate-x-1/2 rounded-full bg-[#cccccc] min-[390px]:top-3 min-[390px]:w-14"
          aria-hidden="true"
        />

        <header className="flex shrink-0 items-center gap-2 px-4 pb-2 pt-5 min-[390px]:gap-2.5 min-[390px]:px-5 min-[390px]:pb-2 min-[390px]:pt-8">
          <button
            className="grid size-6 shrink-0 place-items-center text-[#4d4d4d] min-[390px]:size-8"
            type="button"
            aria-label="بازگشت"
            tabIndex={isOpen ? 0 : -1}
            onClick={onClose}
          >
            <span className="block size-4 min-[390px]:size-5">
              <ArrowRightIcon />
            </span>
          </button>

          <h2 className="m-0 flex-1 text-right text-sm font-bold leading-6 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-7">
            ثبت آگهی
          </h2>
        </header>

        <div className="min-h-0 overflow-y-auto overscroll-contain pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] min-[390px]:pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
          {createAdOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => onSelect?.(option)}
              className="flex w-full items-center gap-3 border-b border-[#d9d9d9] bg-white px-4 py-3 text-right last:border-b-0 focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440] min-[390px]:gap-[18px] min-[390px]:px-5 min-[390px]:py-3"
            >
              <span className="shrink-0 text-[#4d4d4d]">
                <span className="block size-6">
                  <CreateAdIcon type={option.icon} />
                </span>
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold leading-5 text-[#1a1a1a] min-[390px]:text-sm min-[390px]:leading-7">
                  {option.title}
                </span>

                <span className="mt-0.5 block text-[10px] font-normal leading-[1.45] text-[#a6a6a6] min-[390px]:mt-1 min-[390px]:text-sm min-[390px]:leading-6">
                  {option.description}
                </span>
              </span>

              <span className="shrink-0 text-[#4d4d4d]">
                <span className="block size-4 min-[390px]:size-6">
                  <ChevronLeftIcon />
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
