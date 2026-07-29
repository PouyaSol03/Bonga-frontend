# UI System Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Bring the Bonga frontend routing chrome, shared components, page layouts, and repeated UI patterns into alignment with the Figma-as-text design documentation while preserving current product behavior, RTL behavior, API contracts, and the mobile shell constraints.

**Architecture:** Keep the existing React/Vite app and custom route engine. Add a small design-system layer that owns tokens and reusable primitives, then migrate repeated page-local controls into those primitives. Route metadata should describe chrome and navigation behavior so `AppRouter` stops carrying long path-specific conditionals.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind CSS 4, motion/react, Leaflet/react-leaflet, @tanstack/react-query, custom history router.

**Source Of Truth:** Use `docs/design-system-inventory.md` for foundational colors, typography, spacing, icon tone, avatar shape, and grid rules. Use `docs/component-system-inventory.md` for component anatomy and variants. Treat those files as text replacements for Figma. A future developer should not need Figma access to implement this plan.

## Global Rules

- Keep the mobile shell fixed to viewport height. Do not make `html`, `body`, `#root`, the app shell, or the whole document scroll.
- Keep the mobile frame max width at `500px`.
- Keep RTL as the default mental model and implementation model. Do not mirror screens into LTR.
- Omit phone status bars in coded screens.
- Use Tailwind first for colors, spacing, typography, layout, radius, responsive behavior, and states.
- Keep `src/index.css` limited to font setup, CSS variables, base global rules, and CSS that Tailwind cannot express cleanly.
- Do not change API payloads, query keys, auth/session shape, map behavior, or route destinations unless a task explicitly says to.
- Do not replace the custom router with React Router in this pass.
- Do not add a new component library or CSS-in-JS system.
- All product UI icons must come from TSX icon components under `src/components/(icons)/`. Do not add inline SVGs, CSS-drawn icons, raw SVG imports, or new icon files under `src/assets/icons/` for app UI. If an icon is missing, create a typed TSX icon component in `src/components/(icons)/` and import it from there.
- Do not touch unrelated dirty worktree files except the planned documentation and code files.
- Run `npm.cmd run build` after every implementation batch.

## Audit Summary

The app already has a good fixed mobile shell in `src/app/MobileAppShell.tsx`, a reusable `TopBar` in `src/components/TopBar.tsx`, a shared `BottomSheet` in `src/components/BottomSheet.tsx`, and shared form controls in `src/components/form/FormControls.tsx`. Those should be preserved and upgraded instead of replaced wholesale.

The main issue is design-system drift. Color values, text classes, heights, radii, and button patterns are repeated directly in page files. Current scans found heavy repetition: `#0048c4` appears about 907 times, `#1a1a1a` about 722 times, `#4d4d4d` about 456 times, and there are about 532 page/component button occurrences. Common class clusters include `text-sm`, `text-base`, `font-medium`, `font-semibold`, `rounded-xl`, `rounded-lg`, `h-10`, `h-12`, and `h-14`.

`src/routes/AppRouter.tsx` mixes route matching, auth redirects, identity gating, bottom navigation selection, back-target decisions, and top-bar selection. This makes chrome behavior hard to audit. `src/routes/routes.ts` also includes several dashboard placeholder routes mapped to `DashboardHomePage`, plus static `/chat/1` through `/chat/5` routes even though dynamic chat details are handled in `AppRouter`.

`src/index.css` contains page-specific illustration and UI classes such as home brand art, city icons, search empty illustrations, quick action icons, business banner art, ad card image classes, search map marker classes, and agency marker classes. These should move closer to their page/component owners or become TSX assets where possible.

The shared component layer is incomplete. `NewAdControls.tsx` defines its own `InputBox`, `SelectBox`, `Chip`, `Tag`, `SwitchButton`, toggle rows, and footer buttons. `FormControls.tsx` defines similar controls with different behavior. `SwitchButton.tsx`, `RadioIndicator.tsx`, `SelectionCheckIndicator.tsx`, and page-local radio/check indicators duplicate control primitives.

## Target File Ownership

