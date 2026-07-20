import {
  usePublisherOptions,
  type PublisherOption,
} from "../hooks/publisher-options.hooks";
import { BottomSheet } from "./BottomSheet";

type CreateAdOption = PublisherOption;

type CreateAdBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (option: CreateAdOption) => void;
};

function CreateAdIcon({ type }: { type: CreateAdOption["icon"] }) {
  if (type === "user") {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M4 21a8 8 0 0 1 16 0"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 21V4l10 3v14"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M15 11h4v10"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M8 8h3M8 12h3M8 16h3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      {type === "agency" ? (
        <path
          d="M3 21h18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      ) : null}
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function CreateAdBottomSheet({
  isOpen,
  onClose,
  onSelect,
}: CreateAdBottomSheetProps) {
  const options = usePublisherOptions(isOpen);

  return (
    <BottomSheet
      ariaLabel="ثبت آگهی"
      contentClassName="mt-5 min-h-0 overflow-y-auto overscroll-contain pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]"
      heightClassName="max-h-[min(88dvh,560px)]"
      isOpen={isOpen}
      onClose={onClose}
      title="ثبت آگهی"
      zIndexClassName="z-2000"
    >
      {options.map((option) => (
        <button
          className="flex w-full items-center gap-4 border-b border-[#cccccc] bg-white px-4 py-3 text-right last:border-b-0 focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
          key={option.id}
          onClick={() => onSelect?.(option)}
          tabIndex={isOpen ? 0 : -1}
          type="button"
        >
          <span className="shrink-0 text-[#4d4d4d]">
            <span className="block size-6">
              <CreateAdIcon type={option.icon} />
            </span>
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-base font-normal leading-6 text-[#1a1a1a]">
              {option.title}
            </span>
            <span className="mt-0.5 block text-sm font-normal leading-5 text-[#808080]">
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
