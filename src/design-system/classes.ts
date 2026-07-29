export function cn(...classes: Array<false | null | string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const focusRing = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]";

export const stateLayer = {
  primary: "transition hover:bg-[#003eb7] active:bg-[#0033ac]",
  subtle: "transition hover:bg-[#f5f5f5] active:bg-[#e5e5e5]",
  transparent: "transition hover:bg-[#0048c40f] active:bg-[#0048c41f]",
} as const;

export const disabledClasses = "disabled:cursor-not-allowed disabled:bg-[#e5e5e5] disabled:text-[#b3b3b3] disabled:border-[#e5e5e5]";
