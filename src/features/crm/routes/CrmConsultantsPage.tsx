import { Panel, PanelHeader, PrimaryButton, type CrmRoutePageProps } from "../CrmLayout";
import {
  CrmConsultantsFilters,
  CrmConsultantsModals,
  CrmConsultantsTable,
  useCrmConsultants,
} from "../consultants";

export function CrmConsultantsPage(props: CrmRoutePageProps) {
  const {
    agencies,
    agencyIdFilter,
    agencyNames,
    agencyOnly,
    clearFilters,
    confirm,
    consultants,
    editor,
    handleRequestStatusChange,
    isActionPending,
    isLoading,
    openConsultantEditor,
    saveMutation,
    search,
    setAgencyIdFilter,
    setAgencyOnly,
    setConfirm,
    setEditor,
    setSearch,
    setStatusFilter,
    statusFilter,
  } = useCrmConsultants(props);

  return (
    <>
      <Panel>
        <PanelHeader
          action={
            <PrimaryButton
              icon="plus"
              label="مشاور جدید"
              onClick={() => openConsultantEditor()}
            />
          }
          subtitle="مشاوران مستقل و وابسته به آژانس را جستجو، فیلتر و مدیریت کنید."
          title="مدیریت مشاورین"
        />

        <CrmConsultantsFilters
          agencies={agencies}
          agencyIdFilter={agencyIdFilter}
          agencyOnly={agencyOnly}
          onAgencyIdFilterChange={setAgencyIdFilter}
          onAgencyOnlyChange={(checked) => {
            setAgencyOnly(checked);
            if (!checked) setAgencyIdFilter("");
          }}
          onClear={clearFilters}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
          search={search}
          statusFilter={statusFilter}
        />

        <CrmConsultantsTable
          agencyNames={agencyNames}
          consultants={consultants}
          isActionPending={isActionPending}
          isLoading={isLoading}
          onEdit={openConsultantEditor}
          onRequestStatusChange={handleRequestStatusChange}
        />
      </Panel>

      <CrmConsultantsModals
        confirm={confirm}
        editor={editor}
        isPending={saveMutation.isPending}
        notify={props.notify}
        onCloseConfirm={() => setConfirm(null)}
        onCloseEditor={() => setEditor(null)}
      />
    </>
  );
}
