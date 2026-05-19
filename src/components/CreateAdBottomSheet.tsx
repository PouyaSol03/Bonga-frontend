import { BottomSheet } from "./BottomSheet";

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

export function CreateAdBottomSheet({
  isOpen,
  onClose,
  onSelect,
}: CreateAdBottomSheetProps) {
  return (
    <BottomSheet
      ariaLabel="ثبت آگهی"
      contentClassName="mt-8 min-h-0 overflow-y-auto overscroll-contain pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]"
      heightClassName="max-h-[min(88dvh,560px)]"
      isOpen={isOpen}
      onClose={onClose}
      title="ثبت آگهی"
      zIndexClassName="z-2000"
    >
      {createAdOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          tabIndex={isOpen ? 0 : -1}
          onClick={() => onSelect?.(option)}
          className="flex w-full items-center gap-4 border-b border-[#cccccc] bg-white px-4 py-3 text-right last:border-b-0 focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
        >
          <span className="shrink-0 text-[#4d4d4d]">
            <span className="block size-7">
              <CreateAdIcon type={option.icon} />
            </span>
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-lg font-normal leading-7 text-[#1a1a1a]">
              {option.title}
            </span>

            <span className="mt-1 block text-sm font-normal leading-5 text-[#808080]">
              {option.description}
            </span>
          </span>

          <span className="shrink-0 text-[#4d4d4d]">
            <span className="block size-6">
              <ChevronLeftIcon />
            </span>
          </span>
        </button>
      ))}
    </BottomSheet>
  );
}
