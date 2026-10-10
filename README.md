# Rivermark website

Website development source for Rivermark Home Inspections, hosted at [xocliwb-afk/rivermark-website](https://github.com/xocliwb-afk/rivermark-website) on `main`. The A128 initial upload and fresh remote clone were verified. Brandon has since made the repository temporarily PUBLIC for review. Actions, Pages and deployment must remain inactive; the current task records fresh verification separately. Repository hosting is separate from website deployment. Further commits, pushes, merges and deployment require authorization within the current owner-approved task; this is not standing permission to publish.

## Current approved implementation

A131 implements the bounded final quote-wording and identity-schema polish on the A127 local website candidate. It awaits Brandon’s visual sign-off; implementation is not acceptance or a copy/design freeze. Stage 8 owner walkthrough remains in progress, A127 owner re-review remains pending, and native Spectora travel commissioning is unperformed. A126 map-design acceptance is retained. No freeze or public launch is authorized.

West Olive, Macatawa and Ferrysburg are Extended. Included normal travel is $0; Extended travel is $75 total for one normal visit or $125 total for two normal visits. The physical Ferrysburg exception and property-specific confirmation rules remain controlling. The website's travel data does not configure Spectora.

All local content remains visible. Global `noindex,nofollow`, `robots.txt` blocking, empty sitemap, disabled promotion/null dates and New Construction `Not Currently Scheduling` remain intact.

## Requirements and setup

The recorded working toolchain is **Node.js 24.20.0 and npm 11.19.0**, with the checked-in npm lockfile. The headed browser checks were verified with **Google Chrome 153.0.8010.36** on a visible Linux desktop. Use Node 24 with native WebSocket support for that runner. No additional browser automation package is required.

```sh
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3031
```

Open `http://127.0.0.1:3031/` in a normal browser. A clean checkout needs no private environment file to build or run the mocked checks. Next.js generates `next-env.d.ts`, `.next` and TypeScript build information locally. Public network access is needed for npm packages and the existing Google Fonts build downloads (Source Sans 3 and IBM Plex Mono). Do not replace real font behavior with a mocked-font pass.

The lockfile uses the npm registry. The transitive `unrs-resolver` install hook invokes `napi-postinstall` for its native binding; the project has no install/prepare hooks. Dependency and lockfile changes require separate task scope.

## Checks

```sh
npm run check
npm run test:forms
npm run test:publication
npm run start -- --hostname 127.0.0.1 --port 3031
# In another terminal, with the preview above still running:
npm run test:search
```

`check` runs lint, type checking and the production build. Forms/OAuth tests use synthetic credentials and mock transports; they do not send mail. Publication checks exercise isolated flags without changing actual configuration. Search runs rendered quote-branch/identity-schema checks and resource, map and travel assertions plus a **visible/headed** Chrome map check, including measured negative fixtures. It requires a working desktop display and installed Chrome; an unavailable headed run must be reported as unverified, never replaced silently with headless mode.

For a second clean checkout, preserve the original preview and use a separate loopback port:

```sh
npm run start -- --hostname 127.0.0.1 --port 3032
# In another terminal in that checkout:
RIVERMARK_PREVIEW_ORIGIN=http://127.0.0.1:3032 npm run test:search
```

The override accepts only an HTTP origin on numeric loopback, with no credentials, path, query or fragment. `RIVERMARK_CHROME` may specify an existing Chrome executable. Browser output defaults to scratch space; `RIVERMARK_MAP_REPORT` may select an external JSON evidence file whose parent directory exists. Do not place private test output in the source tree. `npm run build`, `npm run lint` and `npm run typecheck` are also available individually.

## Environment and integration boundaries

`.env.example` contains inspected variable names and safe public business addresses only. Real Gmail OAuth client secrets/refresh tokens belong in a protected local `.env.local` or separately authorized server secret store, never in Git. Do not copy existing live credentials into clean checkouts. Do not run `forms:authorize` or `forms:send-test` as part of installation or routine verification: they perform separately authorized account/live-send workflows.

Spectora remains authoritative for live prices, availability, appointments, agreements, payment, portal, reports and the official order. The website contains public handoffs and server-side inquiry delivery code; it is not a scheduler, payment system or report portal. Mocked tests do not verify live account configuration or delivery. Google OAuth/account setup, Spectora commissioning, hosting, DNS, indexing and deployment remain separate authorized tasks. No CI or deployment workflow belongs in this initial upload.

## Source layout and authority

- `src/`: Next.js App Router pages, components, typed content/configuration, maps and form implementation.
- `public/`: approved brand assets, founder photo and sanitized public Sample Report.
- `tests/` and `scripts/`: safe fixtures and verification/maintenance tools; review a script before invoking account or send commands.
- Selected `docs/`: implementation/review instructions and audited blank report/ownership/checklist templates. These templates contain no completed customer record.

The **31 canonical project sources remain external and authoritative** at `/home/brandon/Home Inspections/Master Project Sources`. Read `PROJECT_SOURCE_POLICY.md`, current Foundation, State, Decision Log and relevant masters there before substantive business changes. On another machine, obtain the current authoritative sources from Brandon; do not treat missing files or stale context mirrors as permission to invent policy. This repository is not an independently edited second master set. Building and running the included checks does not require those private folders.

`AGENTS.md`, `CLAUDE.md`, `docs/IMPLEMENTATION_BASELINE.md` and `docs/REVIEW_PROTOCOL.md` govern implementation and review. Machine-local `docs/BUILD_STATE.md`, `docs/tasks/`, reporting ledgers, mixed operational QA history and review evidence are deliberately excluded from the repository. Their paths in instructions are owner-workspace records, not missing runtime dependencies. Current repository setup/check results live in the dated external upload receipt.

## What this repository does and does not back up

Git covers only the reviewed application, safe assets/templates, tests, package/config files and selected developer instructions. It excludes real credentials, canonical masters, source inspection reports, completed client packets, private travel research, account exports, browser profiles, snapshots, evidence archives, dependencies, builds and test output. Approved public phone, founder identity and business email are intentional content.

Local verified snapshots remain outside the repository in `/home/brandon/Rivermark/snapshots`; review/export receipts remain under `/home/brandon/Rivermark/review-packs`. Take and verify the established snapshot before meaningful changes. Review explicit staged filenames, content, binary safety and reachable history for secrets before an authorized commit/push. Never use an unreviewed blanket add or bypass a protection failure. Preserve configured hooks and signing. Do not change the owner-selected temporary public visibility; no Pages, hosting integration or automatic Actions activation is authorized. Keep private evidence and canonical sources excluded.
