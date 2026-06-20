import GpsIcon from "../../../assets/icons/GpsIcon";
import HandDrawIcon from "../../../assets/icons/HandDrawIcon";
import ListIcon from "../../../assets/icons/ListIcon";

type SearchMapFloatingActionsProps = {
  isDrawing?: boolean;
  isHidden?: boolean;
  isLocated?: boolean;
  isLocating?: boolean;
  onLocateClick?: () => void;
  onHandClick?: () => void;
  onListClick?: () => void;
};

export function SearchMapFloatingActions({
  isDrawing = false,
  isHidden = false,
  isLocated = false,
  isLocating = false,
  onLocateClick,
  onHandClick,
  onListClick,
}: SearchMapFloatingActionsProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-[max(76px,calc(env(safe-area-inset-bottom)+76px))] z-[500] ${
        isHidden ? "hidden" : "translate-y-0 opacity-100"
      }`}
      aria-hidden={isHidden}
    >
      <div className="pointer-events-auto absolute bottom-0 left-1/2 -translate-x-1/2">
        <button
          className="flex h-10 min-w-[103px] items-center justify-center gap-2 rounded-2xl bg-[#0048c4] px-4 text-xl font-bold leading-6 text-white shadow-[0_10px_26px_rgba(0,72,196,0.24)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          type="button"
          tabIndex={isHidden ? -1 : 0}
          onClick={onListClick}
        >
          <ListIcon />
          <span>لیست</span>
        </button>
      </div>

      <div className="pointer-events-auto absolute bottom-0 right-4 flex flex-col items-center gap-4">
        <button
          className={`flex h-10 w-9 items-center justify-center rounded-xl shadow-[0_6px_18px_rgba(26,26,26,0.18)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] ${
            isLocated ? "bg-[#0048c4] text-white" : "bg-white text-[#4d4d4d]"
          }`}
          type="button"
          aria-label="موقعیت من"
          aria-busy={isLocating}
          disabled={isLocating}
          tabIndex={isHidden ? -1 : 0}
          onClick={onLocateClick}
        >
          <span>
            <GpsIcon />
          </span>
        </button>

        <button
          aria-pressed={isDrawing}
          className={`flex h-10 w-9 items-center justify-center rounded-xl shadow-[0_6px_18px_rgba(26,26,26,0.18)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] ${
            isDrawing ? "bg-[#0048c4] text-white" : "bg-white text-[#4d4d4d]"
          }`}
          type="button"
          aria-label="انتخاب محدوده روی نقشه"
          tabIndex={isHidden ? -1 : 0}
          onClick={onHandClick}
        >
          <span>
            <HandDrawIcon />
          </span>
        </button>
      </div>
    </div>
  );
}
