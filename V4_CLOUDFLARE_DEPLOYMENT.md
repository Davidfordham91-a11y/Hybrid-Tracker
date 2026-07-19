# Hybrid Tracker V4 Cloudflare Deployment

Version 4 adds a Cloudflare Worker API, D1 database, R2 image storage hooks, magic-link authentication, and local-first sync from the existing PWA.

## Required Secrets And Variables

Do not commit secrets.

```text
APP_ORIGIN=
LOCAL_APP_ORIGIN=
D1_DATABASE_ID=
R2_BUCKET_NAME=
EMAIL_PROVIDER_API_KEY=
EMAIL_FROM_ADDRESS=
EMAIL_PROVIDER=postmark
SESSION_SECRET=
AI_PROVIDER_API_KEY=
OPEN_FOOD_FACTS_USER_AGENT=
```

`EMAIL_PROVIDER` supports `postmark` or `resend` and defaults to `postmark`. For Postmark, use a Server API token and a verified Sender Signature or verified domain sender such as `Hybrid Tracker <login@example.com>`. `AI_PROVIDER_API_KEY` is reserved for the food-photo analysis phase; the Worker returns a low-confidence placeholder until a provider is wired.

## Local Development

1. Copy `cloudflare/wrangler.toml.example` to `wrangler.toml`.
2. Fill in `APP_ORIGIN` and local origin values.
3. Create the D1 database:

```powershell
wrangler d1 create hybrid-tracker
```

4. Put the returned database id into `wrangler.toml`.
5. Apply the schema:

```powershell
wrangler d1 execute hybrid-tracker --local --file cloudflare/schema.sql
```

6. Add secrets:

```powershell
wrangler secret put SESSION_SECRET
wrangler secret put EMAIL_PROVIDER_API_KEY
```

7. Run the Worker locally:

```powershell
wrangler dev
```

## Cloudflare Deployment

1. Deploy the static PWA to Cloudflare Pages.
2. Deploy the Worker:

```powershell
wrangler d1 execute hybrid-tracker --remote --file cloudflare/schema.sql
wrangler deploy
```

3. Route `/api/*` from the Pages app to the Worker.
4. Set `APP_ORIGIN` to the production Pages origin.
5. Create the R2 bucket and bind it as `FOOD_IMAGES`.

## V3 Data Migration

The client upgrades local data to `schemaVersion: 4` and stores a pre-V4 backup under a localStorage backup key before migration.

After sign-in, the Dashboard prompts:

```text
Existing Hybrid Tracker data was found on this device. Import it into your cloud account?
```

The import is idempotent at the client level and pushes a snapshot through the sync outbox. Existing local data is not deleted.

## Rollback

1. Keep the Netlify/static V3 artifact or previous Pages deployment available.
2. If Worker deployment fails, roll back only the Worker route. The PWA remains local-first.
3. Do not delete D1 records during rollback. Disable `/api/*` routing instead.
4. Users can export JSON from More > Data at any time.

## Test Account Procedure

1. Set `DEV_MODE = "true"` only in local development if you need the API to return the generated magic link.
2. Request a magic link from More > Account.
3. Open the link on the same browser/device.
4. Confirm `/api/session` returns the signed-in user.
5. Log a set, food, supplement, and metric offline, then reconnect and use Sync Now.
