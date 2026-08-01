import type {
  DrawingState,
  GeofenceResult,
} from "../geofence/geofenceTypes";
import { TopBar } from "../../../components/TopBar";
import { Button } from "../../../components/ui/Button";

type SearchMapGeofenceControlsProps = {
  drawingState: DrawingState;
  errorMessage: string | null;
  geofenceResult: GeofenceResult | null;
  onBack: () => void;
  onConfirm: () => void;
  onDelete: () => void;
};

export function SearchMapGeofenceControls({
  drawingState,
  errorMessage,
  geofenceResult,
  onBack,
  onConfirm,
  onDelete,
}: SearchMapGeofenceControlsProps) {
  const canConfirm = drawingState === "preview" && geofenceResult !== null;
  const isInvalid = drawingState === "invalid";

  return (
    <section
      className="pointer-events-none absolute inset-0 z-[650]"
      aria-live="polite"
      aria-label="کنترل ترسیم محدوده"
      dir="rtl"
    >
      <TopBar
        className="pointer-events-auto"
        onBack={onBack}
        placement="inline"
        title="ترسیم محدوده"
      />

      {isInvalid ? (
        <div className="pointer-events-none absolute inset-x-4 top-[68px] rounded-xl border border-[#fecdca] bg-[#fffbfa]/95 px-3 py-2 text-right text-xs font-medium leading-5 text-[#b42318] shadow-sm backdrop-blur">
          {errorMessage ?? "محدوده معتبر نیست. دوباره آن را رسم کنید."}
        </div>
      ) : null}

      <footer className="pointer-events-auto absolute inset-x-0 bottom-0 h-16 border-t border-[#e6e6e6] bg-[#fafafa] px-4 py-3 shadow-[0_-2px_10px_rgba(26,26,26,0.06)]">
        <div className="grid h-10 grid-cols-2 gap-4">
          <Button unstyled
            className="h-10 rounded-[10px] border border-[#0048c4] bg-white px-4 text-sm font-medium leading-5 text-[#0048c4] transition-colors hover:bg-[#f5f8ff] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            type="button"
            onClick={onDelete}
          >
            حذف
          </Button>

          <Button unstyled
            className="h-10 rounded-[10px] bg-[#0048c4] px-4 text-sm font-medium leading-5 text-white transition-opacity focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            disabled={!canConfirm}
            onClick={onConfirm}
          >
            تایید
          </Button>
        </div>
      </footer>
    </section>
  );
}
