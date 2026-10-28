import { useMemo, useState } from "react";
import { BottomSheet } from "../../../shared/components/BottomSheet";
import { RadioIndicator } from "../../../shared/components/RadioIndicator";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import LinearBuilding2 from "../../../shared/icons/LinearBuilding2";
import { Button } from "../../../shared/ui/Button";
import { SearchInputBar } from "../../../shared/ui/SearchBar";
import { Typography } from "../../../shared/ui/Typography";
import "../../advertisements/components/AdCard.css";
import { useAgencyInfiniteQuery } from "../../agencies/api/agency.hooks";

export function AgencyReassignBottomSheet({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (agencyId: string | number) => void;
  isPending: boolean;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);

  const { data, isLoading } = useAgencyInfiniteQuery({
    search: searchValue.trim(),
    enabled: isOpen,
    perPage: 20,
  });

  const agencies = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  return (
    <BottomSheet
      ariaLabel="انتخاب آژانس املاک جدید"
      className="max-h-[85svh] rounded-t-[24px]!"
      contentClassName="min-h-0 overflow-y-auto overscroll-contain"
      headerButtonAriaLabel="بستن"
      headerClassName="h-10! gap-1! px-2!"
      heightClassName="h-[min(100svh,640px)]"
      isOpen={isOpen}
      onClose={onClose}
      title="انتخاب آژانس املاک جدید"
      variant="full-height"
      zIndexClassName="z-2000"
    >
      <div className="flex min-h-0 flex-1 flex-col [direction:rtl]">
        <div className="px-4 pb-3">
          <SearchInputBar
            aria-label="جستجوی آژانس"
            containerClassName="rounded-xl border-outline-var/60"
            inputClassName="text-xs leading-5"
            onClear={() => setSearchValue("")}
            onValueChange={setSearchValue}
            placeholder="جستجوی نام آژانس..."
            size="dense"
            type="search"
            value={searchValue}
          />
        </div>

        <div className="min-h-[220px] flex-1 space-y-2 overflow-y-auto px-4 py-1">
          {isLoading ? (
            <div className="text-outline flex h-36 items-center justify-center text-xs">
              در حال بارگذاری آژانس‌ها...
            </div>
          ) : agencies.length === 0 ? (
            <SearchEmptyState />
          ) : (
            agencies.map((agency) => {
              const isSelected = String(agency.id) === String(selectedAgencyId);
              return (
                <button
                  key={agency.id}
                  type="button"
                  onClick={() => setSelectedAgencyId(String(agency.id))}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-right transition-colors ${
                    isSelected ? "border-primary bg-primary/5" : "border-outline-var/40 bg-surface"
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="bg-surface-container text-primary flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                      {agency.logo || agency.img ? (
                        <img
                          src={agency.logo || agency.img}
                          alt={agency.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <LinearBuilding2 className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Typography
                        as="p"
                        variant="body"
                        size="small"
                        weight="medium"
                        className="text-on-surface m-0 truncate text-xs"
                      >
                        {agency.name}
                      </Typography>
                      {agency.address && (
                        <Typography
                          as="p"
                          variant="body"
                          size="small"
                          weight="regular"
                          className="text-on-surface-var m-0 mt-0.5 truncate text-[11px]"
                        >
                          {agency.address}
                        </Typography>
                      )}
                    </div>
                  </div>
                  <RadioIndicator checked={isSelected} />
                </button>
              );
            })
          )}
        </div>

        <div className="border-outline-var/30 bg-surface-container-lowest mt-auto border-t p-4">
          <Button
            unstyled
            disabled={!selectedAgencyId || isPending}
            onClick={() => {
              if (selectedAgencyId) onConfirm(selectedAgencyId);
            }}
            className="bg-primary text-on-primary inline-flex h-11 w-full items-center justify-center rounded-xl text-xs font-semibold active:opacity-90 disabled:opacity-40"
            type="button"
          >
            {isPending ? "در حال واگذاری..." : "تأیید و واگذاری به این آژانس"}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
