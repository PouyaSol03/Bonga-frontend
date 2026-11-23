import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "../../../../../shared/ui/Button";
import { Section } from "../../components/NewAdControls";
import { CrmTargetOwnerSelect } from "../../components/CrmTargetOwnerSelect";
import type { NewAdFormValues } from "../../types";

export function DetailsOwner() {
  const { setValue, watch } = useFormContext<NewAdFormValues>();
  const values = watch();
  const isCrm = new URLSearchParams(window.location.search).get("editSource") === "crm";

  useEffect(() => {
    if (!isCrm) return;
    const searchParams = new URLSearchParams(window.location.search);
    const targetType = searchParams.get("targetOwnerType") as "user" | "agency" | null;
    const targetId = searchParams.get("targetOwnerId");

    if (targetType && !values.targetOwnerType) {
      setValue("targetOwnerType", targetType);
    }
    if (targetId && !values.targetOwnerId) {
      setValue("targetOwnerId", targetId);
    }
  }, [isCrm, setValue, values.targetOwnerType, values.targetOwnerId]);
  if (!isCrm) return null;

  const targetOwnerName =
    new URLSearchParams(window.location.search).get("targetOwnerName") ||
    values.publisherName ||
    "";

  if (values.targetOwnerType && values.targetOwnerId) {
    return (
      <Section icon="personal-card.svg" title="مالک آگهی در پنل مدیریت">
        <div className="flex items-center justify-between rounded-xl border border-outline-var/40 bg-surface-container px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-primary-container px-2.5 py-1 text-xs font-bold text-on-primary-container">
              {values.targetOwnerType === "agency" ? "آژانس املاک" : "کاربر عادی"}
            </span>
            {targetOwnerName ? (
              <span className="text-sm font-semibold text-on-surface">{targetOwnerName}</span>
            ) : null}
            <span className="text-xs text-outline" dir="ltr">
              ({values.targetOwnerId})
            </span>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section icon="personal-card.svg" title="انتخاب مالک آگهی (پنل مدیریت)">
      <div className="flex flex-col gap-4">
        <div
          className="border-outline-var grid h-11 grid-cols-2 overflow-hidden rounded-xl border"
          dir="ltr"
        >
          <Button
            unstyled
            className={`text-sm font-bold transition ${values.targetOwnerType === "agency" ? "bg-primary text-on-primary" : "bg-surface-container-lowest text-on-surface-var"}`}
            onClick={() => setValue("targetOwnerType", "agency")}
            type="button"
          >
            آژانس املاک
          </Button>
          <Button
            unstyled
            className={`border-outline-var border-r text-sm font-bold transition ${values.targetOwnerType === "user" ? "bg-primary text-on-primary" : "bg-surface-container-lowest text-on-surface-var"}`}
            onClick={() => setValue("targetOwnerType", "user")}
            type="button"
          >
            کاربر عادی
          </Button>
        </div>

        {values.targetOwnerType && (
          <CrmTargetOwnerSelect
            type={values.targetOwnerType}
            value={values.targetOwnerId}
            onChange={(id) => setValue("targetOwnerId", id)}
          />
        )}
      </div>
    </Section>
  );
}
