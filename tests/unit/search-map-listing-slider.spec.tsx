import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { afterEach, expect, test, vi } from "vitest";
import { SearchMapListingSlider } from "../../src/features/search/components/SearchMapListingSlider";
import type { SearchMapListing } from "../../src/features/search/searchMapData";

let root: Root;
let container: HTMLDivElement;

afterEach(async () => {
  if (root) {
    await act(async () => root.unmount());
  }
  container?.remove();
});

function makeListing(id: number, title: string): SearchMapListing {
  return {
    id,
    title,
    priceLabel: "قیمت",
    priceValue: "5,000,000,000",
    area: "100",
    rooms: "2",
    year: "1402",
    locationLabel: "تهران",
    postedAt: "امروز",
    images: [],
    imageSrc: "",
    lat: 35.7,
    lng: 51.4,
    category: "apartment",
    transaction: "sale",
  } as unknown as SearchMapListing;
}

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

test("clicking a side card selects and centers it without navigating, while clicking the centered card navigates", async () => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);

  const listings = [
    makeListing(1, "آگهی اول"),
    makeListing(2, "آگهی دوم"),
    makeListing(3, "آگهی سوم"),
  ];
  const onActiveListingChange = vi.fn();

  await act(async () =>
    root.render(
      <MemoryRouter initialEntries={["/search"]}>
        <LocationDisplay />
        <Routes>
          <Route
            path="/search"
            element={
              <SearchMapListingSlider
                isOpen
                listings={listings}
                selectedListingId={2}
                onActiveListingChange={onActiveListingChange}
              />
            }
          />
          <Route path="/ads/:id" element={<div>Ad Detail</div>} />
        </Routes>
      </MemoryRouter>,
    ),
  );

  const scrollEl = container.querySelector('[dir="rtl"] > div') as HTMLDivElement;
  const scrollByMock = vi.fn();
  scrollEl.scrollBy = scrollByMock;
  scrollEl.getBoundingClientRect = () =>
    ({ left: 0, width: 400, right: 400, top: 0, bottom: 216, height: 216 }) as DOMRect;

  const cards = Array.from(
    container.querySelectorAll<HTMLAnchorElement>("[data-map-slider-card]"),
  );
  expect(cards).toHaveLength(3);

  cards[0].getBoundingClientRect = () =>
    ({ left: -300, width: 360, right: 60, top: 0, bottom: 216, height: 216 }) as DOMRect;
  cards[1].getBoundingClientRect = () =>
    ({ left: 20, width: 360, right: 380, top: 0, bottom: 216, height: 216 }) as DOMRect;
  cards[2].getBoundingClientRect = () =>
    ({ left: 390, width: 360, right: 750, top: 0, bottom: 216, height: 216 }) as DOMRect;

  // Clicking a side (non-centered) card centers it without navigating away from /search
  await act(async () => {
    cards[2].dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });
  expect(container.querySelector('[data-testid="location"]')?.textContent).toBe("/search");
  expect(onActiveListingChange).toHaveBeenCalledTimes(1);
  expect(onActiveListingChange).toHaveBeenCalledWith(listings[2]);
  expect(scrollByMock).toHaveBeenCalledWith({ left: 370, behavior: "smooth" });

  // Clicking the centered (selected) card navigates to its detail route
  onActiveListingChange.mockClear();
  await act(async () => {
    cards[1].dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });
  expect(onActiveListingChange).not.toHaveBeenCalled();
  expect(container.querySelector('[data-testid="location"]')?.textContent).toBe("/ads/2");
});
