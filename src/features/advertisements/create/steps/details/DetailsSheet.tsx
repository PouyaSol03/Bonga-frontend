import { BottomSheet, BottomSheetActionList } from "../../../../../shared/components/BottomSheet";
import { ChoiceIndicator } from "../../../../../shared/ui/Choice";
import { Typography } from "../../../../../shared/ui/Typography";
import { Button } from "../../../../../shared/ui/Button";
import type { NewAdFormValues, SheetState } from "../../types";
import type { SetDetailsField, OpenDetailsSheet } from "./types";
import { toggleArray } from "./formatters";

export function DetailsSheet({
  sheet,
  setSheet,
  values,
  setField,
}: {
  sheet: SheetState | null;
  setSheet: OpenDetailsSheet;
  values: NewAdFormValues;
  setField: SetDetailsField;
}) {
  return (
    <BottomSheet
      ariaLabel={sheet?.title ?? "انتخاب"}
      className={sheet?.kind === "exchange" ? "!rounded-t-[24px]" : "rounded-t-[14px]"}
      contentClassName={
        sheet?.kind === "exchange" ? "min-h-0 flex-1 overflow-y-auto pt-1" : "pb-6 pt-0"
      }
      handleClassName={
        sheet?.kind === "exchange"
          ? "h-1 w-[56px] rounded-full bg-outline-var"
          : "h-1 w-[42px] rounded-full bg-outline-var"
      }
      headerButtonAriaLabel="بازگشت"
      headerClassName={sheet?.kind === "exchange" ? "!gap-0 !px-2" : ""}
      heightClassName={
        sheet?.kind === "exchange" ? "h-[min(660px,calc(100svh-24px))]" : "h-auto max-h-[50svh]"
      }
      maxHeight={sheet?.kind === "exchange" ? undefined : "50svh"}
      isOpen={Boolean(sheet)}
      onBack={() => setSheet(null)}
      onClose={() => setSheet(null)}
      panelPaddingClassName={sheet?.kind === "exchange" ? "flex flex-col pt-3" : "pt-3"}
      showBackButton={sheet?.kind === "exchange" || sheet?.kind === "multiSelect"}
      showHandle
      showHeader
      showHeaderDivider={sheet?.kind !== "exchange" && sheet?.kind !== "multiSelect"}
      title={sheet?.title ?? "انتخاب"}
      titleAlign={sheet?.kind === "exchange" || sheet?.kind === "multiSelect" ? "right" : "center"}
    >
      {sheet?.kind === "exchange" ? (
        <div className="px-4" dir="rtl">
          {sheet.options.map((option) => {
            const checked = values.exchangeTargets.includes(option);

            return (
              <Button
                unstyled
                className="text-on-surface flex h-[72px] w-full items-center justify-between gap-3 pr-4 pl-5 text-right"
                key={option}
                onClick={() =>
                  setField("exchangeTargets", toggleArray(values.exchangeTargets, option))
                }
                type="button"
              >
                <Typography as="span" variant="body" size="large" weight="regular">
                  {option}
                </Typography>
                <ChoiceIndicator checked={checked} />
              </Button>
            );
          })}
        </div>
      ) : sheet?.kind === "multiSelect" ? (
        <div className="px-5 pt-3 pb-4" dir="rtl">
          {sheet.options.map((option) => {
            const checked = values[sheet.key].includes(option);

            return (
              <Button
                unstyled
                className="text-on-surface flex h-[72px] w-full items-center justify-between gap-3 text-right"
                key={option}
                onClick={() => setField(sheet.key, toggleArray(values[sheet.key], option))}
                type="button"
              >
                <Typography as="span" variant="body" size="large" weight="regular">
                  {option}
                </Typography>
                <ChoiceIndicator checked={checked} />
              </Button>
            );
          })}
        </div>
      ) : (
        <BottomSheetActionList
          align="center"
          isOpen={Boolean(sheet)}
          items={(sheet?.options ?? []).map((option) => ({
            id: option,
            title: option,
          }))}
          itemClassName="h-12 text-sm font-normal leading-5"
          onSelect={(item) => {
            if (!sheet || sheet.kind !== "select") return;

            if (sheet.key === "elevatorCount") {
              setField("elevatorCount", item.title);
              if (!values.facilities.includes("elevator")) {
                setField("facilities", [...values.facilities, "elevator"]);
              }
            } else if (sheet.key === "parkingCount") {
              setField("parkingCount", item.title);
              if (!values.facilities.includes("parking")) {
                setField("facilities", [...values.facilities, "parking"]);
              }
            } else if (sheet.key === "terraceCount") {
              setField("terraceCount", item.title);
              if (!values.facilities.includes("terrace")) {
                setField("facilities", [...values.facilities, "terrace"]);
              }
            } else {
              setField(sheet.key, item.title);
            }
            setSheet(null);
          }}
          selectedId={sheet?.kind === "select" ? values[sheet.key] : undefined}
          showDividers={false}
        />
      )}
    </BottomSheet>
  );
}
