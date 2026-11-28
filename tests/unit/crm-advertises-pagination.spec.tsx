import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildPaginationTokens,
  CrmAdvertisesPagination,
} from "../../src/features/crm/components/CrmAdvertisesPagination";
import { listCrmAdvertisesPaginated } from "../../src/features/crm/api/services/crmAdvertises.service";

const { postMock } = vi.hoisted(() => ({
  postMock: vi.fn(),
}));

vi.mock("../../src/shared/api/api", () => ({
  api: {
    post: postMock,
    get: vi.fn(),
  },
}));

describe("CRM Advertises Pagination", () => {
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

  it("sends page and per_page to panel/advertise/list and normalizes pagination metadata", async () => {
    postMock.mockReturnValue({
      json: async () => ({
        data: [{ id: 1, title: "آگهی ۱" }],
        total: 100,
        page: 3,
        per_page: 24,
        last_page: 5,
      }),
    });

    const result = await listCrmAdvertisesPaginated({
      page: 3,
      perPage: 24,
      status: "accepted",
      trackCode: "1234",
    });

    expect(postMock).toHaveBeenCalledWith("panel/advertise/list", {
      json: {
        page: 3,
        per_page: 24,
        status: "accepted",
        track_code: "1234",
      },
    });
    expect(result).toEqual({
      data: [{ id: 1, title: "آگهی ۱" }],
      page: 3,
      perPage: 24,
      total: 100,
      lastPage: 5,
    });
  });

  it("renders pagination controls and handles page and page size changes", async () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    const onChangePage = vi.fn();
    const onChangePerPage = vi.fn();

    await act(async () => {
      root?.render(
        <CrmAdvertisesPagination
          currentPage={2}
          isFetching={false}
          onChangePage={onChangePage}
          onChangePerPage={onChangePerPage}
          perPage={24}
          total={100}
          totalPages={5}
        />,
      );
    });

    expect(container.textContent).toContain("صفحه ۲ از ۵ (۱۰۰ آگهی)");

    const buttons = Array.from(container.querySelectorAll("button"));
    const prevButton = buttons.find((btn) => btn.textContent?.includes("قبلی"));
    const nextButton = buttons.find((btn) => btn.textContent?.includes("بعدی"));
    expect(prevButton?.disabled).toBe(false);
    expect(nextButton?.disabled).toBe(false);

    await act(async () => {
      prevButton?.click();
      nextButton?.click();
    });

    expect(onChangePage).toHaveBeenNthCalledWith(1, 1);
    expect(onChangePage).toHaveBeenNthCalledWith(2, 3);

    const select = container.querySelector('select[aria-label="تعداد در صفحه"]') as HTMLSelectElement;
    expect(select).toBeTruthy();

    await act(async () => {
      select.value = "48";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(onChangePerPage).toHaveBeenCalledWith(48);
  });

  it("shows 3 pages before and 3 pages after current page and jumps on click", async () => {
    expect(buildPaginationTokens(6, 12)).toEqual([
      1,
      "ellipsis-start",
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      "ellipsis-end",
      12,
    ]);
    expect(buildPaginationTokens(2, 10)).toEqual([1, 2, 3, 4, 5, "ellipsis-end", 10]);

    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    const onChangePage = vi.fn();

    await act(async () => {
      root?.render(
        <CrmAdvertisesPagination
          currentPage={6}
          isFetching={false}
          onChangePage={onChangePage}
          onChangePerPage={vi.fn()}
          perPage={24}
          total={288}
          totalPages={12}
        />,
      );
    });

    const page9Button = container.querySelector('button[aria-label="صفحه ۹"]') as HTMLButtonElement;
    const page3Button = container.querySelector('button[aria-label="صفحه ۳"]') as HTMLButtonElement;
    expect(page9Button).toBeTruthy();
    expect(page3Button).toBeTruthy();

    await act(async () => {
      page9Button.click();
    });
    expect(onChangePage).toHaveBeenCalledWith(9);
  });
});
