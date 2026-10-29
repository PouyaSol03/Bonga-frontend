import { SearchInputBar } from "../../../../shared/ui/SearchBar";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";
import { FormChoiceChip } from "../../../../shared/form/FormControls";
import LinearArrowLeft2 from "../../../../shared/icons/LinearArrowLeft2";
import type { SelectedNeighborhood } from "../types";

export function NeighborhoodSheetHeader({
  mode,
  onClose,
  onQueryChange,
  onRemoveItem,
  query,
  selectedItems,
  title,
}: {
  mode: "single" | "multiple";
  onClose: () => void;
  onQueryChange: (query: string) => void;
  onRemoveItem: (id: string) => void;
  query: string;
  selectedItems: SelectedNeighborhood[];
  title: string;
}) {
  return (
    <div className="shrink-0 px-3 pt-3 pb-2">
      <div className="flex h-11 items-center gap-2 [direction:ltr]">
        <SearchInputBar
          containerClassName="flex-1 border-outline"
          debounceMs={300}
          onClear={() => onQueryChange("")}
          onDebouncedChange={onQueryChange}
          onValueChange={onQueryChange}
          placeholder="جستجوی محله"
          size="dense"
          value={query}
        />

        <Button
          unstyled
          aria-label="بازگشت"
          className="text-on-surface-var grid h-10 w-10 shrink-0 place-items-center"
          onClick={onClose}
          type="button"
        >
          <LinearArrowLeft2 className="h-6 w-6 rotate-180" />
        </Button>
      </div>

      <div className="mt-3 flex items-center justify-between px-1">
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-on-surface m-0 text-base leading-6 font-semibold"
        >
          {title}
        </Typography>
        {selectedItems.length > 0 ? (
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-primary text-sm leading-5 font-medium"
          >
            {mode === "single" ? selectedItems[0]?.name : `${selectedItems.length} انتخاب`}
          </Typography>
        ) : null}
      </div>

      {selectedItems.length > 0 ? (
        <div className="-mx-3 mt-2 flex [scrollbar-width:none] gap-2 overflow-x-auto px-3 pb-1 [direction:rtl] [&::-webkit-scrollbar]:hidden">
          {selectedItems.map((neighborhood) => (
            <FormChoiceChip
              key={neighborhood.id}
              label={neighborhood.name}
              onClick={() => onRemoveItem(neighborhood.id)}
              removable
              selected
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
