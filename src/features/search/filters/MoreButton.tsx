import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { toPersianDigits } from "../../../shared/lib/numberUtils";
import { motion } from "motion/react";
import LinearArrowDown1 from "../../../shared/icons/LinearArrowDown1";

export function MoreButton({
  count,
  expanded,
  onClick,
}: {
  count: number;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      unstyled
      className="text-primary active:bg-primary-container mx-auto mt-3 flex h-10 items-center justify-center gap-1.5 px-3 pt-2.5 pb-0.5 text-sm leading-5 font-medium"
      onClick={onClick}
      type="button"
    >
      <Typography as="span" variant="label" size="medium" weight="medium" className="text-primary">
        {expanded ? "مشاهده کمتر" : `مشاهده ${toPersianDigits(count)} مورد بیشتر`}
      </Typography>
      <motion.div
        animate={{ rotate: expanded ? 180 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="text-primary inline-flex shrink-0 items-center justify-center"
      >
        <LinearArrowDown1 aria-hidden="true" className="text-primary h-5 w-5 shrink-0" />
      </motion.div>
    </Button>
  );
}
