import { describe, expect, it } from "vitest";
import { AgencyInfoTab } from "../../src/features/dashboard/agency-preview/components/AgencyInfoTab";
import { render } from "../render";

describe("AgencyInfoTab - Remove درباره section from public pages", () => {
  it("does not render the درباره section", async () => {
    const container = await render(
      <AgencyInfoTab
        aboutUs="این یک متن درباره آژانس نمونه است."
        activityAreas={["منطقه ۱", "منطقه ۲"]}
        agencyName="آژانس برتر"
        workingHours="۸ الی ۱۷"
      />,
      "agency-info-tab",
    );

    expect(container.textContent).not.toContain("درباره");
    expect(container.textContent).not.toContain("درباره آژانس برتر");
    expect(container.textContent).not.toContain("این یک متن درباره آژانس نمونه است.");
    expect(container.textContent).toContain("محدوده فعالیت");
    expect(container.textContent).toContain("ساعات کاری");
  });
});
