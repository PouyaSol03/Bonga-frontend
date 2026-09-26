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
- Show the agency-manager option only when the user has the `real_estate_manager` role.
- Show the agency-consultant option when the user has the `real_estate_consultant` role. Its title remains `مشاور آژانس`; its description includes the resolved agency name.

This prevents a consultant from receiving a duplicate agency option while preserving manager publishing behavior.

## Testing

Extract or test the option derivation with a consultant role set containing both independent and agency-consultant roles. Assert the three exact option IDs and the agency-consultant title and description. Add a manager case to ensure the agency-manager option remains available only to a manager.
