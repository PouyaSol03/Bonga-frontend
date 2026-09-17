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
    <Button unstyled
      aria-pressed={checked}
      className={`w-full rounded-[12px] border px-4 py-3.5 text-right transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.99] [direction:ltr] ${
        checked ? "border-primary bg-primary-container/20 shadow-sm" : "border-outline-var hover:border-outline hover:bg-surface-container-low"
      }`}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center justify-between">
        <ChoiceIndicator checked={checked} className="h-4.5 w-4.5" type="radio" />

        <Typography as="span" variant="label" size="medium" weight="medium" className="flex items-center gap-2 font-medium text-on-surface [direction:rtl]">
          <Typography as="span" variant="body" size="medium" weight="regular" className={`transition-colors duration-200 ${checked ? "text-primary font-semibold" : ""}`}>{label}</Typography>

          {badge ? (
            <Typography as="span" variant="label" size="medium" weight="medium" className="rounded-[4px] border border-tertiary px-2 py-0.5 text-sm font-medium text-tertiary">
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
                <LinearInfoCircle className="w-4 h-4 shrink-0 text-on-surface-var mt-0.5" />
                <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 flex-1 whitespace-pre-line rounded-[10px] text-right text-sm font-normal text-on-surface-var leading-5">
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

export function CheckRow({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
  return (
    <Button unstyled className="flex w-full last:mt-1 items-center justify-start gap-3 py-2.5 text-right text-base font-medium leading-6 text-on-surface" onClick={() => onChange(!checked)} type="button">
      <ChoiceIndicator checked={checked} />
      <Typography as="span" variant="label" size="medium" weight="medium">{label}</Typography>
    </Button>
  );
}

export function SocialInput({ value, placeholder, icon, onChange }: { value: string; placeholder: string; icon: "telegram" | "whatsapp"; onChange: (value: string) => void }) {
  return (
    <label className="flex h-14 w-full items-center gap-3 rounded-[12px] border border-outline-var bg-surface-container-lowest px-4 text-base font-normal leading-6 text-on-surface focus-within:border-primary" dir="rtl">
      <input className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right outline-none placeholder:text-outline" onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value} />
      <img src={`${icon === "telegram" ? '/icons/socials/telegram.svg' : '/icons/socials/whatsApp.svg'}`} alt="" />
    </label>
  );
}
