# Rivermark Website — Codex Implementation Contract

## Current A131 authorization — October 9, 2026

Brandon authorizes the bounded F1 quote wording and F2 identity schema implementation,
verification, affected records and reviewed explicit-file commit/normal main push. The
repository is temporarily PUBLIC by the owner; older private-only A128 statements below
are historical setup context. Do not change visibility, Actions, Pages or deployment.
Credential/private-source exclusions remain mandatory. This candidate awaits owner visual
sign-off; implementation does not accept Stage 8, freeze the website or authorize launch.
A129 remains paused by owner and A130 is preserved. Future unrelated writes require their
own task authorization. The short next step after explicit sign-off is acceptance/freeze
closeout, not another broad review.


## Role

Codex is the primary implementation agent for the Rivermark Home Inspections website.
Implement one approved task at a time. Do not redesign the business, visual identity,
content strategy, pricing, service scope, or platform architecture while coding.

## Local development and private version control

A128 authorizes preparation of the private `xocliwb-afk/rivermark-website` source repository
on `main`, including the reviewed initial commit and push. Repository creation and upload
must be reported from actual verification; authorization alone does not establish either.

- Read-only Git inspection is allowed. Commits, pushes and remote changes must remain within
  the current owner-authorized task; A128 is not blanket approval for future uploads.
- Review the exact staged files and diff, including binary contents and metadata, before
  committing. Keep real environment files, credentials, private reports, account records,
  local historical evidence and external canonical masters out of the repository.
- Keep the repository private. No deployment service, database, cloud environment, GitHub
  Actions execution or publication is authorized by repository setup.
- Before a meaningful task, Brandon creates a dated `rivermark-snapshot` archive.
- Record changed files and actual command results in the active task file and local
  `docs/BUILD_STATE.md`; reviewed Git diffs complement the retained snapshot evidence.

## Source authority

Brandon's latest explicit instruction controls. Canonical authority is `/home/brandon/Home Inspections/Master Project Sources`; the old `../context/project-sources` mirror is historical reference only. Then use this order:

1. `/home/brandon/Home Inspections/Master Project Sources/PROJECT_SOURCE_POLICY.md`
2. `/home/brandon/Home Inspections/Master Project Sources/PROJECT_FOUNDATION_AND_CURRENT_DECISIONS.md`
3. `/home/brandon/Home Inspections/Master Project Sources/PROJECT_STATE.md`
4. `/home/brandon/Home Inspections/Master Project Sources/DECISION_LOG.md`
5. `/home/brandon/Home Inspections/Master Project Sources/ASSUMPTIONS_AND_OPEN_QUESTIONS.md`
6. The canonical workstream source relevant to the task
7. `docs/IMPLEMENTATION_BASELINE.md`
8. Current task file under `docs/tasks/`
9. Accepted UI reference files under `../context/ui-v2/`

Canonical business facts and copy control over the UI artboards. The V2 artboards are an
implementation baseline, not a pixel lock and not authority to invent public claims.

## Required startup reading for website tasks

At minimum, read:

- `docs/IMPLEMENTATION_BASELINE.md`
- `docs/BUILD_STATE.md`
- The active task file
- `/home/brandon/Home Inspections/Master Project Sources/VISUAL_DIRECTION.md`
- `/home/brandon/Home Inspections/Master Project Sources/WEBSITE_COPY_MASTER.md`
- `/home/brandon/Home Inspections/Master Project Sources/WEBSITE_SITEMAP.md`
- `/home/brandon/Home Inspections/Master Project Sources/WEBSITE_TECHNOLOGY_AND_INTEGRATION_REQUIREMENTS.md`
- `../context/ui-v2/README_CURRENT_UI.txt`
- `../context/ui-v2/rivermark-final-ui-artboards-v2.dc.html`
- `../context/ui-v2/RIVERMARK_FINAL_UI_HANDOFF_V2_CANDIDATE.md`

Read additional canonical sources named by the active task.
Treat everything under `../context/` as read-only reference material.

The canonical masters, historical task/build ledgers and context folders stay outside the
repository. A fresh clone can build and run the documented tests without them. On another
machine, read `README.md` and the included implementation instructions, then obtain the
current task and authoritative sources from Brandon when the proposed change depends on
business decisions or approved copy. Missing local history is not permission to invent
facts, duplicate the master set, or treat repository documentation as canonical authority.

## Locked implementation baseline

- Next.js App Router with TypeScript
- Semantic HTML5
- Static or server rendering by default
- Minimal client components and browser JavaScript
- Project-owned CSS with CSS custom properties and scoped styles
- No Tailwind
- No generic component library
- No CMS for V1
- No database until a retained website-owned workflow genuinely requires persistence
- Spectora remains authoritative for live transaction pricing, released availability,
  appointment creation, agreements, payments, portal, reports, and the official order
