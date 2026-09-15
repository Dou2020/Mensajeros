# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Official website for Iglesia Presbiteriana Sinai (Retalhuleu, Guatemala), served at https://www.iglesiasinai.org. All user-facing copy is in Spanish (es-GT); keep it that way when adding pages or components.

## Commands

```bash
npm install          # install dependencies
npm run dev          # dev server on localhost:4321
npm run build        # SSR build into ./dist (includes dist/_worker.js)
npm run preview      # preview the built worker locally (via wrangler)

npx wrangler pages deploy dist   # manual deploy to Cloudflare Pages
```

There is no test suite, linter, or formatter configured. `npx astro check` is the only diagnostic, and it is **not** set up: neither `@astrojs/check` nor `typescript` is in `package.json`, so the command prompts to install them first. `tsconfig.json` extends `astro/tsconfigs/strict`, but nothing enforces it in CI.

The README mentions `npm run deploy`, but no such script exists in `package.json` — use the `wrangler` command above.

## Architecture

Astro 5 in **SSR mode** (`output: 'server'`) on the **Cloudflare adapter**, styled with Tailwind + Flowbite. Rendering happens per-request in a Cloudflare Worker, so page code runs on the server at request time, not at build time.

### Notion as CMS

[src/utils/notion.ts](src/utils/notion.ts) is the only data layer. It exposes one fetch function per Notion database, each reading its own env var:

| Function | Env var | Content | Consumed by |
|---|---|---|---|
| `getData()` | `NOTION_DATABASE_ID` | Actividades de jóvenes | `notionList.astro` |
| `getData2()` | `NOTION_DATABASE_ID2` | Actividades de adultos (filtered `Prioridad = Realizar`) | `listOracion.astro` — i.e. this "adultos" database is what `/SemanaOracion` renders |
| `getData3()` | `NOTION_DATABASE_ID3` | Células (filtered `Prioridad = Realizar`) | `listCelula.astro` |
| `getInicioEvents()` | `NOTION_DATABASE_ID_INICIO` | Eventos de inicio | `inicioList.astro` (i.e. `/Eventos`, not `/`) |
| `getDataFamiliar()` | `NOTION_DATABASE_ID_FAMILIAR` | Actividades del culto familiar | `familiarList.astro` and `Familiar/[id].astro` |

`getData()`/`getData2()`/`getData3()` sort by Notion property names; `getData3()` passes no `sorts` at all, so células come back in Notion's default order.

Conventions these functions all follow — match them when adding a new database:

- The Notion client is constructed once at module scope from `import.meta.env.NOTION_API_KEY`.
- Notion property names are **not** uniform across databases (`Nombre`/`title`, `Fecha`/`fecha`, `Descripcion`/`description`). Read the existing mapping before assuming a shape.
- Every accessor is optional-chained (`page.properties.X?.rich_text?.[0]?.plain_text`), so every field on the returned interfaces is `| undefined`.
- Failures never throw: the function logs and returns `[]`, so pages render empty rather than 500.
- Astro reads env through `import.meta.env`, not `process.env`. The `*.example.js` files next to `notion.ts`/`format.ts` are older `process.env` copies kept for reference — they are not imported by anything.

Required in a root `.env` (gitignored) and in the Cloudflare Pages project settings: `NOTION_API_KEY`, plus the five database IDs above.

### Page / component split

Pages under [src/pages/](src/pages/) are layout + copy only; each one that shows Notion data delegates to a single component in [src/components/](src/components/) that does its own `await get…()` at the top of the frontmatter. The pairing is one-to-one — `Celulas.astro` → `listCelula.astro`, `Eventos/index.astro` → `inicioList.astro`, `Familiar/index.astro` → `familiarList.astro`, `Jovenes.astro` → `notionList.astro`, `SemanaOracion.astro` → `listOracion.astro`, `index.astro` → `Inicio/content.astro`. Data is fetched inside the component, not passed down as props.

Pages wrap their body in [src/layouts/Layout.astro](src/layouts/Layout.astro) (props: `title`, `description`, `keywords`, `author` — built as a local `pageMetadata` object) and include `<Navbar option="…" />` + `<Footer />`. Note the layout directory holds both: `Layout.astro` **and** `footer.astro` live in [src/layouts/](src/layouts/), while `navbar.astro` is in [src/components/](src/components/).

The navbar's `option` prop is a single-letter key matching `navItems` in [src/components/navbar.astro](src/components/navbar.astro): `I` inicio, `E` eventos, `D` familiar, `C` células, `S` semana de oración, `M` ministerios. Pass the right letter so the active-link highlight works. Routes not in `navItems` (`/Jovenes`, `/Mensajeros`, `/Ministerios/*`) just pass an unused letter or reuse `M`.

