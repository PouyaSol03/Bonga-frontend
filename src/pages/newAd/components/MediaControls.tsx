import LinearInfoCircle from "../../../shared/icons/LinearInfoCircle";
import { ChoiceIndicator } from "../../../shared/ui/Choice";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

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
      className={`w-full rounded-[12px] border px-4 py-3.5 text-right [direction:ltr] ${checked ? "border-[#0048c4] bg-[#0048C414]" : "border-[#cccccc]"
        }`}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center justify-between">
        <ChoiceIndicator checked={checked} className="h-4.5 w-4.5" type="radio" />

        <Typography as="span" variant="label" size="medium" weight="medium" className="flex items-center gap-2 font-medium text-[#1a1a1a] [direction:rtl]">
          <Typography as="span" variant="body" size="medium" weight="regular" className={`${checked && 'text-[#0048c4]'}`}>{label}</Typography>

          {badge ? (
            <Typography as="span" variant="label" size="medium" weight="medium" className="rounded-[4px] border border-[#11a366] px-2 py-0.5 text-sm font-medium text-[#11a366]">
              {badge}
            </Typography>
          ) : null}
        </Typography>
      </div>

      <div
        className={`grid ${checked && description
          ? "mt-3 grid-rows-[1fr] opacity-100"
          : "grid-rows-[0fr] opacity-0"
          }`}
      >
        <div className="overflow-hidden">
          <div className="flex items-start gap-2 [direction:rtl]">
            <LinearInfoCircle className="w-4 h-4 text-[#4D4D4D]"/>
            <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 flex-1 whitespace-pre-line rounded-[10px] text-right text-sm font-normal text-[#4B5070]">
              {description}
            </Typography>
          </div>
        </div>
      </div>
    </Button>
  );
}

export function CheckRow({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
  return (
    <Button unstyled className="flex w-full last:mt-1 items-center justify-start gap-3 py-2.5 text-right text-base font-medium leading-6 text-[#1a1a1a]" onClick={() => onChange(!checked)} type="button">
      <ChoiceIndicator checked={checked} />
      <Typography as="span" variant="label" size="medium" weight="medium">{label}</Typography>
    </Button>
  );
}

export function SocialInput({ value, placeholder, icon, onChange }: { value: string; placeholder: string; icon: "telegram" | "whatsapp"; onChange: (value: string) => void }) {
  return (
    <label className="flex h-14 w-full items-center gap-3 rounded-[12px] border border-[#cccccc] bg-white px-4 text-base font-normal leading-6 text-[#1a1a1a] focus-within:border-[#0048c4]" dir="rtl">
      <input className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right outline-none placeholder:text-[#a6a6a6]" onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value} />
      <img src={`${icon === "telegram" ? '/icons/socials/telegram.svg' : '/icons/socials/whatsApp.svg'}`} alt="" />
    </label>
  );
}
