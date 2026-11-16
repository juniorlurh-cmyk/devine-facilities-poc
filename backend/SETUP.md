# Backend setup — Google Sheet + Apps Script

The site is static (GitHub Pages), so leads, the site register, task
schedules, work logs, issues and CMS content are stored in a Google Sheet
exposed through a small Apps Script web app. No server, no cost — the Sheet
*is* the central operations dashboard (management can also open it directly).

## One-time setup (~10 minutes)

1. **Create the Sheet**
   - Go to https://sheets.google.com → **Blank** spreadsheet.
   - Name it e.g. *Devine Website Backend*.
   - The script creates the six tabs itself (`Leads`, `Content`, `Sites`,
     `TaskSchedule`, `WorkLogs`, `Issues`) on first request — you don't need
     to add headers.

2. **Install the script**
   - In the Sheet: **Extensions → Apps Script**.
   - Delete the default `Code.gs` contents, paste in
     [`Code.gs`](./Code.gs) from this folder, save.

3. **Set the admin passphrase**
   - Apps Script → **Project Settings (gear) → Script Properties → Add**
   - Property: `ADMIN_KEY` — value: a passphrase only management knows
     (e.g. `Devine-Admin-2026!`). This gates the `/admin` dashboard.

4. **Deploy the web app**
   - **Deploy → New deployment → type: Web app**
   - Execute as: **Me** · Who has access: **Anyone**
   - Authorise when prompted (it's your own Sheet).
   - Copy the **Web app URL** (ends in `/exec`).

5. **Wire it into the site**
   - Repo → **Settings → Secrets and variables → Actions → Variables → New**
   - `VITE_SHEETS_API_URL` = the `/exec` URL (it's a public endpoint —
     safe as a variable, not a secret; admin ops still require ADMIN_KEY).
   - The next push rebuilds with it. For local dev, put the same line in
     `web/.env.local`.

## What management gets

| Surface | Where |
|---|---|
| Leads (all services, statuses, notes) | `/admin` → Leads **and** the `Leads` tab |
| Site register (client/property/scope/supervisor/visibility) | `/admin` → Sites & ops **and** `Sites` tab |
| Task schedules + mark-complete → auto work log | `/admin` → Sites & ops **and** `TaskSchedule`/`WorkLogs` tabs |
| Issue register (log, status, due date) | `/admin` → Sites & ops **and** `Issues` tab |
| CMS content (announcement bar, service text) | `/admin` → Content **and** `Content` tab |
| Client-facing portal data | `/portal` reads sites flagged `demo`/`public` visibility |
| Traffic analytics | GA4 + Search Console (see `web/.env.example`) |

## Ops data model

- **Sites** — `Visibility` controls portal exposure: `internal` (default,
  never public), `demo` or `public` (appears on `/portal`). The seeded row
  is an *illustrative* demo site — replace or remove it before real client
  data goes in.
- **TaskSchedule** — recurring tasks per site (`SiteID`, frequency,
  last/next dates, status).
- **WorkLogs** — appended automatically when a task is marked done from
  `/admin`; this is the evidence trail the portal shows.
- **Issues** — defect register with priority, status (`open` /
  `in-progress` / `resolved`), due date and owner.

## Content keys the site understands

Set these in the `Content` tab (or `/admin` → Content):

| Key | Effect |
|---|---|
| `announcement` | Text shown in the announcement bar site-wide (empty = hidden) |
| `service.<id>.tag` | Overrides the service card tag |
| `service.<id>.card` | Overrides the service card text |

`<id>` is one of: `landscaping-gardening`, `commercial-estate-cleaning`,
`landscape-installations`, `caretaker`.

## Security notes

- The `/exec` URL is public by design — anyone can *submit* a lead
  (that's the point) and read content + demo/public ops data.
- All admin operations require `ADMIN_KEY`, checked server-side. The key
  lives only in management's hands.
- **Never** set a real client site's `Visibility` to `demo`/`public`
  without the client's agreement — the portal exposes that site's task,
  work-log and issue data publicly.
- This is a lightweight gate, not bank-grade auth — fine for a small
  business site. If Devine outgrows it, the same data model ports
  directly to Supabase/Firebase.
