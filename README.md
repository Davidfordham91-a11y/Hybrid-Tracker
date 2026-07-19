# Hybrid Tracker

Hybrid Tracker is a mobile-first PWA for marathon running, gym tracking, mobility, nutrition, supplements, body metrics, progress charts and mate progress sharing.

The app remains local-first. Browser data is written immediately to localStorage and IndexedDB, then synced to Cloudflare when a cloud account is connected.

## Current Release

- App version: 0.5.0
- Schema version: 5
- Build: 28
- Frontend entry: `index.html` -> `app.js` -> `src/main.js`
- Cloudflare Worker source: `cloudflare/worker.js`
- Cloudflare Pages worker copy: `_worker.js`

## Local Use

Open `index.html` directly for quick static checks, or serve the folder locally:

```powershell
.\serve.ps1
```

For iPhone access, deploy to an HTTPS host such as Cloudflare Pages, then open the Pages URL in iPhone Safari and use Share -> Add to Home Screen.

## Cloudflare Setup

Required configuration is documented in `.env.example`.

Create a D1 database and apply:

```powershell
wrangler d1 execute hybrid-tracker --file cloudflare/schema.sql
```

Deploy the Pages project with this repository as the source. Do not commit real secrets, API tokens, `.env` files, caches or dependency folders.

## Data Safety

- Existing v3/v4 local data is migrated in place.
- A local pre-migration backup is saved before schema upgrades.
- JSON Export and Import remain available under More -> Data.
- Reset requires typing `DELETE`.
- Friend progress sharing now requires an explicit request and acceptance.

## Tests

The automated baseline has no third-party dependencies:

```powershell
npm test
```

The current local desktop environment used for this release did not have Node or npm on PATH, so run the test command in a normal Node environment or CI.
