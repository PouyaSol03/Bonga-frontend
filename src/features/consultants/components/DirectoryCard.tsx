import { cn } from "../../../design-system/classes";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";

export type DirectoryCardMode = "agency" | "consultant";

export type DirectoryCardItem = {
  badge?: string;
  image?: string;
  name: string;
  rank: number | string;
  score: number | string;
};

function RankIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <g clipPath="url(#directory-rank-clip)">
        <path
          d="M13.5002 12.0001C13.5002 11.908 13.4256 11.8334 13.3335 11.8334H10.6668C10.5748 11.8334 10.5002 11.908 10.5002 12.0001V14.1668H13.5002V12.0001ZM7.27751 1.25466C7.56638 0.72841 8.31299 0.695215 8.65902 1.1557L8.72282 1.25466L9.37386 2.44086L10.8042 2.6531C11.4214 2.74437 11.7776 3.52164 11.2476 4.01508L10.245 4.94737L10.4644 6.24034C10.5222 6.58117 10.3522 6.86983 10.1232 7.02419C9.89625 7.17711 9.58462 7.22137 9.29834 7.08604L8.00016 6.47211L6.70199 7.08604C6.4157 7.22138 6.10406 7.17711 5.87712 7.02419C5.64813 6.86984 5.47815 6.58117 5.53597 6.24034L5.75472 4.94737L4.75277 4.01508C4.2227 3.52161 4.57897 2.74437 5.19613 2.6531L6.62581 2.44086L7.27751 1.25466ZM7.45719 3.00596C7.33073 3.23638 7.10317 3.3818 6.85824 3.41807L5.75472 3.58083L6.51969 4.29307L5.98519 4.86599L6.76058 4.99815L6.5848 6.03461L7.64144 5.53526C7.83945 5.44159 8.06698 5.42983 8.2723 5.5001L8.35889 5.53526L9.41488 6.03461L9.23975 4.99815C9.19454 4.73169 9.29106 4.46962 9.48063 4.29307L10.245 3.58083L9.14209 3.41807C8.89716 3.3818 8.6696 3.23637 8.54313 3.00596L8.00016 2.01638L7.45719 3.00596ZM6.51969 4.29307C6.70915 4.46952 6.80567 4.73109 6.76058 4.9975L6.26774 4.91417L5.98519 4.86599L6.51969 4.29307ZM9.50016 9.33344C9.50016 9.24138 9.42555 9.16677 9.3335 9.16677H6.66683C6.57478 9.16677 6.50016 9.24139 6.50016 9.33344V14.1668H9.50016V9.33344ZM2.50016 14.1668H5.50016V10.6668C5.50016 10.5747 5.42555 10.5001 5.3335 10.5001H2.66683C2.57478 10.5001 2.50016 10.5747 2.50016 10.6668V14.1668ZM10.5002 10.8465C10.5546 10.8387 10.6102 10.8334 10.6668 10.8334H13.3335C13.9778 10.8334 14.5002 11.3558 14.5002 12.0001V14.1668H14.6668C14.943 14.1668 15.1668 14.3906 15.1668 14.6668C15.1668 14.9429 14.943 15.1668 14.6668 15.1668H1.3335C1.05735 15.1668 0.833496 14.9429 0.833496 14.6668C0.833496 14.3906 1.05735 14.1668 1.3335 14.1668H1.50016V10.6668C1.50016 10.0224 2.02251 9.5001 2.66683 9.5001H5.3335C5.39014 9.5001 5.44567 9.50532 5.50016 9.51313V9.33344C5.50016 8.68909 6.02251 8.16677 6.66683 8.16677H9.3335C9.97784 8.16677 10.5002 8.6891 10.5002 9.33344V10.8465Z"
          fill="#4D4D4D"
        />
      </g>
      <defs>
        <clipPath id="directory-rank-clip">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6.9555 2.13464C7.39132 1.28845 8.60822 1.28845 9.04404 2.13464L10.516 4.99336C10.5401 5.03988 10.5866 5.07425 10.643 5.08321L13.8429 5.58777C14.7827 5.73589 15.1716 6.88595 14.4881 7.56433L12.197 9.83776C12.159 9.87558 12.1429 9.92753 12.1508 9.97774L12.6554 13.1503C12.8068 14.1016 11.81 14.7973 10.9666 14.3723L8.07985 12.9172C8.02967 12.892 7.96988 12.892 7.91969 12.9172L5.03298 14.3723C4.18958 14.7973 3.19276 14.1016 3.34417 13.1503L3.84873 9.97774C3.85663 9.92757 3.84053 9.87561 3.80251 9.83776L1.51149 7.56433C0.827921 6.88592 1.21691 5.73588 2.15667 5.58777L5.35654 5.08321C5.41296 5.07425 5.45948 5.03988 5.4835 4.99336L6.9555 2.13464ZM8.15472 2.59232C8.09115 2.46913 7.9084 2.46913 7.84482 2.59232L6.37282 5.45105C6.20142 5.78388 5.88062 6.0134 5.51214 6.07149L2.31227 6.5754C2.16735 6.59824 2.124 6.76349 2.21592 6.85469L4.50693 9.12748C4.77221 9.3907 4.89522 9.7654 4.83636 10.1353L4.3318 13.3072C4.3122 13.4303 4.44711 13.5482 4.58311 13.4797L7.46917 12.0246C7.80268 11.8565 8.19686 11.8565 8.53037 12.0246L11.4164 13.4797C11.5354 13.5396 11.6536 13.4573 11.6684 13.3534L11.6677 13.3078V13.3072L11.1632 10.1353C11.1043 9.76543 11.2273 9.39074 11.4926 9.12748L13.7836 6.85469C13.8756 6.76346 13.8321 6.59823 13.6873 6.5754L10.4874 6.07149C10.1189 6.0134 9.79813 5.78386 9.62673 5.45105L8.15472 2.59232Z"
        fill="#4D4D4D"
      />
    </svg>
  );
}

