# Bonga new-ad Playwright coverage

This suite tests the real `/new-ad` workflow without calling the production create API.
The backend-facing endpoints used by this flow are mocked so tests are repeatable and do not create real advertisements.

## Coverage

### Category/form contract
`new-ad-categories.spec.ts`

- All 23 supported transaction/category combinations.
- Correct `form_code` request for each combination.
- Correct category-specific required fields on the details step.

### Complete flow for every form
`new-ad-create.spec.ts`

Every supported form runs through:

1. Transaction tab and category selection.
2. Category-specific details.
3. Category-specific optional "more features" controls when available.
4. Heating/cooling and facility chips when available, including expand/collapse.
5. Sale-only loan/exchange controls when available.
6. Project presale details + sale terms when applicable.
7. Daily hotel room editor when applicable.
8. Media step.
9. Two-photo upload and photo removal.
10. Ad video upload (`video/mp4`).
11. Virtual-tour toggle/link.
12. Personal publisher selection.
13. Contact methods, Telegram and WhatsApp.
14. Title and description.
15. Multipart submit and `form_code`/media/social contract assertions.

### Shared interaction paths
`new-ad-interactions.spec.ts`

- Real location page: search, clear, select, confirm, return to details.
- Media: photo removal, video preview, video removal, virtual tour, back navigation.
- Agency publisher: owner fields, agency search, sort, neighborhood filter, map/list switch, agency selection and final submit.

### Validation
`new-ad-validation.spec.ts`

- Category selection required state.
- Required apartment detail errors.
- Loan/exchange dependent validation.
- Photo/registrant/title/description validation.
- Video/virtual-tour/contact-method dependent validation.
- Agency owner-address validation before agency selection.

## Commands

```powershell
npm run test:e2e:ad
npm run test:e2e:ad:headed
npm run test:e2e:ad:ui
npm run test:e2e:ad:debug
```

## About videos

The suite tests **Bonga's ad video upload and video UI** with an in-memory `.mp4` file.

Playwright's own test-run video recording remains disabled in `playwright.config.ts` because this machine previously could not download Playwright's FFmpeg binary (CDN 403). Re-enabling Playwright recording without FFmpeg would make every test fail before the Bonga UI opens.
