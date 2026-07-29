# Bonga Component System As Text

This README describes the Bonga component system as if the Figma component
library had been translated into text. It is written for a developer or AI
agent that does not have access to the Figma file. Use it together with
[`design-system-inventory.md`](./design-system-inventory.md), which defines the
color palettes, typography scale, grid, and avatar foundations.

The component system is mobile-first, RTL-first, and Persian/Farsi-first. Most
component examples are designed at `360px` wide. English variants exist, but
Farsi variants should drive production behavior.

## Global Component Rules

- Default direction is RTL.
- Default language behavior is Farsi.
- Use the Dana/DanaFaNum font family.
- Use semantic color roles from the design-system README instead of arbitrary
  colors.
- Use Farsi typography line heights for Persian text.
- Letter spacing is `0`.
- Component text must not be clipped or overlap neighboring elements.
- Touch targets should be at least `40px`; important controls often use `48px`.
- Mobile examples are commonly `360px` wide, but components should adapt inside
  a shell up to `500px`.
- Disabled state must reduce emphasis and block interaction.
- Focused state must be visible and must not resize the component.
- Pressed state is the mobile touch feedback state.
- Hovered state exists for desktop or pointer devices, but mobile behavior must
  not depend on hover.

## Component Index

| Component | Main variants captured | Key dimensions |
| --- | --- | --- |
| Button | 220 variants across style, state, size/content groups | Matrix is captured; exact individual button sizes are not available in this text spec |
| Icon Button | Filled, Outlined, Standard, Tonal x interactive states | Outer `48 x 48`, inner container `40 x 40` |
| Toggleable Icon Button | Icon Button variants plus selected true/false | Outer `48 x 48`, inner container `40 x 40` |
| Segmented Button | Segment and segment block variants | Example `324 x 40`, three segments of `108px` |
| Checkbox | Checked/unchecked across five states | Component set captured as 10 variants |
| Radio Button | Selected/unselected across five states | Control frame `42 x 42` |
| Switch | On/off state system | Track/thumb details are described from the available capture |
| Input Chip | Input chip matrix | 32 variants |
| Filter Chip | Filter chip matrix | 20 variants |
| Tag | Static compact label | Example `84 x 24` |
| Navigation Item | Farsi/English, enabled/focused | Item `72 x 64` |
| Navigation Bar | Farsi/English, 3/4/5 item variants | Bar `360 x 64` |
| Divider | Thin separating line | Usually `1px` high |
| List Row | Language, line count, leading, trailing, state | Width `360`, heights `72`, `88`, `108`, `128` |
| Dialog | Modal dialog pattern | Full variant matrix was not available in the capture |
| Bottom Sheet | Right item and center item | Sheet content `360 x 656/657` |
| Search Bar | Farsi/English, outlined/filled, enabled/hovered/pressed | `360 x 56` |
| Text Field | Farsi/English, outlined/fill, label/input states | Width `210`, heights `56`, `76`, `84`, `88`, `108` |
| Slider / Range Selection | Middle/right/left/filled/disabled, handle states | Track `400 x 16`, handle `16 x 16` |
| Tab | Tab/segmented navigation family | Full variant matrix was not available in the capture |
| Snackbar | Toast/snackbar pattern | Full variant matrix was not available in the capture |
| Date Picker | Day/today/selected, year cells | Day `48 x 48`, year `88 x 52` |
| Tooltip | Small contextual overlay | Full variant matrix was not available in the capture |

## Button

### Purpose

Buttons are command components. They trigger actions, submit forms, navigate to
the next step, confirm choices, cancel flows, or expose secondary commands.

### Variant Axes

The Figma button matrix contains 220 variants. The captured axes are:

- Style: `Filled`, `Outlined`, `Standard`, `Tonal`, plus custom examples.
- State: `Enabled`, `Hovered`, `Focused`, `Pressed`, `Disabled`.
- Content: text-only, icon with text, and icon-related variants.
- Button size/content groups are present, but exact individual dimensions are
  not available in the current text capture.

### Visual Description

- A filled button uses the primary action color as its background and a high
  contrast label color.
- An outlined button uses a transparent or white surface, a visible border, and
  colored or neutral label text.
- A standard button is visually lighter than outlined or filled; it reads as a
  low-emphasis text/action button.
