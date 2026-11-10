import { AnimatePresence, motion } from "motion/react";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import { ChoiceIndicator } from "../../../../shared/ui/Choice";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";

export function RadioCard({
  checked,
  label,
  badge,
  description,
  onClick,
}: {
  checked: boolean;
  label: string;
  badge?: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <Button
      unstyled
      aria-pressed={checked}
      className={`w-full rounded-[12px] border px-4 py-3.5 text-right transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] [direction:ltr] active:scale-[0.99] ${
        checked ? "border-primary bg-primary-container/20 shadow-sm" : "border-outline-var"
      }`}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center justify-between">
        <ChoiceIndicator checked={checked} className="h-4.5 w-4.5" type="radio" />

        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="medium"
          className="text-on-surface flex items-center gap-2 font-medium [direction:rtl]"
        >
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className={`transition-colors duration-200 ${checked ? "text-primary font-semibold" : ""}`}
          >
            {label}
          </Typography>

          {badge ? (
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="border-tertiary text-tertiary rounded-[4px] border px-2 py-0.5 text-sm font-medium"
            >
              {badge}
            </Typography>
          ) : null}
        </Typography>
      </div>

      <AnimatePresence initial={false}>
        {checked && description ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              <div className="flex items-start gap-2 [direction:rtl]">
                <LinearInfoCircle className="text-on-surface-var mt-0.5 h-4 w-4 shrink-0" />
                <Typography
                  as="p"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="text-on-surface-var m-0 flex-1 rounded-[10px] text-right text-sm leading-5 font-normal whitespace-pre-line"
                >
                  {description}
                </Typography>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Button>
  );
}

export function CheckRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Button
      unstyled
      className="text-on-surface flex w-full items-center justify-start gap-3 py-2.5 text-right text-base leading-6 font-medium last:mt-1"
      onClick={() => onChange(!checked)}
      type="button"
    >
      <ChoiceIndicator checked={checked} />
      <Typography as="span" variant="label" size="medium" weight="medium">
        {label}
      </Typography>
    </Button>
  );
}

