import { Link } from "react-router";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import type { AdCardData } from "../../advertisements/components/AdCard";
import "../../advertisements/components/AdCard.css";
import { ChevronLeftIcon, StateIcon } from "./StateIcons";
import type { StateAction } from "./types";

export function StateAdAction({
  action,
  ad,
  card,
  deleteCompleteTo,
  returnTo,
  backTo,
}: {
  action: StateAction;
  ad?: Record<string, unknown>;
  card: AdCardData;
  deleteCompleteTo: string;
  returnTo: string;
  backTo?: string;
}) {
  const content = (
    <>
      <ChevronLeftIcon className="text-on-surface-var h-6 w-6" />
      <Typography
        as="span"
        variant="label"
        size="large"
        weight="medium"
        className="inline-flex gap-2 [direction:rtl]"
      >
        <StateIcon icon={action.icon} />
        {action.label}
      </Typography>
    </>
  );

  if (action.onClick) {
    return (
      <Button
        unstyled
        className="text-on-surface-var active:bg-surface-container flex h-14 w-full items-center justify-between px-4 [direction:ltr]"
        onClick={action.onClick}
        type="button"
      >
        {content}
      </Button>
    );
  }

  if (action.to) {
    const isAdAssigned = Boolean(
      ad?.is_assigned ||
      ad?.isAssigned ||
      ad?.assignment_status === "pending" ||
      ad?.assignment_status === "accepted" ||
      ad?.status === "wait_for_agency" ||
      ad?.status_key === "wait_for_agency",
    );

    return (
      <Link
        className="text-on-surface-var flex h-14 w-full items-center justify-between px-4 no-underline [direction:ltr]"
        replace={action.icon === "edit"}
        state={{
          ad: action.icon === "upgrade" && !ad ? card : ad,
          card,
          deleteCompleteTo: action.icon === "delete" ? deleteCompleteTo : undefined,
          deleteReturnTo: action.icon === "delete" ? window.location.pathname : undefined,
          editReturnTo: window.location.pathname,
          isEditMode: action.icon === "edit" ? true : undefined,
          previewFlow: action.icon === "preview" && isAdAssigned ? "agency-allocation" : undefined,
          paymentFlow:
            action.icon === "upgrade"
              ? "upgrade"
              : action.icon === "payment"
                ? "new-ad"
                : undefined,
          paymentHistoryReturnTo: action.icon === "history" ? window.location.pathname : undefined,
          visitStatisticsReturnTo: action.icon === "stats" ? window.location.pathname : undefined,
          returnTo: backTo ?? returnTo,
        }}
        to={action.to}
      >
        {content}
      </Link>
    );
  }

  return (
    <Button
      unstyled
      className="text-on-surface flex h-14 w-full items-center justify-between px-4 [direction:ltr]"
      type="button"
    >
      {content}
    </Button>
  );
}
