import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listCrmUsers, listCrmAgencies, getCrmRecordId } from "../../../crm/api/crm.service";
import { Typography } from "../../../../shared/ui/Typography";

export function CrmTargetOwnerSelect({
  type,
  value,
  onChange,
}: {
  type: "user" | "agency";
  value: string;
  onChange: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  // When value changes externally (e.g. cleared), clear our local state
  useEffect(() => {
    if (!value) {
      setQuery("");
      setDebouncedQuery("");
      setSelectedLabel("");
    }
  }, [value]);

  const { data, isLoading } = useQuery({
    queryKey: ["crm", type, "search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      if (type === "user") {
        return await listCrmUsers({ mobile: debouncedQuery });
      } else {
        return await listCrmAgencies({ name: debouncedQuery });
      }
    },
    enabled: Boolean(debouncedQuery) && isFocused,
  });

  return (
    <div className="relative">
      <label className="flex h-14 flex-col rounded-xl border border-[#cccccc] bg-white px-4 py-2 transition-colors focus-within:border-[#0048c4]">
        <Typography as="span" variant="label" size="small" weight="medium" className="text-[#8a94a3]">
          {type === "user" ? "جستجوی کاربر (با شماره موبایل)" : "جستجوی آژانس (با نام)"}
        </Typography>
        <input
          className="h-6 bg-transparent text-sm font-bold text-[#303030] outline-none placeholder:font-normal placeholder:text-[#cccccc]"
          dir={type === "user" ? "ltr" : "rtl"}
          onChange={(event) => {
            setQuery(event.target.value);
            if (value) {
              onChange("");
              setSelectedLabel("");
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={type === "user" ? "مثال: 0912..." : "نام آژانس..."}
          value={value ? selectedLabel || value : query}
        />
      </label>

      {isFocused && (debouncedQuery || isLoading) && !value && (
        <ul className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-[#cccccc] bg-white py-2 shadow-2xl">
          {isLoading ? (
            <li className="px-4 py-3 text-sm text-[#8a94a3]">در حال جستجو...</li>
          ) : data && data.length > 0 ? (
            data.map((item) => {
              const id = getCrmRecordId(item);
              const label = type === "user" 
                ? `${item.name || "بدون نام"} - ${item.mobile || "بدون شماره"}`
                : String(item.name || "بدون نام");

              return (
                <li
                  key={id}
                  className="cursor-pointer border-b border-[#f5f5f5] last:border-0 px-4 py-3 text-sm transition-colors hover:bg-[#f5f7fb]"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent blur
                    onChange(id);
                    setSelectedLabel(label);
                    setQuery("");
                    setIsFocused(false);
                  }}
                >
                  <div className="font-bold text-[#1a1a1a]">{label}</div>
                  <div className="mt-1 text-xs text-[#8a94a3]" dir="ltr">{id}</div>
                </li>
              );
            })
          ) : (
            <li className="px-4 py-3 text-sm text-[#8a94a3]">موردی یافت نشد.</li>
          )}
        </ul>
      )}
    </div>
  );
}
