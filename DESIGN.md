# Design System

A minimalist, dark-first UI for a forex trading journal. Every new page should reuse the tokens
and patterns below instead of introducing new colors, spacing, or one-off components. If a new
pattern is genuinely needed, add it here so it stays a shared pattern instead of a one-off.

## Styling: Tailwind CSS, always

**All styling is written with Tailwind utility classes directly on the JSX element.** This project
does not write component-scoped `.css` files anymore — none should be added going forward. If a
component needs a class, it goes in `className`, not a colocated stylesheet.

- Only [`src/styles/index.css`](src/styles/index.css) exists as a stylesheet. It imports Tailwind,
  defines the design tokens, and maps them into Tailwind's theme (see below). Nothing else should
  be added to it beyond genuinely global, one-off base rules (wrapped in `@layer base`).
- Reach for Tailwind's arbitrary value syntax (`w-[220px]`, `top-[calc(100%+8px)]`) when a design
  value doesn't land on the default scale, rather than dropping into a `.css` file. Arbitrary
  *properties* (`[mask-image:radial-gradient(...)]`) cover the rare case a utility doesn't exist at
  all (see the background grid motif in `Login.jsx`).
- Never write a raw hex/rgba color in a `className`. Always use the semantic color utilities below
  (`bg-surface`, `text-text-muted`, `border-accent-border`, …) so both themes stay correct
  automatically.
- Config: [`vite.config.js`](vite.config.js) registers `@tailwindcss/vite` alongside
  `@vitejs/plugin-react` — both plugins are required, don't drop either.

## Mobile responsive: mandatory, for everything

**Every component, page, and feature must be mobile responsive.** This isn't optional polish —
build it in from the first draft, the same way the Tailwind-only rule above is non-negotiable.
Before considering any UI done, check it at a narrow viewport (≈375px) as well as desktop width.

- Build mobile-first: unprefixed Tailwind classes are the small-screen styles, `sm:`/`lg:` layer on
  top for larger viewports. Don't design for desktop and bolt on breakpoints after.
- No fixed pixel widths that can exceed the viewport. Use `w-full`/`max-w-*` combinations (as the
  `Modal`, `Login` card, and `DateRangeFilter`/`ProfileMenu` popovers already do), and clamp
  anything anchored to screen edges with something like `max-w-[90vw]` (see `DateRangeFilter`'s
  popover) so it can't run off a narrow screen.
- A permanent multi-column desktop layout must collapse on mobile — either stack
  (`flex-col lg:flex-row`, as `Todo.jsx` and the dashboard charts grid do), or become an off-canvas
  overlay when stacking isn't viable. `Sidebar` is the reference implementation for the latter: on
  mobile it's `fixed` + `-translate-x-full`/`translate-x-0` behind a `bg-black/50` backdrop,
  toggled by a hamburger button (`lg:hidden`) in `DashboardLayout`'s header, and calls `onClose`
  when a nav link is clicked so it doesn't stay open after navigating; at `lg:` it reverts to
  `lg:static lg:translate-x-0` and its normal collapse-to-icons behavior. Reuse this shape for any
  future permanent side panel — don't leave a fixed-width column unconditionally in the layout.
  Reference and fine-grained detail should collapse in place, not overlay a global button/gesture.