- `src/design-system/tokens.ts`: semantic color, spacing, radius, size, z-index, and shadow constants used by class builders and non-Tailwind APIs.
- `src/design-system/typography.ts`: named typography roles from the design-system text docs.
- `src/design-system/classes.ts`: Tailwind class maps for common visual states.
- `src/components/ui/Button.tsx`: primary, secondary, tertiary, danger, ghost, and text buttons.
- `src/components/ui/IconButton.tsx`: 40, 48, and compact icon-only buttons with tooltip-ready labels.
- `src/components/ui/TextField.tsx`: text, numeric, textarea, clearable, error, disabled, supporting text, and leading/trailing slot variants.
- `src/components/ui/SearchBar.tsx`: 56px search fields, compact top-bar search, saved-search affordance, clear state.
- `src/components/ui/SelectField.tsx`: button-backed select rows and bottom-sheet trigger fields.
- `src/components/ui/Choice.tsx`: checkbox, radio, check indicator, and semantic selection row primitives.
- `src/components/ui/Switch.tsx`: one switch implementation for app, CRM, dashboard, and New Ad.
- `src/components/ui/Chip.tsx`: filter chip, choice chip, tag chip, removable tag, count chip.
- `src/components/ui/ListItem.tsx`: account rows, settings rows, action rows, menu rows.
- `src/components/ui/Avatar.tsx`: user, agency, fallback initials, icon fallback.
- `src/components/ui/Divider.tsx`: semantic separators.
- `src/components/ui/Slider.tsx`: reusable horizontal carousel scaffolding where Swiper is not required.
- `src/components/(icons)/*.tsx`: the only source for app UI icons. Existing raw SVG imports, inline SVG definitions, CSS-drawn icons, and `src/assets/icons/Nav*.tsx` product icons should be migrated here or replaced by matching existing components.
- `src/routes/routeChrome.ts`: route chrome metadata, bottom-navigation key mapping, top-bar descriptors, and fallback back targets.
- `src/pages/search/searchMap.css`: Leaflet marker and map-specific CSS that cannot be expressed safely with Tailwind.
- `src/pages/home/homeArtwork.css` or TSX artwork components: home-specific drawn/illustration CSS that should not live globally.

## Component Specifications To Implement

### Buttons

- Primary button: height `48px`, radius `10px`, background `#0048c4`, text white, text `16px`, line-height `24px`, weight `500`.
- Secondary button: height `48px`, radius `10px`, white background, `1px` border `#0048c4`, text `#0048c4`, text `16px`, line-height `24px`, weight `500`.
- Disabled button: background `#e0e0e0`, text `#a6a6a6`, no shadow.
- Danger button: use semantic error red from the design-system docs, not orange warning.
- Icon buttons: standard touch target `40px` for dense bars and `48px` for normal toolbar actions; visible icon normally `24px`.
- Do not keep writing one-off `button` classes inside pages for primary actions, footer actions, or toolbar icon actions.

### Top Bars

- Keep `src/components/TopBar.tsx` as the only standard mobile top bar.
- Standard bar height stays `56px`.
- Title text: `16px`, line-height `24px`, weight `600`, color `#1a1a1a`, centered when no dominant custom center slot exists.
- Back/action icon targets: normalize to named `IconButton` size tokens; keep current `40px` dense behavior only where the design says the bar is compact.
- Search top-bar field should be promoted from the current `h-12` pattern to a proper search primitive with a `56px` default and compact variant.
- Remove page-level top-bar color overrides such as selector hacks when a top-bar prop or variant can express the state.

### Search Bars

- Default search height: `56px`.
- Radius: `12px`.
- Border: `1px solid #cccccc` in default state, primary blue on focus.
- Placeholder: `#a6a6a6`, `16px`, line-height `24px`, weight `400`.
- Content direction: the visual shell is RTL; the input may use numeric or text input modes without flipping surrounding icons.
- Use this primitive in `HomeSearchScreen`, `SearchMapHeader`, `SearchMapSearchScreen`, saved-search views, account ad search, and chat search.

### Form Fields

