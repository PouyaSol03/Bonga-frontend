# Agency Consultant Publisher Options Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show an agency consultant exactly three create-ad identities and remove the redundant agency row.

**Architecture:** Keep `CreateAdBottomSheet` as a passive renderer of the options returned by `usePublisherOptions`. Change the role-resolution rule in that hook so consultant identity takes precedence over agency-manager identity when both roles are present. Also make the consultant description explicitly include `آژانس` before the resolved agency name. Update the existing browser-level contract test to exercise the bottom sheet with the same multi-role session shape.

**Tech Stack:** React 19, TypeScript, Vite 8, Playwright.

## Global Constraints

- Preserve RTL text and the fixed mobile-shell behavior.
- Do not change API requests, stored session format, or route destinations.
- Do not modify unrelated dirty files.
- The consultant option title is `مشاور آژانس`.
- The consultant option description is `انتشار به عنوان مشاور آژانس «نام آژانس»` when the agency name is available.

---

### Task 1: Prioritize agency-consultant publishing identity

**Files:**
- Modify: `src/features/advertisements/api/publisher-options.hooks.ts:24-91`
- Modify: `tests/e2e/advertise/publisher-context.spec.ts:5-67`

**Interfaces:**
- Consumes: `getStoredAuthSession()` and `useMyAgencyProfileQuery()` from the existing hook.
- Produces: `usePublisherOptions(enabled?: boolean): PublisherOption[]`, consumed unchanged by `CreateAdBottomSheet`.

- [ ] **Step 1: Write the failing browser test**

Replace the multi-role visibility expectation with a consultant-precedence contract. The existing fixture already supplies `real_estate_manager`, `real_estate_consultant`, and `independent_consultant`; assert that the sheet displays exactly the three expected rows and excludes the redundant agency row.

```ts
test("shows only the three consultant publisher identities for a multi-role agency consultant", async ({ page }) => {
  await expect(page.getByText("شخصی", { exact: true })).toBeVisible();
  await expect(page.getByText("مشاور مستقل", { exact: true })).toBeVisible();
  await expect(page.getByText("مشاور آژانس", { exact: true })).toBeVisible();
  await expect(page.getByText("انتشار به عنوان مشاور آژانس آژانس تست", { exact: true })).toBeVisible();
  await expect(page.getByText("آژانس تست", { exact: true })).toHaveCount(1);
});
```

Add a manager-only fixture whose roles include `user` and `real_estate_manager`, then assert the agency row is visible and the agency-consultant row is absent.

- [ ] **Step 2: Run the browser test to verify it fails**

Run: `npm.cmd run test:e2e:ad -- publisher-context.spec.ts`

Expected: the multi-role test fails because the current hook exposes `آژانس تست` as a fourth publisher option.

- [ ] **Step 3: Implement the minimal role-precedence rule**

Derive an `isAgencyConsultant` boolean from the existing role set. Only append the `agency-manager` option when `canPublishAsAgency` is true and `isAgencyConsultant` is false. Keep the consultant title as `مشاور آژانس` and change its named-agency description to `انتشار به عنوان مشاور آژانس ${agencyName}`.

```ts
const isAgencyConsultant = availableRoles.has("real_estate_consultant");

if (canPublishAsAgency && !isAgencyConsultant) {
  options.push({
    id: "agency-manager",
    title: agencyName || "آژانس",
    description: agencyName ? `انتشار به نام آژانس ${agencyName}` : "انتشار به نام آژانس",
    icon: "agency",
    senderRole: "real_estate_manager",
  });
}

if (isAgencyConsultant) {
  options.push({
    id: "agency-consultant",
    title: "مشاور آژانس",
    description: agencyName
      ? `انتشار به عنوان مشاور آژانس ${agencyName}`
      : "انتشار به عنوان مشاور آژانس",
    icon: "building",
    senderRole: "real_estate_consultant",
  });
}
```

- [ ] **Step 4: Run the browser test to verify it passes**

Run: `npm.cmd run test:e2e:ad -- publisher-context.spec.ts`

Expected: all publisher-context scenarios pass; the consultant sheet has three rows and the manager-only case retains its agency row.

- [ ] **Step 5: Build the frontend**

Run: `npm.cmd run build`

Expected: TypeScript and Vite complete successfully; the known Vite chunk-size warning may remain.

- [ ] **Step 6: Commit the implementation**

```powershell
git add src/features/advertisements/api/publisher-options.hooks.ts tests/e2e/advertise/publisher-context.spec.ts
git commit -m "fix: prioritize agency consultant publisher option"
```
