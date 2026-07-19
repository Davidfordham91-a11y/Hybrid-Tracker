# Access Hybrid Tracker On iPhone

Hybrid Tracker v0.5 is designed to run from an HTTPS Cloudflare Pages URL.

## Open The App

1. Deploy the repository to Cloudflare Pages.
2. Open the Pages URL in iPhone Safari.
3. Tap Share.
4. Tap Add to Home Screen.

Use the same Pages URL each time. Safari stores local app data per website URL, so changing URLs can make existing local data appear missing.

## Import A JSON Backup

If local data was cleared or you moved to a new URL:

1. Open the app on iPhone.
2. Go to More.
3. Open Data.
4. Tap Import.
5. Choose your recent Hybrid Tracker JSON export.
6. Confirm the import.

The import migrates old v3/v4 exports into the current v5 local schema.

## Cloud And Friends

Cloud backup uses the built-in recovery-code account flow unless email magic links are configured. Friend progress sharing uses public friend codes, but progress is shared only after the other person accepts the request.

## If Safari Shows A Service Worker Redirect Error

Deploy v0.5 or newer, then on iPhone:

1. Open Settings.
2. Safari -> Advanced -> Website Data.
3. Search for the old Hybrid Tracker domain.
4. Delete only that site data if the old broken worker is still stuck.
5. Reopen the Pages URL.

The v0.5 service worker avoids caching redirected responses and uses a fresh cache name.
