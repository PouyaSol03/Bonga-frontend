import { BottomSheet } from "../../../components/BottomSheet";
import { Button } from "../../../components/ui/Button";
import { IconButton } from "../../../components/ui/IconButton";
import { ListItem } from "../../../components/ui/ListItem";
import LinearBuilding2 from "../../../components/(icons)/LinearBuilding2";
import LinearCity from "../../../components/(icons)/LinearCity";
import LinearUser from "../../../components/(icons)/LinearUserSolid";
import LinearArrowRight2 from "../../../components/(icons)/LinearArrowRight2";
import LinearArrowLeft1 from "../../../components/(icons)/LinearArrowLeft1";
import { Typography } from "../../../components/ui/Typography";

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
  const iconClassName = "h-6 w-6";

  if (type === "user") {
    return <LinearUser aria-hidden="true" className={iconClassName} />;
  }

  if (type === "building") {
    return <LinearBuilding2 aria-hidden="true" className={iconClassName} />;
  }

  return <LinearCity aria-hidden="true" className={iconClassName} />;
}

function RequestSuccessContent({
  onClose,
  onOpenResults,
}: Pick<SearchRequestSenderBottomSheetProps, "onClose" | "onOpenResults">) {
  return (
    <div className="text-right [direction:rtl]">
      <IconButton
        aria-label="بستن"
        className="text-[#444444]"
        onClick={onClose}
        size="dense"
      >
        <LinearArrowRight2 />
      </IconButton>

      <div className="flex flex-col items-center">
      <div className="mt-10 flex justify-center">
        <img src="/vectors/SavedRequest.svg" alt="" />
      </div>

      <Typography as="h2" variant="headline" size="large" className="m-0 mt-8 text-center font-semibold text-[#00a66b]">
        شما یک قدم به یافتن ملک دلخواه نزدیک‌تر شدید!
      </Typography>
      <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 text-center text-sm text-[#4d4d4d]">
        یافته‌های جدید به محض ثبت، در بخش نتایج درخواست‌های من در مدیریت درخواست‌های پنل کاربری برایتان نمایش داده خواهد شد.
      </Typography>

      <Button
        className="mt-4"
        onClick={onOpenResults}
        size="sm"
        >
        نتایج درخواست‌های من
      </Button>
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
        contentClassName="min-h-0 overflow-y-auto overscroll-contain pb-4"
        isOpen={isOpen && !isSuccess}
        onClose={onClose}
        title="ثبت درخواست"
        variant="actions"
        zIndexClassName="z-[2000]"
      >
        {options.map((option) => (
          <ListItem
            className="border-b border-[#f0f0f0] last:border-b-0"
            description={option.description}
            key={option.id}
            leading={<RequestSenderIcon type={option.icon} />}
            onClick={() => onSelect(option.id)}
            tabIndex={isOpen && !isSuccess ? 0 : -1}
            title={option.title}
            trailing={<LinearArrowLeft1 />}
          >
          </ListItem>
        ))}
      </BottomSheet>

      <BottomSheet
        ariaLabel="ثبت موفق درخواست"
        contentClassName="px-4 pt-4 pb-6"
        isOpen={isOpen && isSuccess}
        onClose={onClose}
        showHeader={false}
        variant="confirm"
        zIndexClassName="z-[2000]"
      >
        <RequestSuccessContent onClose={onClose} onOpenResults={onOpenResults} />
      </BottomSheet>
    </>
  );
}
