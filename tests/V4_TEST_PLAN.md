# Hybrid Tracker V4 Test Plan

## Authentication

- Request magic link with valid email.
- Reject invalid email.
- Verify token expires after 15 minutes.
- Verify token is single-use.
- Confirm sessions use HTTP-only secure same-site cookies.
- Confirm `/api/session` returns only the signed-in user.

## Access Control

- User A cannot pull or push User B records.
- Account export returns only the active user data.
- Account delete requires `DELETE` and removes sessions.

## Migration

- Load a `schemaVersion: 3` export.
- Confirm local pre-V4 backup is created.
- Confirm Version 3 runs, gym logs, nutrition logs, body metrics and profiles remain present.
- Press Import and Sync twice and confirm records are not duplicated in the client outbox.

## Offline And Sync

- Put browser offline.
- Start workout, complete sets, run rest timer, log food and supplements.
- Confirm UI updates immediately.
- Reconnect and confirm debounced sync clears pending changes.
- Trigger Sync Now after a failed sync.
- Confirm soft-deleted/imported JSON records remain recoverable through export.

## Workout UI

- Start Workout stores `startedAt`.
- Resume Workout appears for started sessions.
- Complete Set starts a 60-second timestamp-based rest timer.
- Timer continues after switching tabs and returning.
- Timer plays a tone and vibrates where supported.
- Set rows do not clip text on iPhone SE, iPhone 15, and iPhone 15 Pro Max widths.

## Nutrition

- Add manual food to Breakfast, Lunch, Dinner and Snacks.
- Scan barcode on supported mobile browser.
- Verify product source and serving details before logging.
- Unknown barcode offers manual entry path.
- Take Food Photo produces an estimate and requires confirmation before logging.
- Confirmed photo entries are flagged as estimated.
- Duplicate/McDonald quick presets do not appear in current quick-select lists.
- Historical logs remain in JSON export.

## Supplements

- Mark supplements Taken and Skipped.
- Confirm daily completion percentage, 7-day adherence, 30-day adherence and streak update.
- Pause and resume supplement.

## PWA Updates

- Deploy a new service worker.
- Confirm update banner appears when worker is waiting.
- Press Update Now.
- Confirm `skipWaiting`, `clients.claim`, and a single reload occur.
- Press Later and confirm banner is hidden for the current short window.

## Browser Matrix

- iPhone Safari.
- Installed iPhone PWA.
- Desktop Safari.
- Chrome.
- Offline mode.
- Slow network throttling.