- A tonal button uses a soft container color with stronger label/icon color.
- Disabled buttons have reduced contrast and should not show active feedback.
- Focused buttons show an outline or focus ring without changing size.
- Pressed buttons show a temporary state-layer overlay or darker/lower-emphasis
  feedback.

### Anatomy

- Outer button container.
- Optional state layer for hover/focus/press feedback.
- Optional leading icon.
- Text label.
- Optional trailing icon.

### Text And Layout

- Label text uses `label-md` or `label-lg`.
- Icons are usually `20px` or `24px`.
- In RTL, the start side is the visual right side.
- Text should remain centered for full-width action buttons.
- Compact buttons should keep label and icon aligned on one line.

### Build Instructions

- Implement styles as visual variants, not separate components.
- Preserve stable height across states.
- Do not let focus, hover, or press change layout dimensions.
- Use semantic colors: primary for filled, primary/outline for outlined,
  primary-container for tonal, neutral for disabled.

## Icon Button

### Purpose

Icon buttons are square or circular touch targets that contain an icon-only
action, such as back, close, search, bookmark, edit, attach, more, or filter.

### Variant Axes

- Style: `Filled`, `Outlined`, `Standard`, `Tonal`.
- State: `Enabled`, `Hovered`, `Focused`, `Pressed`, `Disabled`.

### Dimensions

- Outer component frame: `48 x 48`.
- Inner visual container: `40 x 40`.
- Inner container offset: `4px` from each side.
- The state layer fills the `40 x 40` inner container.
- Icon sits centered inside the state layer.
- Typical icon size: `24 x 24`.

### Visual Description

- The outer `48px` frame is the reliable touch target.
- The visible shape is the centered `40px` container.
- Filled style has the strongest container.
- Outlined style has a visible border and lighter fill.
- Standard style has minimal or transparent background.
- Tonal style has a soft colored container.
- Focused state adds visible focus treatment without moving the icon.
- Pressed and hovered states are represented by a state-layer overlay.
- Disabled state reduces icon and container emphasis.

### Build Instructions

- Always provide an accessible label, even when no visible text exists.
- Keep the icon centered in both axes.
- Keep the `48px` outer box stable in every state.
- Use the same geometry for all style variants.

## Toggleable Icon Button

### Purpose

Toggleable icon buttons represent icon-only controls with persistent selected
state, such as favorite/bookmark, active filter, selected view, or enabled mode.

### Variant Axes

- Style: `Filled`, `Outlined`, `Standard`, `Tonal`.
- State: `Enabled`, `Hovered`, `Focused`, `Pressed`, `Disabled`.
- Selected: `True`, `False`.

### Dimensions

- Outer component frame: `48 x 48`.
- Inner visual container: `40 x 40`.
- Inner container offset: `4px`.
- Icon centered inside state layer.

### Visual Description

- Unselected variants look like ordinary icon buttons.
- Selected variants use stronger color, filled icon treatment, selected
  container treatment, or both.
- Selected disabled variants remain selected but visually muted.
- Pressed state is temporary; selected state persists after interaction.

### Build Instructions

- Use selected visual styling only for a persistent state.
- Keep selected and unselected sizes identical.
- Selected state should be perceivable through more than subtle opacity alone.

## Segmented Button

### Purpose

Segmented buttons choose one value from a small set of mutually exclusive
options. They are used for mode switches, local filters, or small grouped
choices.

### Captured Structures

Two related component sets exist:

- `Button segment`: individual segment pieces.
- `Button segment block`: complete segmented-control blocks.

### Dimensions

- Example full control: `324 x 40`.
- Example has three equal segments.
- Each segment in the example is `108px` wide.
- Height is `40px`.

### Anatomy

- Outer segmented-control container.
- Start segment.
- Middle segment or repeated inner segments.
- End segment.
- Each segment contains a centered label and optional state styling.

### Visual Description

- The block is a single connected control, not separated standalone buttons.
- Adjacent segments share borders.
- Start and end segments own the outer rounded corners.
- The selected segment has a stronger container or selected text color.
- Unselected segments stay lower emphasis.
- Focus and press states apply to the segment, not the whole block.

### Build Instructions

- Use equal-width segments by default.
- Keep all segment heights stable.
- In RTL, the first logical option appears on the visual right unless product
  copy explicitly orders it differently.
- Do not confuse segmented buttons with tabs. Segmented buttons select a value;
  tabs switch content panels.

## Checkbox

### Purpose

