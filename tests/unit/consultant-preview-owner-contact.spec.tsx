import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ViewAdContactActions } from "../../src/features/advertisements/view/page/ViewAdContactActions";

describe("Consultant preview owner contact", () => {
  let root: Root | null = null;
  let container: HTMLDivElement | null = null;

  afterEach(async () => {
    if (root) {
      await act(async () => root?.unmount());
      root = null;
    }
    container?.remove();
    container = null;
  });

  it("shows تماس با مالک during consultant preview even when isOwnAd is true", async () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    const onOpenContactInfo = vi.fn();

    await act(async () => {
      root?.render(
        <ViewAdContactActions
          contactActionCount={1}
          contactActionsGridClassName="grid-cols-1"
          contactInfo={{
            phone: "09123456789",
            chat: true,
            instagram: "",
            telegram: "",
            whatsapp: "",
          }}
          hasChatContact={false}
          hasContactSheetData
          isChatPending={false}
          isOwnAd
          isPersonalPreview={false}
          isPreview
          onOpenChat={vi.fn()}
          onOpenContactInfo={onOpenContactInfo}
          publisherContact={{
            category: "agency",
            callLabel: "تماس",
            chatLabel: "چت",
            chatActionLabel: "چت",
          }}
          showAgencyOwnerContact
          useAgencyAllocationPreview={false}
          usesPublicAdPresentation={false}
        />,
      );
    });

    const ownerButton = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("تماس با مالک"),
    );
    expect(ownerButton).toBeTruthy();
    expect(container.textContent).not.toContain("آگهی متعلق به شماست");

    await act(async () => {
      ownerButton?.click();
    });
    expect(onOpenContactInfo).toHaveBeenCalledWith("owner");
  });
});