- Replace `FormTextField` and `NewAdControls.InputBox` with one `TextField`.
- Field height: `56px`.
- Radius: `12px`.
- Horizontal padding: `16px`.
- Text: `16px`, line-height `24px`, weight `400`.
- Floating label: `12px`, line-height `20px`, color `#808080`, white background, right offset `16px`.
- Error border and helper text use semantic error red from tokens.
- Numeric fields must accept Persian and Arabic digits and normalize where the current domain code already requires it.
- Do not hard-code numeric `inputMode` as the only form-control behavior.

### Chips And Tags

- Choice/filter chip height: `36px`.
- Radius: `8px`.
- Horizontal padding: `12px`.
- Gap: `6px`.
- Text: `14px`, line-height `20px`, weight `500`.
- Selected state: border `#0048c4`, background blue tint, text `#0048c4`.
- Default state: border `#cccccc`, background white, text `#4d4d4d`.
- Removable tag uses the same sizing but includes a trailing remove icon with an accessible label.
- Migrate `FormChoiceChip`, New Ad `Chip`, New Ad `Tag`, search filter chips, account ad filter chips, and dashboard consultant chips into one primitive.

### Selection Controls

- Checkbox/check indicator should have one implementation with visual-only and semantic modes.
- Radio indicator should have one implementation with visual-only and semantic modes.
- Switch should have one implementation replacing `src/components/SwitchButton.tsx`, `FormSwitch`, New Ad `SwitchButton`, and CRM route switches.
- Switch dimensions: track `44px x 24px`, thumb `16px`, checked background `#0048c4`, unchecked background `#d1d1d1`, disabled state from tokens.
- Do not define page-local `RadioIndicator` or `SelectionCheckIndicator` functions.

### Bottom Navigation

- Keep `src/components/BottomNavigation.tsx` as the one mobile bottom navigation.
- Use the restored Figma-matched navigation glyphs from TSX components in `src/components/(icons)/`: `LinearHome3`, `LinearSearch`, `LinearAddCircle`, `LinearChat`, and `LinearUserSolid`.
- Keep any alternative `Nav*Icon.tsx` components in `src/components/(icons)/` only as centralized icon assets; do not use `src/assets/icons/` for product UI icons.
- Bar height: current `64px` is acceptable unless the component README specifies a different exact height; keep safe-area handling.
- Item icon: `24px`.
- Item label: `12px`, line-height `16px`, weight `500`.
- Active color: `#0048c4`.
- Inactive color: `#999999`.
- Keep create-ad behavior: unauthenticated users go to login-required; authenticated users open `CreateAdBottomSheet`.

### Bottom Sheets, Dialogs, And Snackbars

- Keep `src/components/BottomSheet.tsx` as the only shell.
- Bottom sheet width: max `500px`, full mobile width.
- Top radius: `20px`.
- Handle: `56px x 4px`, radius full, color `#e0e0e0`.
- Add explicit variants: `actions`, `form`, `confirm`, `media`, and `full-height`.
- Remove the overly generic default fixed `h-[298px]`; use variant-specific height or `max-h-[calc(100svh-56px)]`.
- `BottomSheetActionList` row height: `48px`; text `16px`, line-height `24px`, weight `400`.
- `Snackbar` should support `success`, `info`, `warning`, and `error`. Current `error` uses warning orange; update it to semantic error red and reserve orange for warning.
- Keep `aria-live` and dismiss behavior.

### Cards And List Items

- Preserve `src/components/AdCard.tsx` as the shared listing card, but move decorative image classes out of global CSS if they are not used globally.
- Add a `ListItem` primitive for account, settings, support, request, dashboard menu, and bottom-sheet rows.
- Standard row height: `48px` minimum for action rows, `56px` for form/settings rows.
- Row horizontal padding: `16px`.
- Label text: `16px`, line-height `24px`; use `500` or `600` only when the Figma component calls for emphasis.
- Use icon size `24px` and trailing chevron `20px` or `24px` consistently.

## Implementation Tasks

### 1. Create Design-System Token Layer

