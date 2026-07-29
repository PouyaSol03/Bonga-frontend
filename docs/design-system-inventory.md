# Bonga Design System As Text

This README describes the visual foundation of the Bonga design system without
requiring access to the Figma file. A developer or AI agent should be able to
read this file and understand the system-level tokens: color, typography,
layout grid, and avatar sizing. Component-specific rules live in
[`component-system-inventory.md`](./component-system-inventory.md).

The design is RTL-first and Persian/Farsi-first. English examples exist in the
source design, but Farsi behavior, alignment, and line-height should be treated
as the default product behavior.

## Product Foundation

- Product surface: mobile-first real-estate application.
- Primary writing direction: RTL.
- Primary language: Persian/Farsi.
- Default numeral behavior: Persian/Farsi numerals when product text is Farsi.
- Default font family: Dana / DanaFaNum or the closest available Dana-compatible
  Persian UI font.
- Mobile design reference width: `360px`.
- App shell maximum width: `500px`.
- Mobile page horizontal margin: `16px`.
- Mobile grid: 4 columns, stretch, `16px` gutters.
- Do not recreate phone status bars in application UI.
- Do not make the whole document scroll. Mobile screens should keep the shell
  fixed and scroll only the intended page content area.

## Color System

The Figma color system contains six tonal palettes. Each palette has tones
`0`, `10`, `20`, `30`, `40`, `50`, `60`, `70`, `80`, `90`, `95`, `99`, and
`100`. Use semantic roles in components, but the tonal values below are the raw
source colors.

### Tonal Palettes

| Tone | Primary | Secondary | Tertiary | Error | Warning | Neutral |
| ---: | --- | --- | --- | --- | --- | --- |
| 0 | `#000000` | `#000000` | `#000000` | `#000000` | `#000000` | `#000000` |
| 10 | `#002099` | `#2e2d3e` | `#006038` | `#c11004` | `#ff6d00` | `#1a1a1a` |
| 20 | `#0033ac` | `#3b3d58` | `#01804e` | `#d02216` | `#ff8d00` | `#333333` |
| 30 | `#003eb7` | `#424665` | `#069159` | `#dd2b1e` | `#ff9e00` | `#4d4d4d` |
| 40 | `#0048c4` | `#4b5070` | `#11a366` | `#ee3623` | `#ffb100` | `#666666` |
| 50 | `#0d50ce` | `#525779` | `#1ab371` | `#fc4122` | `#ffbf00` | `#808080` |
| 60 | `#476ad6` | `#696f8a` | `#4abe86` | `#f85143` | `#ffc825` | `#999999` |
| 70 | `#7f97ea` | `#83899d` | `#6eca9b` | `#ef726a` | `#ffd44d` | `#b3b3b3` |
| 80 | `#b1bdf0` | `#a4aaba` | `#9ad8b7` | `#f79a94` | `#ffdf81` | `#cccccc` |
| 90 | `#d7ddf8` | `#c7cbd6` | `#c1e7d3` | `#ffcdcf` | `#ffebb2` | `#e5e5e5` |
| 95 | `#edf0fb` | `#e9eaee` | `#e6f6ed` | `#ffebed` | `#fff8e1` | `#f2f2f2` |
| 99 | `#f8f9fd` | `#f6f7fa` | `#fbfcfd` | `#fffaf9` | `#fffdf8` | `#fcfcfc` |
| 100 | `#ffffff` | `#ffffff` | `#ffffff` | `#ffffff` | `#ffffff` | `#ffffff` |

### Semantic Color Roles

Use the tonal palettes through semantic names. The exact Figma semantic rows are
organized by role groups for light and dark themes.

Recommended light-theme role mapping:

