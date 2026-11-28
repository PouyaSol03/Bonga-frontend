import { describe, expect, it } from "vitest";
import { validateNewAd } from "../../src/features/advertisements/create/validation";
import { blankValues } from "../../src/features/advertisements/create/constants/initialValues";

describe("Ad description 1000 character limit", () => {
  it("accepts descriptions up to 1000 characters and rejects 1001 characters", () => {
    const validResult = validateNewAd({
      ...blankValues,
      title: "عنوان آگهی معتبر",
      description: "ا".repeat(1000),
    });
    expect(validResult?.errors.description).toBeUndefined();

    const invalidResult = validateNewAd({
      ...blankValues,
      title: "عنوان آگهی معتبر",
      description: "ا".repeat(1001),
    });
    expect(invalidResult?.errors.description).toContain("۱۰۰۰");
  });
});
