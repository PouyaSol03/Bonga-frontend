import { useNavigate } from "react-router";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { CrmIcon } from "../../CrmLayout";

export function CrmLocationMapSidebarHeader({
  cityName,
  draftName,
  isPending,
  onChangeDraftName,
  onStartNewNeighborhood,
  onToggleNewNeighborhoodInput,
  showNewNeighborhoodInput,
}: {
  cityName: string;
  draftName: string;
  isPending: boolean;
  onChangeDraftName: (value: string) => void;
  onStartNewNeighborhood: () => void;
  onToggleNewNeighborhoodInput: () => void;
  showNewNeighborhoodInput: boolean;
}) {
  const navigate = useNavigate();

  return (
    <div className="shrink-0 border-b border-[#eeeeee] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <Typography
            as="h1"
            variant="title"
            size="medium"
            weight="semibold"
            className="m-0 truncate text-[#1a1a1a]"
          >
            محله‌های {cityName}
          </Typography>
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="m-0 mt-1 text-[#808080]"
          >
            محله اصلی را باز کنید تا زیرمحله‌های همان محدوده دیده شوند.
          </Typography>
        </div>
        <Button
          aria-label="بازگشت"
          onClick={() =>
            window.history.state?.idx > 0
              ? navigate(-1)
              : navigate("/crm/locations", { replace: true })
          }
          size="small"
          variant="neutral-outline"
        >
          <CrmIcon name="close" size={16} />
        </Button>
      </div>

      <div className="mt-4">
        <Button
          disabled={isPending}
          onClick={onToggleNewNeighborhoodInput}
          size="x-medium"
          variant="primary"
          fullWidth
        >
          محله جدید
        </Button>
      </div>

      {showNewNeighborhoodInput ? (
        <div className="mt-3 flex gap-2 rounded-xl bg-[#f7f8fa] p-2">
          <input
            autoFocus
            className="h-10 min-w-0 flex-1 rounded-lg border border-[#cccccc] bg-white px-3 text-sm outline-none focus:border-[#0048c4]"
            onChange={(event) => onChangeDraftName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onStartNewNeighborhood();
            }}
            placeholder="نام محله جدید"
            value={draftName}
          />
          <Button onClick={onStartNewNeighborhood} size="x-medium" variant="primary">
            ترسیم
          </Button>
        </div>
      ) : null}
    </div>
  );
}
