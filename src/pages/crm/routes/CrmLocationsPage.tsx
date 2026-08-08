import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Fragment, useState, useEffect } from "react";
import { listCrmCities, getCrmRecordId, listCrmNeighborhoods, type CrmRecord, saveCrmCity, deleteCrmCity, saveCrmNeighborhood, deleteCrmNeighborhood } from "../../../core/services/crm.service";
import { ConfirmModal, CrmIcon, DEFAULT_CENTER, DEFAULT_COUNTRY_ID, EditorModal, FilterField, Panel, PanelHeader, PrimaryButton, SmallActionButton, TableCell, TableEmptyRow, SearchTableEmptyRow, TableHead, TableLoadingRows, cleanEmptyValues, inputClassName, parseMapPointValue, readText, stringifyValue, useQueryErrorToast } from "../CrmLayout";
import type { ConfirmState, CrmRoutePageProps, EditorState } from "../CrmLayout";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import { pushRoute } from "../../../app/router/navigation";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";


function getSubNeighborhoodNames(value: unknown) {
  if (!value) return [] as string[];

  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value) as unknown;
    } catch {
      return value.split(/[،,|]/).map((item) => item.trim()).filter(Boolean);
    }
  }

  if (!Array.isArray(parsed)) return [] as string[];

  return parsed.flatMap((item) => {
    if (typeof item === "string") return item.trim() ? [item.trim()] : [];
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const record = item as CrmRecord;
    const name = String(record.name ?? record.title ?? record.label ?? "").trim();
    return name ? [name] : [];
  });
}