Checkboxes represent independent on/off choices. Multiple checkboxes in the
same group may be selected at the same time.

### Variant Axes

- Selection: checked and unchecked.
- State: `Enabled`, `Hovered`, `Focused`, `Pressed`, `Disabled`.
- Captured total: 10 variants.

### Visual Description

- Unchecked state shows an empty square control with border.
- Checked state shows a filled or emphasized square with a check mark.
- Focused state adds focus treatment outside or around the checkbox without
  changing the control size.
- Pressed state shows active feedback.
- Disabled checked and disabled unchecked states are visually muted.

### Layout Rules

- Checkbox control should sit inside a larger touch target.
- When used in a list row, the row may be selectable, but the checkbox mark must
  still communicate selected state clearly.
- In RTL rows, a trailing checkbox often appears on the visual left when it is
  the row's trailing control.

### Build Instructions

- Support checked, unchecked, disabled, focus, hover, and press visuals.
- Preserve selected state even when disabled.
- If indeterminate state is needed, treat it as an extension because it was not
  captured in the current variant matrix.

## Radio Button

### Purpose

Radio buttons represent one selected option within a mutually exclusive group.

### Variant Axes

- Selected: `True`, `False`.
- State: `Enabled`, `Hovered`, `Focused`, `Pressed`, `Disabled`.
- Captured total: 10 variants.

### Dimensions

- Control frame: `42 x 42`.
- The visible circular radio mark sits centered inside the `42px` frame.
- The `42px` frame is the intended touch/focus area, not necessarily the mark
  diameter.

### Visual Description

- Unselected state is a circular outline.
- Selected state shows an emphasized circular control with an inner dot or
  selected fill.
- Focused state adds visible focus treatment while preserving the `42px` frame.
- Pressed state adds active feedback.
- Disabled selected and disabled unselected states are muted but still readable.

### Build Instructions

- A radio group should allow only one selected item.
- Keep all states `42 x 42`.
- Use Farsi/RTL row placement rules when radio buttons appear inside list rows.

## Switch

### Purpose

Switches turn a single setting on or off with immediate effect.

### Variant Axes

The standalone switch page exists in the design system. The exact selected
variant matrix was not available in the latest capture, but the component
should support:

- Checked/on.
- Unchecked/off.
- Enabled.
- Focused.
- Pressed.
- Disabled.

### Visual Description

- A switch is a horizontal rounded track with a circular thumb.
- On state uses primary color for the track and a high-contrast thumb.
- Off state uses neutral surface/outline treatment.
- Disabled state reduces opacity and contrast.
- Thumb position communicates the boolean state.

### RTL Behavior

- Keep the track horizontal.
- Decide thumb direction consistently across the product. For this system,
  checked/on should read as the active direction and use the primary color; the
  label remains RTL.

### Build Instructions

- Keep the label outside the switch unless building a labeled row.
- Preserve track and thumb dimensions across states.
- Focus treatment must not move the thumb.

## Input Chip

### Purpose

Input chips represent compact user-entered or selected values, such as selected
locations, categories, tags, or removable filters.

### Variant Axes

- Captured total: 32 variants.
- Expected axes from the component set: selected/unselected, enabled/hovered/
  focused/pressed/disabled, with optional icon or remove affordance.

### Visual Description

- Shape is compact, pill-like or softly rounded.
- Height is usually around a compact control height, commonly `32px` to `40px`.
- Contains a short label.
- May contain an icon, avatar, or remove icon.
- Selected chips use stronger border/container/text emphasis.
- Removable chips include a close/remove affordance.

### RTL Behavior

- Label text is RTL when Persian.
- For removable selected values, the remove icon appears at the visual start of
  the chip unless a specific usage dictates otherwise.
- Icon and text spacing must remain stable when selected or pressed.

### Build Instructions

- Keep chips single-line.
- Truncate long labels only if the container cannot grow.
- Preserve chip height across states.
- Do not use chips for long text content.

## Filter Chip

### Purpose

Filter chips represent available filters or active filter states. They are used
in horizontal rails and compact filtering surfaces.

### Variant Axes

- Captured total: 20 variants.
- Expected axes from the matrix: selected/unselected, enabled/hovered/focused/
  pressed/disabled, optional icon or dropdown affordance.

### Visual Description

- Compact rounded rectangle or pill control.
- Unselected chips use white or neutral surface with neutral border/text.
- Selected chips use primary-tinted surface, primary border, or primary text.
- Dropdown chips include a small arrow/caret.
- Chips that open a sheet/menu should visually suggest expansion.

