import { type ComponentType } from "react";
import { BottomSheet, BottomSheetActionList } from "../../../shared/components/BottomSheet";
import { AlbumIcon, CameraIcon, MapLocationIcon } from "./attachmentIcons";

export type SendFileOptionId = "camera" | "gallery" | "map";

export type SendFileOption = {
  id: SendFileOptionId;
  title: string;
  Icon: ComponentType<{ className?: string }>;
};

export const sendFileOptions: SendFileOption[] = [
  {
    id: "camera",
    title: "عکس با دوربین",
    Icon: CameraIcon,
  },
  {
    id: "gallery",
    title: "عکس از گالری",
    Icon: AlbumIcon,
  },
  {
    id: "map",
    title: "موقعیت در نقشه",
    Icon: MapLocationIcon,
  },
];

export function SendFileBottomSheet({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: SendFileOption["id"]) => void;
}) {
  return (
    <BottomSheet
      ariaLabel="ارسال فایل"
      className="rounded-t-[18px]"
      contentClassName="mt-2"
      isOpen={isOpen}
      onClose={onClose}
      scrimClassName="bg-black/60"
      title="ارسال"
      variant="actions"
      zIndexClassName="z-[60]"
    >
      <BottomSheetActionList
        isOpen={isOpen}
        itemClassName="h-11 text-[12px] leading-5"
        items={sendFileOptions}
        onSelect={(item) => onSelect(item.id)}
      />
    </BottomSheet>
  );
}
