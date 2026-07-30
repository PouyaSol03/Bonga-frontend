import { memo } from "react";
import ListIcon from "../../../assets/icons/ListIcon";
import LinearHandDraw from "../../../components/(icons)/LinearHandDraw";
import LinearGps from "../../../components/(icons)/LinearGps";
import { Typography } from "../../../components/ui/Typography";
import { Button } from "../../../components/ui/Button";

type SearchMapFloatingActionsProps = {
  isDrawing?: boolean;
  isHidden?: boolean;
  isLocated?: boolean;
  isLocating?: boolean;
  onLocateClick?: () => void;
  onHandClick?: () => void;
  onListClick?: () => void;
  showListButton?: boolean;
  isEditorMode?: boolean;
};

function SearchMapFloatingActionsComponent({
  isDrawing = false,
  isHidden = false,
  isLocated = false,
  isLocating = false,
  onLocateClick,
  onHandClick,
  onListClick,
  showListButton = true,
  isEditorMode = false,
}: SearchMapFloatingActionsProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 z-[500] ${
        isEditorMode ? "bottom-20" : "bottom-4"
      } ${
        isHidden ? "hidden" : "translate-y-0 opacity-100"
      }`}
      aria-hidden={isHidden}
    >
      {showListButton ? (
        <div className="pointer-events-auto absolute bottom-0 left-1/2 -translate-x-1/2">
          <Button unstyled
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0048c4] px-4 py-2 text-xl font-bold leading-6 text-white shadow-[0_10px_26px_rgba(0,72,196,0.24)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            type="button"
            tabIndex={isHidden ? -1 : 0}
            onClick={onListClick}
          >
            <ListIcon />
            <Typography as="span" variant="label" size="large" weight="medium">لیست</Typography>
          </Button>
        </div>
      ) : null}

      <div className="pointer-events-auto absolute bottom-0 right-4 flex flex-col items-center gap-4">
        <Button unstyled
          className={`flex p-2 items-center justify-center rounded-xl shadow-[0_6px_18px_rgba(26,26,26,0.18)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] ${
            isLocated ? "bg-[#0048c4] text-white" : "bg-white text-white"
          }`}
          type="button"
          aria-label="موقعیت من"
          aria-busy={isLocating}
          disabled={isLocating}
          tabIndex={isHidden ? -1 : 0}
          onClick={onLocateClick}
        >
          <Typography as="span" variant="body" size="medium" weight="regular">
            <LinearGps className={`h-5 w-5 ${isLocated ? 'text-white' : 'text-[#4d4d4d]'}`} />
          </Typography>
        </Button>

        <Button unstyled
          aria-pressed={isDrawing}
          className={`flex p-2 items-center justify-center rounded-xl shadow-[0_6px_18px_rgba(26,26,26,0.18)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] ${
            isDrawing ? "bg-[#0048c4] text-white" : "bg-white text-white"
          }`}
          type="button"
          aria-label="انتخاب محدوده روی نقشه"
          tabIndex={isHidden ? -1 : 0}
          onClick={onHandClick}
        >
          <Typography as="span" variant="body" size="medium" weight="regular">
            <LinearHandDraw className={`w-5 h-5 ${isDrawing ? "text-white" : "text-[#4d4d4d]"}`}/>
          </Typography>
        </Button>
      </div>
    </div>
  );
}

export const SearchMapFloatingActions = memo(
  SearchMapFloatingActionsComponent,
  (previous, next) =>
    previous.isDrawing === next.isDrawing &&
    previous.isHidden === next.isHidden &&
    previous.isLocated === next.isLocated &&
    previous.isLocating === next.isLocating &&
    previous.showListButton === next.showListButton &&
    previous.isEditorMode === next.isEditorMode,
);
