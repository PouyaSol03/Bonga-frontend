import { useState } from "react";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import { useNeighborhoodListQuery } from "../../locations/api/neighborhood.hooks";
import { getNeighborhoodHierarchyDescription } from "../../locations/api/neighborhood.service";
import { readStoredSelectedCity } from "../../../shared/lib/selectedCityStorage";
import { SelectionCheckIndicator } from "../../../shared/components/SelectionCheckIndicator";
import { modalInputClassName } from "./constants";

export function CrmNeighborhoodMultiField({
  onChange,
  value,
}: {
  onChange: (ids: string[]) => void;
  value: string;
}) {
  const [query, setQuery] = useState("");
  const cityId = readStoredSelectedCity()?.id ?? "";
  const selectedIds = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: Boolean(cityId),
    perPage: 50,
    q: query,
  });

  const toggle = (id: string) => {
    onChange(
      selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id],
    );
  };

  return (
    <div className="rounded-xl border border-[#d7dce5] bg-white p-3">
      <input
        className={modalInputClassName}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="جستجوی محله..."
        value={query}
      />
      {!cityId ? (
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="m-0 mt-2 text-xs text-[#cc3342]"
        >
          ابتدا شهر را در سایت انتخاب کنید.
        </Typography>
      ) : null}
      {selectedIds.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedIds.map((id) => {
            const neighborhood = neighborhoodsQuery.data?.find(
              (item) => String(item.id ?? item._id) === id,
            );
            return (
              <Button
                unstyled
                className="rounded-lg bg-[#eef4ff] px-2.5 py-1.5 text-xs font-bold text-[#0048c4]"
                key={id}
                onClick={() => toggle(id)}
                type="button"
              >
                {neighborhood?.name ?? id} ×
              </Button>
            );
          })}
        </div>
      ) : null}
      <div className="mt-3 max-h-56 space-y-1 overflow-y-auto">
        {neighborhoodsQuery.isLoading ? (
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="px-2 text-sm text-[#7b8494]"
          >
            در حال جستجو...
          </Typography>
        ) : (
          neighborhoodsQuery.data?.map((neighborhood) => {
            const id = String(neighborhood.id ?? neighborhood._id ?? "");
            const checked = selectedIds.includes(id);
            return (
              <Button
                unstyled
                aria-pressed={checked}
                className={`flex h-14 w-full items-center justify-between gap-3 rounded-[10px] px-2 text-right text-base transition-colors active:bg-[#0048c40a] ${checked ? "text-[#0048c4]" : "text-[#1a1a1a] hover:bg-[#f5f7fa]"}`}
                key={id}
                onClick={() => toggle(id)}
                type="button"
              >
                <Typography
                  as="span"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="min-w-0 flex-1 [direction:rtl]"
                >
                  <Typography
                    as="span"
                    variant="label"
                    size="medium"
                    weight="medium"
                    className="block truncate"
                  >
                    {neighborhood.name}
                  </Typography>
                  {getNeighborhoodHierarchyDescription(neighborhood) ? (
                    <Typography
                      as="span"
                      variant="body"
                      size="small"
                      weight="regular"
                      className="mt-0.5 line-clamp-1 block text-[#8b94a3]"
                    >
                      {getNeighborhoodHierarchyDescription(neighborhood)}
                    </Typography>
                  ) : null}
                </Typography>
                <SelectionCheckIndicator checked={checked} />
              </Button>
            );
          })
        )}
      </div>
    </div>
  );
}
