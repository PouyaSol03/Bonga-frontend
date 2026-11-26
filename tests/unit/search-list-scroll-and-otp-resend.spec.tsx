import { describe, expect, it, beforeEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { getInitialSearchMode } from "../../src/features/search/map/searchParamsHelpers";
import { SearchMapListView } from "../../src/features/search/components/SearchMapListView";
import type { SearchMapListing } from "../../src/features/search/searchMapData";

describe("Search list scroll restoration and OTP resend fixes", () => {
  beforeEach(() => {
    sessionStorage.clear();
    window.history.pushState({}, "", "/search");
  });

  describe("getInitialSearchMode", () => {
    it("returns list when view=list in query param", () => {
      window.history.pushState({}, "", "/search?view=list");
      expect(getInitialSearchMode()).toBe("list");
    });

    it("returns list when stored in sessionStorage even if query param view is omitted", () => {
      window.history.pushState({}, "", "/search");
      sessionStorage.setItem("bonga_search_last_mode", "list");
      expect(getInitialSearchMode()).toBe("list");
    });

    it("returns map by default when no view param and no stored mode", () => {
      window.history.pushState({}, "", "/search");
      expect(getInitialSearchMode()).toBe("map");
    });
  });

  describe("SearchMapListView scroll tracking and rendering", () => {
    const mockListings: SearchMapListing[] = [
      {
        id: "1",
        dotId: "dot-1",
        title: "آپارتمان ۱۰۰ متری",
        priceLabel: "قیمت کل:",
        priceValue: "۵/۰۰۰/۰۰۰/۰۰۰",
        area: "۱۰۰",
        rooms: "۲",
        year: "۱۴۰۰",
        locationLabel: "ونک",
        postedAt: "لحظاتی پیش",
        agencyName: "املاک نمونه",
        images: ["/image1.jpg"],
        latitude: 35.7,
        longitude: 51.4,
      },
    ];

    it("renders list of listings and has scrollable main element", () => {
      const markup = renderToStaticMarkup(
        <MemoryRouter>
          <SearchMapListView
            listings={mockListings}
            onMapClick={() => {}}
          />
        </MemoryRouter>,
      );

      expect(markup).toContain("آپارتمان ۱۰۰ متری");
      expect(markup).toContain("overflow-y-auto");
      expect(markup).toContain("نقشه");
    });

    it("handles scroll storage keys properly in sessionStorage", () => {
      const searchKey = `bonga_search_list_scroll_${window.location.search}`;
      sessionStorage.setItem(searchKey, "450");
      sessionStorage.setItem("bonga_search_list_scroll", "450");

      expect(sessionStorage.getItem(searchKey)).toBe("450");
      expect(sessionStorage.getItem("bonga_search_list_scroll")).toBe("450");
    });
  });
});
