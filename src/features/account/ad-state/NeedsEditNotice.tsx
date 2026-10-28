import { Link } from "react-router";
import { Typography } from "../../../shared/ui/Typography";
import type { AdCardData } from "../../advertisements/components/AdCard";
import "../../advertisements/components/AdCard.css";
import { adManagementPaths, getAdEditPath } from "../adManagement/adManagementData";
import { readModerationReasons } from "./adModel";
import { AlertIcon, StateIcon } from "./StateIcons";

export function NeedsEditNotice({
  ad,
  card,
  returnTo,
}: {
  ad?: Record<string, unknown>;
  card: AdCardData;
  returnTo: string;
}) {
  return (
    <div className="border-warning bg-warning-container mt-4 rounded-2xl border p-4 text-right">
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface m-0 text-sm leading-7 font-normal"
      >
        برای انتشار مجدد آگهی، لطفا موارد زیر را اصلاح کنید.
      </Typography>

      <div className="border-warning bg-surface-container-lowest mt-3 rounded-lg border px-3 py-3">
        <div className="text-warning flex items-center justify-start gap-2">
          <AlertIcon className="h-5 w-5 shrink-0" />
          <Typography
            as="h3"
            variant="title"
            size="small"
            weight="medium"
            className="m-0 text-sm leading-5 font-medium"
          >
            دلیل توقف انتشار
          </Typography>
        </div>

        <ul className="text-on-surface marker:text-outline m-0 mt-2 list-disc space-y-2 pr-5 text-xs leading-6 font-normal">
          {readModerationReasons(ad).map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>

      <Link
        className="bg-primary text-on-primary mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm leading-5 font-medium no-underline"
        replace
        state={{
          ad,
          card,
          editReturnTo: window.location.pathname,
          isEditMode: true,
          returnTo,
        }}
        to={getAdEditPath(card.id, returnTo || adManagementPaths.root, (ad ?? card) as never)}
      >
        ویرایش آگهی
        <StateIcon icon="edit" />
      </Link>
    </div>
  );
}
