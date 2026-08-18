import LinearMapsLocation from "../../../shared/icons/LinearMapsLocation";
import ListIcon from "../../../shared/assets/icons/ListIcon";
import { SearchNoResultsRequestCard } from "./SearchNoResultsRequestCard";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

type SearchNoResultsViewProps = {
  mode: "map" | "list";
  onRequestSubmit: (title: string) => void;
  onToggleMode: () => void;
};

export function SearchNoResultsView({
  mode,
  onRequestSubmit,
  onToggleMode,
}: SearchNoResultsViewProps) {
  const isMapMode = mode === "map";

  return (
    <>
      <main
        aria-label="نتیجه‌ای برای جستجو پیدا نشد"
        className="absolute inset-x-0 bottom-0 top-[56px] z-[450] min-h-0 overflow-y-auto overscroll-contain bg-white px-4 pb-24 pt-4"
        dir="rtl"
      >
        <SearchNoResultsRequestCard onSubmit={onRequestSubmit} />
      </main>

      <Button unstyled
        className="absolute bottom-4 left-1/2 z-[520] flex h-10 min-w-[99px] -translate-x-1/2 items-center justify-center gap-2 rounded-2xl bg-[#0048c4] px-4 text-base font-bold leading-6 text-white shadow-[0_10px_26px_rgba(0,72,196,0.24)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
        onClick={onToggleMode}
        type="button"
      >
        {isMapMode ? <ListIcon className="h-5 w-5" /> : <LinearMapsLocation className="h-5 w-5" />}
        <Typography as="span" variant="body" size="medium" weight="regular">{isMapMode ? "لیست" : "نقشه"}</Typography>
      </Button>
    </>
  );
}