### RTL Behavior

- In a horizontal filter rail, chips flow right-to-left.
- The first chip appears at the visual right.
- Caret/dropdown icon placement should follow the Farsi visual order.

### Build Instructions

- Keep minimum touch height around `40px`.
- Keep selected and unselected widths based on content.
- Do not change height on focus or selection.

## Tag

### Purpose

Tags are compact static labels used to mark status, category, badge, or metadata.

### Dimensions

- Captured example: `84 x 24`.

### Visual Description

- Small rounded label.
- Compact text, usually `label-sm`.
- May use semantic colors for status: primary, tertiary/success, warning,
  error, or neutral.
- Tags are not interactive by default.

### Build Instructions

- Use tags for display, not selection.
- Keep height stable at `24px` for compact tags.
- Keep labels short.

## Navigation Item

### Purpose

A navigation item is one entry inside the bottom navigation bar. It contains an
icon and a short label.

### Variant Axes

- Language: `Fa`, `En`.
- State: `Enabled`, `Focused`.
- Captured total: 4 variants.

### Dimensions

- Item frame: `72 x 64`.
- Height is `64px`.
- Width in the component is `72px`.

### Anatomy

- Vertical container.
- Icon centered horizontally.
- Label below icon.
- State layer/focus treatment.

### Visual Description

- Enabled state is the normal item display.
- Focused state adds clear focus feedback without resizing the item.
- Active/selected page state should use stronger primary treatment, even though
  the captured matrix explicitly lists enabled/focused language variants.
- Label is short and centered under the icon.

### RTL Behavior

- Item order in the full navigation bar follows RTL product order.
- Farsi labels are the production default.

## Navigation Bar

### Purpose

The navigation bar is the persistent bottom navigation surface containing three,
four, or five navigation items.

### Variant Axes

- Language: `Fa`, `En`.
- Items: `3`, `4`, `5 Middle`.
- Captured total: 6 variants.

### Dimensions

- Bar example width: `360px`.
- Bar height: `64px`.
- Items sit in one horizontal row.

### Visual Description

- Background is a surface color, usually white.
- Items are evenly distributed across the bar.
- The five-item middle variant has a special middle slot; this may be visually
  or behaviorally emphasized.
- Navigation labels use compact label typography.
- Active item should be visually distinct through primary color and/or icon fill.

### RTL Behavior

- Navigation order is right-to-left.
- Farsi labels are centered under icons.
- Do not mirror icons accidentally if the icon itself has directional meaning.

## Divider

### Purpose

Dividers separate content groups, list rows, sheet items, or sections.

### Dimensions

- Standard divider thickness: `1px`.
- Horizontal dividers span either the full container width or an inset width
  depending on the parent component.

### Visual Description

- Use neutral low-emphasis color, usually neutral 90/95 or an outline variant.
- Dividers should be subtle and not compete with content.
- In list rows, the divider commonly sits at the bottom edge.

### Build Instructions

- Use a single physical pixel or CSS `1px`.
- Do not add heavy shadows or gradients.
- Keep inset behavior consistent inside repeated list components.

## List Row

### Purpose

List rows display repeated pieces of content in vertical lists. They can show
text-only content, media-leading content, video-leading content, and optional
trailing controls.

### Variant Axes

- Language: `Fa`, `En`.
- Text condition: `1 line`, `2 line`, `3 line+`.
- Leading: `Image`, `Video`.
- Trailing: `None`, `Checkbox`, `Radio Button`, `Icon`.
- State: `Enabled`, `Hovered`, `Pressed`.

### Dimensions

- Captured row width: `360px`.
- Image-leading rows:
  - `72px` height for one-line and two-line content.
  - `88px` or `108px` height for longer content depending on language and
    trailing control.
- Video-leading rows:
  - `88px` height for one-line and two-line content.
  - `108px` or `128px` height for three-line Farsi content with trailing
    controls.

### Anatomy

- Row container.
- State layer, used for hover/press feedback.
- Optional leading visual:
  - image thumbnail, or
  - video thumbnail/icon.
- Text content block:
  - title/primary text,
  - optional secondary text,
  - optional third/supporting line.
- Optional trailing control:
  - checkbox,
  - radio button,
  - icon,
  - or none.
- Bottom divider.