export function CrmLocationsPage({ notify, refreshNonce }: CrmRoutePageProps) {
  const queryClient = useQueryClient();
  const [citySearch, setCitySearch] = useState("");
  const cityFilter = citySearch.trim();
  const [cityId, setCityId] = useState("");
  const [expandedNeighborhoodId, setExpandedNeighborhoodId] = useState("");
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

  useEffect(() => {
    setExpandedNeighborhoodId("");
  }, [cityId]);

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
            lat: Number(city.lat) || DEFAULT_CENTER[0],
            lng: Number(city.lng) || DEFAULT_CENTER[1],
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
      ],
      onSubmit: async (values) => {
        await neighborhoodSaveMutation.mutateAsync({
          id,
          payload: cleanEmptyValues({
            ...values,
            lat: values.lat ? Number(values.lat) : undefined,
            lng: values.lng ? Number(values.lng) : undefined,
            polygon: neighborhood.polygon ?? neighborhood.geofence,
            sub_neighbors: neighborhood.sub_neighbors,
          }),
        });
      },
      title: id ? "ویرایش محله" : "ثبت محله جدید",
    });
  };

  const openCityMap = (neighborhoodId?: string) => {
    if (!cityId) return;
    const selectedCity = citiesQuery.data?.find((city) => getCrmRecordId(city) === cityId);
    const params = new URLSearchParams({ cityId });
    if (selectedCity) {
      const cityName = readText(selectedCity, ["name"], "");
      const lat = Number(selectedCity.lat);
      const lng = Number(selectedCity.lng);
      if (cityName) params.set("cityName", cityName);
      if (Number.isFinite(lat)) params.set("lat", String(lat));
      if (Number.isFinite(lng)) params.set("lng", String(lng));
    }
    if (neighborhoodId) params.set("neighborhoodId", neighborhoodId);
    pushRoute(`/crm/locations/map?${params.toString()}`);
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
                        </TableCell>
                        <TableCell>{id}</TableCell>
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
            action={
              <Button disabled={!cityId} onClick={() => openCityMap()} size="x-medium" variant="secondary">
                <CrmIcon name="location" size={18} />
                نقشه و مرزبندی
              </Button>
            }
            subtitle={cityId ? "محله‌های اصلی، زیرمحله‌های وابسته و محدوده جغرافیایی آن‌ها" : "ابتدا یک شهر را انتخاب کنید."}
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
                  <th
                    aria-label="باز کردن محله"
                    className="w-12 min-w-12 border-b border-[#e5e5e5] bg-[#fafafa] px-2 py-3.5 text-center last:rounded-l-xl"
                  />
                </tr>
              </thead>
              <tbody>
                {!cityId ? (
                  <TableEmptyRow columns={5} message="برای مشاهده محله‌ها یک شهر انتخاب کنید." />
                ) : neighborhoodsQuery.isLoading ? (
                  <TableLoadingRows columns={5} rows={6} />
                ) : neighborhoodsQuery.data?.length ? (
                  neighborhoodsQuery.data.map((neighborhood) => {
                    const id = getCrmRecordId(neighborhood);
                    const subNeighborhoodNames = getSubNeighborhoodNames(neighborhood.sub_neighbors);
                    const isExpanded = expandedNeighborhoodId === id;

                    return (
                      <Fragment key={id}>
                        <tr
                          className={`cursor-pointer transition-colors hover:bg-[#fafcff] ${isExpanded ? "bg-[#f6f9ff]" : ""}`}
                          onClick={() => setExpandedNeighborhoodId((current) => current === id ? "" : id)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="min-w-0">
                                <Typography as="span" variant="label" size="medium" weight="semibold" className="block truncate text-[#1a1a1a]">{readText(neighborhood, ["name"])}</Typography>
                                <Typography as="span" variant="body" size="small" weight="regular" className="mt-1 block text-[#808080]">
                                  {subNeighborhoodNames.length ? `${subNeighborhoodNames.length} زیرمحله` : "بدون زیرمحله"}
                                </Typography>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell><Typography as="span" variant="body" size="medium" weight="regular" className="block max-w-[130px] truncate text-sm" dir="ltr">{readText(neighborhood, ["city_id"], cityId)}</Typography></TableCell>
                          <TableCell><Typography as="span" variant="body" size="medium" weight="regular" className="text-sm" dir="ltr">{readText(neighborhood, ["lat"])}, {readText(neighborhood, ["lng"])}</Typography></TableCell>
                          <TableCell>
                            <div className="flex gap-1" onClick={(event) => event.stopPropagation()}>
                              <SmallActionButton label="نقشه" onClick={() => openCityMap(id)} tone="primary" />
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
                          <td className="w-12 min-w-12 border-b border-[#f0f0f0] px-2 py-4 text-center align-middle">
                            <LinearArrowLeft1
                              aria-hidden="true"
                              className={`mx-auto h-5 w-5 shrink-0 text-[#808080] transition-transform ${isExpanded ? "rotate-90" : ""}`}
                            />
                          </td>
                        </tr>

                        {isExpanded ? (
                          <tr className="bg-[#fbfcfe]">
                            <td className="border-t border-[#eef0f3] px-4 py-3" colSpan={5}>
                              <div className="rounded-xl border border-[#e6e8ec] bg-white p-3">
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <Typography as="p" variant="label" size="medium" weight="semibold" className="m-0 text-[#1a1a1a]">زیرمحله‌ها</Typography>
                                    <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-1 text-[#808080]">زیرمحله‌های این محله فقط در همین بخش نمایش داده می‌شوند.</Typography>
                                  </div>
                                  <Button onClick={() => openCityMap(id)} size="small" variant="primary">
                                    افزودن زیرمحله
                                  </Button>
                                </div>

                                {subNeighborhoodNames.length ? (
                                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {subNeighborhoodNames.map((name) => (
                                      <div className="rounded-lg border border-[#eeeeee] bg-[#fafafa] px-3 py-2" key={name}>
                                        <Typography as="span" variant="body" size="medium" weight="medium" className="text-[#333333]">{name}</Typography>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-3 rounded-lg bg-[#fafafa] px-3 py-3 text-[#909090]">هنوز زیرمحله‌ای برای این محله ثبت نشده است.</Typography>
                                )}
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })
                ) : (
                  <TableEmptyRow columns={5} message="برای این شهر محله‌ای ثبت نشده است." />
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
