export function cn(...classes: Array<false | null | string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const focusRing = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]";

export const disabledClasses = "disabled:cursor-not-allowed disabled:bg-[#e5e5e5] disabled:text-[#b3b3b3] disabled:border-[#e5e5e5]";
