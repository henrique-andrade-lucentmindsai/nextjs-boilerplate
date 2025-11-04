# Bitrix Local App – Quick Setup

1) Deploy this project on Vercel (Next.js App Router).
2) Add **Vercel Postgres** → set `POSTGRES_URL` env var.
3) Run `/schema.sql` in the Vercel Postgres SQL console.
4) In Bitrix24:
   - Applications → Developer resources → Other → Create app → Local
   - Handler path: `https://YOUR-APP.vercel.app/`
   - Leave install/uninstall blank
   - Permissions: none required initially
   - Save → open app from Applications → My Apps
5) In the page, enter **Mobile** and **Configuration key** → Save.
6) Verify row in `tenant_config` table.

Notes:
- The Bitrix SDK script is loaded in `layout.tsx`.
- Page auto-detects `portal_domain`, `member_id`, `user_id` when inside Bitrix.
- API upserts by `portal_domain`. Change unique constraint if needed.