| Role | Source tone | Color |
| --- | --- | --- |
| `primary` | Primary 40 | `#0048c4` |
| `on-primary` | Primary 100 | `#ffffff` |
| `primary-container` | Primary 90 or 95 | `#d7ddf8` or `#edf0fb` |
| `on-primary-container` | Primary 10 | `#002099` |
| `secondary` | Secondary 40 | `#4b5070` |
| `on-secondary` | Secondary 100 | `#ffffff` |
| `secondary-container` | Secondary 90 or 95 | `#c7cbd6` or `#e9eaee` |
| `on-secondary-container` | Secondary 10 | `#2e2d3e` |
| `tertiary` | Tertiary 40 | `#11a366` |
| `on-tertiary` | Tertiary 100 | `#ffffff` |
| `tertiary-container` | Tertiary 90 or 95 | `#c1e7d3` or `#e6f6ed` |
| `on-tertiary-container` | Tertiary 10 | `#006038` |
| `error` | Error 40 | `#ee3623` |
| `on-error` | Error 100 | `#ffffff` |
| `error-container` | Error 90 or 95 | `#ffcdcf` or `#ffebed` |
| `on-error-container` | Error 10 | `#c11004` |
| `warning` | Warning 40 | `#ffb100` |
| `on-warning` | Warning 100 | `#ffffff` |
| `warning-container` | Warning 90 or 95 | `#ffebb2` or `#fff8e1` |
| `on-warning-container` | Warning 10 | `#ff6d00` |
| `surface` | Neutral 99 or 100 | `#fcfcfc` or `#ffffff` |
| `surface-container-low` | Neutral 95 | `#f2f2f2` |
| `surface-container` | Neutral 90 | `#e5e5e5` |
| `outline` | Neutral 50 or 80 | `#808080` or `#cccccc` |
| `on-surface` | Neutral 10 | `#1a1a1a` |
| `on-surface-variant` | Neutral 30 or 50 | `#4d4d4d` or `#808080` |
| `disabled` | Neutral 80/90 with reduced opacity | `#cccccc` / `#e5e5e5` |

Captured dark-theme examples:

| Role group | Captured colors |
| --- | --- |
| Primary | `#d7ddf8`, `#0033ac`, `#003eb7`, `#edf0fb` |
| Secondary | `#c7cbd6`, `#3b3d58`, `#424665`, `#e9eaee` |
| Tertiary | `#c1e7d3`, `#01804e`, `#069159`, `#e6f6ed` |
| Error | `#ffebed`, `#d02216`, `#dd2b1e`, `#ffebed` |
| Warning | `#ffebb2`, `#ff6d00`, `#ff8d00`, `#fff8e1` |

### Color Usage Rules

- Primary blue is the main action and selection color.
- Tertiary green is the success/positive/accent color.
- Error red is for destructive or invalid states.
- Warning yellow/orange is for caution states.
- Neutral 10 is the strongest body text.
- Neutral 30 to 50 is secondary text, icon, and helper text.
- Neutral 80 to 95 is border, divider, disabled, and low-emphasis surface.
- White is the dominant component surface.
- Do not build components from random hex values when a semantic role exists.

## Typography System

The typography system contains five groups: Display, Headline, Title, Label,
and Body. The source design includes English and Persian samples. Use Persian
line heights as the practical default for the app.

### Typography Scale

| Token | Figma style | Size | Weight | English line height | Persian line height |
| --- | --- | ---: | --- | ---: | ---: |
| `display-lg` | Display Large | 57 | Regular | 64 | 66 |
| `display-md` | Display Medium | 45 | Regular | 52 | 54 |
| `display-sm` | Display Small | 36 | Regular | 44 | 46 |
| `headline-lg` | Headline Large | 32 | Regular | 40 | 42 |
| `headline-md` | Headline Medium | 24 | Regular | 32 | 38 |
| `headline-sm` | Headline Small | 24 | Regular | 32 | 36 |
| `title-lg` | Title Large | 22 | Medium or Semibold | 28 | 32 |
| `title-md` | Title Medium | 16 | Medium or Semibold | 24 | 28 |
| `title-sm` | Title Small | 14 | Medium or Semibold | 20 | 22 |
| `label-lg` | Label Large | 16 | Medium or Semibold | 20 | 22 |
| `label-md` | Label Medium | 14 | Medium or Semibold | 16 | 18 |
| `label-sm` | Label Small | 12 | Medium | 16 | 18 |
| `body-lg` | Body Large | 16 | Regular or Medium | 24 | 28 |
| `body-md` | Body Medium | 14 | Regular | 20 | 22 |
| `body-sm` | Body Small | 12 | Regular or Medium | 16 | 18 |

### Typography Usage Rules

- Use `display-*` only for large marketing or presentation surfaces.
- Use `headline-*` for major screen titles or important section titles.
- Use `title-*` for app bars, card headings, list titles, and prominent labels.
- Use `label-*` for buttons, chips, tabs, navigation labels, and compact UI
  labels.
