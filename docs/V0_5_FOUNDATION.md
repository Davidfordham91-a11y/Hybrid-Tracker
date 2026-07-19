# Version 0.5 Foundation Notes

## Goals

Version 0.5 stabilises the v4 cloud prototype without rebuilding the app from scratch. It keeps existing local data, adds a v5 schema migration path, and starts splitting the app into smaller modules.

## Implemented

- Thin root `app.js` bootstrap that imports `src/main.js`.
- Shared version module in `src/core/version.js`.
- Shared workout validation module in `src/utils/validation.js`.
- Profile settings migrated away from hard-coded Dave-only defaults while preserving old local data.
- Training template metadata seeded into local state.
- Nutrition entries and presets now carry source, confidence and estimate metadata.
- Friend progress sharing changed from instant linking to request/accept consent.
- Friend public payloads avoid private email addresses and internal user IDs.
- Worker JSON body size limits and content-type validation.
- State-changing API origin checks.
- Magic-link rate limiting by IP and email hash.
- Barcode format validation and rate limiting.
- Photo upload content-type and size checks.
- Server logout endpoint and client sign-out cookie clearing.
- Service worker v5 cache update with all imported modules included.
- Dependency-free Node test baseline in `tests/run-tests.mjs`.

## Preservation Rules

- Existing localStorage key remains `hybrid-marathon-gym-tracker:v1`.
- IndexedDB name remains `hybrid-tracker-v4` to avoid abandoning existing offline snapshots.
- Old friendship rows with `active` are migrated to `accepted`.
- Existing v3/v4 profile fields are mapped into the new editable profile settings.
- Historical nutrition logs are preserved; cleanup only affects current preset/library shape.

## Follow-Up Candidates

- Continue extracting feature modules from `src/main.js`.
- Add browser-driven layout tests once Node/browser tooling is available.
- Split sync snapshot storage into record-level tables when the UI is ready for deeper conflict resolution.
- Replace placeholder AI photo estimates with a configured provider after secrets are available.
