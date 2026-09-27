# Account My Ad State UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the ten agency-assigned advertisement state views to match `docs_UI` exactly, keep existing server behavior, repair Storybook, and leave every touched feature/story file at 200 lines or fewer.

**Architecture:** Keep `AccountMyAdStatePage` as a thin route/data container and move each existing page branch into feature-local modules. The assigned-user branch uses a deterministic view model, reusable reference-matched primitives, state sections, and three full-screen action flows; API mutations live in a controller hook rather than visual components.

**Tech Stack:** React 19, TypeScript 6, Tailwind CSS 4, TanStack Query, Storybook 10, Playwright.

## Global Constraints

- Only the state-advertisement page family is in scope.
- Match all ten 360px-wide SVG references in `docs_UI` for RTL direction, spacing, sizing, color, typography, dividers, buttons, timelines, and icon placement.
- Reuse existing `src/shared/icons` components; do not substitute text glyphs or a new icon library.
- Preserve personal-ad and real-estate-manager behavior, routes, API payloads, mutations, and error copy.
- Do not recreate the phone operating-system status bar.
- No touched production source or Storybook file may exceed 200 lines.
- Preserve the user's existing uncommitted changes and do not rewrite unrelated files.

---

## File Structure

Create `src/features/account/adState/` with these responsibilities:

- `types.ts`: public props, route state, view state, action and timeline types.
- `stateConfig.ts`: labels, tones and visible controls for assigned states.
- `model.ts`: pure normalization from advertisement/card/status to `AssignedAdStateModel`.
- `readers.ts`: defensive API field readers and Persian date/digit helpers.
- `AccountMyAdStatePage.tsx`: route/query/role composition only.
- `PersonalAdStatePage.tsx`: unchanged personal-ad branch extracted from the oversized page.
- `ManagerAdStatePage.tsx`: unchanged manager branch composition.
- `ManagerPublisherPicker.tsx`: unchanged manager publisher selector.
- `useAssignedAdActions.ts`: mutations, refetch and flow transitions.
- `AssignedAdStateView.tsx`: shared assigned-state screen shell.
- `AssignedAdSummary.tsx`: badge, category/title/image summary.
- `AssignedAdActions.tsx`: preview and state-specific actions.
- `AssignedAdTimeline.tsx`: timeline heading and rows.
- `AssignedAdNotice.tsx`: waiting/repost/archive/deleted messaging.
- `flows/StopPublishFlow.tsx`: reference-matched stop-publication request screen.
- `flows/CancelAssignmentFlow.tsx`: reference-matched cancellation screen.
- `flows/DealResultFlow.tsx`: reference-matched result form.
- `flows/RepostFlow.tsx`: existing repost/reassign behavior in focused views.
- `fixtures.ts`: deterministic Storybook data.
- `AccountMyAdStatePage.stories.tsx`: ten agency stories plus unchanged personal stories.

Split any unit again before it reaches 200 lines.

### Task 1: Repair Storybook Runtime and Add a Smoke Test

**Files:**
- Modify: `.storybook/main.ts`
- Modify: `.storybook/preview.tsx`
- Modify: `package.json`
- Create: `tests/e2e/storybook/account-my-ad-state-storybook.spec.ts`
- Create: `playwright.storybook.config.ts`

**Interfaces:**
- Consumes: Storybook story id `features-account-accountmyadstatepage--agency-docs-1-published`.
- Produces: a Storybook runtime that renders stories without the removed addon error.

- [ ] **Step 1: Write the failing Storybook smoke test**

```ts
import { expect, test } from "@playwright/test";

test("assigned-ad published story renders without runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/iframe.html?id=features-account-accountmyadstatepage--agency-docs-1-published&viewMode=story");
  await expect(page.getByText("منتشر شده", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
```

- [ ] **Step 2: Run it and verify the current removed-addon failure**

Run: `npx playwright test -c playwright.storybook.config.ts tests/e2e/storybook/account-my-ad-state-storybook.spec.ts`

Expected: FAIL because Storybook reports that `@storybook/addon-viewport` no longer exists.

- [ ] **Step 3: Remove only the obsolete addon registration and dependency**

