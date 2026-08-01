import {
  usePublisherOptions,
  type PublisherOption,
} from "../hooks/publisher-options.hooks";
import { BottomSheet } from "./BottomSheet";
import LinearArrowLeft1 from "./(icons)/LinearArrowLeft1";
import LinearBuilding2 from "./(icons)/LinearBuilding2";
import LinearCity from "./(icons)/LinearCity";
import LinearUser from "./(icons)/LinearUserSolid";
import { ListItem } from "./ui/ListItem";

type CreateAdOption = PublisherOption;

type CreateAdBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (option: CreateAdOption) => void;
};

function CreateAdIcon({ type }: { type: CreateAdOption["icon"] }) {
  const iconClassName = "h-6 w-6";

  if (type === "user") {
    return <LinearUser aria-hidden="true" className={iconClassName} />;
  }

  if (type === "building") {
    return <LinearBuilding2 aria-hidden="true" className={iconClassName} />;
  }

  return <LinearCity aria-hidden="true" className={iconClassName} />;
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
      className="rounded-t-[24px]!"
      contentClassName="min-h-0 overflow-y-auto overscroll-contain pb-[max(0.875rem,env(safe-area-inset-bottom,0px))]"
      headerClassName="h-10! gap-1! px-2!"
      isOpen={isOpen}
      onClose={onClose}
      title="ثبت آگهی"
      variant="actions"
      zIndexClassName="z-2000"
    >
      {options.map((option) => (
        <ListItem
          className="after:absolute after:inset-x-4 after:bottom-0 after:h-px after:bg-[#f0f0f0] last:after:hidden"
          description={option.description}
          key={option.id}
          leading={<CreateAdIcon type={option.icon} />}
          onClick={() => onSelect?.(option)}
          tabIndex={isOpen ? 0 : -1}
          title={option.title}
          trailing={<LinearArrowLeft1 aria-hidden="true" className="h-6 w-6" />}
        />
      ))}
    </BottomSheet>
  );
}
