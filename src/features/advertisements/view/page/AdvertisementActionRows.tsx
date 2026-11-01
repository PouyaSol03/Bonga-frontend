import { type AdvertisementItem } from "../../api/advertisement.service";
import { ViewAdIcon } from ".././ViewAdIcon";
import type { ViewAdDetails } from ".././viewAdTypes";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";
import { getAdvertisementNeighborhood } from "./advertisementNeighborhood";

export function AdvertisementActionRows({ad,details,isPreview,hideRestrictedActions,onRowAction}:{ad:AdvertisementItem;details:ViewAdDetails;isPreview:boolean;hideRestrictedActions:boolean;onRowAction:(label:string)=>void}) {
  const selectedNeighborhood = getAdvertisementNeighborhood(ad, details);
  const actionRows = details.rows.map((row) =>
    row.icon === "apartment" && selectedNeighborhood
      ? { ...row, label: `آژانس‌های محله ${selectedNeighborhood.name}` }
      : row,
  );
  const visibleRows = isPreview
    ? []
    : hideRestrictedActions
      ? actionRows.filter((row) => !row.label.includes("بازخورد") && !row.label.includes("تخلف"))
      : actionRows;
return (<>
      {visibleRows.length > 0 ? (
        <section className="border-surface-container bg-surface-container-lowest border-t-8">
          {visibleRows.map((row) => (
            <Button
              unstyled
              className="border-surface-container last:border-surface-container-lowest focus-visible:outline-inset focus-visible:outline-primary/40 flex w-full items-center justify-between border-b-8 p-4 text-right last:border-b-[16px] focus-visible:outline-3"
              key={row.label}
              onClick={() => onRowAction(row.label)}
              type="button"
            >
              <div className="flex min-w-0 items-center gap-2">
                <ViewAdIcon className="text-outline" name={row.icon} />
                <Typography
                  as="span"
                  variant="label"
                  size="large"
                  weight="medium"
                  className="text-on-surface"
                >
                  {row.label}
                </Typography>
              </div>
              <ViewAdIcon className="text-on-surface-var" name="arrowLeft" />
            </Button>
          ))}
        </section>
      ) : null}
</>); }
