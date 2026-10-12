import { Button } from "../../../shared/ui/Button";
import { RadioIndicator } from "../../../shared/components/RadioIndicator";
import { Typography } from "../../../shared/ui/Typography";
import LinearArrowLeft2 from "../../../shared/icons/LinearArrowLeft2";
import LinearList from "../../../shared/icons/LinearList";
import LinearRanking from "../../../shared/icons/LinearRanking";
import LinearStar from "../../../shared/icons/LinearStar";
import type { AgencyDirectoryMapItem } from "./AgencyMap.types";

export function AgencyImage({ item }: { item: AgencyDirectoryMapItem }) {
  return item.image ? (
    <img
      alt=""
      className="h-[72px] w-[72px] block shrink-0 rounded-xl object-cover shadow-[0_0_16px_rgba(77,77,77,0.08)]"
      src={item.image}
    />
  ) : (
    <Typography
      as="span"
      variant="headline"
      size="small"
      aria-hidden="true"
      className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-xl bg-primary-container text-2xl font-bold text-primary"
    >
      {item.name.trim().charAt(0) || "آ"}
    </Typography>
  );
}

export function AgencySummary({ item }: { item: AgencyDirectoryMapItem }) {
  return (
    <Typography
      as="span"
      variant="body"
      size="medium"
      weight="regular"
      className="flex flex-1 flex-col h-full gap-y-4"
    >
      <strong className="truncate text-base font-medium text-on-surface">
        {item.name}
      </strong>
      <Typography
        as="span"
        variant="label"
        size="small"
        weight="medium"
        className="flex items-center justify-between text-xs font-medium leading-5 text-on-surface"
      >
        <Typography as="span" variant="body" size="medium" weight="regular" className="flex items-center gap-1.5">
          <LinearStar className="w-4 h-4 text-on-surface-var" />
          <Typography as="span" variant="body" size="medium" weight="regular">امتیاز</Typography>
          <b className="text-sm font-semibold text-tertiary px-2">{item.score}</b>
        </Typography>
        <Typography as="span" variant="body" size="medium" weight="regular" className="flex items-center gap-1.5">
          <LinearRanking className="w-4 h-4 text-on-surface-var" />
          <Typography as="span" variant="body" size="medium" weight="regular">رتبه</Typography>
          <b className="text-sm font-semibold text-tertiary px-2">{item.rank}</b>
        </Typography>
      </Typography>
    </Typography>
  );
}

export function AgencyDirectoryCard({
  item,
  onClick,
}: {
  item: AgencyDirectoryMapItem;
  onClick: () => void;
}) {
  return (
    <Button
      unstyled
      className="absolute inset-x-4 bottom-4 z-[500] flex min-h-[104px] items-center gap-4 rounded-2xl border border-outline-var bg-surface-container-lowest p-4 text-right shadow-[0_-4px_16px_rgba(26,26,26,0.08)] active:bg-surface-container"
      dir="rtl"
      onClick={onClick}
      type="button"
    >
      <AgencyImage item={item} />
      <AgencySummary item={item} />
    </Button>
  );
}

export function AgencySelectionCard({
  item,
  onOpen,
  profileLabel,
}: {
  item: AgencyDirectoryMapItem;
  onOpen: () => void;
  profileLabel: string;
}) {
  return (
    <div
      className="absolute inset-x-0 bottom-[76px] z-[500] rounded-t-[22px] bg-surface-container-lowest px-4 pb-3 pt-4 shadow-[0_-8px_26px_rgba(26,26,26,0.08)]"
      dir="rtl"
    >
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        aria-hidden="true"
        className="mx-auto mb-3 block h-1 w-[42px] rounded-full bg-outline-var"
      />
      <article className="flex flex-col gap-y-2 rounded-2xl border-2 border-primary bg-primary-container/20 p-4">
        <div className="flex gap-4">
          <AgencyImage item={item} />
          <AgencySummary item={item} />
        </div>
        <div className="h-px bg-outline-var" />
        <div className="flex items-center justify-between gap-3">
          <Typography
            as="span"
            variant="label"
            size="large"
            weight="medium"
            className="flex items-center gap-2 text-base font-medium text-on-surface"
          >
            <RadioIndicator checked />
            <Typography as="span" variant="body" size="medium" weight="regular">
              انتخاب
            </Typography>
          </Typography>
          <Button
            unstyled
            className="flex items-center justify-center gap-2 rounded-xl border border-primary bg-surface-container-lowest/50 px-4 py-2.5 text-primary active:bg-surface-container-lowest"
            onClick={onOpen}
            type="button"
          >
            <Typography as="span" variant="body" size="medium" weight="regular">
              {profileLabel}
            </Typography>
            <LinearArrowLeft2 className="w-5 h-5 text-primary" />
          </Button>
        </div>
      </article>
    </div>
  );
}

export function AgencyMapSelectionFooter({
  confirmDisabled,
  confirmLabel,
  listLabel,
  onConfirm,
  onOpenList,
}: {
  confirmDisabled: boolean;
  confirmLabel: string;
  listLabel: string;
  onConfirm: () => void;
  onOpenList: () => void;
}) {
  return (
    <footer
      className="absolute inset-x-0 bottom-0 z-[550] flex h-[76px] items-center gap-3 border-t border-outline-var bg-surface-container-lowest px-4"
      dir="rtl"
    >
      <Button
        unstyled
        className="flex h-12 w-[104px] shrink-0 items-center justify-center gap-2 rounded-xl border border-outline-var bg-surface-container-lowest text-base font-semibold text-on-surface active:bg-surface-container"
        onClick={onOpenList}
        type="button"
      >
        <LinearList className="w-6 h-6" />
        <Typography as="span" variant="body" size="medium" weight="regular">
          {listLabel}
        </Typography>
      </Button>
      <Button
        unstyled
        className="h-12 min-w-0 flex-1 rounded-xl bg-primary px-4 text-base font-semibold text-on-primary active:opacity-80 disabled:bg-surface-container-high disabled:text-outline"
        disabled={confirmDisabled}
        onClick={onConfirm}
        type="button"
      >
        {confirmLabel}
      </Button>
    </footer>
  );
}
