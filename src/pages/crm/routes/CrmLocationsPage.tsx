import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { listCrmCities, getCrmRecordId, listCrmNeighborhoods, type CrmRecord, saveCrmCity, deleteCrmCity, saveCrmNeighborhood, deleteCrmNeighborhood } from "../../../core/services/crm.service";
import { ConfirmModal, CrmIcon, DEFAULT_CENTER, DEFAULT_COUNTRY_ID, EditorModal, FilterField, Panel, PanelHeader, PrimaryButton, SmallActionButton, TableCell, TableEmptyRow, SearchTableEmptyRow, TableHead, TableLoadingRows, cleanEmptyValues, inputClassName, parseJsonValue, parseMapPointValue, readText, stringifyValue, useQueryErrorToast } from "../CrmLayout";
import type { ConfirmState, CrmRoutePageProps, EditorState } from "../CrmLayout";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

export function CrmLocationsPage({ notify, refreshNonce }: CrmRoutePageProps) {
  const queryClient = useQueryClient();
  const [citySearch, setCitySearch] = useState("");
  const cityFilter = citySearch.trim();
  const [cityId, setCityId] = useState("");
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const citiesQuery = useQuery({
    queryFn: () => listCrmCities({ query: cityFilter }),
    queryKey: ["crm", "cities", cityFilter, refreshNonce],
  });

  useEffect(() => {
    if (cityId || !citiesQuery.data?.length) return;
    setCityId(getCrmRecordId(citiesQuery.data[0]));
  }, [citiesQuery.data, cityId]);

  const neighborhoodsQuery = useQuery({
    enabled: Boolean(cityId),
    queryFn: () => listCrmNeighborhoods({ cityId }),
    queryKey: ["crm", "neighborhoods", cityId, refreshNonce],
  });

  useQueryErrorToast([citiesQuery.error, neighborhoodsQuery.error], notify);

  const citySaveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: CrmRecord }) =>
      saveCrmCity(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "cities"] });
      notify("اطلاعات شهر ذخیره شد.");
    },
  });

  const cityDeleteMutation = useMutation({
    mutationFn: deleteCrmCity,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "cities"] });
      notify("شهر حذف شد.");
    },
  });

  const neighborhoodSaveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: CrmRecord }) =>
      saveCrmNeighborhood(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "neighborhoods"] });
      notify("اطلاعات محله ذخیره شد.");
    },
  });

  const neighborhoodDeleteMutation = useMutation({
    mutationFn: deleteCrmNeighborhood,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "neighborhoods"] });
      notify("محله حذف شد.");
    },
  });

  const openCityEditor = (city: CrmRecord = {}) => {
    const id = getCrmRecordId(city) || null;

    setEditor({
      fields: [
        { label: "نام شهر", name: "name", value: city.name },
        { label: "شناسه کشور", name: "country_id", type: "number", value: city.country_id ?? DEFAULT_COUNTRY_ID },
        {
          label: "موقعیت شهر روی نقشه",
          name: "location",
          type: "map-point",
          value: stringifyValue({
            lat: Number(city.lat) || 36.2605,
            lng: Number(city.lng) || 59.6168,
          }),
        },
      ],
      onSubmit: async (values) => {
        const { location, ...cityValues } = values;
        const point = parseMapPointValue(location);

        await citySaveMutation.mutateAsync({
          id,
          payload: cleanEmptyValues({
            ...cityValues,
            country_id: Number(cityValues.country_id ?? DEFAULT_COUNTRY_ID),
            lat: point.lat,
            lng: point.lng,
          }),
        });
      },
      title: id ? "ویرایش شهر" : "ثبت شهر جدید",
    });
  };

  const openNeighborhoodEditor = (neighborhood: CrmRecord = {}) => {
    const id = getCrmRecordId(neighborhood) || null;

    setEditor({
      fields: [
        { label: "نام محله", name: "name", value: neighborhood.name },
        { label: "شناسه شهر", name: "city_id", value: neighborhood.city_id ?? cityId },
        { label: "عرض جغرافیایی", name: "lat", type: "number", value: neighborhood.lat ?? DEFAULT_CENTER[0] },
        { label: "طول جغرافیایی", name: "lng", type: "number", value: neighborhood.lng ?? DEFAULT_CENTER[1] },
        { label: "محدوده جغرافیایی", name: "polygon", type: "geofence", value: stringifyValue(neighborhood.polygon) },
        { label: "زیرمحله‌ها", name: "sub_neighbors", type: "sub-neighborhoods", value: neighborhood.sub_neighbors },
      ],
      onSubmit: async (values) => {
        const polygon = values.polygon
          ? parseJsonValue(values.polygon, "محدوده جغرافیایی", undefined)
          : undefined;
        const subNeighborhoods = values.sub_neighbors
          ? parseJsonValue(values.sub_neighbors, "زیرمحله‌ها", [])
          : [];

        if (!Array.isArray(subNeighborhoods)) {
          throw new Error("زیرمحله‌ها باید به صورت فهرست معتبر باشند.");
        }

        const hasInvalidSubNeighborhood = subNeighborhoods.some((item) => {
          if (!item || typeof item !== "object" || Array.isArray(item)) return true;

          const record = item as CrmRecord;
          const id = String(record.id ?? "").trim();
          const name = String(record.name ?? "").trim();
          const geofence = record.geofence;

          return !id || !name || !geofence;
        });

        if (hasInvalidSubNeighborhood) {
          throw new Error("برای هر زیرمحله نام، شناسه و محدوده جغرافیایی را کامل کنید.");
        }

        await neighborhoodSaveMutation.mutateAsync({
          id,
          payload: cleanEmptyValues({
            ...values,
            lat: values.lat ? Number(values.lat) : undefined,
            lng: values.lng ? Number(values.lng) : undefined,
            polygon,
            sub_neighbors: subNeighborhoods,
          }),
        });
      },
      title: id ? "ویرایش محله" : "ثبت محله جدید",
    });
  };

  const handleDeleteCity = async (id: string) => {
    await cityDeleteMutation.mutateAsync(id);
    if (cityId === id) setCityId("");
  };

  const handleDeleteNeighborhood = (id: string) =>
    neighborhoodDeleteMutation.mutateAsync(id);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
        <Panel>
          <PanelHeader
            action={<PrimaryButton icon="plus" label="شهر جدید" onClick={() => openCityEditor()} />}
            subtitle="فهرست شهرهای قابل استفاده در جستجو و ثبت آگهی"
            title="شهرها"
          />
          <form
            className="mt-4 flex items-end gap-2 rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-3"
            onSubmit={(event) => event.preventDefault()}
          >
            <FilterField className="flex-1" label="جستجوی شهر">
              <input className={inputClassName} onChange={(event) => setCitySearch(event.target.value)} placeholder="نام شهر" value={citySearch} />
            </FilterField>
          </form>

          <div className="mt-4 max-h-[calc(100vh-320px)] overflow-auto rounded-xl border border-[#f0f0f0]">
            <table className="w-full min-w-[620px] border-separate border-spacing-0 text-right">
              <thead>
                <tr className="text-sm font-bold text-[#4d4d4d]">
                  <TableHead>نام</TableHead>
                  <TableHead>کد</TableHead>
                  <TableHead>موقعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </tr>
              </thead>
              <tbody>
                {citiesQuery.isLoading ? (
                  <TableLoadingRows columns={4} rows={6} />
                ) : citiesQuery.data?.length ? (
                  citiesQuery.data.map((city) => {
                    const id = getCrmRecordId(city);
                    const selected = cityId === id;

                    return (
                      <tr className={selected ? "bg-[#f6f9ff]" : ""} key={id}>
                        <TableCell>
                          <Button unstyled className={`text-sm font-bold ${selected ? "text-[#0048c4]" : "text-[#1a1a1a]"}`} onClick={() => setCityId(id)} type="button">
                            {readText(city, ["name"])}
                          </Button>
                          <small className="mt-1 block max-w-[140px] truncate text-sm text-[#9aa2af]">{id}</small>
                        </TableCell>
                        <TableCell>{readText(city, ["code"])}</TableCell>
                        <TableCell><Typography as="span" variant="body" size="medium" weight="regular" className="text-sm" dir="ltr">{readText(city, ["lat"])}, {readText(city, ["lng"])}</Typography></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <SmallActionButton label="ویرایش" onClick={() => openCityEditor(city)} />
                            <SmallActionButton
                              label="حذف"
                              onClick={() => setConfirm({
                                body: "با حذف شهر ممکن است محله‌های وابسته قابل استفاده نباشند.",
                                confirmLabel: "حذف شهر",
                                onConfirm: () => handleDeleteCity(id),
                                title: "حذف شهر",
                              })}
                              tone="danger"
                            />
                          </div>
                        </TableCell>
                      </tr>
                    );
                  })
                ) : cityFilter ? (
                  <SearchTableEmptyRow columns={4} />
                ) : (
                  <TableEmptyRow columns={4} message="هنوز شهری ثبت نشده است." />
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            action={<PrimaryButton disabled={!cityId} icon="plus" label="محله جدید" onClick={() => openNeighborhoodEditor()} />}
            subtitle={cityId ? "محله‌های شهر انتخاب‌شده و محدوده جغرافیایی آن‌ها" : "ابتدا یک شهر را انتخاب کنید."}
            title="محله‌ها"
          />

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-3">
            <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef4ff] text-[#0048c4]"><CrmIcon name="location" size={20} /></Typography>
            <div className="min-w-0 flex-1">
              <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 text-sm font-bold text-[#4f5a6c]">شناسه شهر انتخاب‌شده</Typography>
              <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-1 truncate text-sm text-[#9098a6]" dir="ltr">{cityId || "-"}</Typography>
            </div>
          </div>

          <div className="mt-4 max-h-[calc(100vh-320px)] overflow-auto rounded-xl border border-[#f0f0f0]">
            <table className="w-full min-w-[620px] border-separate border-spacing-0 text-right">
              <thead>
                <tr className="text-sm font-bold text-[#4d4d4d]">
                  <TableHead>نام</TableHead>
                  <TableHead>شناسه شهر</TableHead>
                  <TableHead>موقعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </tr>
              </thead>
              <tbody>
                {!cityId ? (
                  <TableEmptyRow columns={4} message="برای مشاهده محله‌ها یک شهر انتخاب کنید." />
                ) : neighborhoodsQuery.isLoading ? (
                  <TableLoadingRows columns={4} rows={6} />
                ) : neighborhoodsQuery.data?.length ? (
                  neighborhoodsQuery.data.map((neighborhood) => {
                    const id = getCrmRecordId(neighborhood);

                    return (
                      <tr key={id}>
                        <TableCell>
                          <Typography as="span" variant="label" size="medium" weight="semibold" className="font-bold text-[#1a1a1a]">{readText(neighborhood, ["name"])}</Typography>
                          <small className="mt-1 block max-w-[140px] truncate text-sm text-[#9aa2af]">{id}</small>
                        </TableCell>
                        <TableCell><Typography as="span" variant="body" size="medium" weight="regular" className="block max-w-[130px] truncate text-sm" dir="ltr">{readText(neighborhood, ["city_id"], cityId)}</Typography></TableCell>
                        <TableCell><Typography as="span" variant="body" size="medium" weight="regular" className="text-sm" dir="ltr">{readText(neighborhood, ["lat"])}, {readText(neighborhood, ["lng"])}</Typography></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <SmallActionButton label="ویرایش" onClick={() => openNeighborhoodEditor(neighborhood)} />
                            <SmallActionButton
                              label="حذف"
                              onClick={() => setConfirm({
                                body: "این محله و محدوده جغرافیایی ثبت‌شده آن حذف می‌شود.",
                                confirmLabel: "حذف محله",
                                onConfirm: async () => { await handleDeleteNeighborhood(id); },
                                title: "حذف محله",
                              })}
                              tone="danger"
                            />
                          </div>
                        </TableCell>
                      </tr>
                    );
                  })
                ) : (
                  <TableEmptyRow columns={4} message="برای این شهر محله‌ای ثبت نشده است." />
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <EditorModal
        editor={editor}
        isPending={citySaveMutation.isPending || neighborhoodSaveMutation.isPending}
        onClose={() => setEditor(null)}
        notify={notify}
        wide
      />
      <ConfirmModal confirm={confirm} onClose={() => setConfirm(null)} notify={notify} />
    </>
  );
}
