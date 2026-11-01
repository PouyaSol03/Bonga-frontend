import { memo } from "react";
import { TopBar } from "../../../shared/components/TopBar";
import { MoreVerticalIcon, SearchIcon } from "./listIcons";

export const ChatHeader = memo(function ChatHeader({
  onOpenMenu,
  onOpenSearch,
}: {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
}) {
  return (
    <TopBar
      actions={[
        {
          icon: <MoreVerticalIcon />,
          id: "more",
          label: "گزینه‌های بیشتر",
          onClick: onOpenMenu,
        },
        {
          icon: <SearchIcon className="h-6 w-6" />,
          id: "search",
          label: "جستجو در چت‌ها",
          onClick: onOpenSearch,
        },
      ]}
      backTo="/home"
      title="چت"
    />
  );
});

export const ChatSearchHeader = memo(function ChatSearchHeader({
  onClose,
  onQueryChange,
  query,
}: {
  onClose: () => void;
  onQueryChange: (value: string) => void;
  query: string;
}) {
  return (
    <TopBar
      centerSlot={
        <input
          aria-label="جستجو در گفتگوها"
          autoFocus
          className="text-on-surface caret-primary placeholder:text-outline h-10 w-full appearance-none border-0 bg-transparent p-0 text-right text-base leading-6 font-medium outline-none"
          inputMode="search"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="جستجو"
          type="search"
          value={query}
        />
      }
      className="bg-surface-container"
      onBack={onClose}
    />
  );
});
