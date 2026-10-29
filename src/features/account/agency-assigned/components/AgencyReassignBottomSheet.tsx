import { useState } from "react";
import { BottomSheet } from "../../../../shared/components/BottomSheet";
import { RadioIndicator } from "../../../../shared/components/RadioIndicator";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { SearchEmptyState } from "../../../../shared/components/SearchEmptyState";
import { SearchInputBar } from "../../../../shared/ui/SearchBar";
import LinearBuilding2 from "../../../../shared/icons/LinearBuilding2";
import { useAgencyInfiniteQuery } from "../../../agencies/api/agency.hooks";

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

  const agencies = (data?.pages.flatMap((page) => page.data) ?? []) as Array<
    Record<string, unknown>
  >;

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
      variant="actions"
      zIndexClassName="z-2000"
    >
      <div className="flex h-full flex-col [direction:rtl]">
        <div className="border-outline-var/20 border-b p-4">
          <SearchInputBar
            value={searchValue}
            onValueChange={(val) => setSearchValue(val)}
            onClear={() => setSearchValue("")}
            placeholder="جستجوی نام آژانس املاک..."
          />
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-on-surface-var py-8 text-center text-xs">
              در حال بارگذاری آژانس‌ها...
            </div>
          ) : agencies.length === 0 ? (
            <SearchEmptyState
              title="آژانسی یافت نشد"
              description="لطفاً عبارت دیگری را جستجو کنید."
            />
          ) : (
            agencies.map((agency) => {
              const id = String(agency.id ?? "");
              const isSelected = selectedAgencyId === id;
              return (
                <div
                  key={id}
                  onClick={() => setSelectedAgencyId(id)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                    isSelected ? "border-primary bg-primary-container/30" : "border-outline-var/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-surface-container-high text-on-surface-var flex h-10 w-10 items-center justify-center rounded-full font-bold">
                      <LinearBuilding2 className="text-on-surface-var h-5 w-5" />
                    </div>
                    <div>
                      <Typography
                        as="h4"
                        variant="title"
                        size="small"
                        weight="medium"
                        className="text-on-surface m-0 text-sm font-semibold"
                      >
                        {String(agency.title ?? agency.name ?? "آژانس املاک")}
                      </Typography>
                      <Typography
                        as="p"
                        variant="body"
                        size="small"
                        weight="regular"
                        className="text-on-surface-var m-0 mt-0.5 text-xs"
                      >
                        {String(agency.address ?? agency.location ?? "")}
                      </Typography>
                    </div>
                  </div>
                  <RadioIndicator checked={isSelected} />
                </div>
              );
            })
          )}
        </div>

        <div className="border-outline-var/20 bg-surface-container-lowest mt-auto border-t p-4">
          <Button
            fullWidth
            variant="primary"
            size="medium"
            disabled={!selectedAgencyId || isPending}
            onClick={() => {
              if (selectedAgencyId) onConfirm(selectedAgencyId);
            }}
          >
            {isPending ? "در حال واگذاری..." : "تأیید و واگذاری به این آژانس"}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