export function DirectoryCard({
  item,
  mode,
  onClick,
  className,
  layout = "list",
}: {
  item: DirectoryCardItem;
  mode: DirectoryCardMode;
  onClick?: () => void;
  className?: string;
  layout?: "list" | "carousel";
}) {
  const content = (
    <>
      {item.image ? (
        <img
          alt=""
          className={`${mode === "consultant" ? "rounded-full" : "rounded-xl"} h-[72px] w-[72px] shrink-0 object-cover shadow-[0_0_16px_0_rgba(77,77,77,0.1)]`}
          src={item.image}
          draggable={false}
        />
      ) : (
        <Typography
          as="span"
          variant="headline"
          size="small"
          aria-hidden="true"
          className={`${mode === "consultant" ? "rounded-full" : "rounded-xl"} grid h-[72px] w-[72px] shrink-0 place-items-center bg-[#e9f1ff] text-2xl font-bold text-[#0048c4] shadow-[0_0_16px_0_rgba(77,77,77,0.1)]`}
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
          className="mt-1 truncate text-base font-semibold leading-6 text-[#4d4d4d]"
        >
          {item.name}
        </Typography>

        {item.badge && (
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="mt-0.5 w-fit rounded-full bg-[#80808014] px-2 text-[9px] font-medium text-[#808080]"
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
              className="mr-1 text-xs font-normal leading-4 text-[#1a1a1a]"
            >
              رتبه
            </Typography>
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="semibold"
              className="mr-2 text-sm font-semibold leading-4 text-[#00a66a]"
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
              className="mr-1 text-xs font-normal leading-4 text-[#1a1a1a]"
            >
              امتیاز
            </Typography>
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="semibold"
              className="mr-2 text-sm font-semibold leading-6 text-[#00a66a]"
            >
              {item.score}
            </Typography>
          </div>
        </div>
      </div>
    </>
  );

  const baseClassName =
    "flex h-[104px] items-center gap-4 rounded-xl border border-[#d1d1d1] bg-white p-4 text-right shadow-[0_0_6px_rgba(26,26,26,0.04)]";
  const layoutClassName =
    layout === "carousel" ? "mx-0 w-[300px]" : "mx-4 w-[calc(100%_-_2rem)]";
  const mergedClassName = cn(
    baseClassName,
    layoutClassName,
    onClick && "active:bg-[#fafafa]",
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
        "flex h-[104px] items-center gap-4 rounded-xl border border-[#e5e5e5] bg-white p-4",
        layout === "carousel" ? "mx-0 w-[300px]" : "mx-4",
        className,
      )}
    >
      <div className="h-[72px] w-[72px] shrink-0 animate-pulse rounded-xl bg-[#f0f0f0]" />
      <div className="min-w-0 flex-1">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-[#f0f0f0]" />
        <div className="mt-3 h-3 w-1/2 animate-pulse rounded-full bg-[#f0f0f0]" />
        <div className="mt-4 flex justify-between">
          <div className="h-4 w-20 animate-pulse rounded-full bg-[#f0f0f0]" />
          <div className="h-4 w-20 animate-pulse rounded-full bg-[#f0f0f0]" />
        </div>
      </div>
    </div>
  );
}
