function RadioIndicator({ checked }: { checked: boolean }) {
  return (
    <span
      className={`grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full border ${checked
        ? "border-[#0048c4] bg-[#0048c4]"
        : "border-[#808080] bg-white"
        }`}
    >
      {checked ? (
        <span className="h-2 w-2 rounded-full bg-white" />
      ) : null}
    </span>
  );
}

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
    <button
      aria-pressed={checked}
      className={`w-full rounded-[12px] border px-4 py-4 text-right [direction:ltr] ${checked ? "border-[#0048c4] bg-[#0048C414]" : "border-[#cccccc]"
        }`}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center justify-between">
        <RadioIndicator checked={checked} />

        <span className="flex items-center gap-2  font-medium leading-7 text-[#1a1a1a] [direction:rtl]">
          <span className={`${checked && 'text-[#0048c4]'}`}>{label}</span>

          {badge ? (
            <span className="rounded-[4px] border border-[#11a366] px-2 py-0.5 text-sm font-medium leading-5 text-[#11a366]">
              {badge}
            </span>
          ) : null}
        </span>
      </div>

      <div
        className={`grid ${checked && description
          ? "mt-3 grid-rows-[1fr] opacity-100"
          : "grid-rows-[0fr] opacity-0"
          }`}
      >
        <div className="overflow-hidden">
          <p className="m-0 rounded-[10px] text-right text-sm font-normal leading-6 text-[#4B5070] [direction:rtl]">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

export function CheckRow({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
  return (
    <button className="flex h-12 w-full items-center justify-start gap-3 text-right text-base font-medium leading-6 text-[#1a1a1a]" onClick={() => onChange(!checked)} type="button">
      <span className={`grid h-6 w-6 place-items-center rounded-lg border ${checked ? "border-[#0048C4] bg-[#0048C4] text-white" : "border-[#808080] bg-white"}`}>{checked ? <img src="/icons/checkTick.svg" alt="" /> : null}</span>
      <span>{label}</span>
    </button>
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