- [x] Add `src/design-system/tokens.ts`.
- [x] Add `src/design-system/typography.ts`.
- [x] Add `src/design-system/classes.ts`.
- [x] Encode semantic colors first, then raw aliases only when unavoidable.
- [x] Include named sizes for `fieldHeight=56`, `buttonHeight=48`, `bottomNavHeight=64`, `topBarHeight=56`, `iconButtonDense=40`, `iconButtonDefault=48`, `chipHeight=36`, `mobileMaxWidth=500`.
- [x] Include radius names: `field=12`, `button=10`, `chip=8`, `sheet=20`, `card=8` unless an existing card requires a larger Figma radius.
- [x] Include typography roles: `title`, `body`, `bodyStrong`, `caption`, `button`, `navLabel`, `fieldLabel`, `helper`.
- [x] Replace no page code in this task except imports needed by a tiny smoke check.
- [x] Run `npm.cmd run build`.

### 2. Add Core Button Primitives

- [x] Add `src/components/ui/Button.tsx`.
- [x] Add `src/components/ui/IconButton.tsx`.
- [x] Support variants `primary`, `secondary`, `ghost`, `text`, `danger`, and `neutral`.
- [x] Support sizes `sm`, `md`, and `lg`, with `md` mapping to the 48px Figma action button.
- [x] Support `loading`, `disabled`, `leadingIcon`, `trailingIcon`, `fullWidth`, and `dir="rtl"`.
- [x] Keep native `button` semantics and allow `type`.
- [x] Use `RouteLink` separately for navigation until a typed link-button wrapper is added.
- [x] Migrate only `NewAdControls.Footer` and `MoreFeaturesFooter` first as a low-risk pilot.
- [x] Run `npm.cmd run build`.

### 3. Unify Text Field, Select Field, And Search Bar

- [x] Add `src/components/ui/TextField.tsx`.
- [x] Add `src/components/ui/SelectField.tsx`.
- [x] Add `src/components/ui/SearchBar.tsx`.
- [x] Replace `FormTextField` internals with the new `TextField` while keeping the old export temporarily.
- [x] Replace `NewAdControls.InputBox`, `SelectBox`, and `LocationBox` with wrapper usage of the new primitives.
- [x] Preserve existing numeric normalization in New Ad and search filters.
- [x] Preserve all existing `aria-invalid`, clear button, helper text, and focus behavior.
- [x] Migrate `HomeSearchScreen`, `SearchMapHeader`, `SearchMapSearchScreen`, and account ad search after New Ad compiles.
- [x] Run `npm.cmd run build`.

### 4. Unify Chips, Tags, Radio, Checkbox, And Switch

- [x] Add `src/components/ui/Chip.tsx`.
- [x] Add `src/components/ui/Choice.tsx`.
- [x] Add `src/components/ui/Switch.tsx`.
- [x] Re-export compatibility wrappers from `src/components/form/FormControls.tsx`.
- [x] Replace `src/components/SwitchButton.tsx` implementation with the shared switch or mark it deprecated and remove imports gradually.
- [x] Replace page-local `RadioIndicator` and `SelectionCheckIndicator` functions in search filters, account business creation, New Ad media controls, and ad payment pages.
- [x] Keep visual-only indicator mode for rows that already handle selection at the parent button level.
- [x] Run `npm.cmd run build`.

### 5. Refactor Top Bar And Route Chrome

- [x] Add `src/routes/routeChrome.ts`.
- [x] Move bottom navigation mapping from `getBottomNavigationKey` in `src/routes/AppRouter.tsx` into typed route-chrome metadata.
- [x] Move account fallback back-target logic from `getAccountFallbackBackTo` into named rules in `routeChrome.ts`.
- [x] Move default top-bar descriptors from `getRouteTopBar` into route metadata.
- [x] Keep special cases for `/new-ad`, CRM embedded edit routes, and map/list modes explicit and tested.
- [x] Update `TopBar.tsx` to use `IconButton` and `SearchBar` primitives.
- [x] Normalize top-bar title, action, back, and search dimensions.
- [x] Run `npm.cmd run build`.

### 6. Refactor Bottom Navigation

- [x] Update `src/components/BottomNavigation.tsx` to use restored Figma-matched TSX icons from `src/components/(icons)/`.
- [x] Add or standardize the create-ad icon so inactive/active behavior is deliberate.
- [x] Keep the existing create-ad bottom-sheet behavior.
- [x] Keep notification unread indicator on chat.
- [x] Ensure `activeKey` remains driven by route chrome and does not reorder items.
- [x] Run `npm.cmd run build`.