### Visual Description

- Text block occupies the main flexible area.
- Leading media has fixed dimensions and does not stretch.
- Trailing controls are aligned with the row center unless content height
  requires a top-aligned pattern.
- Enabled rows have no strong background beyond the surface.
- Hovered/pressed rows use a state-layer background.
- Divider sits on the bottom edge and stays subtle.

### RTL Behavior

- In Farsi rows, the leading visual appears on the visual right.
- The text block is right-aligned.
- The trailing control appears on the visual left.
- English variants document LTR behavior, but Farsi variants are the production
  default.

### Build Instructions

- Do not hard-code one height for all rows. Height depends on language, line
  count, leading type, and trailing control.
- Preserve row width responsiveness, but use `360px` as the reference.
- Allow Farsi multi-line content enough vertical space.

## Dialog

### Purpose

Dialogs are modal surfaces for confirmations, short decisions, alerts, and
blocking tasks.

### Expected Anatomy

- Scrim/backdrop behind the dialog.
- Dialog container on top of the scrim.
- Optional icon or illustration.
- Title.
- Body/supporting text.
- Primary action.
- Optional secondary action.
- Optional close action.

### Visual Description

- Dialogs should feel more blocking than bottom sheets.
- Container uses surface color, rounded corners, and clear internal spacing.
- Primary action uses primary color.
- Destructive action uses error color.
- Secondary action is lower emphasis.

### RTL Behavior

- Persian title and body copy are right-aligned.
- Action order should follow the product's RTL decision pattern. Primary action
  usually appears in the stronger visual position.

### Build Instructions

- Use dialog only when the user must respond before continuing.
- Do not use dialog for long lists of options; use bottom sheet for that.

## Bottom Sheet

### Purpose

Bottom sheets are mobile modal panels that slide from the bottom of the screen.
They are used for action lists, pickers, secondary choices, and short workflows.

### Variant Axes

- Style: `Right Item`, `Center Item`.
- Captured total: 2 variants.

### Dimensions

- Component example width: `360px`.
- `Right Item` sheet height: `656px`.
- `Center Item` sheet height: `657px`.

### Anatomy

- Full-screen scrim behind the panel.
- Bottom-aligned sheet panel.
- Rounded top corners.
- Optional drag handle at top.
- Header/title area.
- Optional back/close icon.
- Vertical list of sheet items.
- Optional dividers between items.

### Visual Description

- The sheet panel is anchored to the bottom.
- The top corners are rounded; the bottom edge touches the viewport bottom.
- `Right Item` aligns item labels to the right and is the normal RTL action-list
  style.
- `Center Item` centers item labels inside each row.
- Sheet items are vertically stacked with consistent row height.
- Scrim darkens the page underneath.

### RTL Behavior

- Right-item sheets align content to the visual right.
- Back or close icon should use the correct RTL directional symbol.
- Action-list order reads from top to bottom.

### Build Instructions

- Sheet width should fill the mobile shell up to its maximum.
- Keep sheet content scrollable only when content exceeds available height.
- Tapping scrim may close the sheet unless the workflow is blocking.

## Search Bar

### Purpose

Search bars let the user enter or trigger a search query. The captured component
is a compact mobile search field.

### Variant Axes

- Language: `Fa`, `En`.
- Type: `Outlined`, `Filled`.
- State: `Enabled`, `Hovered`, `Pressed`.
- Captured total: 12 variants.

### Dimensions

- Component width: `360px`.
- Component height: `56px`.

### Anatomy

- Outer search container.
- Search icon.
- Placeholder/query text.
- Optional clear or trailing action, depending on usage.
- State layer or background treatment for hover/press.

### Visual Description

- Outlined search bar has a visible border and surface fill.
- Filled search bar has a stronger filled container with less emphasis on the
  border.
- Enabled state is the default resting state.
- Hovered state changes container or border emphasis.
- Pressed state gives active touch feedback.
- Search icon remains visually attached to the text field.

### RTL Behavior

- In Farsi variants, placeholder/query text is right-aligned.
- The search icon should appear according to the Farsi visual layout; do not
  simply mirror from English without checking directional intent.
- Farsi variants are the production default.

### Build Instructions

- Keep height `56px`.
- Keep text vertically centered.
- Do not let placeholder or query text overlap icons.
- Use `body-md` for query text and neutral color for hint text.

## Text Field

### Purpose

