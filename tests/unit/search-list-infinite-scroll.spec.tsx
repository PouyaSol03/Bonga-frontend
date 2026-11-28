import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, test, vi } from "vitest";
import { buildAdvertiseSearchParams } from "../../src/features/advertisements/api/advertisement/search-params";
import { SearchMapListView } from "../../src/features/search/components/SearchMapListView";
import { readSearchFilters } from "../../src/features/search/searchFilters";
import type { SearchMapListing } from "../../src/features/search/searchMapData";

let root: Root;
let container: HTMLDivElement;

afterEach(async () => {
  if (root) {
    await act(async () => root.unmount());
  }
  container?.remove();
});

function makeListings(count: number): SearchMapListing[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `آگهی شماره ${i + 1}`,
    priceLabel: "قیمت",
    priceValue: "1,000,000",
    priceSecondary: "",
    agencyName: "املاک برتر",
    locationLabel: "ونک",
    postedAt: "امروز",
    imageSrc: "",
    images: [],
    lat: 35.7,
    lng: 51.4,
    showPriceMarker: true,
  } as unknown as SearchMapListing));
}

describe("Search List Public Advertise Infinite Scroll & Filters", () => {
  test("buildAdvertiseSearchParams correctly formats sub_neighborhood_id and all query filters", () => {
    const params = buildAdvertiseSearchParams({
      areaMax: 200,
      areaMin: 50,
      buildingAge: "10",
      categoryId: "2",
      floor: "3",
      formCode: "sale-apartment",
      isSpecial: true,
      neighborhoodId: "15",
      priceMax: 10000000000,
      priceMin: 2000000000,
      query: "آپارتمان نورگیر",
      rooms: "2",
      subNeighborhoodId: "42",
    });

    expect(params.sub_neighborhood_id).toBe("42");
    expect(params.neighborhood_id).toBe("15");
    expect(params.category_id).toBe("2");
    expect(params.form_code).toBe("sale-apartment");
    expect(params.price_min).toBe(2000000000);
    expect(params.price_max).toBe(10000000000);
    expect(params.area_min).toBe(50);
    expect(params.area_max).toBe(200);
    expect(params.rooms).toBe("2");
    expect(params.floor).toBe("3");
    expect(params.building_age).toBe("10");
    expect(params.is_special).toBe(true);
    expect(params.query).toBe("آپارتمان نورگیر");
  });

  test("readSearchFilters parses sub_neighborhood_id without leaking into featureFilters", () => {
    const searchParams = new URLSearchParams({
      sub_neighborhood_id: "99",
      neighborhood_id: "12",
      category_id: "4",
      rooms: "3",
      custom_feature: "luxury",
    });

    const parsed = readSearchFilters(searchParams);
    expect(parsed.subNeighborhoodId).toBe("99");
    expect(parsed.neighborhoodId).toBe("12");
    expect(parsed.categoryId).toBe("4");
    expect(parsed.rooms).toBe("3");
    expect(parsed.featureFilters).toEqual({ custom_feature: "luxury" });
  });

  test("renders 3 skeleton cards at the bottom when isFetchingNextPage is true", async () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    const listings = makeListings(20);

    await act(async () => {
      root.render(
        <MemoryRouter>
          <SearchMapListView
            hasNextPage={true}
            isFetchingNextPage={true}
            listings={listings}
            onMapClick={vi.fn()}
          />
        </MemoryRouter>,
      );
    });

    // Check rendered ad links: 20 ads
    const adLinks = container.querySelectorAll("a[href^='/ads/']");
    expect(adLinks.length).toBe(20);

    // Check skeleton loading elements: 3 skeleton articles
    const skeletons = container.querySelectorAll("article[aria-hidden='true']");
    expect(skeletons.length).toBe(3);
  });

  test("triggers onFetchNextPage when scrolling reaches the prefetch threshold", async () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    const onFetchNextPage = vi.fn();
    const listings = makeListings(20);

    await act(async () => {
      root.render(
        <MemoryRouter>
          <SearchMapListView
            hasNextPage={true}
            isFetchingNextPage={false}
            listings={listings}
            onFetchNextPage={onFetchNextPage}
            onMapClick={vi.fn()}
          />
        </MemoryRouter>,
      );
    });

    const scrollContainer = container.querySelector("main");
    expect(scrollContainer).not.toBeNull();

    // Simulate scrolling near the bottom
    Object.defineProperty(scrollContainer!, "scrollTop", { value: 3000, configurable: true });
    Object.defineProperty(scrollContainer!, "scrollHeight", { value: 3200, configurable: true });
    Object.defineProperty(scrollContainer!, "clientHeight", { value: 600, configurable: true });

    await act(async () => {
      scrollContainer!.dispatchEvent(new Event("scroll"));
    });

    expect(onFetchNextPage).toHaveBeenCalled();
  });

  test("does not trigger onFetchNextPage when hasNextPage is false", async () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    const onFetchNextPage = vi.fn();
    const listings = makeListings(20);

    await act(async () => {
      root.render(
        <MemoryRouter>
          <SearchMapListView
            hasNextPage={false}
            isFetchingNextPage={false}
            listings={listings}
            onFetchNextPage={onFetchNextPage}
            onMapClick={vi.fn()}
          />
        </MemoryRouter>,
      );
    });

    const scrollContainer = container.querySelector("main");
    Object.defineProperty(scrollContainer!, "scrollTop", { value: 3000, configurable: true });
    Object.defineProperty(scrollContainer!, "scrollHeight", { value: 3200, configurable: true });
    Object.defineProperty(scrollContainer!, "clientHeight", { value: 600, configurable: true });

    await act(async () => {
      scrollContainer!.dispatchEvent(new Event("scroll"));
    });

    expect(onFetchNextPage).not.toHaveBeenCalled();
    const skeletons = container.querySelectorAll("article[aria-hidden='true']");
    expect(skeletons.length).toBe(0);
  });

  test("gates automatic fetch on pagination error and provides explicit retry button", async () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    const onFetchNextPage = vi.fn();
    const listings = makeListings(20);

    await act(async () => {
      root.render(
        <MemoryRouter>
          <SearchMapListView
            hasNextPage
            isFetchNextPageError
            isFetchingNextPage={false}
            listings={listings}
            onFetchNextPage={onFetchNextPage}
            onMapClick={vi.fn()}
          />
        </MemoryRouter>,
      );
    });

    const scrollContainer = container.querySelector("main");
    Object.defineProperty(scrollContainer!, "scrollTop", { value: 3000, configurable: true });
    Object.defineProperty(scrollContainer!, "scrollHeight", { value: 3200, configurable: true });
    Object.defineProperty(scrollContainer!, "clientHeight", { value: 600, configurable: true });

    await act(async () => {
      scrollContainer!.dispatchEvent(new Event("scroll"));
    });

    expect(onFetchNextPage).not.toHaveBeenCalled();

    const retryButton = Array.from(container.querySelectorAll("button")).find((btn) =>
      btn.textContent?.includes("تلاش مجدد"),
    );
    expect(retryButton).toBeTruthy();

    await act(async () => {
      retryButton?.click();
    });

    expect(onFetchNextPage).toHaveBeenCalledTimes(1);
  });
});
