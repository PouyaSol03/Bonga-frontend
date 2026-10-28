import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { expect, test } from "vitest";
import {
  Panel, PanelHeader, FilterField, TableHead, TableCell, TableLoadingRows,
  TableEmptyRow, SearchTableEmptyRow, StatusBadge, UserStatusBadge, PrimaryButton,
  SmallActionButton, CrmSelect, TextLink, EmptyState, ListSkeleton, FormCardSkeleton,
} from "../../src/features/crm/CrmLayout";

test("preserves CRM shared component markup", () => {
  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <Panel><PanelHeader title="عنوان" subtitle="توضیح" /><FilterField label="فیلتر"><input /></FilterField></Panel>
      <table><thead><tr><TableHead>عنوان</TableHead></tr></thead><tbody>
        <tr><TableCell>مقدار</TableCell></tr><TableLoadingRows columns={2} rows={2} />
        <TableEmptyRow columns={2} message="خالی" /><SearchTableEmptyRow columns={2} />
      </tbody></table>
      <StatusBadge status="accepted" /><StatusBadge status="wait_for_admin" />
      <UserStatusBadge status={1} /><UserStatusBadge status={0} />
      <PrimaryButton icon="save" label="ذخیره" onClick={() => {}} />
      <SmallActionButton label="ویرایش" tone="danger" onClick={() => {}} />
      <CrmSelect value="a" onChange={() => {}}><option value="a">گزینه</option></CrmSelect>
      <TextLink label="مشاهده" to="/account" /><EmptyState description="خالی" />
      <ListSkeleton count={2} /><FormCardSkeleton />
    </MemoryRouter>,
  );
  expect(markup).toMatchSnapshot();
});
