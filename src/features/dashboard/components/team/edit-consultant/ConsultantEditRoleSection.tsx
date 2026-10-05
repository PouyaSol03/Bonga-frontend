import { SelectionCheckIndicator } from "../../../../../shared/components/SelectionCheckIndicator";
import { Button } from "../../../../../shared/ui/Button";
import { Typography } from "../../../../../shared/ui/Typography";
import { AddConsultantRoleOption } from "../ConsultantCardWidgets";
import { managerAccessItems, type AccessRole } from "../teamTypes";

export function ConsultantEditRoleSection({
  accessRole,
  isManager,
  managerAccess,
  onAccessRoleChange,
  onToggleManagerAccess,
}: {
  accessRole: AccessRole;
  isManager: boolean;
  managerAccess: string[];
  onAccessRoleChange: (role: AccessRole) => void;
  onToggleManagerAccess: (id: string) => void;
}) {
  return (
    <section className="mt-5">
      <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-right text-base font-semibold leading-6 text-on-surface">
        انتخاب سمت
      </Typography>

      <div className="mt-4 grid" role="radiogroup" aria-label="انتخاب سمت">
        <AddConsultantRoleOption
          checked={accessRole === "consultant"}
          label="مشاور"
          onClick={() => onAccessRoleChange("consultant")}
        />
        <AddConsultantRoleOption
          checked={accessRole === "manager"}
          label="مدیر"
          onClick={() => onAccessRoleChange("manager")}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-7 gap-y-5">
        {managerAccessItems.map((item) => {
          const checked = managerAccess.includes(item.id) && isManager;

          return (
            <Button
              unstyled
              aria-pressed={checked}
              className={`flex items-center gap-2 text-right text-sm font-medium leading-5 ${
                isManager ? "text-on-surface-var" : "text-outline"
              }`}
              disabled={!isManager}
              key={item.id}
              onClick={() => onToggleManagerAccess(item.id)}
              type="button"
            >
              <SelectionCheckIndicator className="h-[18px] w-[18px] rounded-sm" checked={checked} />
              <Typography as="span" variant="body" size="medium" weight="regular">
                {item.label}
              </Typography>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
