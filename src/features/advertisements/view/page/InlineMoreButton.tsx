import { type ReactNode } from "react";
import { motion } from "motion/react";
import { ViewAdIcon } from ".././ViewAdIcon";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";

export function InlineMoreButton({
  children,
  isOpen = false,
  onClick,
}: {
  children: ReactNode;
  isOpen?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      unstyled
      className="text-primary focus-visible:outline-primary/40 mx-auto mt-3 flex w-fit items-center justify-center gap-1 p-0 focus-visible:outline-3 focus-visible:outline-offset-2"
      onClick={onClick}
      type="button"
    >
      <Typography
        as="span"
        variant="label"
        size="small"
        weight="medium"
        className="text-primary text-xs leading-4 font-medium"
      >
        {children}
      </Typography>

      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.24, ease: "easeInOut" }}
        className="inline-flex shrink-0 items-center justify-center"
      >
        <ViewAdIcon className="text-primary h-3 w-3 shrink-0" name="arrowDown" />
      </motion.div>
    </Button>
  );
}