### 7. Refactor Bottom Sheets, Dialogs, And Snackbar

- [x] Update `BottomSheet.tsx` with explicit variants and height rules.
- [x] Convert action sheets in `CreateAdBottomSheet`, `CategoryBottomSheet`, chat file/settings sheets, account notes/bookmarks sheets, support request sheets, and search request sheets to variant-based usage.
- [x] Update `Snackbar.tsx` semantic colors and add warning variant.
- [x] Replace ad hoc confirmation sheet buttons with `Button`.
- [x] Keep portal, overlay, animation, escape key, and backdrop close behavior.
- [x] Run `npm.cmd run build`.

### 8. Clean Global CSS Ownership

- [x] Move search-map marker CSS from `src/index.css` to `src/pages/search/searchMap.css`, imported by `SearchMapPage.tsx` or `SearchMapView.tsx`.
- [x] Move home-specific classes from `src/index.css` to `src/pages/home/homeArtwork.css` or replace them with TSX artwork components.
- [x] Move ad-card image helpers to an `AdCard`-owned CSS file only if Tailwind cannot represent them cleanly.
- [x] Keep global font declarations, Tailwind setup, CSS variables, safe viewport root rules, and truly global Leaflet resets if required.
- [x] After the move, search `src/index.css` for page nouns such as `home`, `search-map`, `agency-directory`, and `ad-card`; only intentional global entries may remain.
- [x] Run `npm.cmd run build`.

### 9. Centralize Icon Ownership

- [x] Inventory every UI icon import and inline SVG usage.

Run:

```powershell
rg -n "from ['\"].*\\.svg['\"]|<svg|src/assets/icons|url\\(|className=.*icon|::before|::after" src
```

- [ ] Keep `src/components/(icons)/*.tsx` as the only product UI icon source.
- [x] Move the navigation icon components currently under `src/assets/icons/NavHomeIcon.tsx`, `NavSearchIcon.tsx`, `NavChatIcon.tsx`, `NavAccountIcon.tsx`, and `NavCreateIcon.tsx` into `src/components/(icons)/`.
- [x] Update `src/components/BottomNavigation.tsx` to import all navigation icons from `src/components/(icons)/`.
- [x] Replace inline SVGs in shared primitives and shared shells with imports from `src/components/(icons)/`. This includes `Button` arrow usage call sites, `IconButton` call sites, `TextField` clear icon, `SelectField` chevron, `SearchBar` search/bookmark icons, `BottomSheet` check icon, and `Snackbar` close icon.
- [ ] Replace page-local inline SVGs only when they are icons. Keep true illustrations, image placeholders, generated artwork, and content imagery out of the icon registry unless they behave as reusable UI icons.
- [ ] Convert raw SVG imports used as interactive/category UI icons into TSX components under `src/components/(icons)/` before importing them in React components.
- [ ] Do not move API-served images, user avatars, property photos, brand logos, or large decorative illustrations into `src/components/(icons)/`.
- [x] Delete duplicate icon files only after imports have been updated and `rg` confirms no references remain.
- [x] Run `npm.cmd run build`.

### 10. Route Cleanup And Guard Tests

- [ ] Add route/chrome tests with the project’s chosen test runner. If no runner exists yet, add Vitest in a separate dependency/setup commit.
- [ ] Test `/`, `/home`, `/search`, `/search/filter`, `/new-ad`, `/chat`, `/chat/:id`, `/account`, dashboard paths, and CRM paths.
- [ ] Remove static `/chat/1` through `/chat/5` routes after dynamic chat-detail matching is covered.
- [x] Audit dashboard placeholder routes currently mapped to `DashboardHomePage`; either wire them to real page components or document them as intentional placeholders in route metadata.
- [x] Keep identity gate behavior unchanged for protected account/dashboard/new-ad routes.
- [x] Run `npm.cmd run build`.

### 11. Page Family Migration Order