The one page outside this structure is [src/pages/Mensajeros.astro](src/pages/Mensajeros.astro): it is a standalone `<html>` document with its own `<head>`, its own inline footer, Tailwind from the **Play CDN** (`cdn.tailwindcss.com`) instead of the bundled `@astrojs/tailwind`, and Swiper CSS from jsDelivr — no `Layout`, no `Navbar`. Its three components (`carruselMensajero`, `informativaMensajero`, `galeriaMensajero`) are used only there. Treat it as its own mini-site rather than a template for new pages.

### Prerendering

The project is SSR by default, so most pages render per request without any directive. Only [src/pages/Familiar/index.astro](src/pages/Familiar/index.astro) and [src/pages/Familiar/[id].astro](src/pages/Familiar/[id].astro) declare `export const prerender = false;` explicitly (redundant, but harmless). Dynamic routes like `Familiar/[id].astro` therefore need no `getStaticPaths()` — they look the record up by `Astro.params.id` against the full Notion list and `Astro.redirect('/404')` when nothing matches. There is no `src/pages/404.astro`, so that redirect falls through to the platform's default 404.

### Images

Files in [src/assets/](src/assets/) are **not** imported through `astro:assets` anywhere. Images are referenced by absolute `https://raw.githubusercontent.com/Dou2020/Mensajeros/refs/heads/main/src/assets/…` URLs instead, and Notion-hosted images come back as S3 URLs. `astro.config.mjs` allowlists the relevant remote hosts under `image.domains`; adding an image from a new host requires adding it there. Keep using the existing URL style rather than mixing in local imports.

### Client-side JS

Interactivity is plain inline `<script>` blocks inside the `.astro` file (mobile menu toggle in `navbar.astro`, live search filter in `listCelula.astro`, Swiper carousel in `carruselMensajero.astro` which `import`s Swiper as an ESM URL from jsDelivr). Flowbite is loaded from a CDN `<script is:inline>` in the layout, not bundled. No UI framework integration is installed, so the `client:load` written on the `<script>` tag in `carruselMensajero.astro` does nothing — client directives only apply to framework components.

### Deployment

Cloudflare Pages, configured by [wrangler.jsonc](wrangler.jsonc): entry `dist/_worker.js/index.js`, compat flags `nodejs_compat` + `global_fetch_strictly_public`, observability enabled, `./dist` as the `ASSETS` directory. `public/.assetsignore` keeps `_worker.js` and `_routes.json` out of the static asset upload. `astro.config.mjs` sets `platformProxy: { enabled: true }`, so `npm run dev` emulates Cloudflare bindings locally.

[.github/workflows/deploy.yml](.github/workflows/deploy.yml) is a GitHub Pages workflow whose triggers are all commented out — it is dead and does not run; ignore it unless asked to revive it.

## Known rough edges

- `src/pages/Eventos/[id].astro`, `src/pages/Ministerios/celulas.astro`, and `src/pages/Ministerios/icthus.astro` are empty (0 bytes). The real ministry page is `Ministerios/ichtus.astro` — note the transposed letters versus the empty `icthus.astro`.
- Because of that spelling split, links disagree: `Ministerios/index.astro` links to `/Ministerios/ichtus` (the real 38 KB page), while the home page's ministry cards in `Inicio/content.astro` link to `/Ministerios/icthus` and `/Ministerios/celulas` — both empty. `footer.astro` also links to `/Mensajeros/Jovenes`, a route that does not exist. Fix links against the actual file names rather than assuming the targets are live.
- `src/pages/Jovenes.astro` and `src/pages/Ministerios/jovenes.astro` both exist and serve different routes.
- `src/components/eventCard.astro` is imported by nothing.
- The Notion fetch functions `console.log` their full result sets on every request; this noise is intentional-by-accident, not a debugging aid you added.
- `getformat()` in [src/utils/format.ts](src/utils/format.ts) is `async` but is called un-awaited in templates (`{getformat(item.fecha)}`) — it works only because Astro awaits promises in expressions. It also imports `z` from `astro:content` without using it, and takes `string` while every caller passes a possibly-`undefined` Notion date.
- `astro.config.mjs` sets `image.service.entrypoint: '@astrojs/image/services/sharp'`, a package that is not installed (it was the Astro 3 image integration). The Cloudflare adapter supplies its own image service, so this line is inert — don't build on it.
- `@astrojs/node` and `gh-pages` are still dependencies from earlier hosting setups; the node adapter is commented out in `astro.config.mjs`.
