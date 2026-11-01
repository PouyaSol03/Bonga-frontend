import { AnimatePresence, motion } from "motion/react";
import { Button } from "../../../../../shared/ui/Button";
import { RadioIndicator } from "../../../../../shared/components/RadioIndicator";
import { Typography } from "../../../../../shared/ui/Typography";
import LinearBuilding2 from "../../../../../shared/icons/LinearBuilding2";
import LinearUserSolid from "../../../../../shared/icons/LinearUserSolid";
import LinearArrowLeft1 from "../../../../../shared/icons/LinearArrowLeft1";
import type { publisherOptions, SelectableConsultant } from "../types";

export function PublisherIcon({
  className,
  icon,
}: {
  className?: string;
  icon: "agency" | "consultant";
}) {
  if (icon === "agency") return <LinearBuilding2 className={className} />;
  return <LinearUserSolid className={className} />;
}

export function ConsultantAvatar({
  className,
  consultant,
}: {
  className: string;
  consultant: SelectableConsultant;
}) {
  if (consultant.avatarSrc) {
    return (
      <img
        alt=""
        className={`${className} shrink-0 rounded-full object-cover`}
        draggable={false}
        src={consultant.avatarSrc}
      />
    );
  }

  return (
    <Typography
      as="span"
      variant="label"
      size="small"
      weight="semibold"
      aria-hidden="true"
      className={`${className} bg-primary-container text-primary grid shrink-0 place-items-center rounded-full text-xs font-semibold`}
    >
      {consultant.name.trim().charAt(0) || "م"}
    </Typography>
  );
}

export function PublisherOptionCard({
  assignedConsultant,
  onAssignConsultant,
  onSelect,
  option,
  selected,
}: {
  assignedConsultant: SelectableConsultant | null;
  onAssignConsultant: () => void;
  onSelect: () => void;
  option: (typeof publisherOptions)[number];
  selected: boolean;
}) {
  const isConsultant = option.value === "consultant";

  return (
    <motion.div
      layout
      animate={{
        scale: selected ? 1.01 : 1,
      }}
      whileTap={{ scale: 0.985 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
      className={`w-full rounded-xl border p-4 text-right ${
        selected ? "border-primary" : "border-outline-var"
      }`}
    >
      <Button
        unstyled
        aria-checked={selected}
        className="flex min-h-[48px] w-full justify-between gap-3 border-0 bg-transparent text-right [direction:ltr]"
        onClick={onSelect}
        role="radio"
        type="button"
      >
        <RadioIndicator className="m-3" checked={selected} />
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="flex min-w-0 flex-1 items-start gap-2 text-right [direction:rtl]"
        >
          <PublisherIcon className="text-on-surface-var h-6 w-6 shrink-0" icon={option.icon} />
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="min-w-0 flex-1"
          >
            <Typography
              as="p"
              variant="body"
              size="large"
              weight="regular"
              className="text-on-surface block"
            >
              {option.label}
            </Typography>
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="text-outline block"
            >
              {option.description}
            </Typography>
          </Typography>
        </Typography>
      </Button>

      <AnimatePresence initial={false}>
        {selected && isConsultant ? (
          <motion.div
            key="consultant-options"
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 22 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
            className="flex flex-col gap-2.5"
          >
            {assignedConsultant ? (
              <div className="flex items-center gap-4 text-right [direction:rtl]">
                <ConsultantAvatar
                  consultant={assignedConsultant}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <Typography
                  as="span"
                  variant="title"
                  size="medium"
                  weight="semibold"
                  className="text-on-surface text-base font-semibold"
                >
                  {assignedConsultant.name}
                </Typography>
              </div>
            ) : null}

            <Button
              unstyled
              className="border-primary text-primary active:bg-primary/10 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-colors [direction:rtl]"
              onClick={onAssignConsultant}
              type="button"
            >
              <span>{assignedConsultant ? "تغییر مشاور" : "تعیین مشاور"}</span>
              <LinearArrowLeft1 className="h-5 w-5" />
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
