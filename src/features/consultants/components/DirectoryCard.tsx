import { cn } from "../../../design-system/classes";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { RankIcon, StarIcon } from "./DirectoryIcons";

export type DirectoryCardMode = "agency" | "consultant";

export type DirectoryCardItem = {
  badge?: string;
  image?: string;
  name: string;
  rank: number | string;
  score: number | string;
};

export function DirectoryCard({
  item,
  mode,
  onClick,
  className,
  layout = "list",
  imageLoading = "eager",
}: {
  item: DirectoryCardItem;
  mode: DirectoryCardMode;
  onClick?: () => void;
  className?: string;
  layout?: "list" | "carousel";
  imageLoading?: "eager" | "lazy";
}) {
  const content = (
    <>
      {item.image ? (
        <img
          alt=""
          className={`${mode === "consultant" ? "rounded-full" : "rounded-xl"} h-[72px] w-[72px] shrink-0 object-cover shadow-[0_0_16px_0_rgba(77,77,77,0.1)]`}
          src={item.image}
          draggable={false}
          loading={imageLoading}
          decoding="async"
        />
      ) : (
        <Typography
          as="span"
          variant="headline"
          size="small"
          aria-hidden="true"
          className={`${mode === "consultant" ? "rounded-full" : "rounded-xl"} grid h-[72px] w-[72px] shrink-0 place-items-center bg-primary-container text-2xl font-bold text-primary shadow-[0_0_16px_0_rgba(77,77,77,0.1)]`}
        >
          {item.name.trim().charAt(0) || "آ"}
        </Typography>
      )}

      <div className="flex h-full min-w-0 flex-1 flex-col text-right">
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="mt-1 truncate text-base font-semibold leading-6 text-on-surface"
        >
          {item.name}
        </Typography>

        {item.badge && (
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="mt-0.5 w-fit rounded-full bg-surface-container-high px-2 text-[9px] font-medium text-on-surface-var"
          >
            {item.badge}
          </Typography>
        )}

        <div className="mt-auto flex items-center justify-between [direction:ltr]">
          <div className="flex items-center [direction:rtl]">
            <RankIcon />
            <Typography
              as="span"
              variant="body"
              size="small"
              weight="regular"
              className="mr-1 text-xs font-normal leading-4 text-on-surface-var"
            >
              رتبه
            </Typography>
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="semibold"
              className="mr-2 text-sm font-semibold leading-4 text-tertiary"
            >
              {item.rank}
            </Typography>
          </div>

          <div className="flex items-center [direction:rtl]">
            <StarIcon />
            <Typography
              as="span"
              variant="body"
              size="small"
              weight="regular"
              className="mr-1 text-xs font-normal leading-4 text-on-surface-var"
            >
              امتیاز
            </Typography>
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="semibold"
              className="mr-2 text-sm font-semibold leading-6 text-tertiary"
            >
              {item.score}
            </Typography>
          </div>
        </div>
      </div>
    </>
  );

  const baseClassName =
    "flex h-[104px] items-center gap-4 rounded-xl border border-outline-var bg-surface-container-lowest p-4 text-right shadow-[0_0_6px_rgba(26,26,26,0.04)]";
  const layoutClassName =
    layout === "carousel" ? "mx-0 w-[300px]" : "mx-4 w-[calc(100%_-_2rem)]";
  const mergedClassName = cn(
    baseClassName,
    layoutClassName,
    onClick && "active:bg-surface-container",
    className,
  );

  return onClick ? (
    <Button unstyled className={mergedClassName} onClick={onClick} type="button">
      {content}
    </Button>
  ) : (
    <article className={mergedClassName}>{content}</article>
  );
}

export function DirectoryCardSkeleton({
  className,
  layout = "list",
}: {
  className?: string;
  layout?: "list" | "carousel";
}) {
  return (
    <div
      className={cn(
        "flex h-[104px] items-center gap-4 rounded-xl border border-outline-var bg-surface-container-lowest p-4",
        layout === "carousel" ? "mx-0 w-[300px]" : "mx-4",
        className,
      )}
    >
      <div className="h-[72px] w-[72px] shrink-0 animate-pulse rounded-xl bg-surface-container" />
      <div className="min-w-0 flex-1">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-surface-container" />
        <div className="mt-3 h-3 w-1/2 animate-pulse rounded-full bg-surface-container" />
        <div className="mt-4 flex justify-between">
          <div className="h-4 w-20 animate-pulse rounded-full bg-surface-container" />
          <div className="h-4 w-20 animate-pulse rounded-full bg-surface-container" />
        </div>
      </div>
    </div>
  );
}