Set `.storybook/main.ts` `addons` to `[]`, remove `@storybook/addon-viewport` from `package.json`, run `npm install --package-lock-only`, and keep the supported `parameters.viewport` definitions in `preview.tsx`.

- [ ] **Step 4: Add a 360px reference viewport**

```ts
reference360: {
  name: "State Ads Reference (360px)",
  styles: { width: "360px", height: "905px" },
  type: "mobile",
}
```

- [ ] **Step 5: Build Storybook and rerun the smoke test**

Run: `npm run build-storybook && npx playwright test -c playwright.storybook.config.ts tests/e2e/storybook/account-my-ad-state-storybook.spec.ts`

Expected: PASS with no browser console errors.

- [ ] **Step 6: Commit**

```bash
git add .storybook/main.ts .storybook/preview.tsx package.json package-lock.json playwright.storybook.config.ts tests/e2e/storybook/account-my-ad-state-storybook.spec.ts
git commit -m "fix(storybook): restore state-ad story runtime"
```

### Task 2: Extract and Test the Assigned-State Model

**Files:**
- Create: `src/features/account/adState/types.ts`
- Create: `src/features/account/adState/readers.ts`
- Create: `src/features/account/adState/stateConfig.ts`
- Create: `src/features/account/adState/model.ts`
- Create: `tests/e2e/account/account-my-ad-state-model.spec.ts`

**Interfaces:**
- Consumes: `AdCardData`, `MyAdStatusKey`, raw advertisement records.
- Produces: `buildAssignedAdStateModel(input): AssignedAdStateModel`.

- [ ] **Step 1: Write failing model tests for all reference variants**

```ts
import { expect, test } from "@playwright/test";
import { buildAssignedAdStateModel } from "../../../src/features/account/adState/model";

test("maps an agency deal deletion to result confirmation", () => {
  const model = buildAssignedAdStateModel({
    ad: { assigned_agency_name: "آژانس جلیلیان", deleted_reason: "agency_deal" },
    card: { id: "130", title: "آگهی", status: "حذف شده" } as never,
    statusKey: "wait_for_deal_confirmation",
  });
  expect(model.variant).toBe("deal-confirmation");
  expect(model.primaryAction).toBe("submit-result");
});

test("maps user-stopped and recovery-expired deletions independently", () => {
  expect(buildAssignedAdStateModel({ ad: {}, card: { id: "1" } as never, statusKey: "deleted", deletedVariant: "user_stopped" }).variant).toBe("user-stopped");
  expect(buildAssignedAdStateModel({ ad: {}, card: { id: "1" } as never, statusKey: "deleted", deletedVariant: "recovery_expired" }).variant).toBe("recovery-expired");
});
```

- [ ] **Step 2: Run the focused test and verify it fails because the model does not exist**

Run: `npx playwright test tests/e2e/account/account-my-ad-state-model.spec.ts`

Expected: FAIL resolving `adState/model`.

- [ ] **Step 3: Define explicit types and state configuration**

```ts
export type AssignedAdVariant =
  | "published"
  | "waiting-agency"
  | "waiting-repost"
  | "archived"
  | "deal-confirmation"
  | "recovery-expired"
  | "user-stopped";

export type AssignedAdFlow = "details" | "stop-publish" | "cancel-assignment" | "deal-result";
export type AssignedAdPrimaryAction = "none" | "restore" | "repost" | "submit-result";
```

- [ ] **Step 4: Implement the pure mapper and defensive readers**

The mapper must contain no React hooks, browser globals, mutations, alerts or navigation. It must normalize badge copy, category, agency, dates, timeline rows, visible actions and deleted variant.

- [ ] **Step 5: Run the focused model tests**

Run: `npx playwright test tests/e2e/account/account-my-ad-state-model.spec.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/account/adState tests/e2e/account/account-my-ad-state-model.spec.ts
git commit -m "refactor(account): model assigned advertisement states"
```

### Task 3: Split the Oversized Route Page Without Changing Other Branches