- [x] New Ad first: `src/pages/newAd/components/NewAdControls.tsx` already centralizes many page controls, making it the safest pilot for fields, chips, switches, and footer buttons.
- [ ] Search second: migrate `SearchMapFilterPage.tsx`, `SearchMapHeader.tsx`, `SearchMapSearchScreen.tsx`, filter chips, map list/slider actions, and request bottom sheets.
- [ ] Account third: migrate `MyAccountPage.tsx`, `accountPageViews.tsx`, `AccountSubPages.tsx`, account route pages, notes/bookmarks/recent views/wallet/support rows and sheets.
- [ ] Chat fourth: migrate `UserChatHomePage.tsx` top bars, filters, attachment/settings sheets, message action rows, and search surfaces.
- [ ] View Ad fifth: migrate `ViewAdPage.tsx`, `viewAdDetails.tsx`, `viewAdComponents.tsx`, contact sheets, CTA buttons, snackbars, and repeated detail rows.
- [ ] Dashboard and CRM last: migrate `src/dashboard/*`, `src/components/dashboard/*`, and `src/pages/crm/*` after mobile primitives stabilize, because they include wider desktop layouts and admin data tables.
- [ ] Run `npm.cmd run build` after each family.

### 12. Verification Checklist For Every Batch

- [x] `npm.cmd run build` passes.
- [ ] UI icons used by components and pages are imported from `src/components/(icons)/`.
- [ ] No new whole-app scroll is introduced.
- [ ] Mobile pages still fit inside `500px` max width.
- [ ] RTL alignment remains correct.
- [ ] Top bars and bottom navigation remain fixed where expected.
- [ ] Only intended content areas scroll.
- [ ] Buttons have correct height, radius, text size, and disabled states.
- [ ] Fields have correct `56px` height, label behavior, error state, and clear behavior.
- [ ] Bottom sheets respect safe area and do not exceed viewport height.
- [ ] Snackbar variants use semantic colors.
- [ ] Auth redirects and route back targets behave as before.

## Detailed File Recommendations

### `src/app/MobileAppShell.tsx`

- Keep this file’s core structure.
- Preserve `h-screen`, `max-h-screen`, `overflow-hidden`, and `w-[min(100vw,var(--mobile-frame-max-width))]`.
- Do not add document-level scroll.
- Consider moving `--mobile-frame-max-width` fallback to `tokens.ts` and `index.css` so the value is declared once.

### `src/app/PageFrame.tsx`

- Keep `standard` and `flush` variants.
- Add optional semantic background variants only if repeated page values continue: `white`, `subtle`, `map`, `dashboard`.
- Keep `h-full min-h-0 w-full`.

### `src/app/TopBarNavigationLayout.tsx`

- Keep as the standard mobile layout with top bar, scrollable main, fixed content below top bar, bottom navigation, and overlay.
- Ensure `main` remains the only scrollable area for regular app pages.
- Add named slots only when page families need consistent filter bars below the top bar.

### `src/components/TopBar.tsx`

- Replace local icon-button classes with `IconButton`.
- Replace `TopBarSearchButton` internals with `SearchBar` compact/topbar variant.
- Remove selector-based overrides from pages after adding variants.
- Keep provider/reset behavior, because it allows pages to override route-level top bars.

### `src/components/BottomNavigation.tsx`

- Switch from `LinearHome3`, `LinearSearch`, `LinearAddCircle`, `LinearChat`, `LinearUserSolid` to the `Nav*Icon` assets.
- Keep item order: home, search, create ad, chat, account.
- Keep `h-16`, safe-area bottom padding, labels, and active key behavior unless the component README requires a different value.
- Drive `activeKey` only from `routeChrome.ts`.

### `src/components/BottomSheet.tsx`

- Keep the portal and motion implementation.
- Add variants and remove the generic fixed default height.
- Normalize header back/close targets through `IconButton`.
- Keep `BottomSheetActionList`, but make it a specialization of `ListItem` once `ListItem` exists.

### `src/components/form/FormControls.tsx`

- Keep exports temporarily to avoid a giant migration.
- Rebuild internals using `TextField`, `SelectField`, `Chip`, `SegmentedControl`, and `Switch`.
- Remove hard-coded colors from this file once token classes exist.
- Add missing states: disabled, error, focused, supporting text, clearable, and generic input mode.

