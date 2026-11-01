import { Link, useNavigate } from "react-router";
import type { AccountAction } from "../types";
import { AccountIcon } from "../accountIconMap";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import {
  getStoredAuthSession,
  setStoredActiveRole,
  storeLoginRedirectPath,
} from "../../../../shared/auth/auth-storage";
import { getLoginRequiredPath } from "../navigationHelpers";

export function Divider({ spaced = false }: { spaced?: boolean }) {
  return (
    <div className={spaced ? "py-0.5" : ""} aria-hidden="true">
      <div className="bg-outline-var mx-4 h-px" />
    </div>
  );
}

export function ChevronLeftIcon({ className = "" }: { className?: string }) {
  return <LinearArrowLeft1 aria-hidden="true" className={className} />;
}

export function AccountMenuRow({
  action,
  hasDivider = false,
  spacedDivider = false,
}: {
  action: AccountAction;
  hasDivider?: boolean;
  spacedDivider?: boolean;
}) {
  const navigate = useNavigate();
  const isDanger = action.tone === "danger";
  const isWarning = action.tone === "warning";
  const isDisabled = Boolean(action.disabled);

  const content = (
    <>
      {isDisabled ? (
        action.badge ? (
          <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
            {action.badge}
          </span>
        ) : null
      ) : (
        <ChevronLeftIcon
          className={`h-6 w-6 shrink-0 ${isDanger ? "text-error" : isWarning ? "text-amber-500" : "text-on-surface-var"}`}
        />
      )}
      <Typography
        as="span"
        variant="label"
        size="large"
        weight="medium"
        className={`flex-1 text-right text-base font-medium [direction:rtl] ${
          isDanger ? "text-on-error-container" : isWarning ? "text-amber-800" : ""
        }`}
      >
        {action.label}
      </Typography>
      <AccountIcon
        className={`h-6 w-6 shrink-0 ${isDanger ? "text-error" : isWarning ? "text-amber-600" : "text-on-surface-var"}`}
        name={action.icon}
      />
    </>
  );

  if (isDisabled) {
    return (
      <>
        <div
          aria-disabled="true"
          className="text-on-surface flex h-14 w-full cursor-not-allowed items-center gap-2 bg-amber-50/50 px-4 [direction:ltr]"
        >
          {content}
        </div>
        {hasDivider ? <Divider spaced={spacedDivider} /> : null}
      </>
    );
  }

  return (
    <>
      {action.to ? (
        <Link
          className="bg-surface-container-lowest text-on-surface focus-visible:outline-primary/25 flex w-full cursor-pointer items-center gap-2 p-4 [direction:ltr] focus-visible:outline-3 focus-visible:outline-offset-[-3px]"
          onClick={(event) => {
            if (action.requiresAuth && !getStoredAuthSession()) {
              event.preventDefault();
              storeLoginRedirectPath(action.to ?? "/account");
              navigate(getLoginRequiredPath(action.to ?? "/account", action.label));
              return;
            }

            if (action.activeRole) {
              setStoredActiveRole(action.activeRole);
            }

            action.onClick?.();
          }}
          to={action.to}
        >
          {content}
        </Link>
      ) : (
        <Button
          unstyled
          className="bg-surface-container-lowest text-on-surface focus-visible:outline-primary/25 flex h-14 w-full cursor-pointer items-center gap-2 px-4 [direction:ltr] focus-visible:outline-3 focus-visible:outline-offset-[-3px]"
          onClick={action.onClick}
          type="button"
        >
          {content}
        </Button>
      )}
      {hasDivider ? <Divider spaced={spacedDivider} /> : null}
    </>
  );
}