**Files:**
- Modify: `src/features/account/AccountMyAdStatePage.tsx`
- Create: `src/features/account/adState/PersonalAdStatePage.tsx`
- Create: `src/features/account/adState/PersonalAdStateSections.tsx`
- Create: `src/features/account/adState/PersonalAdStateDialogs.tsx`
- Create: `src/features/account/adState/ManagerAdStatePage.tsx`
- Create: `src/features/account/adState/ManagerPublisherPicker.tsx`
- Create: `src/features/account/adState/ManagerAdStateParts.tsx`
- Create: `src/features/account/adState/routeState.ts`
- Create: `src/features/account/adState/StatePageSkeleton.tsx`
- Modify: `src/features/account/myAdsStatus.ts`
- Create: `src/features/account/myAdsStatusConfig.ts`
- Create: `src/features/account/myAdsStatusResolver.ts`

**Interfaces:**
- Consumes: the current `AccountMyAdStatePageProps`, route state and queries.
- Produces: the same exported `AccountMyAdStatePage` and status exports with no route/API behavior change.

- [ ] **Step 1: Extend the smoke test to cover personal and manager branches**

Add deterministic personal and manager stories and assert their existing heading/action copy is visible before moving code.

- [ ] **Step 2: Run the tests against the existing page**

Expected: PASS, establishing characterization coverage.

- [ ] **Step 3: Move personal and manager functions verbatim into focused modules**

Move markup and helpers before rewriting. Preserve classes, route paths, request payloads, query calls and copy. Each destination file must stay under 200 lines.

- [ ] **Step 4: Reduce `AccountMyAdStatePage.tsx` to orchestration**

```tsx
export function AccountMyAdStatePage(props?: AccountMyAdStatePageProps) {
  const context = useMyAdStatePageContext(props);
  if (context.loading) return <StatePageSkeleton {...context.navigation} />;
  if (context.isManager) return <ManagerAdStatePage {...context.managerProps} />;
  if (context.isAssigned) return <AssignedAdStateContainer {...context.assignedProps} />;
  return <PersonalAdStatePage {...context.personalProps} />;
}
```

- [ ] **Step 5: Split status configuration from resolution while preserving exports**

Keep `getMyAdStatusInfo`, `myAdStatusConfig`, `MyAdStatusInfo`, and `MyAdStatusKey` import-compatible through re-exports.

- [ ] **Step 6: Run focused stories and the production build**

Run: `npm run build-storybook && npm run build`

Expected: both exit 0.

- [ ] **Step 7: Verify file lengths**

Run: `Get-ChildItem src/features/account/adState -Recurse -File | ForEach-Object { if ((Get-Content $_.FullName).Count -gt 200) { $_.FullName } }`

Expected: no output.

- [ ] **Step 8: Commit**

```bash
git add src/features/account/AccountMyAdStatePage.tsx src/features/account/myAdsStatus.ts src/features/account/myAdsStatusConfig.ts src/features/account/myAdsStatusResolver.ts src/features/account/adState
git commit -m "refactor(account): split advertisement state page"
```

### Task 4: Build the Shared Reference-Matched Assigned State UI

**Files:**
- Create: `src/features/account/adState/AssignedAdStateView.tsx`
- Create: `src/features/account/adState/AssignedAdSummary.tsx`
- Create: `src/features/account/adState/AssignedAdActions.tsx`
- Create: `src/features/account/adState/AssignedAdTimeline.tsx`
- Create: `src/features/account/adState/AssignedAdNotice.tsx`
- Create: `src/features/account/adState/useAssignedAdActions.ts`
- Remove after migration: `src/features/account/components/AgencyAssignedUserAdView.tsx`

**Interfaces:**
- Consumes: `AssignedAdStateModel` and `AssignedAdStateActions` callbacks.
- Produces: `AssignedAdStateView({ model, actions, flow, onFlowChange })`.

- [ ] **Step 1: Add failing story assertions for the four base layouts**

Assert exact state-specific text and action visibility for published, waiting-agency, waiting-repost and archived stories. Ensure the published story does not show repost/restore controls.

- [ ] **Step 2: Run and verify failures against the current partial UI**

Expected: at least one reference-specific assertion fails.