- Use `body-*` for ordinary readable content, supporting text, descriptions,
  form input text, and list subtitles.
- Use Farsi line heights for Persian text. They are slightly taller than English
  to prevent vertical clipping and cramped mobile UI.
- Letter spacing is `0`.
- Do not scale font size with viewport width.

### Component Text Defaults

| UI element | Recommended text token |
| --- | --- |
| App bar title | `title-md` semibold |
| Button label | `label-md` or `label-lg` |
| Icon button visible label, when present | `label-sm` |
| Bottom navigation label | `label-sm` |
| Text field input | `body-md` |
| Text field label | `body-sm` or `label-sm` |
| Supporting/error text | `body-sm` |
| List title | `body-lg` or `title-sm` |
| List subtitle | `body-md` or `body-sm` |
| Snackbar title | `title-sm` or `label-md` |
| Snackbar body | `body-md` |

## Layout Grid System

The Figma grid system defines desktop, tablet, and mobile layouts. Bonga is
mobile-first, but the full grid is captured here for responsive products and
dashboard surfaces.

### Breakpoints And Columns

| Breakpoint | Reference frame | Columns | Type | Column width | Margin | Gutter | Side panel behavior |
| --- | --- | ---: | --- | --- | ---: | ---: | --- |
| Desktop Large | `1920 x 1080` | 12 | Center | 94 | 0 | 24 | Full width, or 1560/1840 content with side panel |
| Desktop Medium | `1600 x 900` | 12 | Center | 72 | 0 | 24 | Full width, or 1320/1520 content with side panel |
| Desktop Small | `1280 x 720` | 12 | Stretch | Auto | 180 | 24 | Full width, or 1000/1200 content with side panel |
| Tablet Horizontal | `1024 x 768` | 8 | Stretch | Auto | 24 | 24 | Full width, or 944 content with 80 side panel |
| Tablet Vertical | `768 x 1024` | 8 | Stretch | Auto | 32 | 16 | Full width, or 688 content with 80 side panel |
| Mobile | `360 x 640` | 4 | Stretch | Auto | 16 | 16 | No side panel |

### Side Panel Sizes

| Context | Side open | Side closed |
| --- | ---: | ---: |
| Desktop Large | 360 | 80 |
| Desktop Medium | 280 | 80 |
| Desktop Small | 280 | 80 |
| Tablet | 80 | Not captured |
| Mobile | Not used | Not used |

### Layout Rules

- Mobile components are usually documented at `360px` width.
- App screens may grow up to `500px` wide, but the component rhythm should still
  feel like the `360px` Figma reference.
- Mobile pages use `16px` left/right content padding.
- Dense controls should keep at least a `40px` touch target.
- Icon buttons and calendar day cells commonly use `48px` outer frames.
- Fixed shell UI such as app bars and bottom navigation stays outside the
  scrollable page content.

## Avatar System

The avatar system contains three component sets: a main avatar matrix, preset
profile-image avatars, and preset 3D avatars.

### Avatar Types

| Type | Description |
| --- | --- |
| `Letter` | Circular fallback avatar containing one or more text initials. |
| `Profile` | Circular avatar using a profile photograph or image. |
| `3D` | Circular avatar using a preset illustrated/3D character image. |

### Avatar Sizes

| Size | Usage |
| ---: | --- |
| 16 | Tiny inline presence, dense metadata, compact lists |
| 20 | Small inline identity marker |
| 24 | Compact list leading/trailing identity |
| 32 | Small list rows and compact cards |
| 40 | Standard list rows, comments, chat previews |
| 48 | Prominent list/card identity |
| 56 | Profile summaries and account blocks |
| 64 | Large identity cards |
| 80 | Profile headers |
| 96 | Hero/profile emphasis |

### Avatar Rules

- All avatar variants are circular.
- The outer size is fixed by the selected size token.
- Letter avatars center their text both horizontally and vertically.
- Profile and 3D avatars crop image content to the circular container.
- If an image fails, fallback to the Letter avatar behavior.
- Use semantic background/text colors from the color system for Letter avatars.

## File Provenance

This text spec was produced from the Arrow Design Kit design source and manual
captures of the selected pages. It is intentionally written so the design source
does not need to be opened while implementing the system.
