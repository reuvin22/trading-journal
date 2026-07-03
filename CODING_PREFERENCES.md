# Coding Preferences

## File Structure

This project uses a **feature-based (colocation)** structure inside `src/`. Code that
changes together lives together; only truly shared code lives in the top-level
shared folders.

```
src/
├── assets/            Static files — images, icons, fonts
├── components/
│   ├── ui/            Generic, unopinionated UI primitives (Button, Input, Modal)
│   └── common/        Shared composite components used across features (Header, Sidebar, Layout)
├── features/          One folder per domain feature (e.g. trades, journal, dashboard)
│   └── <feature>/
│       ├── components/   Components used only by this feature
│       ├── hooks/         Hooks used only by this feature
│       ├── api.js         Data fetching / mutations for this feature
│       └── index.js       Barrel export — the feature's public surface
├── hooks/             Shared custom hooks used by 2+ features (useDebounce, useLocalStorage)
├── lib/               Framework-agnostic helpers, formatters, constants
├── pages/             Route-level components that compose features together
├── services/          External integrations — API clients, storage, third-party SDKs
├── store/             Global app state (context providers / state management)
├── styles/            The one global stylesheet — Tailwind import + theme tokens (see DESIGN.md)
├── App.jsx
└── main.jsx
```

### Rules

- **Colocate before you share.** New code starts inside the relevant
  `features/<feature>/` folder. Only promote it to `components/`, `hooks/`, or
  `lib/` once a second feature actually needs it.
- **One component per file.** Filename matches the component name
  (`TradeCard.jsx` exports `TradeCard`).
- **Naming:** `PascalCase` for components and their files, `camelCase` for
  functions, hooks, and utility files. Hooks are always prefixed `use`.
- **Barrel exports:** each `features/<feature>/` folder exposes its public API
  through `index.js`. Files inside a feature should not be imported directly
  from outside that feature — import from the barrel instead.
- **No orphan folders.** Don't create an empty folder "for later." Add the
  folder when the first file that belongs in it exists.
- **Depth limit:** keep nesting to 3 levels under `src/`
  (`features/trades/components/TradeCard.jsx` is the deepest normal case).
- **Styling is Tailwind utility classes in `className`, always** — no per-component `.css` files.
  See [`DESIGN.md`](DESIGN.md) for the token set and conventions.
- **Tests live next to the code they cover** (`TradeCard.jsx`, `TradeCard.test.jsx` in the same
  folder).
- **No default exports for anything except React components/pages.** Utilities,
  hooks, and constants use named exports so refactors and auto-imports stay
  accurate.