- [ ] **Step 3: Implement the common 360px layout primitives**

Use the SVG coordinates as exact tokens: 16px horizontal page inset, 40px status badge height with 8px radius, 328x80 summary card, state-specific vertical gaps, reference divider colors, and Dana typography.

- [ ] **Step 4: Implement state-specific notices and action composition**

Use configuration/model data for copy and timelines, but keep markup explicit where reference layouts differ. Use existing icons including `LinearPreview`, `LinearCancel`, `LinearRefresh`, `LinearCalendar`, `LinearArrowLeft1`, `LinearClock`, and `LinearInfoCircle`.

- [ ] **Step 5: Move mutations into `useAssignedAdActions`**

```ts
export type AssignedAdStateActions = {
  preview(): void;
  requestStop(reason: string): Promise<void>;
  cancelAssignment(): Promise<void>;
  restore(): Promise<void>;
  submitDealResult(confirmed: boolean): Promise<void>;
};
```

Keep existing mutation hooks, payloads, error messages and post-success refetch behavior.

- [ ] **Step 6: Rerun focused Storybook tests and build**

Expected: base-state assertions PASS and `npm run build` exits 0.

- [ ] **Step 7: Commit**

```bash
git add src/features/account/adState src/features/account/components/AgencyAssignedUserAdView.tsx tests/e2e/storybook/account-my-ad-state-storybook.spec.ts
git commit -m "feat(account): match assigned ad state layouts"
```

### Task 5: Implement the Three Full-Screen Reference Flows

**Files:**
- Create: `src/features/account/adState/flows/StopPublishFlow.tsx`
- Create: `src/features/account/adState/flows/CancelAssignmentFlow.tsx`
- Create: `src/features/account/adState/flows/DealResultFlow.tsx`
- Create: `src/features/account/adState/flows/FlowActionBar.tsx`
- Create: `src/features/account/adState/flows/RepostFlow.tsx`
- Modify: `src/features/account/adState/AssignedAdStateView.tsx`

**Interfaces:**
- Consumes: `AssignedAdFlow`, action callbacks, pending flags.
- Produces: exact flow screens with cancel/back behavior and submit validation.

- [ ] **Step 1: Add failing tests for each initial flow state**

```ts
await page.goto("/iframe.html?id=features-account-accountmyadstatepage--agency-docs-2-stop-publish-sheet&viewMode=story");
await expect(page.getByRole("heading", { name: "توقف انتشار" })).toBeVisible();
await expect(page.getByRole("button", { name: "ثبت" })).toBeVisible();
```

Add equivalent assertions for cancellation and deal result, including disabled submit until a radio option is selected where the reference requires it.

- [ ] **Step 2: Run and verify the tests fail against the generic bottom sheets**

Expected: FAIL because current markup is not the full-screen reference flow.

- [ ] **Step 3: Implement the shared flow shell and fixed action bar**

The shell includes the application header, scrollable main region, reference body spacing, and bottom two-button action bar. It excludes the OS status bar.

- [ ] **Step 4: Implement each form with exact copy, radio controls and icons**

Keep selections local, call controller callbacks on confirmation, preserve pending/disabled states, and keep successful navigation/refetch behavior.

