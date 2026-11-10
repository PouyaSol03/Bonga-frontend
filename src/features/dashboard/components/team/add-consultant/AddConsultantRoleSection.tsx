import { SelectionCheckIndicator } from "../../../../../shared/components/SelectionCheckIndicator";
import { Button } from "../../../../../shared/ui/Button";
import { Typography } from "../../../../../shared/ui/Typography";
import { AddConsultantRoleOption } from "../ConsultantCardWidgets";
import { managerAccessItems, type AccessRole } from "../teamTypes";

export function AddConsultantRoleSection({
  accessRole,
  managerAccess,
  onAccessRoleChange,
  onToggleManagerAccess,
}: {
  accessRole: AccessRole;
  managerAccess: string[];
  onAccessRoleChange: (role: AccessRole) => void;
  onToggleManagerAccess: (id: string) => void;
}) {
  const isManager = accessRole === "manager";

  return (
    <section className="border-surface-container bg-surface-container-lowest border-t-[8px] px-4 py-5">
      <Typography
        as="p"
        variant="title"
        size="medium"
        weight="semibold"
        className="text-on-surface m-0"
      >
        انتخاب سمت
      </Typography>

      <div aria-label="انتخاب سمت" className="mt-4 grid" role="radiogroup">
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

      <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-3">
        {managerAccessItems.map((item) => {
          const checked = managerAccess.includes(item.id);
          const isChecked = checked && isManager;

          return (
            <Button
              unstyled
              aria-pressed={isChecked}
              className={`flex items-center gap-2 text-right leading-4 ${
                isManager ? "text-on-surface-var" : "text-outline"
              }`}
              disabled={!isManager}
              key={item.id}
              onClick={() => onToggleManagerAccess(item.id)}
              type="button"
            >
              <SelectionCheckIndicator
                className={`h-4.5 w-4.5 rounded-sm ${
                  isChecked ? "" : isManager ? "!border-on-surface-var" : "!border-outline"
                }`}
                checked={isChecked}
              />
              <Typography
                as="span"
                variant="label"
                size="medium"
                weight="medium"
                className={isManager ? "text-on-surface-var" : "text-outline"}
              >
                {item.label}
              </Typography>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
