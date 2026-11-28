import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useManagerAdDeletion } from "../../src/features/account/ad-state/useManagerAdDeletion";

const { removeAgencyMock, deleteAdMock } = vi.hoisted(() => ({
  removeAgencyMock: vi.fn().mockResolvedValue({}),
  deleteAdMock: vi.fn().mockResolvedValue({}),
}));

vi.mock("../../src/features/advertisements/api/advertisement.hooks", () => ({
  useRemoveAgencyAdvertisementMutation: () => ({ mutateAsync: removeAgencyMock }),
  useDeleteAdvertisementMutation: () => ({ mutateAsync: deleteAdMock }),
}));

function DeletionHarness({ isIndependentConsultant }: { isIndependentConsultant: boolean }) {
  const { handleDeleteAd } = useManagerAdDeletion(
    "592",
    "/account/manage-ads",
    undefined,
    isIndependentConsultant,
  );
  return (
    <button type="button" onClick={() => void handleDeleteAd()}>
      حذف
    </button>
  );
}

describe("Independent consultant ad deletion", () => {
  let root: Root | null = null;
  let container: HTMLDivElement | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    if (root) {
      await act(async () => root?.unmount());
      root = null;
    }
    container?.remove();
    container = null;
  });

  it("uses personal deleteAdvertisement mutation for independent consultant instead of agency endpoint", async () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    await act(async () => {
      root?.render(
        <MemoryRouter>
          <DeletionHarness isIndependentConsultant />
        </MemoryRouter>,
      );
    });

    await act(async () => {
      container?.querySelector("button")?.click();
    });

    expect(deleteAdMock).toHaveBeenCalledWith({
      advertiseId: "592",
      description: "حذف توسط مشاور",
    });
    expect(removeAgencyMock).not.toHaveBeenCalled();
  });

  it("uses removeAgencyAdvertisement mutation for agency manager", async () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    await act(async () => {
      root?.render(
        <MemoryRouter>
          <DeletionHarness isIndependentConsultant={false} />
        </MemoryRouter>,
      );
    });

    await act(async () => {
      container?.querySelector("button")?.click();
    });

    expect(removeAgencyMock).toHaveBeenCalledWith({
      advertiseId: "592",
      payload: {
        reason: "other",
        description: "حذف توسط آژانس",
      },
    });
    expect(deleteAdMock).not.toHaveBeenCalled();
  });
});