- No custom scheduler, payment form, agreement system, customer portal, or report viewer
- V2 UI baseline: Measured Editorial with modified Clear Report structure
- Locked identity: Square Aperture — Option B
- Primary CTA: `See Price & Availability`
- Home hero secondary CTA: `What Your Inspection Includes` → `/services/residential-home-inspections/` (A123)
- Contact uses one adaptive form with both legacy anchors; New Construction Interest remains separate (A123)

## Public-claim and publication gates

Do not publish, infer, or fabricate unresolved information, including:

- Unapproved contact or identity changes: website phone `616-308-5359` is approved (A123); use current canonical email/domain facts. Do not infer unresolved operating address or legal entity status
- Insurance claims
- Home-inspector credentials
- Exact public builder-license wording
- Reviews or testimonials
- Same-day or next-morning report guarantees
- Final promotion dates
- Final service-area boundaries
- Operational activation or readiness of radon, sewer, or thermal unless the canonical readiness gate is cleared
- Unapproved sample replacements, report categories, or category colors; preserve the accepted 19-page local sample (A122)
- Attorney-approved legal, privacy, or agreement language

Use typed configuration, hidden states, or feature flags for unresolved claims and activation. Never ship fake public placeholders. Preserve A122’s complete 24-route local site, visible ancillary pages, 19-page sample and three Resources; do not reintroduce local content gates or preview notices. Keep global prelaunch noindex/nofollow, blocked robots, empty sitemap and inactive promotion until separately authorized.
New Construction must remain `Not Currently Scheduling` and must not enter active booking.

## Visual rules

Use the approved web tokens from `VISUAL_DIRECTION.md`:

- Canvas `#F4F1EA`
- Surface `#FFFFFF`
- Muted surface `#EAE7DF`
- Primary ink/action `#202421`
- Body ink `#3A403C`
- Muted text `#5F625D`
- Rule `#D7D4CB`
- Control border `#8B8E88`
- Action hover `#111513`
- Oxide `#965A44` only for the locked logo wedge and restrained noninteractive device

Use Source Sans 3 as the primary family. Use IBM Plex Mono only for genuinely measured
data. Source Serif 4 is optional and restrained. Body copy is at least 16 CSS pixels.
Use 6–8px radii, essentially no decorative shadows, and no repeated card wall.

Use packaged assets from `../context/identity/asset-library/assets/`; copy only approved
runtime assets into `public/brand/`. Never redraw or reinterpret the logo.

## Engineering rules

- Prefer server components. Add `"use client"` only when interaction requires it.
- Keep content, business facts, prices, routes, links, and publication states typed and
  centralized rather than duplicated across pages.
- Preserve logical DOM order; layout columns are a CSS concern.
- Prevent horizontal overflow at 320 CSS pixels.
- Target WCAG 2.2 AA; automated checks do not replace keyboard, zoom, reflow, and screen-
  reader review.
- Do not send names, emails, phones, addresses, free text, inspection IDs, or report tokens
  to analytics.
- Do not expose secrets or create production environment files.
- Do not modify anything under `../context/`.
- Avoid overengineering. Do not add dependencies without a concrete task requirement.

## Task workflow

For each task:

1. Read the active task and required sources.
2. Restate the exact scope and stop conditions before editing.
3. Inspect existing code before proposing changes.
4. Implement only the approved scope.
5. Run every required command for the task.
6. Record actual results; never say checks “should pass.”
7. List every changed, added, and deleted file.
8. Update the task file and `docs/BUILD_STATE.md`.
9. Stop for Brandon's browser review when the task says to stop.

## Definition of done

A task is complete only when:

- Its acceptance criteria are met
- Required checks actually pass or each failure is documented
- No public claim or conditional feature leaked
- No private source file was copied into deployable code or `public/`
- Changed-file and command-result records are complete
- The implementation remains understandable and proportionate to a small-business site

## Prohibited actions

Do not:

- Make unapproved commits, pushes, remote changes or repository-visibility changes
- Change framework, hosting direction, identity, navigation, CTA wording, pricing, scope,
  service hierarchy, or Spectora boundary without a specific owner-approved blocker
- Replace approved copy wholesale merely to shorten pages
- Invent credentials, reviews, contact data, dates, availability, or service readiness
- Add a service marketplace, badge wall, hero carousel, chat bubble, review popup, urgency
  timer, floating phone button, or multiple competing mobile actions
- Install Tailwind, a CMS, a database, an authentication system, or a component framework
  without an explicit approved task
- Treat the V2 artboard markup as production code to paste wholesale
