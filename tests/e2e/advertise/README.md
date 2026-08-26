# Bonga new-ad Playwright E2E coverage

This is the restored advertisement E2E suite. It drives the real `/new-ad` UI while mocking the backend endpoints that would otherwise create real advertisements or depend on production data.

The suite was updated for the current advertisement model rather than replaced with contract-only tests.

## Coverage

### 1. Category -> backend form contract
`new-ad-categories.spec.ts`

- All **19 active** transaction/category combinations.
- Correct `/public/advertise-form/:form_code` request for every combination.
- Current category-specific required fields.
- Sale, long-term rent, daily rent, project and partnership.

### 2. Complete create flow for every active form
`new-ad-create.spec.ts`

Each active form goes through the real UI:

1. Transaction and category selection.
2. Required category-specific fields.
3. `مشخصات بیشتر` where applicable.
4. Bottom-sheet/select/date/toggle controls.
5. Heating/cooling and facilities.
6. Sale loan/exchange controls where available.
7. Rent mortgage/rent values.
8. Project details, sale terms and project exchange.
9. Daily-hotel hotel-level fields and room editor.
10. Media, photo removal, video, virtual-tour link.
11. Publisher/contact/social fields.
12. Multipart create request.
13. Representative **canonical payload-key assertions** for every form, including new keys such as `opening_count`, `has_document`, daily times/prices, `daily_hotel_rooms`, project details and partnership fields.

### 3. New-feature interaction regressions
`new-ad-interactions.spec.ts`

In addition to the original location/media/agency tests, this now protects the recent UI changes:

- `تبدیل رهن و اجاره` is disabled until a rent or mortgage value exists.
- The conversion range writes back to the real `رهن` and `اجاره` inputs.
- Clearing both prices disables and turns off conversion again.
- `تعداد دهنه` is a BottomSheet in **sale commercial and rent commercial**.
- Daily check-in/check-out are BottomSheets.
- Daily pet policy is ordered before toggle fields.
- Daily hotel has hotel-level period/check-in/check-out/pet controls.
- Daily hotel room editor is a full-screen child editor with its own single header.
- Hotel room save **and remove** paths are preserved.
- Project total-floor/total-unit controls are BottomSheets.
- Partnership `ثبت ... مشخصات دیگر` stays inside the normal `مشخصات مشارکت` section.

### 4. Validation
`new-ad-validation.spec.ts`

Preserves validation coverage for:

- Required category selection.
- Current apartment required-field messages.
- Loan/exchange dependent validation.
- Photo/registrant/title/description validation.
- Video/virtual-tour/contact-method validation.
- Agency owner-address validation.

### 5. Publisher context
`publisher-context.spec.ts`

Preserves the existing publisher-role E2E coverage for personal, agency, agency consultant and independent consultant contexts.

### 6. Local smoke tests
`../example.spec.ts`

The old Playwright website example was preserved as a test file but converted to a **local Bonga smoke test** so `npm run test:e2e` no longer depends on `playwright.dev` or external internet access.

## Commands

Run only advertisement E2E tests:

```powershell
npm run test:e2e:ad
```

Useful modes:

```powershell
npm run test:e2e:ad:headed
npm run test:e2e:ad:ui
npm run test:e2e:ad:debug
```

Run the entire E2E directory, including local smoke tests:

```powershell
npm run test:e2e
```

## Test environment

- The suite uses the system Chrome channel configured in `playwright.config.ts`.
- Playwright video recording remains disabled; this does **not** disable testing Bonga's own advertisement-video upload UI.
- Advertisement backend endpoints are mocked during these tests, so running them does not publish real ads.
