# Project Rules

These rules apply only to this repository: `C:\Projects\Bonga-frontend`.

1. Use Tailwind CSS first for all pages, components, layout, spacing, color, typography, responsive behavior, and common states.
2. Keep `src/index.css` limited to global setup, font declarations, CSS variables, and CSS that Tailwind cannot express cleanly, such as pseudo-elements, custom drawn icons, complex clip paths, or generated illustration details.
3. Do not make the whole document or whole app layout scroll. The app shell must stay fixed to the client viewport height. For mobile-app screens, only the intended content area, usually the page `<main>`, may scroll between fixed header and fixed bottom navigation.
4. Do not recreate Figma mobile status bars. If a Figma frame includes the top phone status bar with time, signal, Wi-Fi, or battery, omit it in implementation. Remove status-bar UI from pages unless explicitly requested otherwise.
5. The project is RTL by default. Build pages and components with RTL layout and Persian/Farsi text direction in mind.
6. Figma frames provided for this project should be interpreted as RTL designs. Do not accidentally mirror them into LTR layouts. If a frame appears reversed because of coordinate interpretation, correct it to match RTL product behavior.
7. Keep the mobile shell max width at `500px` unless the user explicitly requests a different project-wide width.
8. Always use `figma-mcp-go` for Figma URLs and Figma frame inspection in this project.
9. When implementing from a Figma frame, the coded screen must visually match that frame exactly except for project rules that explicitly override it, such as omitting mobile status bars and preserving the `500px` mobile shell maximum width. Check direction, alignment, spacing, colors, icons, and text placement against the frame before finishing.


## Feature-first Architecture

- Business code belongs under `src/features/<feature>`. Do not recreate top-level `src/pages`, `src/core/services`, or `src/core/hooks` buckets.
- Keep only business-agnostic primitives in `src/shared`; `shared` must not import from `features` or `app`.
- App composition and route configuration stay under `src/app`.
- See `ARCHITECTURE.md` before adding or relocating modules.

## Recent Handoff Notes

Read this section first when continuing from the latest chat.

- Shared UI cleanup was started and should be preserved: use `src/shared/components/BottomSheet.tsx` for all bottom-sheet shells, and use `src/shared/components/TopBar.tsx` for standard page headers/topbars instead of recreating header markup in each page.
- Bottom navigation lives in `src/app/layout/BottomNavigation.tsx` and uses the shared dynamic TSX navigation icons; active nav items should render the blue duotone icon state.
- Chat flow work added `/chat/:id` detail screens from Figma, including `SendFileBottomSheet` opened from the attach icon. The chat detail page intentionally omits mobile status bars.
- Account/login flow work added the logged-out and logged-in-unverified My Account states and routes for account subpages such as profile, identity, wallet, notes, bookmarks, recent views, requests, and about.
- Search map work is in progress around marker selection and the `MapAdCard` carousel. Desired behavior: clicking/tapping a marker selects the matching listing without reordering card data, shows the slider, and scrolls the selected card to the center. With two cards, the active card should center and the next card should peek; with three or more, the active card should center with neighboring cards partially visible on both sides. Marker tap targets should be easy to click/tap and must not be swallowed by map gestures.
- Always run `npm run build` after changes. The build has been passing, with only the existing Vite large chunk-size warning.
