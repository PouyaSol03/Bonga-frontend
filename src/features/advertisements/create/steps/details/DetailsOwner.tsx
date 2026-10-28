import { useFormContext } from "react-hook-form";
import { Button } from "../../../../../shared/ui/Button";
import { Section } from "../../components/NewAdControls";
import { CrmTargetOwnerSelect } from "../../components/CrmTargetOwnerSelect";
import type { NewAdFormValues } from "../../types";

export function DetailsOwner() {
  const { setValue, watch } = useFormContext<NewAdFormValues>();
  const values = watch();
  const isCrm = new URLSearchParams(window.location.search).get("editSource") === "crm";
  return (
    <>
      {isCrm && (
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
      )}
    </>
  );
}