Text fields collect or display typed values. The captured matrix includes
ordinary input fields, placeholder states, filled states, outlined states,
label-in-outline states, error states, disabled states, and picker/check-picker
states.

### Variant Axes

- Language: `Fa`, `En`.
- Style: `Outlined Label in`, `Outlined`, `Filled`.
- Type: `Placeholder text`, `Input text`.
- State: `Enabled`, `Focused`, `Hovered`, `Error`, `Disabled`,
  `Check Picker`.
- Captured total: 57 variants.

### Shared Anatomy

- Outer component frame.
- Main field container named `text field` or `content`.
- Optional label area named `label-text`.
- Optional supporting-text area below the field.
- Optional internal icon or picker indicator.
- Input or placeholder text.
- State-dependent border/background.

### Core Dimensions

- Common width: `210px`.
- Main compact field container height: `56px`.
- Supporting text area height: `20px` when present.
- English compact total height with supporting text: `76px`.
- Farsi label-in total height: `84px`.
- Farsi outlined expanded total height: `108px`.
- Some Farsi example instances use `88px` when content is shorter.

### Size Matrix

| Language / style / type | Common total size |
| --- | --- |
| English `Outlined Label in`, placeholder text | `210 x 76` |
| Farsi `Outlined Label in`, placeholder text | `210 x 84` |
| Farsi `Outlined Label in`, input text | `210 x 84` |
| English `Outlined`, placeholder text | `210 x 108` |
| Farsi `Outlined`, placeholder text | `210 x 108` |
| English `Filled`, placeholder text | `210 x 76` |
| Farsi `Filled`, placeholder text | `210 x 76` |
| English `Outlined`, input text | `210 x 76` |
| Farsi `Outlined`, input text | `210 x 108` |
| English `Filled`, input text | `210 x 76` |
| Farsi `Filled`, input text | `210 x 76` |

### Style Descriptions

`Outlined Label in`:

- The label sits inside or overlapping the outlined field area.
- English input-text variants include a floating label frame positioned near the
  top edge.
- Farsi variants place the label as a right-aligned top label block with the
  content field below.

`Outlined`:

- The field has a visible outline.
- Placeholder text appears before input.
- Error state changes the border/supporting text to the error color.
- Disabled state lowers contrast.

`Filled`:

- The field uses a filled container surface.
- Border is lower emphasis or absent.
- Focus/error states still need clear visual treatment.

### State Descriptions

- Enabled: resting, interactive state.
- Focused: stronger border or focus treatment.
- Hovered: pointer-hover feedback.
- Error: error-colored border/label/supporting text.
- Disabled: muted, non-interactive state.
- Check Picker: outlined picker-style field with a check or picker indicator,
  total size `210 x 108`.

### RTL Behavior

- Farsi labels are right-aligned.
- Farsi input and placeholder text are right-aligned.
- Farsi outlined variants need taller vertical rhythm than English variants.
- Do not compress Farsi field labels into English compact heights.

### Build Instructions

- Support field states without changing width.
- Support both placeholder and input text states.
- Reserve space for supporting text when the variant includes it.
- Error text should not overlap field content.
- Picker/check-picker should be treated as a field-like selector, not as a free
  text input.

## Slider / Range Selection

### Purpose

Sliders select a numeric value or numeric range. The captured range selection
component shows the visual track states and separate handle states.

### Range Selection Variants

| State | Size | Description |
| --- | --- | --- |
| `Middle` | `400 x 16` | Active range segment sits away from both ends. |
| `Right` | `400 x 16` | Active range reaches the right end. |
| `Left` | `400 x 16` | Active range reaches the left end. |
| `Filled` | `400 x 16` | Entire track is active/filled. |
| `Disabled` | `400 x 16` | Range is non-interactive and muted. |

### Handle Variants

| State | Size |
| --- | --- |
| `Enabled` | `16 x 16` |
| `Hovered` | `16 x 16` |
| `Focused` | `16 x 16` |
| `Pressed` | `16 x 16` |
| `Disabled` | `16 x 16` |

### Anatomy

- Horizontal track.
- Inactive track segment.
- Active/filled range segment.
- One or two circular handles.
- Optional state treatment around handle.

### Visual Description

- Track visual height is contained inside a `16px` tall component.
- Handle visual size is `16 x 16`.
- Active segment uses primary color or a primary semantic role.
- Disabled track and handle use muted neutral colors.
- Focused handle receives a visible focus treatment.
- Pressed handle may appear stronger or show an active overlay.

