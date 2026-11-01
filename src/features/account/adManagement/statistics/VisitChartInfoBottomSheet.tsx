import { BottomSheet } from "../../../../shared/components/BottomSheet";
import { Typography } from "../../../../shared/ui/Typography";

export function VisitChartInfoBottomSheet({
  description,
  isOpen,
  onClose,
  title,
}: {
  description: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}) {
  return (
    <BottomSheet
      ariaLabel={`توضیحات ${title}`}
      contentClassName="px-5 pb-6 pt-2"
      heightClassName="min-h-[214px] h-auto"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-3"
      showBackButton={false}
      title={title}
    >
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface-var m-0 text-sm leading-7 font-normal"
      >
        {description}
      </Typography>
    </BottomSheet>
  );
}
