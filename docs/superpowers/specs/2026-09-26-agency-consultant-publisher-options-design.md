# Agency Consultant Publisher Options

## Goal

Show an agency consultant exactly three choices when starting a new advertisement:

1. `شخصی`
2. `مشاور مستقل`
3. Title: `مشاور آژانس`; description: `انتشار به عنوان مشاور آژانس «نام آژانس»`

## Design

`usePublisherOptions` derives available choices from the authenticated role set and the current agency profile.

- Keep the personal option for every user.
- Keep the independent-consultant option when the user has the `independent_consultant` role.
- When the user has the `real_estate_consultant` role, suppress the agency-manager option even if their session also lists `real_estate_manager`. This is the account state shown in the create-ad sheet.
- Show the agency-manager option only to users who have `real_estate_manager` without `real_estate_consultant`.
- Show the agency-consultant option when the user has the `real_estate_consultant` role. Its title remains `مشاور آژانس`; its description includes the resolved agency name.

This prevents a consultant from receiving a duplicate agency option while preserving manager publishing behavior.

## Testing

Update the existing Playwright publisher-context test with a session containing independent, agency-manager, and agency-consultant roles. Assert only the three consultant choices are visible and that the agency-manager row is absent. Add a manager-only session case to ensure the agency-manager option remains available to a manager without the consultant role.