### RTL Behavior

- RTL direction must be decided intentionally.
- If the product treats the right side as the starting/minimum side for Farsi
  numeric ranges, the active range should follow that rule consistently.
- If numeric convention requires minimum on the left, keep that behavior and
  document it in the consuming feature.

### Build Instructions

- Let the track scale to container width while preserving `16px` visual height.
- Keep handle visual size `16px`, with a larger invisible touch target if
  needed.
- Support keyboard, drag, focus, disabled, and pressed states.

## Tab

### Purpose

Tabs switch between related content panels or route-like views.

### Visual Description

- Tabs are horizontal controls.
- Active tab uses primary color or selected indicator.
- Inactive tabs use neutral text.
- Tabs may be scrollable if there are too many to fit.
- A tab indicator should not shift layout when it appears.

### Difference From Segmented Button

- Use tabs for switching content.
- Use segmented buttons for choosing a value or mode inside the same content.

### RTL Behavior

- Farsi tabs flow right-to-left.
- The first tab appears on the visual right.
- Text is centered or right-aligned depending on tab style.

## Snackbar

### Purpose

Snackbars display temporary feedback messages such as success, error, warning,
or information.

### Expected Anatomy

- Snackbar container.
- Optional leading status icon.
- Title or short message.
- Optional supporting message.
- Optional action button.
- Optional dismiss button.

### Visual Description

- Error snackbar uses error semantic color.
- Success snackbar uses tertiary/success color.
- Info snackbar uses primary color.
- Warning snackbar uses warning color.
- Snackbar surface should contrast with the page without feeling like a full
  dialog.
- It should appear above fixed navigation or app chrome.

### RTL Behavior

- Persian title and message are right-aligned.
- Close/dismiss icon placement follows the component's visual hierarchy and
  should not obscure the message.

## Date Picker

### Purpose

Date picker components select days and years. The system includes separate day
cell and year cell component sets.

### Day Cell Variants

| Type | States | Size |
| --- | --- | --- |
| `Day` | Enabled, Hovered, Focused, Pressed, Disabled | `48 x 48` |
| `Today` | Enabled, Hovered, Focused, Pressed, Disabled | `48 x 48` |
| `Selected` | Enabled, Hovered, Focused, Pressed | `48 x 48` |

### Year Cell Variants

| Selected | States captured | Size |
| --- | --- | --- |
| `False` | Enabled, Hovered, Focused | `88 x 52` |

### Visual Description

- Day cells are square `48px` touch targets.
- Today state is visually distinct from ordinary day.
- Selected day uses the strongest selected treatment.
- Disabled day is muted.
- Focused day has focus treatment without changing size.
- Year cells are wider than day cells to fit year numerals.

### RTL/Farsi Behavior

- Calendar labels and numerals should support Persian.
- Week and month layout should follow the product calendar locale.
- Do not clip Persian numerals or month names.

## Tooltip

### Purpose

Tooltips provide short contextual text for controls, usually icon-only controls.

### Visual Description

- Small floating surface.
- Short text only.
- Uses high-contrast surface/text.
- May include a small pointer depending on placement.
- Should not be required to understand core mobile workflows.

### RTL Behavior

- Persian tooltip text is right-aligned.
- Tooltip placement should avoid covering the target control.

## Builder Checklist

Use this checklist when creating components from these two README files:

1. Read `design-system-inventory.md` first for colors, typography, grid, and
   avatar foundations.
2. For each component, implement the captured variant axes.
3. Preserve captured dimensions as the visual reference.
4. Make Farsi/RTL the default.
5. Implement state behavior without layout shift.
6. Use semantic color roles rather than random hex values.
7. Keep mobile touch targets large enough.
8. Do not depend on Figma access; all required structure should come from these
   descriptions.

## Known Missing Visual Details

The text above captures every structural detail currently available from the
design capture. Some low-level visual values were not available in text form:

- Exact fills, strokes, opacity, and effects for many component states.
- Exact corner radius for several controls.
- Exact icon artwork for some generic icon placeholders.
- Exact snackbar and tooltip dimensions.
- Exact checkbox and switch inner mark sizes.

When those values are unavailable, derive them from the foundation system:
primary for selected/action states, neutral for surfaces and outlines, error for
invalid states, warning for caution states, and tertiary for success states.
