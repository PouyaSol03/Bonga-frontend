import { useEffect, useRef, useState } from "react";
import LinearMoreVertical from "../../../../../shared/icons/LinearMoreVertical";
import LinearEdit2 from "../../../../../shared/icons/LinearEdit2";
import LinearDelete from "../../../../../shared/icons/LinearDelete";
import { RouteLink } from "../../../../../shared/navigation/RouteLink";
import { Typography } from "../../../../../shared/ui/Typography";
import {
  ConsultantAvatar,
  consultantTeamPaths,
  formatPhoneNumber,
  type TeamConsultant,
} from "../ConsultantManagementPage";

export function ConsultantProfileHeader({
  consultant,
  consultantId,
}: {
  consultant: TeamConsultant;
  consultantId: number | string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  const isInactive = !consultant.isActive || consultant.status === "pending";

  return (
    <div className="w-full bg-surface-container-lowest px-4 pt-3 pb-4">
      {isInactive && (
        <div className="mb-2 flex justify-end">
          <span className="inline-flex items-center rounded-lg bg-error/8 px-3 py-1 text-xs font-medium text-error">
            ۷ روز بدون فعالیت
          </span>
        </div>
      )}

      <div className="relative flex w-full items-center justify-between border border-surface-container p-4 rounded-2xl">
        <div className="flex min-w-0 items-center gap-3">
          <ConsultantAvatar consultant={consultant} sizeClassName="h-14 w-14 shrink-0 rounded-full" />
          <div className="min-w-0">
            <Typography as="h1" variant="label" size="large" weight="medium" className="text-on-surface">
              {consultant.name}
            </Typography>
            <div className="mt-1 flex items-center gap-2">
              <Typography as="span" variant="body" size="medium" weight="regular" className="text-outline">
                {consultant.roleLabel || "مشاور"}
              </Typography>
              {consultant.phone ? (
                <>
                  <span className="h-5 w-px bg-outline-var" />
                  <Typography
                    as="span"
                    dir="ltr"
                    variant="body"
                    size="medium"
                    weight="regular"
                    className="text-outline [direction:ltr]"
                  >
                    {formatPhoneNumber(consultant.phone)}
                  </Typography>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="گزینه‌های مشاور"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center left-0 top-0 rounded-full text-on-surface-var"
          >
            <LinearMoreVertical className="h-6 w-6" />
          </button>

          {menuOpen && (
            <div className="absolute left-0 top-11 z-30 min-w-[150px] rounded-xl border border-outline-var/40 bg-surface-container-lowest p-1.5 shadow-lg">
              <RouteLink
                to={`${consultantTeamPaths.edit}/${consultantId}`}
                state={{ consultant }}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface"
                onClick={() => setMenuOpen(false)}
              >
                <LinearEdit2 className="h-4 w-4 text-on-surface-var" />
                <span>ویرایش مشاور</span>
              </RouteLink>
              <RouteLink
                to={`${consultantTeamPaths.remove}/${consultantId}`}
                state={{ consultant }}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-error"
                onClick={() => setMenuOpen(false)}
              >
                <LinearDelete className="h-4 w-4 text-error" />
                <span>حذف مشاور</span>
              </RouteLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