- Rows of controls that could overflow (a heading + a filter button, a table's pagination footer)
  need `flex-wrap` and a `gap`, not a bare `justify-between` that assumes both items always fit on
  one line. See the `Dashboard` header row and `DataTable`'s pagination footer.
- Tables handle overflow with a horizontal scroll wrapper (`overflow-x-auto` around the `<table>`,
  already built into `DataTable`) rather than trying to force every column to shrink to fit.
- Fixed-position overlays anchored to a screen edge (toasts, in particular) should go full-width
  with margins on mobile and only take a fixed width at a larger breakpoint — see the
  `inset-x-4 ... sm:inset-x-auto sm:w-80` pattern in `Toast.jsx`.

## Themes

Two themes: `dark` (default/brand) and `light`. Switching is done via a `data-theme` attribute on
`<html>`:

- Toggled by [`ThemeToggle`](src/components/common/ThemeToggle.jsx) — a plain button with no
  built-in positioning; the parent decides placement (fixed top-right on `Login`, inline in the
  dashboard topbar). Mount it once per page/layout, next to whatever else lives in that corner.
- Persisted to `localStorage` under the `theme` key.
- Initialized from `prefers-color-scheme` on first visit, applied by an inline script in
  [`index.html`](index.html) before React mounts (avoids a flash of the wrong theme).

### How theming works with Tailwind

Tailwind v4 doesn't manage the theme switch itself — the CSS custom properties in
[`src/styles/index.css`](src/styles/index.css) do, exactly as before. Tailwind's `@theme` block
just aliases each design token into Tailwind's color namespace so it gets a utility class:

```css
@theme {
  --color-surface: var(--surface); /* → bg-surface / text-surface / border-surface */
  --color-accent: var(--accent);   /* → bg-accent / text-accent / stroke-accent / accent-accent */
}

:root {
  --surface: #12161b;
  --accent: #21c384;
}
:root[data-theme='light'] {
  --surface: #ffffff;
  --accent: #17a673;
}
```

Because `--color-surface` is *itself* a reference to `--surface` (not a copied value), the
generated utility (`.bg-surface { background-color: var(--color-surface) }`) keeps resolving live
against whichever theme's value is active. Adding a new token means adding it in both places: the
`:root` / `:root[data-theme='light']` value pair, and one `--color-*` (or `--font-*` / `--shadow-*`)
line in `@theme` to expose it as a utility.

| Token             | Tailwind utility prefix                          | Dark      | Light     | Use                            |
| ----------------- | ------------------------------------------------- | --------- | --------- | ------------------------------- |
| `--bg`             | `bg-bg`                                           | `#0a0d10` | `#f7f8fa` | page background                 |
| `--surface`        | `bg-surface` / `border-surface`                   | `#12161b` | `#ffffff` | cards, panels                   |
| `--surface-2`      | `bg-surface-2`                                    | `#171c22` | `#f1f3f5` | inputs, recessed surfaces       |
| `--border`         | `border-border`                                   | `#232830` | `#e2e5e9` | hairlines, dividers             |
| `--text`           | `text-text`                                       | `#c9d1d9` | `#4b5563` | body text                       |
| `--text-muted`     | `text-text-muted` / `bg-text-muted` (dots/badges) | `#6b7280` | `#8a94a3` | secondary text, labels          |
| `--text-h`         | `text-text-h`                                     | `#f4f6f8` | `#10151b` | headings, high-emphasis text    |
| `--accent`         | `bg-accent` / `text-accent` / `stroke-accent`     | `#21c384` | `#17a673` | primary actions, bullish signal |
| `--accent-bg`      | `bg-accent-bg`                                    | tint of accent (12% / 10%)      | | accent tint backgrounds     |
| `--accent-border`  | `border-accent-border`                            | tint of accent (40% / 35%)      | | focus rings, hover borders  |
| `--shadow`         | `shadow-card`                                     | soft black | soft black, lower opacity      | card elevation               |
| `--sans` / `--mono`| `font-sans` / `font-mono`                         | — | — | body text / numeric-tabular data |

## Typography

- `font-sans` for all text, `font-mono` reserved for numeric/tabular data (prices, PnL, dates).
- Base size 16px, line-height 145% (set once on `body` in `@layer base`).
- Headings: `font-semibold text-text-h`, sized per context (e.g. `text-2xl` for a page `<h1>`).
  Tailwind's Preflight strips default heading margin/size — always set size explicitly.
- Field labels: `text-xs font-medium uppercase tracking-wide text-text-muted`.

## Spacing & shape

- Card: `px-8 py-9` padding, `rounded-xl` (12px), `border border-border`, `shadow-card`.
- Form field gap: `gap-[18px]`. Input padding: `px-3 py-2.5`, `rounded-md` (6px).
- Borders are always `border border-border` (1px) — no heavier borders anywhere.
- Prefer the default Tailwind spacing/radius scale (`p-6`, `rounded-lg`, `gap-3`, …); it already
  lines up with this system's pixel values (`rounded-xl`=12px, `rounded-lg`=8px, `rounded-md`=6px).
  Drop to an arbitrary value only when the scale genuinely doesn't have the number you need.

## Components

- **Card** — the base surface for any grouped content: `bg-surface`, `border border-border`,
  `rounded-xl`, `shadow-card`. Use the shared [`Card`](src/components/ui/Card.jsx) component
  (also exports `CardTitle`, the `text-xs font-semibold uppercase` heading every card-based
  feature reaches for) instead of re-typing the surface classes per feature.
- **Input** — `bg-surface-2`, `border border-border`, `focus:border-accent-border`. See
  [`LoginForm.jsx`](src/features/auth/components/LoginForm.jsx).
- **Primary button** — `bg-accent`, dark text (`text-[#06110b]` — stays readable on the accent in
  both themes), `rounded-md`, no border.
- **Links** — `text-text-muted` by default; `text-accent` only for the primary call to action in a
  block of text.
- **Background motif** — a faint 48px grid (`--border` lines via an arbitrary
  `[background-image:...]` utility, radial mask fade toward the edges) behind full-page centered
  layouts. See the grid `<div>` in `Login.jsx`.
- **Badges** — use the shared [`Badge`](src/components/ui/Badge.jsx) component
  (`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold`), `tone="positive"` for wins/
  longs (`bg-accent-bg text-accent`), `tone="neutral"` (the default) for losses/shorts
  (`bg-surface-2 text-text-muted`). No red token — losses read as muted gray, not alarmed, to keep
  the palette small.
- **DataTable** — the shared [`DataTable`](src/components/ui/DataTable.jsx) component for any
  tabular data. It's a plain `<table>`, not wrapped in a `Card` — wrap it yourself
  (`<Card><CardTitle>…</CardTitle><DataTable .../></Card>`) so it can also be dropped straight into
  a full page. Column-driven (`columns={[{ key, header, align?, render? }]}`, `render` defaults to
  `row[key]`), so it renders whatever field types a caller passes. Every other feature is opt-in via
  props, so a bare `<DataTable columns={...} data={...} />` is a plain static table:
  - `searchable` (+ optional `searchKeys`) adds a search input above the table that filters `data`
    client-side.
  - `actions={(row) => <ReactNode>}` adds a trailing actions column; omit it and no column renders.
  - `onRowClick={(row) => void}` makes rows clickable — hover highlight (`hover:bg-surface-2`)
    always applies, but `cursor-pointer` only appears when `onRowClick` is actually passed.
  - `pageSize={n}` turns on pagination (page indicator + prev/next, reusing the same chevron button
    treatment as the calendar popover's month nav).
  See [`TradesTable.jsx`](src/features/dashboard/components/TradesTable.jsx) for a full example
  (search + pagination + row click + a trailing chevron as the action).
- **Modal** — the shared [`Modal`](src/components/ui/Modal.jsx) component for any dialog. Fully
  controlled: the caller owns the open state and passes `open`/`onClose` — `Modal` renders nothing
  itself when `open` is `false`, so guard any prop content that depends on selection data (e.g.
  `{selectedRow && <Modal ...>{selectedRow.field}</Modal>}`) rather than passing it unconditionally.
  Renders via `createPortal` into `document.body` (so it isn't clipped by a scrolling ancestor like
  the dashboard page area), dims the page with `bg-black/50`, and closes on backdrop click, the `×`
  button, or `Escape`. Props: `title` (header text), `children` (body — put whatever content shape
  fits, e.g. a `grid grid-cols-2` of `label`/`value` pairs), `footer` (optional, right-aligned
  action buttons), `size` (`'sm' | 'md' | 'lg'`, default `'md'`). See the row-click → trade-details
  modal in `TradesTable.jsx` — reuse this shell for any other "click a row/card, see full details"
  interaction rather than building a new dialog.
- **ConfirmModal** — the shared [`ConfirmModal`](src/components/ui/ConfirmModal.jsx) component for
  any "are you sure?" interaction. It's `Modal` pre-wired with a `footer` of Cancel/Confirm
  buttons — same `open`/`onClose` contract as `Modal`, plus `onConfirm`, `title`, `description`,
  `confirmLabel`/`cancelLabel`, and `tone` (`'default' | 'danger'` — danger renders the confirm
  button in red for destructive actions). Don't wire a raw `Modal` with custom footer buttons for a
  confirmation — use this instead. See the delete-confirmation in
  [`TodoCard.jsx`](src/features/todo/components/TodoCard.jsx).
- **Toast** — global notifications via [`Toast.jsx`](src/components/ui/Toast.jsx). `ToastProvider`
  is mounted once, at the root, in [`main.jsx`](src/main.jsx) (inside `BrowserRouter`, wrapping
  `App`) — never mount a second one. Any component calls `useToast()` (from
  [`useToast.js`](src/components/ui/useToast.js) — split into its own file, along with the context
  in `toast-context.js`, purely so `Toast.jsx` only exports a component and Fast Refresh doesn't
  complain) to get `showToast(message, { tone, duration })`. `tone` is `'default' | 'success' |
  'error'` (colors the leading dot + border accent); `duration` in ms, default `4000`, pass `0` to
  require manual dismissal. Toasts stack bottom-right via `createPortal`, each with its own
  auto-dismiss timer and a manual `×`. See the add/delete calls in
  [`TodoForm.jsx`](src/features/todo/components/TodoForm.jsx) and
  [`Todo.jsx`](src/pages/Todo.jsx).
- **Rich text editor** — [`RichTextEditor`](src/components/ui/RichTextEditor.jsx) for any
  "content" field that needs basic formatting (bold, italic, bullet/numbered list, alignment). It's
  a `contentEditable` div driven by `document.execCommand` (no editor library/dependency) with a
  small icon toolbar above it; value is an HTML string (`value`/`onChange` props, controlled the
  same way as any other input). Because Tailwind's Preflight strips default list styling, anywhere
  this HTML is redisplayed (e.g. via `dangerouslySetInnerHTML`) must repeat the
  `[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5` overrides — see `TodoCard.jsx` for
  the read-only side of this. This content is never sent anywhere/rendered for other users, so
  `dangerouslySetInnerHTML` here is a deliberate, scoped exception — don't reuse this pattern for
  HTML coming from outside the current user's own input.
- **Sidebar** — collapsible app nav, icon + label links that collapse to icon-only. See
  [`Sidebar.jsx`](src/components/common/Sidebar.jsx). Collapse state is local to the component
  (flexbox reflows the content pane automatically — no prop drilling needed).
- **Dropdown / popover** — a trigger button + an absolutely-positioned `Card`-styled panel
  (`absolute top-[calc(100%+8px)] ... rounded-xl border border-border bg-surface shadow-card`)
  that closes on outside click via a `mousedown` listener + ref. See
  [`ProfileMenu.jsx`](src/components/common/ProfileMenu.jsx) (simple menu) and
  [`DateRangeFilter.jsx`](src/features/dashboard/components/DateRangeFilter.jsx) (calendar
  popover — same shell, richer content).
- **Calendar / date picker** — a popover (see above) containing a preset-range row (pill buttons,
  `bg-surface-2` → `bg-accent-bg` on hover), a month header with `ChevronLeft`/`ChevronRight` nav,
  and a 7-column day grid (`grid grid-cols-7`). Selected day(s): `bg-accent text-[#06110b]`; days
  between a range: `bg-accent-bg text-accent`; today (unselected): `ring-1 ring-accent-border`;
  days outside the current month: `text-text-muted/40`. See `DateRangeFilter.jsx` — reuse this
  shape for any future date-based filter rather than building a new calendar widget. The day-grid
  math (`startOfDay`, `addDays`, `isSameDay`, `formatShort`, `getCalendarDays`) lives in
  [`src/lib/date.js`](src/lib/date.js) — it's shared by `DateRangeFilter` and the recurrence picker
  below, so any third calendar-shaped feature should pull from there too rather than reimplementing it.
- **Inline (non-popover) calendar** — the same day-grid look as above but embedded directly in a
  form instead of behind a trigger button, used for multi-date (not range) selection: every clicked
  day toggles independently in/out of a `dates` array. See the `manual` mode of
  [`RecurrencePicker.jsx`](src/features/todo/components/RecurrencePicker.jsx). When the calendar is
  scheduling new/future data (not filtering existing history like `DateRangeFilter`), dates before
  today get `disabled` + `text-text-muted/30 cursor-not-allowed` and the "previous month" nav
  disables once the visible month is the current month — don't let users pick or navigate to the
  past when the action is "add/schedule," only when it's "browse/filter."
- **Multi-select pill grid** — for picking from a small fixed set (weekdays, days of a month):
  circular pills, unselected `bg-surface-2 text-text-muted hover:bg-surface`, selected
  `bg-accent text-[#06110b]`. Weekly uses a `flex flex-wrap` row of 7; monthly uses
  `grid grid-cols-7` for 1–31. See `RecurrencePicker.jsx`.
- **Recurrence picker** — segmented tabs (Manual / Weekly / Monthly, using the segmented-tabs
  pattern below) switch which of the three pickers above is shown, plus a `text-xs text-text-muted`
  human-readable summary line underneath (`describeRecurrence()` in
  [`src/features/todo/recurrence.js`](src/features/todo/recurrence.js) — the single source of
  truth for the recurrence value shape `{ type, dates, weekdays, monthDays }` and its helpers;
  import from there rather than re-deriving the summary text elsewhere).
- **Image upload** — an empty state is a dashed dropzone (`border-2 border-dashed border-border`,
  hover `border-accent-border text-accent`) wrapping a visually-hidden `<input type="file">` via a
  `<label htmlFor>`; once a file is chosen, swap to a thumbnail preview (`object-cover`, rounded)
  with a small circular remove button overlaid top-right. Use `URL.createObjectURL`/
  `URL.revokeObjectURL` for the preview — there's no upload endpoint, this is client-only. See
  [`TodoForm.jsx`](src/features/todo/components/TodoForm.jsx).
- **Segmented tabs** (e.g. Sign in / Create account) — a `bg-surface-2 rounded-full p-1` pill
  container; the active tab is `bg-surface text-text-h shadow-card`, inactive tabs are
  `text-text-muted`. See the mode switcher in [`Login.jsx`](src/pages/Login.jsx).
- **Auth card** ([`Login.jsx`](src/pages/Login.jsx) + [`LoginForm.jsx`](src/features/auth/components/LoginForm.jsx))
  — heading (accent word `italic`) → subheading → segmented tabs → credential fields → primary
  button → `Or continue with` divider (`h-px flex-1 bg-border` rules either side) → OAuth button.
  OAuth/social buttons always go *after* the credentials form, never before it. `LoginForm` takes a
  `mode` (`'signin' | 'signup'`) prop and adapts labels/hints/which rows show — it doesn't fork
  into two components. The badges row and its "Support" link exist in `Login.jsx` but the link is
  `hidden` (kept in markup, not rendered) — re-enable by dropping the `hidden` class rather than
  rebuilding it.
- **Inline field toggle** (e.g. password show/hide) — an absolutely positioned
  `absolute top-1/2 right-3 -translate-y-1/2` text button inside a `relative` input wrapper.

## Icons

Inline SVG only (no icon font/library). 2px stroke, round caps/joins, `currentColor` so icons
inherit theme color automatically (Tailwind's `stroke-*` utilities target this directly).

## Layouts

- **Centered card layout** (e.g. `Login`) — full-viewport flex-center, background grid motif, one
  `Card` in the middle.
- **App shell layout** (`DashboardLayout` + nested routes) — `Sidebar` on the left,
  content column on the right with a topbar (`ThemeToggle` + `ProfileMenu`, and per-page filters
  like `DateRangeFilter` live in the page content next to its `<h1>`, not the topbar) and a padded
  page area rendering the active route via `<Outlet />`. Every dashboard-area page
  (`/dashboard`, `/dashboard/trades`, …) is a route nested under this layout — add new dashboard
  pages as a new `<Route>` under `/dashboard` in `App.jsx` and a matching `Sidebar` nav entry,
  don't build a second layout shell.

## Conventions

- Style with Tailwind utility classes in `className` — see the mandate at the top of this doc.
- New pages live in `src/pages/`, composed from `src/features/<feature>/components/` via that
  feature's barrel (`src/features/<feature>/index.js`).
- Shared chrome (`ThemeToggle`, `Sidebar`, `ProfileMenu`) lives in `src/components/common/`.
  Layouts decide where and how many times to mount it — it isn't assumed to be global.
- Routing lives in `App.jsx` (`react-router-dom`). Pages that need to navigate use `useNavigate`/
  `Link`/`NavLink` rather than a page prop passed down from `App`.
- See [`CODING_PREFERENCES.md`](CODING_PREFERENCES.md) for the file/folder structure these
  components live in.
