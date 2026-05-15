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
