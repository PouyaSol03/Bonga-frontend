import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { SearchEmptyState } from "../../../../shared/components/SearchEmptyState";
import LinearFilterHorizontal from "../../../../shared/icons/LinearFilterHorizontal";
import { Button } from "../../../../shared/ui/Button";
import { SearchInputBar } from "../../../../shared/ui/SearchBar";
import { AdCard, type AdCardData } from "../../../advertisements/components/AdCard";
import { agencyPreviewPath } from "../types";

interface AgencyAdsTabProps {
  ads: AdCardData[];
  previewPath: string;
  showFilter?: boolean;
}

export function AgencyAdsTab({
  ads,
  previewPath,
  showFilter = true,
}: AgencyAdsTabProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const filterReturnTo = encodeURIComponent(`${previewPath}?tab=ads`);
  const normalizedQuery = query.trim().toLocaleLowerCase("fa-IR");
  const visibleAds = useMemo(
    () =>
      normalizedQuery
        ? ads.filter((ad) =>
            [ad.title, ad.agency, ad.area, ad.timeAndLocation, ...ad.badges]
              .join(" ")
              .toLocaleLowerCase("fa-IR")
              .includes(normalizedQuery),
          )
        : ads,
    [ads, normalizedQuery],
  );

  return (
    <div className="bg-surface-container-lowest space-y-2 px-0 pt-5 pb-3">
      <div className="flex items-center gap-2 px-4 [direction:ltr]">
        {showFilter ? (
          <Button
            unstyled
            aria-label="فیلتر آگهی‌ها"
            className="border-primary bg-primary-container text-primary grid h-12 w-12 shrink-0 place-items-center rounded-xl border"
            onClick={() => navigate(`${agencyPreviewPath}/filter?returnTo=${filterReturnTo}`)}
            type="button"
          >
            <LinearFilterHorizontal className="h-6 w-6" />
          </Button>
        ) : null}
        <div className="min-w-0 flex-1">
          <SearchInputBar
            compact
            debounceMs={300}
            onClear={() => setQuery("")}
            onDebouncedChange={setQuery}
            onValueChange={setQuery}
            placeholder="جستجو در آگهی‌ها"
            value={query}
          />
        </div>
      </div>

      <div className="flex flex-col pt-4">
        {visibleAds.length ? (
          visibleAds.map((ad) => (
            <AdCard
              className="border-surface-container shrink-0 border-b-[12px] last:border-b-0"
              key={ad.id}
              ad={ad}
              showAgency={false}
              to={`/ads/${ad.id}`}
              variant="standard"
            />
          ))
        ) : normalizedQuery ? (
          <SearchEmptyState />
        ) : (
          <div className="bg-surface-container-lowest text-outline px-4 py-12 text-center text-sm">
            آگهی فعالی برای نمایش وجود ندارد.
          </div>
        )}
      </div>
    </div>
  );
}
