# Changelog

## 0.5.0

- Added v5 schema migration with pre-migration local backup.
- Moved version metadata into `src/core/version.js`.
- Split workout validation into `src/utils/validation.js`.
- Converted root `app.js` into a module bootstrap.
- Added editable profile settings for athlete defaults, race details, training times and units.
- Added persisted training template metadata for running and gym programs.
- Added nutrition provenance metadata for foods, presets, barcode results and photo estimates.
- Replaced instant mate linking with consent-based friend requests.
- Hardened Cloudflare Worker JSON parsing, CORS checks, rate limits, barcode validation and photo upload validation.
- Added server logout and client sign-out cookie clearing.
- Updated service worker cache for v0.5 imported modules and redirected-response safety.
- Added dependency-free test baseline and deployment documentation.
