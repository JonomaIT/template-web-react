# template-web-react

The starting point for JonomaIT web apps (`web-*`, runtime `cloudfront`): React, TypeScript, Vite and [Cloudscape](https://cloudscape.design), the design system of the AWS consoles. **Use this template** gives a repo that already builds, tests, lints and passes CI on its first push, with a working example to replace.

Running in production: [`web-sales`](https://github.com/JonomaIT/web-sales).

## From template to your app

1. **Create the repo**: _Use this template_ on GitHub (or `gh repo create JonomaIT/web-<name> --template JonomaIT/template-web-react --public --clone`). The name is `web-<name>`: it is also the app's name everywhere (ADR-005).
2. **Name it**: `APP_ID` in `src/app/appId.ts`, `name` in `package.json` and in `deploy/app.hcl`; your squad's team (`gh-dev-<squad>`) on the first line of `.github/CODEOWNERS`.
3. **Public names**: `hosts` in `deploy/env/production.tfvars` (ADR-010: the deploy creates them).
4. **Your API**: `apiUrl` in `public/config.json`; its contract in `src/features/<yours>` and its simulation in `src/mocks/handlers.ts`.
5. **Replace the example**: `src/features/items`, the `Itens` pages and their routes in `src/app/router.tsx`.
6. **Open a pull request**: CI runs lint, typecheck, tests, build and the dependency scan.

The home page of the running template lists the same steps.

## Run it

```bash
nvm use            # Node from .nvmrc
npm ci
npm run dev        # http://localhost:5173, API simulated in the browser
```

| Script              | Does                                                                                                                 |
| ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`       | dev server; the API is simulated by [Mock Service Worker](https://mswjs.io) (`src/mocks`), no backend or credentials |
| `npm test`          | Vitest + Testing Library, against the same simulated API                                                             |
| `npm run lint`      | ESLint (TypeScript and React Compiler rules) and Prettier                                                            |
| `npm run typecheck` | TypeScript, strict                                                                                                   |
| `npm run build`     | the production site in `dist/` (no mock code in it)                                                                  |

These scripts are the contract with the platform: the `build-static` workflow of [`pipelines`](https://github.com/JonomaIT/pipelines) runs exactly them.

## What comes with it

```
src/
├── main.tsx              loads /config.json, then renders (simulated API only in `npm run dev`)
├── app/                  shell (top bar, side navigation, breadcrumbs, notifications), routes, theme, config
├── api/client.ts         the one way to call the API: JSON, timeout, errors with the API's message
├── components/           shared UI (empty state, delete confirmation)
├── features/items/       EXAMPLE: types, API calls, queries, validation; replace with your domain
├── pages/                one per route, each loaded on first visit
├── mocks/                the simulated API (dev and tests)
└── test/                 setup and renderApp(path): the whole app on a route
```

| Practice                | How                                                                                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Build once, deploy many | the API address lives in `/config.json`, read at start; each environment gets its own file at deploy, never a rebuild       |
| Server state            | TanStack Query: cache, loading and error states, retries (network and 5xx, never 4xx), invalidation after writes            |
| Lists                   | Cloudscape table with search, sorting, pagination, column preferences remembered per browser, bulk delete with confirmation |
| Forms                   | validation next to each field before calling the API; the API's refusal shown on the form                                   |
| Errors                  | route errors show an alert with a way back; API errors offer a retry                                                        |
| Accessibility           | Cloudscape components, a label on every control, tests that find elements by role and name                                  |
| Language                | pt-BR, Cloudscape's own messages included (`I18nProvider`); light and dark themes                                           |
| Performance             | each page is its own chunk; Cloudscape and the other libraries in long-cached chunks                                        |
| Supply chain            | exact versions and a lockfile, `npm ci` only, Trivy in CI, Dependabot grouped by family                                     |

## Deploy

`deploy/app.hcl` (`runtime = "cloudfront"`, `source_dir = "dist"`, `spa = true`) and `deploy/env/<account>.tfvars` (`hosts`) are all the app declares: the `cloudfront` runner creates the private bucket, the distribution and the public names. On `main`, CI keeps the built site as the `site` artifact. Hashed files under `assets/` are cached for a year; `index.html` and `config.json` are always revalidated. See `web-sales` for the commands, until the platform's deploy pipeline uploads it.