- [ ] **Step 5: Rerun focused flow tests**

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/account/adState/flows src/features/account/adState/AssignedAdStateView.tsx tests/e2e/storybook/account-my-ad-state-storybook.spec.ts
git commit -m "feat(account): match assigned ad action flows"
```

### Task 6: Rebuild Storybook Fixtures and All Ten Stories

**Files:**
- Modify: `src/features/account/AccountMyAdStatePage.stories.tsx`
- Create: `src/features/account/adState/fixtures.ts`
- Modify: `tests/e2e/storybook/account-my-ad-state-storybook.spec.ts`

**Interfaces:**
- Consumes: exported `AccountMyAdStatePageProps` and deterministic fixtures.
- Produces: ten stable reference stories at `reference360` viewport.

- [ ] **Step 1: Add a table-driven test for all ten story ids**

```ts
const stories = [
  ["agency-docs-1-published", "منتشر شده"],
  ["agency-docs-2-stop-publish-sheet", "توقف انتشار"],
  ["agency-docs-3-wait-for-agency", "در انتظار تایید آژانس"],
  ["agency-docs-4-cancel-assignment-sheet", "لغو واگذاری آگهی به آژانس"],
  ["agency-docs-5-wait-for-repost", "ثبت مجدد آگهی"],
  ["agency-docs-6-archived", "بازیابی آگهی"],
  ["agency-docs-7-deleted-agency-deal", "ثبت نتیجه درخواست"],
  ["agency-docs-8-deal-result-sheet", "نتیجه درخواست"],
  ["agency-docs-9-deleted-recovery-expired", "حذف شده"],
  ["agency-docs-10-deleted-user-stopped", "حذف شده"],
] as const;
```

- [ ] **Step 2: Run and record current failures**

Expected: incomplete stories or mismatched reference copy fail.

- [ ] **Step 3: Move fixtures out of the story file and set reference parameters**

```ts
parameters: {
  layout: "fullscreen",
  viewport: { defaultViewport: "reference360" },
}
```

- [ ] **Step 4: Keep the story file at or below 200 lines**

Use small exported fixture builders rather than repeating advertisement records.

- [ ] **Step 5: Run all ten Storybook tests**

Expected: 10/10 PASS with no console errors.

- [ ] **Step 6: Commit**

```bash
git add src/features/account/AccountMyAdStatePage.stories.tsx src/features/account/adState/fixtures.ts tests/e2e/storybook/account-my-ad-state-storybook.spec.ts
git commit -m "test(storybook): cover assigned ad reference states"
```

### Task 7: Visual Parity Pass and Final Verification

**Files:**
- Modify only mismatching files under `src/features/account/adState/` and the state stories.

**Interfaces:**
- Consumes: ten SVGs in `docs_UI` and ten Storybook stories.
- Produces: verified 360px visual parity and a clean build.

- [ ] **Step 1: Capture each Storybook story at 360px**

Use the Storybook Playwright configuration and save temporary screenshots outside source control.

- [ ] **Step 2: Compare each screenshot against its matching SVG render**

Check top-to-bottom geometry, RTL order, typography weight/line height, colors, borders, radii, icon sizes, divider styles, timeline spacing, fixed action bars and scroll height. Fix one mismatch class at a time.

- [ ] **Step 3: Run focused tests after every visual correction**

Run: `npx playwright test -c playwright.storybook.config.ts tests/e2e/storybook/account-my-ad-state-storybook.spec.ts`

Expected: all tests PASS.

- [ ] **Step 4: Run lint**

Run: `npm run lint`

Expected: exit 0 with no new warnings/errors.

- [ ] **Step 5: Run the complete production build**

Run: `npm run build`

Expected: exit 0; only the already-known Vite chunk-size warning may remain.

- [ ] **Step 6: Run Storybook build and runtime tests**

Run: `npm run build-storybook && npx playwright test -c playwright.storybook.config.ts tests/e2e/storybook/account-my-ad-state-storybook.spec.ts`

Expected: exit 0 and all ten stories PASS without console errors.

- [ ] **Step 7: Enforce the line limit**

Run:

```powershell
$files = @(
  "src/features/account/AccountMyAdStatePage.tsx",
  "src/features/account/AccountMyAdStatePage.stories.tsx",
  "src/features/account/myAdsStatus.ts",
  "src/features/account/myAdsStatusConfig.ts",
  "src/features/account/myAdsStatusResolver.ts"
) + (Get-ChildItem src/features/account/adState -Recurse -File | ForEach-Object FullName)
$files | Where-Object { (Get-Content $_).Count -gt 200 }
```

Expected: no output.

- [ ] **Step 8: Inspect the final scoped diff**

Run: `git status --short && git diff --stat && git diff --check`

Expected: no unrelated files, no whitespace errors, and the pre-existing user changes remain accounted for.

- [ ] **Step 9: Commit final parity corrections**

```bash
git add src/features/account .storybook package.json package-lock.json playwright.storybook.config.ts tests/e2e/account tests/e2e/storybook
git commit -m "fix(account): align assigned ad states with references"
```
