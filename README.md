# Devine Facilities Management — website + operations platform (POC)

A multi-page marketing site plus a working client-reporting/operations demo
for **Devine Facilities Management**, a Pretoria facilities-care company.
Built to be shown to the owner as a sellable product — every claim is
labelled by verification tier.

**Live:** https://juniorlurh-cmyk.github.io/devine-facilities-poc/
**Repo:** `juniorlurh-cmyk/devine-facilities-poc`

---

## What's inside

### Marketing site (11 routes)

| Route | Purpose |
|---|---|
| `/` | Hero, four service lines, differentiator (visible reporting), process, sectors, projects, testimonial, FAQ |
| `/about` | Company details, values, client types, contacts, FAQ |
| `/services` | Service-line overview |
| `/services/:id` | Per-service page — landscaping, cleaning, installations, caretaker (data-driven from `data/services.js`) |
| `/projects` | Case studies from the company's published project pages |
| `/portal` | **Client-reporting demo** — schedule, work logs w/ photo evidence, issue register, monthly report |
| `/insights` | Internal service-positioning view + AI briefing + model-planned charts |
| `/contact` | Contacts, enquiry form (mailto fallback), service-area map |
| `/admin` | Supervisor dashboard — leads, sites/tasks/issues, CMS (passphrase-gated) |
| `*` | 404 |

### Operations platform (the differentiator)

The research brief identified the real opportunity: **documented service
quality and proof of delivery** — not being the cheapest or largest. The
platform layer demonstrates that:

- **Site register** — client/property/scope/supervisor/visibility per site
- **Recurring task schedules** — weekly/fortnightly/monthly per site
- **Work logs** — completed tasks with notes + photo evidence (auto-appended
  when a task is marked done)
- **Issue register** — defects with priority, status, due date, owner
- **Client portal** (`/portal`) — the client-facing view: what's scheduled,
  what was done, what needs attention, monthly report
- **Lead management** — every service page + contact form feeds one central
  `Leads` sheet with service/type/status workflow
- **CMS** — announcement bar + per-service card text editable in `/admin`
  with no code change or deploy

Backend: **Google Sheet + Apps Script** (same proven pattern as the Lebess
build). Setup: [`backend/SETUP.md`](./backend/SETUP.md). Without it the site
runs fully static — forms fall back to pre-filled email.

### AI layer

- **Chat assistant** (Groq, free tier) — knows services, sectors, portal,
  contacts; refuses to invent prices/certifications
- **Insights briefing** — AI analyst read of service-positioning data
- **Viz planner** — model proposes chart specs, eval gate validates labels/
  ranges before render, one reflected correction pass on failure

---

## Verification register

| Tier | What | Where |
|---|---|---|
| **Company-stated** | 13 years in operation, four service lines, indoor greenery, client types, contacts (Marissa & Tjaart van der Walt), postal address, Facebook | `data/site.js`, throughout copy |
| **Directory-sourced** | 5.0★ / 27 reviews (2pos, za.directmap.info) — labelled as directory-sourced everywhere it appears | `REVIEWS` in `data/site.js` |
| **Project-published** | Case-study descriptions summarise devinefacilities.co.za/our-projects (elevated crane-lift installation, corporate indoor plants, townhouse landscape, estate cleaning) | `data/projects.js` |
| **Illustrative/demo** | All `/portal` and `/admin` ops data (sites, tasks, work logs, issues, monthly stats) | `data/ops.js` + seeded `demo` site in `Code.gs` — labelled "Demo data" on the page |
| **Placeholder imagery** | All photos are verified Unsplash stock (HTTP 200 checked), captioned "representative" — the company's own project photos replace them once supplied with permission | `data/services.js`, `data/projects.js` |
| **Not used** | No CIPC/registration number (none found publicly — not fabricated). No street address on the map (Roeloe St is directory-sourced only; map shows the Pretoria service area). No invented testimonials (only the one published on the company site). No scraped/reused imagery from devinefacilities.co.za. |

---

## Owner confirmations needed before go-live

- [ ] Which service lines are on active contracts right now
- [ ] Registration/CIPC number, if any
- [ ] Permission + delivery of Devine's own project photography (replaces stock)
- [ ] Confirmation of a public-facing street address (Roeloe St is directory-only)
- [ ] Whether the ops demo should become a real pilot on one actual site
- [ ] Trading hours, if they should be published
- [ ] Whether `/portal` should require a client login in production

---

## Development

```bash
cd web
npm ci
npm run dev      # local dev
npm run lint     # oxlint
npm run build    # vite build + SPA 404 fallback
```

## Configuration

Environment variables (GitHub repo **Variables**, or `web/.env.local`):

| Var | Purpose |
|---|---|
| `VITE_SHEETS_API_URL` | Apps Script `/exec` URL — leads, CMS, portal ops data |
| `VITE_GA_MEASUREMENT_ID` | GA4 measurement ID (empty = disabled) |
| `VITE_GSC_VERIFICATION` | Search Console token (empty = disabled) |
| `VITE_AI_API_KEY` | Groq API key (GitHub **Secret**) — chat + insights |
| `VITE_BASE` | Set automatically by the workflow (`/<repo>/`) |

## Deploy

Push to `main` → GitHub Actions builds `web/` and deploys to GitHub Pages.
First deploy: repo **Settings → Pages → Source: GitHub Actions**.
