import { Typography } from "../../../../shared/ui/Typography";
import LinearClock from "../../../../shared/icons/LinearClock";

export interface ActivityLogItem {
  id: string;
  time: string;
  description: string;
}

export interface ViewAdLeadActivitySectionProps {
  activities: ActivityLogItem[];
}

export function ViewAdLeadActivitySection({
  activities,
}: ViewAdLeadActivitySectionProps) {
  return (
    <section className="bg-surface-container-lowest p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 text-on-surface">
        <Typography
          as="h3"
          variant="label"
          size="large"
          weight="medium"
          className="text-on-surface"
        >
          آخرین تغییرات
        </Typography>
      </div>

      <div className="flex flex-col">
        {activities.map((act, index) => (
          <div key={act.id} className="flex flex-col">
            <div className="flex flex-col gap-2 py-2">
              <div className="flex items-center gap-1">
                <LinearClock className="h-4 w-4 text-on-surface-var" />
                <Typography
                  as="span"
                  variant="body"
                  size="small"
                  weight="regular"
                  className="text-on-surface-var"
                >
                  {act.time}
                </Typography>
              </div>
              <Typography
                as="p"
                variant="body"
                size="medium"
                weight="regular"
                className="text-on-surface"
              >
                {act.description}
              </Typography>
            </div>
            {index < activities.length - 1 && (
              <div className="h-px bg-surface-container my-1" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
