import LinearMapsLocation from "../../../components/(icons)/LinearMapsLocation";
import ListIcon from "../../../assets/icons/ListIcon";
import { SearchNoResultsRequestCard } from "./SearchNoResultsRequestCard";

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
    <main
      aria-label="نتیجه‌ای برای جستجو پیدا نشد"
      className="absolute inset-x-0 bottom-0 top-[60px] z-[450] min-h-0 overflow-y-auto overscroll-contain bg-white p-4 pb-24"
      dir="rtl"
    >
      <div className="bg-white">
        <SearchNoResultsRequestCard onSubmit={onRequestSubmit} />
      </div>

      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center px-4">
        <button
          className="flex h-10 min-w-[99px] items-center justify-center gap-2 rounded-2xl bg-[#0048c4] px-4 text-sm font-bold leading-5 text-white shadow-[0_10px_26px_rgba(0,72,196,0.24)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          onClick={onToggleMode}
          type="button"
        >
          {isMapMode ? <ListIcon /> : <LinearMapsLocation className="h-5 w-5" />}
          <span>{isMapMode ? "لیست" : "نقشه"}</span>
        </button>
      </div>
    </main>
  );
}
