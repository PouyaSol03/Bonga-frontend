import LinearUserSolid from "../../../shared/icons/LinearUserSolid";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import "../../advertisements/components/AdCard.css";
import { PublisherAvatar } from "../ad-state/PublisherAvatar";
import { ChevronLeftIcon } from "../ad-state/StateIcons";
import type { ManagerPublisher } from "../ad-state/types";

export function ManagerPublisherSection({
  publisher,
  onOpen,
}: {
  publisher?: ManagerPublisher;
  onOpen: () => void;
}) {
  return (
    <section className="bg-surface-container-lowest px-4 pt-4 pb-4" aria-label="مسئول آگهی">
      <Typography
        as="h2"
        variant="label"
        size="large"
        weight="medium"
        className="text-on-surface m-0"
      >
        مسئول آگهی (مشاور مسئول)
      </Typography>
      <div className="mt-3">
        <div className="bg-surface flex items-center justify-end gap-3 rounded-xl p-3 [direction:rtl]">
          {publisher ? (
            <PublisherAvatar publisher={publisher} size="small" />
          ) : (
            <div className="bg-surface-container text-outline grid h-12 w-12 shrink-0 place-items-center rounded-full">
              <LinearUserSolid className="h-6 w-6" />
            </div>
          )}
          <div className="flex flex-1 flex-col justify-center gap-1 text-right">
            <Typography
              as="p"
              variant="body"
              size="large"
              weight="medium"
              className="text-on-surface-var m-0"
            >
              {publisher?.name ?? "مسئول آگهی مشخص نیست"}
            </Typography>
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="text-outline m-0"
            >
              {publisher ? (publisher.type === "agency" ? "مدیریت آژانس" : "مشاور مسئول") : "—"}
            </Typography>
          </div>
        </div>

        <Button
          unstyled
          className="border-primary bg-surface-container-lowest text-primary active:bg-primary-container mt-3 inline-flex h-10 w-full items-center justify-center gap-1 rounded-lg border text-sm font-medium"
          onClick={onOpen}
          type="button"
        >
          تغییر مشاور مسئول
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}
