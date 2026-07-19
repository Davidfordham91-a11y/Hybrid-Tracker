# Cloudflare v0.5 Deployment

## Required Services

- Cloudflare Pages
- Cloudflare Workers through Pages Functions
- Cloudflare D1
- Cloudflare R2 only if food-photo uploads are enabled

## Required Variables

Use `.env.example` as the source list. Set production values in Cloudflare, not in committed files.

```text
APP_ORIGIN
LOCAL_APP_ORIGIN
D1_DATABASE_ID
R2_BUCKET_NAME
EMAIL_PROVIDER
EMAIL_PROVIDER_API_KEY
EMAIL_FROM_ADDRESS
SESSION_SECRET
AI_PROVIDER_API_KEY
OPEN_FOOD_FACTS_USER_AGENT
DEV_MODE
```

`SESSION_SECRET` must be a long random value. Do not rotate it casually because existing sessions and recovery-code hashes depend on it.

## Database

Apply the schema before or during deployment:

```powershell
wrangler d1 execute hybrid-tracker --file cloudflare/schema.sql
```

The schema keeps existing data and converts legacy friendship status `active` to `accepted`.

## Rollback

1. In Cloudflare Pages, open Deployments.
2. Select the previous successful deployment.
3. Roll back to that deployment.
4. Do not delete D1 data during rollback.

Local app data remains on the device. JSON export/import remains the portable fallback.
