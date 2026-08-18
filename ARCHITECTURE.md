# Bonga Front-end Architecture

This project uses a **feature-first** structure. Business code should live with the feature that owns it; only code that is genuinely reusable across unrelated features belongs in `shared`.

## Source structure

```text
src/
├── app/                    # App composition and router configuration only
│   ├── layout/             # App-shell-only layout such as bottom navigation
│   └── router/             # Route table, matching and route chrome
├── features/               # Business/domain features
│   ├── account/
│   ├── advertisements/
│   │   ├── api/
│   │   ├── components/
│   │   ├── create/
│   │   └── view/
│   ├── agencies/
│   ├── auth/
│   ├── categories/
│   ├── chat/
│   ├── cities/
│   ├── consultants/
│   ├── crm/
│   ├── dashboard/
│   ├── home/
│   ├── locations/
│   ├── notifications/
│   ├── onboarding/
│   ├── packages/
│   ├── payments/
│   ├── property-requests/
│   ├── search/
│   ├── support/
│   └── system/
├── shared/                 # Business-agnostic reusable code
│   ├── api/                # API client/query infrastructure
│   ├── auth/               # Shared auth-session storage primitives
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── form/
│   ├── hooks/
│   ├── icons/
│   ├── layout/
│   ├── lib/
│   ├── navigation/
│   ├── ui/
│   └── utils/
├── design-system/
├── styles/
└── main.tsx
```

## Ownership rules

- Put a page, component, hook, service, mapper, type, or helper in the feature that owns the business behavior.
- Keep feature-specific API modules inside that feature's `api/` folder.
- Keep feature-specific visual components inside that feature, even when several screens reuse them. For example, advertisement cards live in `features/advertisements/components` rather than `shared/components`.
- Use `shared/` only when the code is business-agnostic and can be reused by unrelated features.
- `shared/` must not import from `features/` or `app/`.
- `app/` composes features and owns route configuration; avoid placing business logic there.
- Do not create a new top-level `pages/`, `services/`, `hooks/`, or `core/` bucket. Add new code to its owning feature instead.

## Safe refactoring rule

Architecture changes must not change runtime behavior. When moving existing code:

1. Move files without rewriting component/business logic.
2. Update import paths only.
3. Preserve route paths, request payloads, query keys, state, styling classes, assets and rendered markup.
4. Delete a source module only after verifying it is unreachable from the application entry and is not loaded dynamically.
5. Run the build after dependency installation is available.

## Examples

```text
features/advertisements/api/advertisement.service.ts
features/advertisements/api/advertisement.hooks.ts
features/advertisements/components/AdCard.tsx
features/advertisements/create/NewAdFlowPage.tsx
features/advertisements/view/ViewAdPage.tsx
```

```text
features/account/api/account.service.ts
features/account/api/account.hooks.ts
features/account/adManagement/
features/account/credit/
features/account/routes/
```

The existing internal folders inside a feature can be refined incrementally when needed, but code should not be moved back into global type-based buckets.
