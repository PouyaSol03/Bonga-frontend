# Account My Ad State UI Design

## Scope

Rebuild only the agency-assigned branch of `AccountMyAdStatePage` to match the ten SVG references in `docs_UI`. Preserve the personal-ad and real-estate-manager branches, route behavior, API calls, mutations, and unrelated project code.

The ten reference states are:

1. Published
2. Published stop-publication request
3. Waiting for agency approval
4. Cancel agency assignment
5. Waiting for repost
6. Archived
7. Deleted after agency closure
8. Submit deal result
9. Deleted after recovery expiry
10. Deleted after user-requested publication stop

## Visual Contract

- Treat each 360px-wide SVG as the source of truth for RTL direction, dimensions, spacing, typography, colors, borders, radii, dividers, timelines, buttons, and icon placement.
- Scale responsively within the existing mobile shell without changing the project-wide 500px maximum width.
- Reuse the project's existing TSX icon components and select the closest exact icon already present in `src/shared/icons`.
- Do not recreate the phone operating-system status bar. Keep required application headers.
- Render action flows as the full-screen layouts shown in the reference frames rather than generic bottom-sheet approximations.

## Architecture

Keep route and server orchestration in a thin `AccountMyAdStatePage` container. Move agency-assigned presentation into a feature-local `adState` folder with small, single-purpose units:

- state types and deterministic view-model mapping;
- shared status badge, advertisement summary, action row, notice, and timeline primitives;
- state-specific content composition;
- full-screen stop-publication, cancel-assignment, and deal-result flows;
- mutation/controller hook that keeps asynchronous behavior outside presentational components;
- Storybook fixtures and stories for all ten references.

No production source or story file touched by this refactor may exceed 200 lines. Prefer explicit feature components over a universal schema renderer.

## Data and Interaction Flow

`AccountMyAdStatePage` continues resolving the route state, advertisement details, role, assignment state, and status. For assigned user advertisements it passes a normalized model and action callbacks to the new view. Presentational components never call feature APIs directly.

The interaction controller preserves the existing mutations and error messages:

- stop publication;
- cancel agency assignment;
- restore an archived advertisement;
- repost personally or through an agency;
- submit the deal result;
- refetch details after successful mutations.

Navigation paths and payload shapes remain unchanged.

## Storybook

- Keep ten named agency reference stories at a 360px mobile viewport.
- Make each story deterministic by using local fixtures and initial flow state.
- Remove the obsolete `@storybook/addon-viewport` runtime registration that currently blanks Storybook under Storybook 10, while retaining the mobile viewport parameters in the supported configuration.
- Preserve unrelated stories and global styling.

## Testing and Verification

- Add failing tests first for state normalization, deleted-state variants, visible actions, and flow selection.
- Verify each Storybook story renders without console errors and contains the expected state-specific content.
- Compare rendered stories visually against all ten SVG references at 360px.
- Run lint, the complete production build, Storybook build, focused tests, and a file-length check.
- Treat existing unrelated warnings as pre-existing only when confirmed by fresh output.

## Non-goals

- No redesign of personal advertisements, manager advertisement management, general account screens, advertisement cards, navigation, or shared design-system primitives.
- No broad repository cleanup.
- No changes to backend contracts.
