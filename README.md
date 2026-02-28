# SubhVivah (शुभविवाह)

Production-ready Indian matrimonial platform with verification, anti-fraud, contribution-based premium, coordinators, CMS, themes, RBAC admin, and analytics.

## Tech
- Vite + React SPA (frontend)
- Cloudflare Workers (API), D1 (DB), R2 (voice uploads)
- Hono framework, TypeScript

## Setup
1. Node 20+, pnpm/npm
2. `npm ci`
3. Configure Wrangler (Cloudflare)
   - `wrangler login`
   - Ensure wrangler.json has DB and R2 bindings
4. Secrets
   - `wrangler secret put PAN_HASH_KEY`
   - `wrangler secret put MOCHA_USERS_SERVICE_API_URL`
   - `wrangler secret put MOCHA_USERS_SERVICE_API_KEY`
   - Optional dev: `wrangler secret put TEST_OTP_BYPASS` (value `1`)
   - Admin: `wrangler secret put ADMIN_2FA_TEST_CODE`
   - Set `ADMIN_EMAILS` in Worker vars (comma separated)
5. Migrations
   - Apply D1 migrations in order `migrations/` (9 → 25)
   - `wrangler d1 migrations apply <DB>`
6. Dev
   - `npm run dev` (SPA + auxiliary services)
7. Build
   - `npm run build` then `npm run preview`

## Deploy
### Cloudflare Workers
- `wrangler deploy`

### Vercel (Frontend)
1. Connect GitHub repo to Vercel
2. Framework: Other
3. Build Command: `npm run build`
4. Output Dir: `dist`
5. Add env for preview use if needed (static SPA)

### GitHub Actions
- `.github/workflows/deploy.yml`
  - Secrets:
    - `CF_API_TOKEN`, `CF_ACCOUNT_ID`
    - `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

## Admin Roles
Create RBAC entries via API:
- POST `/api/admin/rbac/upsert_user` with `email`, `role`, optional `permissions_json`
- Critical actions require header `x-admin-2fa` or body `twofa_code` matching `ADMIN_2FA_TEST_CODE`

## Theme Variables
Use `/api/themes/current` to fetch active theme and inject CSS variables on the client for instant updates.

## Notes
- All sensitive actions are logged in `audit_logs`.
- PAN is stored as HMAC+masked only. Voice bios to R2.

