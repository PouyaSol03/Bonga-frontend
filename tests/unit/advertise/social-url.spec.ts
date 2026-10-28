import { expect, test } from "vitest";
import { normalizeSocialUrl } from "../../../src/shared/utils/social-url";

const cases = [
  ["instagram", " @neshoono ", "https://www.instagram.com/neshoono"],
  ["instagram", "instagram.com/neshoono", "https://www.instagram.com/neshoono"],
  ["instagram", "@", ""],
  ["telegram", "@neshoono", "https://t.me/neshoono"],
  ["telegram", "t.me/neshoono", "https://t.me/neshoono"],
  ["telegram", "t.me/", ""],
  ["whatsapp", "۰۹۱۲ ۳۴۵ ۶۷۸۹", "https://wa.me/989123456789"],
  ["whatsapp", "+98 (912) 345-6789", "https://wa.me/989123456789"],
  ["whatsapp", "not-a-number", ""],
  ["whatsapp", "https://wa.me/989123456789", "https://wa.me/989123456789"],
  ["telegram", " HTTP://t.me/neshoono ", "HTTP://t.me/neshoono"],
  ["instagram", "", ""],
  ["telegram", "   ", ""],
  ["whatsapp", " ", ""],
] as const;

test.each(cases)("normalizes %s contact %s", (type, value, expected) => {
  expect(normalizeSocialUrl(type, value)).toBe(expected);
});