### `src/components/Snackbar.tsx`

- Add `warning`.
- Change `error` from `#ff6d00` to the semantic error color.
- Keep `role="status"`, `aria-live="polite"`, dismiss button, and fixed-position override support.

### `src/components/SwitchButton.tsx`

- Replace internals with `ui/Switch`.
- Keep the old export name only as a migration adapter.
- Remove after all imports are migrated.

### `src/components/RadioIndicator.tsx` And `src/components/SelectionCheckIndicator.tsx`

- Replace internals with `ui/Choice`.
- Keep adapters during migration.
- Remove page-local indicator functions.

### `src/routes/AppRouter.tsx`

- Move chrome decisions to `routeChrome.ts`.
- Keep dynamic route matching in this file until route tests exist.
- Keep login redirect, CRM embedding, and identity gate behavior unchanged.
- Reduce this file to route resolution plus rendering once metadata exists.

### `src/routes/routes.ts`

- Keep the current custom route array and role access rules.
- Add metadata fields only if TypeScript route types remain clean.
- Audit dashboard routes mapped to `DashboardHomePage`.
- Remove static chat detail routes only after dynamic `/chat/:id` tests pass.

### `src/index.css`

- Keep font setup, Tailwind import, `:root`, global base rules, and CSS variables.
- Move home, map, agency directory, and ad-card decorative classes out.
- Keep only Leaflet CSS that cannot be scoped safely if React Leaflet requires global selectors.

### `src/pages/HomePage.tsx` And `src/pages/home/components/*`

- Migrate search, city selector rows, category sheet rows, quick-action buttons, and business banner buttons to shared primitives.
- Keep category mapping and navigation logic unchanged.
- Move home artwork CSS out of `index.css`.

### `src/pages/search/*`

- Keep map query, geofence, saved search, and marker selection behavior unchanged.
- Migrate filter chips, search inputs, bottom sheets, list rows, and CTA buttons.
- Move map-marker CSS to a search-owned stylesheet.
- Keep marker click/tap target rules from the project handoff.

### `src/pages/account/*`

- Migrate account rows to `ListItem`.
- Migrate account action buttons and bottom-sheet confirmation buttons to `Button`.
- Migrate notes/bookmarks/recent views sheets to `BottomSheet` variants.
- Keep auth role switching, logout, identity state, and notification behavior unchanged.

### `src/pages/newAd/*`

- Use this as the first migration family.
- Replace `NewAdControls` local controls with shared primitives while preserving exports.
- Keep desktop layout context behavior.
- Keep numeric normalization and `formatPrice` display rules.

### `src/pages/UserChatHomePage.tsx`

- Split shared chat controls after primitives exist; this file is large enough that migration should be incremental.
- Migrate top bars, horizontal filters, attachment sheets, settings sheets, confirmation sheets, and icon buttons.
- Keep chat route behavior and socket/service logic unchanged.

### `src/pages/ViewAdPage.tsx` And `src/pages/viewAd/*`

- Migrate contact CTA buttons, snackbar, bottom sheets, and repeated rows.
- Preserve ad data mapping, saved state, report flow, contact reveal behavior, and route state.

### `src/dashboard/*` And `src/pages/crm/*`

- Treat these as admin/desktop surfaces, not mobile-app screens.
- Use the same semantic tokens but allow denser table/layout patterns.
- Extract CRM modal fields, table action buttons, switches, and confirmation dialogs gradually.
- Do not force mobile bottom navigation into dashboard or CRM layouts.

## Completion Criteria

- Shared primitives exist and are used by at least New Ad, Search, Account, Chat, View Ad, Bottom Navigation, Top Bar, Bottom Sheets, and Snackbar.
- `AppRouter.tsx` no longer owns long bottom-navigation and back-target conditionals.
- `src/index.css` no longer owns page-specific home/search/account artwork and component styling.
- Repeated hard-coded colors are materially reduced, especially primary blue, text colors, borders, and neutral backgrounds.
- Static chat detail routes are removed only after dynamic route tests pass.
- `npm.cmd run build` passes with only the existing Vite large chunk warning if that warning still appears.
