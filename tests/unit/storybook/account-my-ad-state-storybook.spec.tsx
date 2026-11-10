import { expect, test, vi } from "vitest";
import storybookConfig from "../../../.storybook/main";
import { AccountMyAdStatePage } from "../../../src/features/account/AccountMyAdStatePage";
import { AgencyDocs_1_Published } from "../../../src/features/account/AccountMyAdStatePage.stories";
import { render } from "../../render";

test("Storybook does not register the removed viewport addon", () => {
  expect(storybookConfig.addons).not.toContain("@storybook/addon-viewport");
});

test("assigned-ad published story renders without runtime errors", async () => {
  const errors = vi.spyOn(console, "error").mockImplementation(() => {});
  const container = await render(<AccountMyAdStatePage {...AgencyDocs_1_Published.args} />);
  expect(container.textContent).toContain("منتشر شده");
  expect(errors).not.toHaveBeenCalled();
});
