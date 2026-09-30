# Acme web

Marketing and billing pages for Acme.

- `pnpm dev` starts the app, `pnpm typecheck` checks types.
- UI primitives live in `src/components/ui`, feature components in `src/components`.
- Theme tokens are defined in `src/styles.css` (Tailwind v4 `@theme`). Dark mode is the `dark` class on `<html>`; `.dark` overrides the tokens.
- Fonts are self-hosted with Fontsource and imported in `src/fonts.ts`.
