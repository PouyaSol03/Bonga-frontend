export type IdentityPageStep = "pending" | "verified" | "ownership";

export type SimCardOwnershipReason = "selling" | "transferred" | "purchased";

export const simCardOwnershipReasons: Array<{
  id: SimCardOwnershipReason;
  label: string;
}> = [
  { id: "selling", label: "می‌خواهم سیم‌کارتم را بفروشم" },
  { id: "transferred", label: "سیم‌کارتم را واگذار کرده‌ام" },
  { id: "purchased", label: "سیم‌کارتم را تازه خریده‌ام" },
];
