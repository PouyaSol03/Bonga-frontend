import { Button } from "../../../shared/ui/Button";
import { RadioIndicator } from "../../../shared/components/RadioIndicator";
import { Typography } from "../../../shared/ui/Typography";
import LinearArrowLeft2 from "../../../shared/icons/LinearArrowLeft2";
import LinearList from "../../../shared/icons/LinearList";
import LinearRanking from "../../../shared/icons/LinearRanking";
import LinearStar from "../../../shared/icons/LinearStar";
import type { AgencyDirectoryMapItem } from "./AgencyMap.types";

function AgencyImage({ item }: { item: AgencyDirectoryMapItem }) {
  return item.image ? (
    <img
      alt=""
      className="block h-[72px] w-[72px] shrink-0 rounded-xl object-cover shadow-[0_0_16px_rgba(77,77,77,0.08)]"
      src={item.image}
    />
  ) : (
    <Typography
      as="span"
      variant="headline"
      size="small"
      aria-hidden="true"
      className="bg-primary-container text-primary grid h-[72px] w-[72px] shrink-0 place-items-center rounded-xl text-2xl font-bold"
    >
      {item.name.trim().charAt(0) || "آ"}
    </Typography>
  );
}

function AgencySummary({ item }: { item: AgencyDirectoryMapItem }) {
  return (
    <Typography
      as="span"
      variant="body"
      size="medium"
      weight="regular"
      className="flex h-full flex-1 flex-col gap-y-4"
    >
      <strong className="text-on-surface truncate text-base font-medium">{item.name}</strong>
      <Typography
        as="span"
        variant="label"
        size="small"
        weight="medium"
        className="text-on-surface flex items-center justify-between text-xs leading-5 font-medium"
      >
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="flex items-center gap-1.5"
        >
          <LinearStar className="text-on-surface-var h-4 w-4" />
          <Typography as="span" variant="body" size="medium" weight="regular">
            امتیاز
          </Typography>
          <b className="text-tertiary px-2 text-sm font-semibold">{item.score}</b>
        </Typography>
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="flex items-center gap-1.5"
        >
          <LinearRanking className="text-on-surface-var h-4 w-4" />
          <Typography as="span" variant="body" size="medium" weight="regular">
            رتبه
          </Typography>
          <b className="text-tertiary px-2 text-sm font-semibold">{item.rank}</b>
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
      className="border-outline-var bg-surface-container-lowest active:bg-surface-container absolute inset-x-4 bottom-4 z-[500] flex min-h-[104px] items-center gap-4 rounded-2xl border p-4 text-right shadow-[0_-4px_16px_rgba(26,26,26,0.08)]"
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
      className="bg-surface-container-lowest absolute inset-x-0 bottom-[76px] z-[500] rounded-t-[22px] px-4 pt-4 pb-3 shadow-[0_-8px_26px_rgba(26,26,26,0.08)]"
      dir="rtl"
    >
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        aria-hidden="true"
        className="bg-outline-var mx-auto mb-3 block h-1 w-[42px] rounded-full"
      />
      <article className="border-primary bg-primary-container/20 flex flex-col gap-y-2 rounded-2xl border-2 p-4">
        <div className="flex gap-4">
          <AgencyImage item={item} />
          <AgencySummary item={item} />
        </div>
        <div className="bg-outline-var h-px" />
        <div className="flex items-center justify-between gap-3">
          <Typography
            as="span"
            variant="label"
            size="large"
            weight="medium"
            className="text-on-surface flex items-center gap-2 text-base font-medium"
          >
            <RadioIndicator checked />
            <Typography as="span" variant="body" size="medium" weight="regular">
              انتخاب
            </Typography>
          </Typography>
          <Button
            unstyled
            className="border-primary bg-surface-container-lowest/50 text-primary active:bg-surface-container-lowest flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5"
            onClick={onOpen}
            type="button"
          >
            <Typography as="span" variant="body" size="medium" weight="regular">
              {profileLabel}
            </Typography>
            <LinearArrowLeft2 className="text-primary h-5 w-5" />
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
      className="border-outline-var bg-surface-container-lowest absolute inset-x-0 bottom-0 z-[550] flex h-[76px] items-center gap-3 border-t px-4"
      dir="rtl"
    >
      <Button
        unstyled
        className="border-outline-var bg-surface-container-lowest text-on-surface active:bg-surface-container flex h-12 w-[104px] shrink-0 items-center justify-center gap-2 rounded-xl border text-base font-semibold"
        onClick={onOpenList}
        type="button"
      >
        <LinearList className="h-6 w-6" />
        <Typography as="span" variant="body" size="medium" weight="regular">
          {listLabel}
        </Typography>
      </Button>
      <Button
        unstyled
        className="bg-primary text-on-primary disabled:bg-surface-container-high disabled:text-outline h-12 min-w-0 flex-1 rounded-xl px-4 text-base font-semibold active:opacity-80"
        disabled={confirmDisabled}
        onClick={onConfirm}
        type="button"
      >
        {confirmLabel}
      </Button>
    </footer>
  );
}
