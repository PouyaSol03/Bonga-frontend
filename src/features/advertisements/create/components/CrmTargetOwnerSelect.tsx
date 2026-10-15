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
    const timer = setTimeout(() => {
      if (!value) {
        setQuery("");
        setDebouncedQuery("");
        setSelectedLabel("");
      }
    }, 0);
    return () => clearTimeout(timer);
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
      <label className="border-outline-var bg-surface-container-lowest focus-within:border-primary flex h-14 flex-col rounded-xl border px-4 py-2 transition-colors">
        <Typography as="span" variant="label" size="small" weight="medium" className="text-outline">
          {type === "user" ? "جستجوی کاربر (با شماره موبایل)" : "جستجوی آژانس (با نام)"}
        </Typography>
        <input
          className="text-on-surface placeholder:text-outline-var h-6 bg-transparent text-sm font-bold outline-none placeholder:font-normal"
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
        <ul className="border-outline-var bg-surface-container-lowest absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border py-2 shadow-2xl">
          {isLoading ? (
            <li className="text-outline px-4 py-3 text-sm">در حال جستجو...</li>
          ) : data && data.length > 0 ? (
            data.map((item) => {
              const id = getCrmRecordId(item);
              const label =
                type === "user"
                  ? `${item.name || "بدون نام"} - ${item.mobile || "بدون شماره"}`
                  : String(item.name || "بدون نام");

              return (
                <li
                  key={id}
                  className="border-outline-var cursor-pointer border-b px-4 py-3 text-sm transition-colors last:border-0"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent blur
                    onChange(id);
                    setSelectedLabel(label);
                    setQuery("");
                    setIsFocused(false);
                  }}
                >
                  <div className="text-on-surface font-bold">{label}</div>
                  <div className="text-outline mt-1 text-xs" dir="ltr">
                    {id}
                  </div>
                </li>
              );
            })
          ) : (
            <li className="text-outline px-4 py-3 text-sm">موردی یافت نشد.</li>
          )}
        </ul>
      )}
    </div>
  );
}
