import GpsIcon from "../../../assets/icons/GpsIcon";
import HandDrawIcon from "../../../assets/icons/HandDrawIcon";
import ListIcon from "../../../assets/icons/ListIcon";

type SearchMapFloatingActionsProps = {
  isHidden?: boolean;
  onLocateClick?: () => void;
  onHandClick?: () => void;
  onListClick?: () => void;
};

export function SearchMapFloatingActions({
  isHidden = false,
  onLocateClick,
  onHandClick,
  onListClick,
}: SearchMapFloatingActionsProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-[max(88px,calc(env(safe-area-inset-bottom)+88px))] z-[500] transition-all duration-300 ease-out min-[390px]:bottom-[max(104px,calc(env(safe-area-inset-bottom)+104px))] ${
        isHidden ? "hidden" : "translate-y-0 opacity-100"
      }`}
      // aria-hidden={isHidden}
    >
      <div className="pointer-events-auto absolute bottom-0 left-1/2 -translate-x-1/2">
        <button
          className="flex h-10 min-w-[96px] items-center justify-center gap-2 rounded-xl bg-[#0048c4] px-3 text-sm font-semibold leading-5 text-white shadow-[0_8px_20px_rgba(0,72,196,0.24)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] min-[390px]:h-11 min-[390px]:min-w-[108px] min-[390px]:px-4 min-[390px]:text-base min-[390px]:leading-6"
          type="button"
          tabIndex={isHidden ? -1 : 0}
          onClick={onListClick}
        >
          <ListIcon />
          <span>لیست</span>
        </button>
      </div>

      <div className="pointer-events-auto absolute bottom-0 right-3 flex flex-col items-center gap-2 min-[390px]:right-4 min-[390px]:gap-3">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white text-[#4d4d4d] shadow-[0_4px_18px_rgba(26,26,26,0.12)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] min-[390px]:h-12 min-[390px]:w-12 min-[390px]:rounded-xl"
          type="button"
          aria-label="موقعیت من"
          tabIndex={isHidden ? -1 : 0}
          onClick={onLocateClick}
        >
          <span className="scale-90 min-[390px]:scale-100">
            <GpsIcon />
          </span>
        </button>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white text-[#4d4d4d] shadow-[0_4px_18px_rgba(26,26,26,0.12)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] min-[390px]:h-12 min-[390px]:w-12 min-[390px]:rounded-xl"
          type="button"
          aria-label="انتخاب محدوده روی نقشه"
          tabIndex={isHidden ? -1 : 0}
          onClick={onHandClick}
        >
          <span className="scale-90 min-[390px]:scale-100">
            <HandDrawIcon />
          </span>
        </button>
      </div>
    </div>
  );
}
