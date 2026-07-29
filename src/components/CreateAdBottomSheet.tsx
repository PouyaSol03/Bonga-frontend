import {
  usePublisherOptions,
  type PublisherOption,
} from "../hooks/publisher-options.hooks";
import { BottomSheet } from "./BottomSheet";
import LinearArrowLeft1 from "./(icons)/LinearArrowLeft1";
import CreateAdBuildingIcon from "./(icons)/CreateAdBuildingIcon";
import CreateAdUserIcon from "./(icons)/CreateAdUserIcon";
import { ListItem } from "./ui/ListItem";

type CreateAdOption = PublisherOption;

type CreateAdBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (option: CreateAdOption) => void;
};

function CreateAdIcon({ type }: { type: CreateAdOption["icon"] }) {
  if (type === "user") {
    return <CreateAdUserIcon aria-hidden="true" />;
  }

  return <CreateAdBuildingIcon agency={type === "agency"} aria-hidden="true" />;
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
      isOpen={isOpen}
      onClose={onClose}
      title="ثبت آگهی"
      variant="actions"
      zIndexClassName="z-2000"
    >
      {options.map((option) => (
        <ListItem
          className="border-b border-[#cccccc] last:border-b-0"
          description={option.description}
          key={option.id}
          leading={<CreateAdIcon type={option.icon} />}
          onClick={() => onSelect?.(option)}
          tabIndex={isOpen ? 0 : -1}
          title={option.title}
          trailing={<LinearArrowLeft1 aria-hidden="true" />}
        >
        </ListItem>
      ))}
    </BottomSheet>
  );
}
